'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the TipTap editor with no SSR
const TipTapEditor = dynamic(() => import('./TipTapEditor'), {
  ssr: false,
  loading: () => (
    <div className="tiptap-editor">
      <div className="tiptap-content">
        <div className="p-4 text-gray-500 text-center">
          Loading editor...
        </div>
      </div>
    </div>
  ),
});

interface TipTapEditorWrapperProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const TipTapEditorWrapper: React.FC<TipTapEditorWrapperProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="tiptap-editor">
        <div className="tiptap-content">
          <div className="p-4 text-gray-500 text-center">
            Loading editor...
          </div>
        </div>
      </div>
    }>
      <TipTapEditor {...props} />
    </Suspense>
  );
};

export default TipTapEditorWrapper;
