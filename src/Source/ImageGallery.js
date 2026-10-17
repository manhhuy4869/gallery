import React, { useState, useEffect, useRef } from 'react';
import { AdvancedImage } from "@cloudinary/react";

const ImageGallery = ({ cld, folder }) => {
    const [visibleImages, setVisibleImages] = useState(20); // Bắt đầu với 20 ảnh
    const loaderRef = useRef(null);

    // Tạo danh sách các ảnh từ Cloudinary
    const images = Array.from({ length: 10 }, (_, i) => cld.image(`${folder.iF}/${i + 1}`));
const imgUrl=
    // Tăng số lượng ảnh hiển thị khi cuộn đến cuối trang
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setVisibleImages((prev) => Math.min(prev + 20, images.length)); // Tải thêm 20 ảnh khi cuộn
            }
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [images.length]);

    return (
        <div className='row'>
            {images.slice(0, visibleImages).map((img,i) => (
                <div key={img.publicID} className='col-lg-2 image'>
                    <div className='img-wrapper'>
                        <a href={img}>
                            {/* <AdvancedImage cldImg={img} loading='lazy' /> */}
                            <img src={`https://gitlab.com/huyetcongtu4869/h/-/raw/main/public/${folder.iF}/${i+1}.jpg?ref_type=heads`} loading='lazy'/>
                        </a>
                        <div className='img-overlay'>
                            <i className='fa fa-plus-circle text-white' aria-hidden='true'></i>
                        </div>
                    </div>
                </div>
            ))}
            {/* Loader xuất hiện khi tải thêm ảnh */}
            <div ref={loaderRef} style={{ height: '20px', backgroundColor: 'transparent' }} />
        </div>
    );
};

export default ImageGallery;
