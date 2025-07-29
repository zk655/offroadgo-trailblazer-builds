import TipTapEditor from './TipTapEditor';
import '../styles/tiptap-editor.css';

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  blogId?: string;
}

export default function BlogEditor({ content, onChange, className = "", blogId }: BlogEditorProps) {
  return (
    <TipTapEditor 
      content={content}
      onChange={onChange}
      className={className}
      blogId={blogId}
    />
  );
}