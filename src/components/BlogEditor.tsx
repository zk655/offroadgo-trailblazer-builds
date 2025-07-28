import { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/quill-editor.css';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, List } from "lucide-react";
import { useImageUpload } from '@/hooks/useImageUpload';
import { useToast } from '@/hooks/use-toast';

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  blogId?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  },
  history: {
    delay: 2000,
    maxStack: 500,
    userOnly: true
  }
};

const formats = [
  'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'script', 'list', 'bullet', 'check', 'indent',
  'direction', 'align', 'blockquote', 'code-block', 'link', 'image', 'video'
];

export default function BlogEditor({ content, onChange, className = "", blogId }: BlogEditorProps) {
  const { uploadImage, uploading } = useImageUpload({ blogId });
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      const uploadedImage = await uploadImage(file);
      if (uploadedImage) {
        // Simply append image HTML to content instead of direct manipulation
        const imageHtml = `<p><img src="${uploadedImage.url}" alt="Uploaded image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px auto; display: block;" /></p>`;
        onChange(content + '\n' + imageHtml);
        
        toast({
          title: "Image uploaded successfully",
          description: "The image has been added to your content.",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    event.target.value = '';
  };

  const generateTableOfContents = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
      toast({
        title: "No headings found",
        description: "Add some headings to your content first.",
        variant: "destructive"
      });
      return;
    }

    let tocHtml = '<div class="table-of-contents"><h3>Table of Contents</h3><ul>';
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || `Heading ${index + 1}`;
      const id = `heading-${index}`;
      
      heading.id = id;
      
      const indent = '  '.repeat(level - 1);
      tocHtml += `${indent}<li><a href="#${id}">${text}</a></li>`;
    });
    
    tocHtml += '</ul></div>';
    
    const updatedContent = doc.body.innerHTML;
    onChange(tocHtml + '\n\n' + updatedContent);
    
    toast({
      title: "Table of contents generated",
      description: "Added to the beginning of your content.",
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Content</Label>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              onClick={handleUploadButtonClick}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              onClick={generateTableOfContents}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              Generate TOC
            </Button>
          </div>
        </div>
        <div className="min-h-[500px] relative">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={onChange}
            modules={modules}
            formats={formats}
            style={{ 
              height: '450px',
              backgroundColor: 'hsl(var(--background))'
            }}
            placeholder="Write your blog post content here..."
          />
        </div>
      </div>
    </div>
  );
}