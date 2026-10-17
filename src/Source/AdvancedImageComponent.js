// AdvancedImageComponent.jsx
import React from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { useInView } from 'react-intersection-observer';


const AdvancedImageComponent = ({ img }) => {
  const { ref, inView } = useInView({ triggerOnce: true });
  return (
    <div ref={ref} style={{ marginBottom: '10px' }}>
      {inView && <AdvancedImage cldImg={img} />}
    </div>
  );
};

export default AdvancedImageComponent;
