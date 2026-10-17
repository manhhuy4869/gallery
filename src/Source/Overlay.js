import React, { useState, useEffect } from 'react';
import './Overlay.css'; // Assuming you have CSS for the overlay

const Overlay = ({ src, onClose }) => {
    const [currentSrc, setCurrentSrc] = useState(src);

    const handleOverlayClick = (e) => {
        const overlayWidth = e.currentTarget.clientWidth;
        const threshold = overlayWidth - 1200;
        if (e.clientY > 70) {
            if (e.pageX <= threshold) {
                // Handle previous image
            } else if (e.pageX >= overlayWidth - threshold) {
                // Handle next image
            }
        }
    };

    useEffect(() => {
        if (src) {
            setCurrentSrc(src);
        }
    }, [src]);

    return (
        <div className="overlay" onClick={handleOverlayClick}>
            <img src={currentSrc} alt="Overlay" />
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default Overlay;
