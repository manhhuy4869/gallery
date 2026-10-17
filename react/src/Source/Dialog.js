import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { alt, data, path } from "../data";

// Constants
const STORAGE_KEY = "index";

const CloseButton = memo(({ onClose }) => (
  <div id="exit">
    <i 
      onClick={onClose} 
      className="fa fa-times text-white"
      role="button"
      aria-label="Close dialog"
    />
  </div>
));

CloseButton.displayName = "CloseButton";

const FolderOption = memo(({ option, index, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(index, option.iF);
  }, [index, option.iF, onSelect]);

  return (
    <li className="option" onClick={handleClick}>
      <div className="img-select-container">
        <img 
          src={path(option.iF)} 
          className="img-select" 
          alt={alt(option.iF)}
          loading="lazy" 
        />
      </div>
      <span className="option-text">{option.iF}</span>
    </li>
  );
});

FolderOption.displayName = "FolderOption";

const Dialog = memo(({ onFolderChange, setSelectedImage }) => {
  const initialIndex = Number(localStorage.getItem(STORAGE_KEY)) || 0;
  const [isOpen, setIsOpen] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState([initialIndex, data[initialIndex].iF]);
  const dialogRef = useRef(null);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'f') {
      setIsOpen(prev => !prev);
    }
  }, []);

  // Handle keyboard shortcut
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setOptionsVisible(false);
      }
    };

    if (optionsVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [optionsVisible]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleOptions = useCallback(() => {
    setOptionsVisible(prev => !prev);
  }, []);

  const handleOptionSelect = useCallback((index, text) => {
    setSelectedImage(null);
    window.scrollTo(0, 0);
    setOptionsVisible(false);
    onFolderChange(data[index]);
    setIsOpen(false);
    setSelectedFolder([index, text]);
    localStorage.setItem(STORAGE_KEY, index);
  }, [onFolderChange, setSelectedImage]);

  return (
    <div 
      ref={dialogRef} 
      className={`dialog-container ${isOpen ? "open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <CloseButton onClose={handleClose} />
      
      <div id="dialog-title" className="dialog-header">
        Change folder
      </div>

      <div id="dialog-body" className="dialog-body">
        <div className={`select-menu ${optionsVisible ? "active" : ""}`}>
          <button 
            className="select-btn" 
            onClick={toggleOptions}
            aria-expanded={optionsVisible}
            aria-controls="folder-options"
          >
            <span className="sBtn-text">
              {selectedFolder[1] || "Select your option"}
            </span>
            <i className={`bx bx-chevron-down ${optionsVisible ? "rotate-180" : ""}`} />
          </button>

          {optionsVisible && (
            <ul id="folder-options" className="options" role="listbox">
              {data.map((option, index) => (
                <FolderOption
                  key={index}
                  option={option}
                  index={index}
                  onSelect={handleOptionSelect}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
});

Dialog.displayName = "Dialog";

export default Dialog;