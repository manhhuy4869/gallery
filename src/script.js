let folderSelect = lIF[localStorage.getItem("index") ?? 0],
    iI,
    overlay = $("#overlay"),
    url = "../react/public/h/",
    imgOverlay = overlay.find("img");
    
const generateImageURL = (folder, index, type = "mini") => `${url}/${folder.iF}/${type}/${index}.jpg`;

const updateImages = (folder) => {
    const container = document.querySelector(".row");
    const images = container.querySelectorAll(".lazy-image");
    const totalImages = images.length;

    if (folder.tI > totalImages) {
        // Thêm ảnh nếu folder mới có nhiều hơn ảnh hiện tại
        const additionalImages = Array.from({ length: folder.tI - totalImages }, (_, index) => {
            const i = totalImages + index + 1;
            return `
                <div class="col-lg-2 image">
                    <div class="img-wrapper">
                        <a href="${url}/${folder.iF}/${i}.jpg" data-index="${i}">
                            <img data-src="${url}/${folder.iF}/mini/${i}.jpg" 
                                 class="img-responsive lazy-image" 
                                 loading="lazy" 
                                 decoding="async">
                        </a>
                        <div class="img-overlay">
                            <i class="fa fa-plus-circle text-white" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        container.insertAdjacentHTML("beforeend", additionalImages);
    }

    // Cập nhật hoặc ẩn các ảnh hiện có
    images.forEach((img, index) => {
        const i = index + 1;
        if (i > folder.tI) {
            img.closest(".image").style.display = "none";
        } else {
            const newSrc = `${url}/${folder.iF}/mini/${i}.jpg`;
            img.dataset.src = newSrc;
            img.src = ""; // Reset `src`
            img.classList.remove("loaded");
            img.closest(".image").style.display = "";
        }
    });

    initLazyLoad(); // Gọi lại lazy-load
};


const updateDialog = (() => {
    let dialogContainer = $("#dialog-container"),
        selectBtnText = $(".sBtn-text"),
        selectMenu = $(".select-menu"),
        options = dialogContainer.find(".options");
    const updateOptions = () => {
        options.empty();
        lIF.forEach((item, index) => {
            options.append(`
                <li class="option">
                    <div class="img-select-container"><img src="${url}/${item.iF}/1.jpg" alt="${item.iF}" class="img-select"></div>
                    <span class="option-text" data-index="${index}">${item.iF}</span>
                </li>
            `);
        });
    };

    const showDialog = () => dialogContainer.css({ top: "15%", right: "30%", opacity: 1 });
    const hideDialog = () => {
        dialogContainer.css({ top: "-15%", right: "-30%", opacity: 0 });
        selectMenu.removeClass("active");
    };

    selectBtnText.text(folderSelect.iF);
    updateOptions();

    $(".select-btn").on("click", () => selectMenu.addClass("active"));

    options.on("click", ".option", function () {
        const optionText = $(this).find(".option-text");
        const newText = optionText.text();

        hideDialog();
        window.scrollTo(0, 0);

        if (selectBtnText.text() !== newText) {
            const index = optionText.data("index");
            folderSelect = lIF[index];
            lI(folderSelect);
            localStorage.setItem("index", index);
            selectBtnText.text(newText);
        }
    });

    return { show: showDialog, close: hideDialog };
})();

const updateOverlayImage = (e, isNext = 1, play = 0, index = imgOverlay.attr("data-idImage")) => {
    if (overlay.is(":hidden")) return;
    e.stopPropagation();

    const newId = isNext ? (index >= folderSelect.tI ? 1 : ++index) : index <= 1 ? folderSelect.tI : --index;

    imgOverlay
        .hide()
        .attr({
            "data-idImage": newId,
            src: `${url}/${folderSelect.iF}/${newId}.jpg`,
        })
        .fadeIn(0);

    !play && iI && pause();
};

const closeOverlay = () => {
    overlay.fadeOut("slow");
    imgOverlay.removeAttr("data-idImage");
    iI ?? pause();
};

const pause = () => {
    clearInterval(iI);
    iI = null;
};

$(document).on("click", ".img-overlay", function (e, prevLink = $(this).prev()) {
    e.preventDefault();
    imgOverlay.attr({
        src: prevLink.attr("href"),
        "data-idImage": prevLink.data("index"),
    });
    overlay.fadeIn("slow");
});

overlay.click((e) => {
    const width = $(this).width() - 1200;
    e.clientY > 70 &&
        (e.pageX <= width || e.pageX >= $(this).width() - width) &&
        updateOverlayImage(e, e.pageX <= width ? 0 : undefined);
});

$(document).keydown((e) => {
    switch (e.keyCode) {
        case 27:
            closeOverlay();
            break;
        case 39:
            updateOverlayImage(e);
            break;
        case 37:
            updateOverlayImage(e, 0);
            break;
        case 70:
            updateDialog.show();
            break;
        case 32:
            e.preventDefault();
            e.stopPropagation();
            iI ? pause() : (iI = setInterval(() => updateOverlayImage(e, 1, 1), time));
            break;
    }
});
