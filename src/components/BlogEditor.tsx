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
  images?: string[];
  onImagesChange?: (images: string[]) => void;
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

export default function BlogEditor({ content, onChange, images = [], onImagesChange, className = "", blogId }: BlogEditorProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(images);
  const [newImageUrl, setNewImageUrl] = useState("");
  const quillRef = useRef<ReactQuill>(null);
  const { uploadImage } = useImageUpload({ blogId });

  useEffect(() => {
    setImageUrls(images);
  }, [images]);

  const addImage = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      const updatedImages = [...imageUrls, newImageUrl.trim()];
      setImageUrls(updatedImages);
      onImagesChange?.(updatedImages);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImages);
    onImagesChange?.(updatedImages);
  };

  const insertImageIntoContent = (imageUrl: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection() || { index: quill.getLength(), length: 0 };
      quill.insertEmbed(range.index, 'image', imageUrl);
      quill.setSelection({ index: range.index + 1, length: 0 });
    } else {
      // Fallback to appending at the end
      const imageTag = `<img src="${imageUrl}" alt="Blog image" style="max-width: 100%; height: auto; margin: 16px 0;" />`;
      onChange(content + imageTag);
    }
  };

  const handleFileUpload = async (file: File) => {
    const uploadedImage = await uploadImage(file);
    if (uploadedImage) {
      const updatedImages = [...imageUrls, uploadedImage.url];
      setImageUrls(updatedImages);
      onImagesChange?.(updatedImages);
    }
  };

  const handleEditorImageUpload = async (file: File) => {
    const uploadedImage = await uploadImage(file);
    if (uploadedImage) {
      insertImageIntoContent(uploadedImage.url);
      const updatedImages = [...imageUrls, uploadedImage.url];
      setImageUrls(updatedImages);
      onImagesChange?.(updatedImages);
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

      {/* Image Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Blog Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload or Add Image */}
          <div className="space-y-4">
            <Label>Upload or Add Images</Label>
            <ImageUploadDropzone
              onImageUploaded={(url) => {
                const updatedImages = [...imageUrls, url];
                setImageUrls(updatedImages);
                onImagesChange?.(updatedImages);
              }}
              blogId={blogId}
              className="h-32"
            />
            <div className="flex gap-2">
              <Input
                placeholder="Or enter image URL..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addImage()}
              />
              <Button onClick={addImage} size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Add URL
              </Button>
            </div>
          </div>

          {/* Image List */}
          {imageUrls.length > 0 && (
            <div className="space-y-3">
              <Label>Added Images ({imageUrls.length})</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group border rounded-lg p-4 space-y-3">
                    <div className="relative">
                      <img
                        src={url}
                        alt={`Blog image ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Input
                        value={url}
                        readOnly
                        className="text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => insertImageIntoContent(url)}
                        className="w-full"
                      >
                        Insert into Content
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {imageUrls.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No images added yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}