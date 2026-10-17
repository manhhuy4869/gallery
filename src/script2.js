class ImageGallery {
    constructor() {
        this.currentIndex = parseInt(localStorage.getItem("index")) || 0;
        this.slideInterval = null;
        this.imageCache = new Map(); // Cache URL ảnh đã tải
        this.observedElements = new Set(); // Theo dõi các elements đang quan sát
        this.imageObserver = null;
        this.initElements();
        this.initEvents();
        this.initGallery();
    }

    initElements() {
        // Lưu trữ các phần tử DOM để tránh truy vấn lặp lại
        this.dialog = document.getElementById("dialog-container");
        this.options = this.dialog.querySelector(".options");
        this.selectMenu = document.querySelector(".select-menu");
        this.selectBtnText = document.querySelector(".sBtn-text");
        this.exitBtn = this.dialog.querySelector(".exit");
        this.overlay = document.getElementById("overlay");
        this.overlayExit = this.overlay.querySelector(".exit");
        this.overlayImg = this.overlay.querySelector("img");
        this.galleryContainer = document.querySelector(".row");
        this.selectBtn = document.querySelector(".select-btn");
    }

    initGallery() {
        this.selectBtnText.textContent = lIF[this.currentIndex].iF;
        this.renderOptions();
        this.loadImages(lIF[this.currentIndex]);
    }

    renderOptions() {
        // Sử dụng DocumentFragment để cải thiện hiệu suất khi thêm nhiều phần tử
        const fragment = document.createDocumentFragment();

        lIF.forEach((item, index) => {
            const li = document.createElement("li");
            li.className = "option";
            li.innerHTML = `
                <div class="img-select-container">
                <img src="${this.path(item.iF)}" alt="${item.iF}" 
                    class="img-select" loading="lazy">
                </div>
                <span class="option-text" data-index="${index}">${item.iF}</span>
            `;
            fragment.appendChild(li);
        });

        // Xóa nội dung cũ và thêm mới trong một thao tác duy nhất
        this.options.innerHTML = '';
        this.options.appendChild(fragment);
    }

    path(folderName, serial = 1) {
        return `./gallery/${folderName}/${serial}.jpg`
    }

    loadImages(config) {
        // Xóa nội dung cũ
        this.galleryContainer.innerHTML = '';

        // Tạo và sử dụng Virtual DOM Fragment
        const fragment = document.createDocumentFragment();
        const totalImages = config.tI;
        const folderPath = config.iF;

        // Tạo mảng các URL ảnh trước
        const imageUrls = Array.from({ length: totalImages }, (_, i) =>
            this.path(folderPath, i + 1)
        );

        // Sử dụng virtualized rendering để hiển thị hiệu quả
        this.setupVirtualizedRendering(imageUrls, folderPath, fragment);
    }

    setupVirtualizedRendering(imageUrls, folderPath, fragment) {
        // Chỉ render ảnh trong viewport đầu tiên + một số ảnh phụ
        const initialRenderCount = Math.min(24, imageUrls.length);

        // Render batch đầu tiên ngay lập tức
        this.renderImageBatch(imageUrls.slice(0, initialRenderCount), folderPath, fragment);
        this.galleryContainer.appendChild(fragment);

        // Thiết lập infinite scroll loader cho phần còn lại
        if (imageUrls.length > initialRenderCount) {
            this.setupInfiniteScroll(imageUrls, initialRenderCount, folderPath);
        }

        // Thiết lập Intersection Observer cho các ảnh đã render
        this.setupIntersectionObserver();
    }

    renderImageBatch(imageBatch, folderPath, targetFragment) {
        imageBatch.forEach((src, idx) => {
            const column = document.createElement('div');
            column.className = 'col-lg-2 image';

            const wrapper = document.createElement('div');
            wrapper.className = 'img-wrapper';

            const link = document.createElement('a');
            link.href = src;
            link.dataset.index = idx;

            // Sử dụng lazy loading với data-src
            const img = document.createElement('img');
            img.className = 'img-responsive';
            img.dataset.src = src; // Lưu src thật vào data-src
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; // Tiny transparent placeholder
            img.alt = folderPath;
            img.dataset.name = idx;
            img.loading = 'lazy';
            img.decoding = 'async';

            const overlay = document.createElement('div');
            overlay.className = 'img-overlay';

            const icon = document.createElement('i');
            icon.className = 'fa fa-plus-circle text-white';
            icon.setAttribute('aria-hidden', 'true');

            overlay.appendChild(icon);
            link.appendChild(img);
            wrapper.appendChild(link);
            wrapper.appendChild(overlay);
            column.appendChild(wrapper);

            targetFragment.appendChild(column);
        });
    }

    setupInfiniteScroll(allImageUrls, startIndex, folderPath) {
        const loadMoreThreshold = 300; // px từ cuối trang
        const batchSize = 18; // Số lượng ảnh mỗi lần load
        let nextIndex = startIndex;
        let isLoading = false;

        const handleScroll = () => {
            if (isLoading || nextIndex >= allImageUrls.length) return;

            const scrollY = window.scrollY;
            const visibleHeight = window.innerHeight;
            const pageHeight = document.documentElement.scrollHeight;
            const bottomOfPage = scrollY + visibleHeight >= pageHeight - loadMoreThreshold;

            if (bottomOfPage) {
                isLoading = true;

                // Tính toán batch tiếp theo
                const endIndex = Math.min(nextIndex + batchSize, allImageUrls.length);
                const nextBatch = allImageUrls.slice(nextIndex, endIndex);

                // Render batch mới
                requestAnimationFrame(() => {
                    const fragment = document.createDocumentFragment();
                    this.renderImageBatch(nextBatch, folderPath, fragment);
                    this.galleryContainer.appendChild(fragment);

                    // Cập nhật index và trạng thái
                    nextIndex = endIndex;
                    isLoading = false;

                    // Cập nhật Intersection Observer cho các ảnh mới
                    this.setupIntersectionObserver();

                    // Ngừng lắng nghe nếu đã tải tất cả
                    if (nextIndex >= allImageUrls.length) {
                        window.removeEventListener('scroll', handleScroll);
                    }
                });
            }
        };

        // Debounce scroll event để tối ưu hiệu năng
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScroll, 100);
        });
    }

    setupIntersectionObserver() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if (!lazyImages.length) return;

        if ('IntersectionObserver' in window) {
            // Tái sử dụng observer nếu đã tồn tại
            if (!this.imageObserver) {
                console.log(this.observedElements);
                
                this.imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            const realSrc = img.dataset.src;

                            if (realSrc) {
                                // Tạo một ảnh tạm để preload
                                const tempImg = new Image();
                                tempImg.onload = () => {
                                    // Chỉ thay đổi src khi ảnh đã tải xong
                                    img.src = realSrc;
                                    img.classList.add('loaded');
                                    delete img.dataset.src; // Xóa data-src để không load lại
                                };
                                tempImg.src = realSrc;
                                this.imageCache.set(realSrc, true);
                            }

                            // Ngừng theo dõi ảnh này
                            observer.unobserve(img);
                            this.observedElements.delete(img);
                        }
                    });
                }, {
                    rootMargin: '100px 0px', // Load trước khi vào viewport 100px
                    threshold: 0.01
                });
            }

            lazyImages.forEach(img => {
                if (!this.observedElements.has(img)) {
                    this.imageObserver.observe(img);
                    this.observedElements.add(img);
                }
            });
        } else {
            // Fallback cho trình duyệt không hỗ trợ IntersectionObserver
            this.loadAllImagesImmediately(lazyImages);
        }
    }

    loadAllImagesImmediately(images) {
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                delete img.dataset.src;
            }
        });
    }

    clearImageCache() {
        this.imageCache.clear();

        // Loại bỏ tất cả observers hiện tại
        if (this.imageObserver) {
            this.observedElements.forEach(element => {
                this.imageObserver.unobserve(element);
            });
        }
        this.observedElements.clear();
        this.observedElements.entries
        console.log('after: ', this.observedElements )
    }

    preloadNextImages(currentIndex, count = 5) {
        const preloadFunc = () => {
            const images = Array.from(document.querySelectorAll(".img-wrapper a"));
            for (let i = 1; i <= count; i++) {
                const nextIdx = (currentIndex + i) % images.length;
                const nextSrc = images[nextIdx].href;

                if (!this.imageCache.has(nextSrc)) {
                    const img = new Image();
                    img.src = nextSrc;
                    this.imageCache.set(nextSrc, true);
                }
            }
        };

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(preloadFunc);
        } else {
            preloadFunc();
        }
    }

    initEvents() {
        // Sử dụng event delegation khi có thể để giảm số lượng event listener
        this.selectBtn.addEventListener("click", () => this.selectMenu.classList.add("active"));

        this.options.addEventListener("click", (e) => {
            const option = e.target.closest(".option");
            if (!option) return;

            const optionText = option.querySelector(".option-text");
            const newIndex = parseInt(optionText.dataset.index);

            if (this.selectBtnText.textContent !== optionText.textContent) {
                // Xóa cache khi chuyển folder
                this.clearImageCache();

                window.scrollTo({ top: 0, behavior: "smooth" });
                this.currentIndex = newIndex;
                this.loadImages(lIF[newIndex]);
                this.selectBtnText.textContent = optionText.textContent;
                localStorage.setItem("index", newIndex);
            }
            this.hideDialog();
        });

        this.exitBtn.addEventListener("click", () => this.hideDialog());

        // Delegate event cho overlay images
        this.galleryContainer.addEventListener("click", (e) => {
            const imgOverlay = e.target.closest(".img-overlay");
            if (imgOverlay) {
                e.preventDefault();
                const link = imgOverlay.previousElementSibling;

                // Thêm indicator loading
                this.overlayImg.classList.add('loading');

                // Hiển thị overlay ngay lập tức
                this.overlay.style.display = "block";

                // Tải hình ảnh chất lượng cao
                const highResImg = new Image();
                highResImg.onload = () => {
                    this.overlayImg.src = link.href;
                    this.overlayImg.classList.remove('loading');
                    this.overlay.style.opacity = 1;

                    // Preload một số ảnh kế tiếp
                    const currentIndex = parseInt(link.dataset.index);
                    this.preloadNextImages(currentIndex);
                };
                highResImg.src = link.href;
            }
        });

        this.overlayExit.addEventListener("click", () => {
            this.clearSlideInterval();
            this.overlay.style.opacity = 0;
            this.overlay.style.display = "none";
        });

        this.overlay.addEventListener("click", (e) => {
            if (e.target === this.overlayExit) return;

            const overlay = e.currentTarget;
            const threshold = overlay.offsetWidth / 4;

            if (e.clientY > 70) {
                if (e.pageX <= threshold) {
                    this.navigateImage("p", e);
                } else if (e.pageX >= overlay.offsetWidth - threshold) {
                    this.navigateImage("n", e);
                }
            }
        });

        // Keyboard event handler
        document.addEventListener("keydown", this.handleKeyPress.bind(this));
    }

    handleKeyPress(e) {
        // Phân tách xử lý phím bấm thành một phương thức riêng để dễ bảo trì
        e.stopPropagation();

        switch (e.keyCode) {
            case 27: // ESC
                if (this.overlay.style.display === "block") {
                    this.overlayExit.click();
                } else {
                    this.hideDialog();
                }
                break;
            case 39: // Right arrow
                if (this.overlay.style.display === "block") {
                    this.navigateImage("n", e);
                }
                break;
            case 37: // Left arrow
                if (this.overlay.style.display === "block") {
                    this.navigateImage("p", e);
                }
                break;
            case 70: // F key
                this.showDialog();
                break;
            case 32: // Space
                if (e.target === document.body && this.overlay.style.display === "block") {
                    e.preventDefault();
                    this.toggleSlideShow(e);
                }
                break;
        }
    }

    navigateImage(direction, event, updateInterval = 1) {
        event.stopPropagation();
    
        const currentSrc = this.overlayImg.src;
        
        // Tách folder và số ảnh từ src
        const match = currentSrc.match(/\/gallery\/(.+?)\/(\d+)\.jpg$/);
        if (!match) return;
    
        const folder = decodeURIComponent(match[1]);

        let imageNumber = parseInt(match[2], 10);
    
        // Tìm total ảnh trong folder
        const album = lIF.find(item => item.iF === folder);
        
        if (!album) return;
    
        const totalImages = album.tI;
    
        // Tính next index
        if (direction === "n") {
            imageNumber = (imageNumber + 1) % totalImages;
        } else {
            imageNumber = (imageNumber - 1 + totalImages) % totalImages;
        }
    
        const fullSizeSrc = `./gallery/${folder}/${imageNumber}.jpg`;
    
        const highResImage = new Image();
        highResImage.onload = () => {
            this.overlayImg.src = fullSizeSrc;
            this.currentIndex = imageNumber;
    
            this.preloadNextImages(imageNumber); // Nếu bạn muốn preload
        };
        highResImage.src = fullSizeSrc;
    
        if (updateInterval && this.slideInterval) {
            this.clearSlideInterval();
        }
    }
    

    toggleSlideShow(event) {
        if (this.slideInterval) {
            this.clearSlideInterval();
        } else {
            // Đảm bảo time được định nghĩa ở nơi khác trong code
            const slideshowInterval = time; // Mặc định 3 giây nếu không có biến time
            this.slideInterval = setInterval(() => this.navigateImage("n", event, 0), slideshowInterval);
        }
    }

    clearSlideInterval() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }

    showDialog() {
        // Sử dụng CSS transition thay vì jQuery animation
        this.dialog.style.top = "15%";
        this.dialog.style.right = "30%";
        this.dialog.style.opacity = 1;
    }

    hideDialog() {
        this.dialog.style.top = "-15%";
        this.dialog.style.right = "-30%";
        this.dialog.style.opacity = 0;
        this.selectMenu.classList.remove("active");
    }
}

// Khởi tạo gallery khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    const gallery = new ImageGallery();
});