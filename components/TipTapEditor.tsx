'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-text-style';
import { FontSize } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table';
import { TableHeader } from '@tiptap/extension-table';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { 
  MdFormatBold, 
  MdFormatItalic, 
  MdFormatStrikethrough, 
  MdCode,
  MdFormatClear,
  MdTitle,
  MdFormatSize,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdTableChart,
  MdImage,
  MdLink,
  MdUndo,
  MdRedo,
  MdHorizontalRule
} from 'react-icons/md';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "Start writing your content...",
  className = ""
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyleKit,
      Color,
      FontFamily,
      FontSize,
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false, // Fix for SSR
  });

  // Don't render anything until the component is mounted on the client
  if (!isMounted || !editor) {
    return (
      <div className={`tiptap-editor ${className}`}>
        <div className="tiptap-content">
          <div className="p-4 text-gray-500 text-center">
            Loading editor...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`tiptap-editor ${className}`}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="tiptap-content" />
    </div>
  );
};

interface MenuBarProps {
  editor: any;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="tiptap-menu-bar">
      <div className="tiptap-menu-group">
        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={`tiptap-menu-button ${editorState.isBold ? 'is-active' : ''}`}
          title="Bold"
        >
          <MdFormatBold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={`tiptap-menu-button ${editorState.isItalic ? 'is-active' : ''}`}
          title="Italic"
        >
          <MdFormatItalic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={`tiptap-menu-button ${editorState.isStrike ? 'is-active' : ''}`}
          title="Strikethrough"
        >
          <MdFormatStrikethrough size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={`tiptap-menu-button ${editorState.isCode ? 'is-active' : ''}`}
          title="Inline Code"
        >
          <MdCode size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          disabled={!editorState.canClearMarks}
          className="tiptap-menu-button"
          title="Clear Formatting"
        >
          <MdFormatClear size={18} />
        </button>
      </div>

      <div className="tiptap-menu-group">
        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`tiptap-menu-button ${editorState.isHeading1 ? 'is-active' : ''}`}
          title="Heading 1"
        >
          <MdTitle size={18} />
          <span className="ml-1">1</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`tiptap-menu-button ${editorState.isHeading2 ? 'is-active' : ''}`}
          title="Heading 2"
        >
          <MdTitle size={18} />
          <span className="ml-1">2</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`tiptap-menu-button ${editorState.isHeading3 ? 'is-active' : ''}`}
          title="Heading 3"
        >
          <MdTitle size={18} />
          <span className="ml-1">3</span>
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`tiptap-menu-button ${editorState.isParagraph ? 'is-active' : ''}`}
          title="Paragraph"
        >
          <MdFormatSize size={18} />
        </button>
      </div>

      <div className="tiptap-menu-group">
        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`tiptap-menu-button ${editorState.isBulletList ? 'is-active' : ''}`}
          title="Bullet List"
        >
          <MdFormatListBulleted size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`tiptap-menu-button ${editorState.isOrderedList ? 'is-active' : ''}`}
          title="Numbered List"
        >
          <MdFormatListNumbered size={18} />
        </button>
      </div>

      <div className="tiptap-menu-group">
        {/* Blocks */}
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`tiptap-menu-button ${editorState.isCodeBlock ? 'is-active' : ''}`}
          title="Code Block"
        >
          <MdCode size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`tiptap-menu-button ${editorState.isBlockquote ? 'is-active' : ''}`}
          title="Blockquote"
        >
          <MdFormatQuote size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="tiptap-menu-button"
          title="Horizontal Rule"
        >
          <MdHorizontalRule size={18} />
        </button>
      </div>

      <div className="tiptap-menu-group">
        {/* Media & Tables */}
        <button
          onClick={addTable}
          className="tiptap-menu-button"
          title="Insert Table"
        >
          <MdTableChart size={18} />
        </button>
        <button
          onClick={addImage}
          className="tiptap-menu-button"
          title="Insert Image"
        >
          <MdImage size={18} />
        </button>
        <button
          onClick={addLink}
          className="tiptap-menu-button"
          title="Insert Link"
        >
          <MdLink size={18} />
        </button>
      </div>

      <div className="tiptap-menu-group">
        {/* History */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          className="tiptap-menu-button"
          title="Undo"
        >
          <MdUndo size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
          className="tiptap-menu-button"
          title="Redo"
        >
          <MdRedo size={18} />
        </button>
      </div>
    </div>
  );
};

export default TipTapEditor;
