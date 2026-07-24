import { useEffect } from 'react';

export function useDocumentTitle(title, retainOnUnmount = false) {
  useEffect(() => {
    const defaultTitle = 'PrepStack AI ⭐⭐⭐⭐⭐ - Full Stack Interview Prep';
    document.title = title ? `${title} | PrepStack AI` : defaultTitle;

    return () => {
      if (!retainOnUnmount) {
        document.title = defaultTitle;
      }
    };
  }, [title, retainOnUnmount]);
}
