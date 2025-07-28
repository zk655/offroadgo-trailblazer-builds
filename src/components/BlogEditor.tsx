import { useState, useEffect, useRef } from 'react';
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
  toolbar: {
    container: [
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
    handlers: {
      'image': function() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        
        input.onchange = () => {
          const file = input.files?.[0];
          if (file) {
            // This will be handled by the BlogEditor component
            const event = new CustomEvent('quill-image-upload', { detail: file });
            document.dispatchEvent(event);
          }
        };
      }
    }
  },
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
  const quillRef = useRef<ReactQuill>(null);
  const { uploadImage, uploading } = useImageUpload({ blogId });
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload from toolbar or upload button
  const handleImageUpload = async (file: File) => {
    try {
      const uploadedImage = await uploadImage(file);
      if (uploadedImage) {
        insertImageIntoEditor(uploadedImage.url);
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

  // Custom image handler for Quill toolbar
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        handleImageUpload(file);
      }
    };
  };

  // Update modules to use our custom image handler
  const customModules = {
    ...modules,
    toolbar: {
      ...modules.toolbar,
      handlers: {
        'image': imageHandler
      }
    }
  };

  const insertImageIntoEditor = (imageUrl: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection() || { index: quill.getLength(), length: 0 };
      
      // Insert image with proper spacing
      quill.insertText(range.index, '\n');
      quill.insertEmbed(range.index + 1, 'image', imageUrl);
      quill.insertText(range.index + 2, '\n');
      quill.setSelection({ index: range.index + 3, length: 0 });
      
      // Force re-render to ensure image displays
      quill.update();
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
    // Reset input
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
        <div className="min-h-[450px]">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={onChange}
            modules={customModules}
            formats={formats}
            style={{ height: '400px' }}
            placeholder="Write your blog post content here..."
          />
        </div>
      </div>
    </div>
  );
}