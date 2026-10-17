import { useState, useCallback, useMemo, memo } from "react";
import ImageGallery from "./Source/ImageGallery";
import Dialog from "./Source/Dialog";
import Overlay from "./Source/Overlay";
import { data } from "./data";

const getInitialFolder = () => {
  try {
    const storedIndex = localStorage.getItem("index");
    return data[Number(storedIndex) || 0];
  } catch (error) {
    console.warn("Failed to get folder from localStorage:", error);
    return data[0];
  }
};

const GalleryContainer = memo(({ children }) => (
  <div className="container-fluid">
    <div id="image-gallery">{children}</div>
  </div>
));

GalleryContainer.displayName = "GalleryContainer";

const App = () => {
  const [folder, setFolder] = useState(getInitialFolder);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFolderChange = useCallback((newFolder) => {
    setFolder(newFolder);
    try {
      const newIndex = data.findIndex(f => f.iF === newFolder.iF);
      localStorage.setItem("index", newIndex.toString());
    } catch (error) {
      console.warn("Failed to save folder to localStorage:", error);
    }
  }, []);

  const handleImageSelect = useCallback((image) => {
    setSelectedImage(image);
  }, []);

  const galleryProps = useMemo(() => ({
    folder,
    setSelectedImage: handleImageSelect
  }), [folder, handleImageSelect]);

  const overlayProps = useMemo(() => ({
    src: selectedImage,
    folder,
    setSelectedImage: handleImageSelect
  }), [selectedImage, folder, handleImageSelect]);

  const dialogProps = useMemo(() => ({
    onFolderChange: handleFolderChange,
    setSelectedImage: handleImageSelect
  }), [handleFolderChange, handleImageSelect]);

  return (
    <section id="gallery">
      <GalleryContainer>
        <ImageGallery {...galleryProps} />
      </GalleryContainer>
      
      {selectedImage && <Overlay {...overlayProps} />}
      <Dialog {...dialogProps} />
    </section>
  );
};

App.displayName = "App";

export default memo(App);