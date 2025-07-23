import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image } from "lucide-react";

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
  images?: string[];
  onImagesChange?: (images: string[]) => void;
  className?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'bullet', 'indent',
  'align', 'blockquote', 'code-block', 'link', 'image'
];

export default function BlogEditor({ content, onChange, images = [], onImagesChange, className = "" }: BlogEditorProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(images);
  const [newImageUrl, setNewImageUrl] = useState("");

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
    const imageTag = `<img src="${imageUrl}" alt="Blog image" style="max-width: 100%; height: auto; margin: 16px 0;" />`;
    onChange(content + imageTag);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Rich Text Editor */}
      <div className="space-y-2">
        <Label>Content</Label>
        <div className="min-h-[400px]">
          <ReactQuill
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
          {/* Add Image */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter image URL..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addImage()}
            />
            <Button onClick={addImage} size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Add
            </Button>
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