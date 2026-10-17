import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import { alt, path } from "../data";

const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center p-4">
    <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

const ErrorState = memo(() => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-red-500">
    Failed to load
  </div>
));

ErrorState.displayName = "ErrorState";

const ImageOverlay = memo(({ onClick, imageTitle }) => (
  <div
    className="img-overlay absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
    onClick={onClick}
    role="button"
    aria-label={`Select image ${imageTitle}`}
  >
    <i className="fa fa-plus-circle text-white text-xl" aria-hidden="true" />
  </div>
));

ImageOverlay.displayName = "ImageOverlay";

// Enhanced ImageItem with intersection observer for viewport detection
const ImageItem = memo(({ img, folder, onClick, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const imageRef = useRef(null);

  const { src, altText } = useMemo(
    () => ({
      src: path(folder.iF, "", img),
      altText: alt(folder.iF, img),
    }),
    [folder.iF, img]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = useCallback(() => setIsLoaded(true), []);
  const handleError = useCallback(() => setHasError(true), []);
  const handleClick = useCallback(() => onClick(img), [onClick, img]);

  // Only start loading the image when it's in viewport or marked as priority
  const shouldLoad = isInViewport || priority;

  if (hasError) return <ErrorState />;

  return (
    <div className="col-lg-2 image" ref={imageRef}>
      <div className="img-wrapper relative">
        {!isLoaded && <LoadingSpinner />}
        {shouldLoad && (
          <img
            src={src}
            alt={altText}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? "eager" : "lazy"}
          />
        )}
        {isLoaded && <ImageOverlay onClick={handleClick} imageTitle={img} />}
      </div>
    </div>
  );
});

ImageItem.displayName = "ImageItem";

const calculateInitialCount = () => {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const imagesPerRow = Math.floor(viewportWidth / 200);
  const rows = Math.ceil(viewportHeight / 200) + 1; // Add one more row for buffer
  return imagesPerRow * rows;
};

// Enhanced infinite scroll hook with viewport awareness
const useInfiniteScroll = (loadingRef, totalCount, visibleCount, isLoading, onLoadMore) => {
  useEffect(() => {
    if (!loadingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoading && visibleCount < totalCount) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Increased margin to start loading earlier
        threshold: 0.1
      }
    );

    observer.observe(loadingRef.current);
    return () => observer.disconnect();
  }, [loadingRef, totalCount, visibleCount, isLoading, onLoadMore]);
};

const ImageGallery = memo(({ folder, setSelectedImage }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const loadingRef = useRef(null);

  const images = useMemo(
    () => Array.from({ length: folder.tI }, (_, i) => i + 1),
    [folder.tI]
  );

  useEffect(() => {
    const initialCount = calculateInitialCount();
    const timeoutId = setTimeout(() => {
      setVisibleCount(initialCount);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 50, images.length));
      setIsLoading(false);
    }, 100);
  }, [images.length]);

  useInfiniteScroll(loadingRef, images.length, visibleCount, isLoading, handleLoadMore);

  const handleImageClick = useCallback(
    (img) => setSelectedImage(img),
    [setSelectedImage]
  );

  const visibleImages = useMemo(
    () => images.slice(0, visibleCount),
    [images, visibleCount]
  );

  // Calculate the initial viewport images
  const initialViewportCount = useMemo(() => calculateInitialCount(), []);

  return (
    <div className="image-gallery" ref={containerRef}>
      <div className="row">
        {visibleImages.map((img, index) => (
          <ImageItem
            key={img}
            img={img}
            folder={folder}
            onClick={handleImageClick}
            priority={index < initialViewportCount} // Prioritize loading for initial viewport images
          />
        ))}
      </div>
      <div ref={loadingRef} className="h-4">
        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
});

ImageGallery.displayName = "ImageGallery";

export default ImageGallery;