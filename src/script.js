const a = (() => {
    let e = $("#dialog-container"),
        t = e.find(".options"),
        i = $(".select-menu"),
        s = $(".sBtn-text"),
        cl = e.find(".exit");

    l = (t) => e.css(t),
        n = () => {
            l({ top: "15%", right: "30%", opacity: 1 });
        },
        c = () => {
            l({ top: "-15%", right: "-30%", opacity: 0 }), i.removeClass("active");
        };
    return (
        s.text(lIF[localStorage.getItem("index") ?? 0].iF),
        lIF.forEach((e, i) => {
            t.append(`
                <li class="option">
                    <div class="img-select-container"><img src="./public/${e.iF}/1.jpg" alt="${s}" class="img-select"></div>
                    <span class="option-text" data-index="${i}">${e.iF}</span>
                </li>
            `);
        }),
        $(".select-btn").on("click", () => i.addClass("active")),
        t.on("click", ".option", function () {
            let e = $(this).find(".option-text").text();
            if (s.text() !== e) {
                $("html, body").animate({ scrollTop: "0px" }, 0);
                let t = $(this).find(".option-text").data("index");
                lI(lIF[t]), s.text(e), localStorage.setItem("index", t);
            }
            c();
        }),
        cl.on("click", () => {
            c();
        }),
        { show: n }
    );
})(),
    o = $("#overlay"),
    eo = $("#overlay .exit"),
    uI = (e, t, i = 1, s = $("#overlay img")) => {
        t.stopPropagation(), s.hide();
        let l = $('#image-gallery img[src="' + s.attr("src") + '"]').closest(".image"),
            n;
        "n" === e
            ? 0 === (n = l.next().find("img")).length && (n = $("#image-gallery img").first())
            : 0 === (n = l.prev().find("img")).length && (n = $("#image-gallery img").last()),
            s.attr("src", n.attr("src")).fadeIn(0),
            i && iI && (clearInterval(iI), (iI = null));
    },
    lI = (e, t = "") => {
        for (let i = 1; i < e.tI; i++) {
            let s = `./public/${e.iF}/${i}.jpg`;
            t += `
                <div class="col-lg-2 image">
                    <div class="img-wrapper">
                        <a href="${s}"><img src="${s}" alt="${s}" data-name="${i}" class="img-responsive" loading="lazy" decoding="async"></a>
                        <div class="img-overlay">
                            <i class="fa fa-plus-circle text-white" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
            `;
        }
        $(".row").html(t);
    };

eo.click(() => {
    clearInterval(iI), o.fadeOut("slow");
})
$(document).on("click", ".img-overlay", function (e) {
    e.preventDefault(), o.find("img").attr("src", $(this).prev().attr("href")), o.fadeIn("slow");
}),
    o.click(
        (e, t = $(this).width() - 1200) =>
            e.clientY > 70 && (e.pageX <= t ? uI("p", e) : e.pageX >= $(this).width() - t && uI("n", e))
    );
let iI;
lI(lIF[localStorage.getItem("index") ?? 0]),
    $(document).keydown((e) => {
        switch ((32 == e.keyCode && e.target == document.body && e.preventDefault(), e.stopPropagation(), e.keyCode)) {
            case 27:
                cO();
                break;
            case 39:
                uI("n", e);
                break;
            case 37:
                uI("p", e);
                break;
            case 70:
                a.show();
                break;
            case 32:
                iI ? (clearInterval(iI), (iI = null)) : (iI = setInterval(() => uI("n", e, 0), time));
        }
    });
