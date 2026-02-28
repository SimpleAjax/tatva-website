"use client";

import { useEffect, useRef, useState } from 'react';

interface VideoLoadState {
  loaded: boolean;
  error: boolean;
  progress: number;
}

/**
 * Hook to preload videos and track their loading state
 */
export function useVideoPreloader(videoUrls: string[]) {
  const [loadStates, setLoadStates] = useState<Record<string, VideoLoadState>>({});
  const videoElements = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    // Clean up previous video elements
    videoElements.current.forEach(video => {
      video.src = '';
      video.load();
    });
    videoElements.current = [];

    // Create new video elements for preloading
    const states: Record<string, VideoLoadState> = {};
    
    videoUrls.forEach(url => {
      states[url] = { loaded: false, error: false, progress: 0 };
      
      const video = document.createElement('video');
      video.src = url;
      video.preload = 'metadata';
      video.muted = true;
      
      video.addEventListener('loadedmetadata', () => {
        setLoadStates(prev => ({
          ...prev,
          [url]: { ...prev[url], loaded: true, progress: 100 }
        }));
      });

      video.addEventListener('progress', () => {
        if (video.buffered.length > 0) {
          const buffered = video.buffered.end(0);
          const duration = video.duration;
          const progress = duration ? (buffered / duration) * 100 : 0;
          
          setLoadStates(prev => ({
            ...prev,
            [url]: { ...prev[url], progress }
          }));
        }
      });

      video.addEventListener('error', () => {
        setLoadStates(prev => ({
          ...prev,
          [url]: { ...prev[url], error: true }
        }));
      });

      videoElements.current.push(video);
    });

    setLoadStates(states);

    return () => {
      videoElements.current.forEach(video => {
        video.src = '';
        video.load();
      });
      videoElements.current = [];
    };
  }, [videoUrls]);

  return loadStates;
}

/**
 * Hook to check if element is in viewport
 */
export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.1 }
) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}
