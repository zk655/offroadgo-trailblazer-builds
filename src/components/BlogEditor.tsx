import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/quill-editor.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image, List, Trash2 } from "lucide-react";
import ImageUploadDropzone from './ImageUploadDropzone';
import { useImageUpload } from '@/hooks/useImageUpload';

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
      ['link', 'image', 'video', 'formula'],
      [{ 'table': 'TD' }],
      ['clean']
    ],
    handlers: {
      'table': function() {
        const table = '<table><tr><td>Cell 1</td><td>Cell 2</td></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table>';
        const range = this.quill.getSelection();
        if (range) {
          this.quill.clipboard.dangerouslyPasteHTML(range.index, table);
        }
      },
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
  'direction', 'align', 'blockquote', 'code-block', 'link', 'image', 'video', 'formula'
];

export default function BlogEditor({ content, onChange, className = "", blogId }: BlogEditorProps) {
  const quillRef = useRef<ReactQuill>(null);
  const { uploadImage } = useImageUpload({ blogId });

  // Handle custom Quill image upload events
  useEffect(() => {
    const handleQuillImageUpload = async (event: CustomEvent) => {
      const file = event.detail;
      if (file) {
        const uploadedImage = await uploadImage(file);
        if (uploadedImage) {
          insertImageIntoContent(uploadedImage.url);
        }
      }
    };

    document.addEventListener('quill-image-upload', handleQuillImageUpload as EventListener);
    return () => {
      document.removeEventListener('quill-image-upload', handleQuillImageUpload as EventListener);
    };
  }, [uploadImage]);

  const insertImageIntoContent = (imageUrl: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection() || { index: quill.getLength(), length: 0 };
      quill.insertEmbed(range.index, 'image', imageUrl);
      quill.setSelection({ index: range.index + 1, length: 0 });
    } else {
      // Fallback to appending at the end with proper styling
      const imageTag = `<p><img src="${imageUrl}" alt="Blog image" /></p>`;
      onChange(content + imageTag);
    }
  };

  const generateTableOfContents = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
      return;
    }

    let tocHtml = '<div class="table-of-contents"><h3>Table of Contents</h3><ul>';
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || `Heading ${index + 1}`;
      const id = `heading-${index}`;
      
      // Add id to heading if it doesn't have one
      heading.id = id;
      
      const indent = '  '.repeat(level - 1);
      tocHtml += `${indent}<li><a href="#${id}">${text}</a></li>`;
    });
    
    tocHtml += '</ul></div>';
    
    // Update content with modified headings
    const updatedContent = doc.body.innerHTML;
    onChange(tocHtml + '\n\n' + updatedContent);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Rich Text Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Content</Label>
          <div className="flex gap-2">
            <ImageUploadDropzone
              onImageUploaded={(url) => insertImageIntoContent(url)}
              blogId={blogId}
              variant="compact"
            />
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              onClick={generateTableOfContents}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              Generate Table of Contents
            </Button>
          </div>
        </div>
        <div className="min-h-[400px]">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={onChange}
            modules={modules}
            formats={formats}
            style={{ height: '350px' }}
            placeholder="Write your blog post content here..."
          />
        </div>
      </div>
    </div>
  );
}