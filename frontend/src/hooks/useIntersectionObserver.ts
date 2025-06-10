
import { useEffect } from 'react';
import type { RefObject } from 'react';

export const useIntersectionObserver = (
  ref: RefObject<Element>,
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          callback(entry.isIntersecting);
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -5% 0px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, callback, options]);
};
