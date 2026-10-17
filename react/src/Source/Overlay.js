import React, { useEffect, useRef, useCallback, memo } from 'react';
import { alt, path } from '../data';

const ANIMATION_INTERVAL = 350;
const CLICK_THRESHOLD = 1200;

const Overlay = memo(({ src, folder, setSelectedImage }) => {
  const imageRef = useRef(null);
  const intervalRef = useRef(null);
  const { iF, tI: totalImages } = folder;

  const handleSrcUpdate = useCallback((newSrc) => {
    const img = imageRef.current;
    if (!img) return;
    
    img.src = path(iF, '', newSrc);
    img.alt = alt(iF, newSrc);
  }, [iF]);

  const adjustSrc = useCallback((isLeftSideClick, isPlaying = false) => {
    const img = imageRef.current;
    if (!img) return;

    const currentSrc = parseInt(img.src.split('/').pop());
    const newSrc = isLeftSideClick 
      ? Math.max(1, currentSrc - 1)
      : Math.min(totalImages, currentSrc + 1);
    
    handleSrcUpdate(newSrc);
    
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [totalImages, handleSrcUpdate]);

  const togglePlayback = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else {
      intervalRef.current = setInterval(() => adjustSrc(false, true), ANIMATION_INTERVAL);
    }
  }, [adjustSrc]);

  const handleOverlayClick = useCallback(({ pageX, clientY, currentTarget }) => {
    if (clientY <= 70) return;
    
    if (pageX <= CLICK_THRESHOLD) {
      adjustSrc(true);
    } else if (pageX >= currentTarget.clientWidth - CLICK_THRESHOLD) {
      adjustSrc(false);
    }
  }, [adjustSrc]);

  const handleKeyDown = useCallback((event) => {
    const { keyCode, target } = event;

    if (keyCode === 32 && target === document.body) {
      event.preventDefault();
      togglePlayback();
      return;
    }

    const keyActions = {
      27: () => setSelectedImage(0),
      39: () => adjustSrc(false),
      37: () => adjustSrc(true)
    };

    keyActions[keyCode]?.();
  }, [adjustSrc, setSelectedImage, togglePlayback]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [handleKeyDown]);

  return (
    <div id="overlay" onClick={handleOverlayClick}>
      <img
        ref={imageRef}
        src={path(iF, '', src)}
        alt={alt(iF, src)}
        loading="lazy"
      />
      <div id="exit">
        <i
          onClick={(e) => {
            e.stopPropagation();
            setSelectedImage(0);
          }}
          className="fa fa-times text-white"
          role="button"
          aria-label="Close overlay"
        />
      </div>
    </div>
  );
});

Overlay.displayName = 'Overlay';

export default Overlay;