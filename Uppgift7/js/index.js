// Globala variabler
let cart, wishlist;
const minDrag = 100;
let wrapperElem;
let slideWidth;
let currentIx;
let nrOfSlides;

// 👇 Variabler för dubbelklick
let lastClickTime = 0;
let lastClickedElem = null;

function init() {
    // Skapa listobjekt med samma namn som används i list.js
    cart = new ListObject(null, "cart");        
    wishlist = new ListObject(null, "wishlist"); // Lagt till wishlist

    wrapperElem = document.querySelector("#imgViewer .slideshow > div");
    initCategories();
    currentIx = 0;
    showSlide();
    window.addEventListener("orientationchange", showSlide);
    window.addEventListener("resize", showSlide);
    document.addEventListener("keydown", checkKey);
}
window.addEventListener("load", init);

function showSlide() {
    slideWidth = wrapperElem.querySelector(".slide").offsetWidth;
    nrOfSlides = Math.floor(wrapperElem.offsetWidth / slideWidth);
    wrapperElem.style.transitionDuration = "0.2s";
    wrapperElem.style.transform = "translateX(" + (-currentIx * slideWidth) + "px)";
}

function dragStart(e) {
    e.preventDefault();
    if (!e.isPrimary) return;
    let dragElem = this;
    let startX = e.pageX;
    wrapperElem.style.transitionDuration = "0s";
    document.addEventListener("pointerup", dragEnd);
    document.addEventListener("pointercancel", dragEnd);
    dragElem.addEventListener("pointermove", dragMove);

    function dragEnd(e) {
        e.preventDefault();
        if (!e.isPrimary) return;
        document.removeEventListener("pointerup", dragEnd);
        document.removeEventListener("pointercancel", dragEnd);
        dragElem.removeEventListener("pointermove", dragMove);
        if (e.pageX - startX > minDrag) {
            shiftToPrevious();
        } else if (e.pageX - startX < -minDrag) {
            shiftToNext();
        }
        showSlide();
    }

    function dragMove(e) {
        e.preventDefault();
        if (!e.isPrimary) return;
        let x = e.pageX - startX - currentIx * slideWidth;
        wrapperElem.style.transform = "translateX(" + x + "px)";
    }
}

function checkKey(e) {
    switch (e.key) {
        case "ArrowLeft":
            e.preventDefault();
            shiftToPrevious();
            showSlide();
            break;
        case "ArrowRight":
            e.preventDefault();
            shiftToNext();
            showSlide();
            break;
    }
}

function shiftToPrevious() {
    if (currentIx >= nrOfSlides) {
        currentIx -= nrOfSlides;
    } else {
        currentIx = 0;
    }
}

function shiftToNext() {
    let maxIx = wrapperElem.querySelectorAll(".slide").length - nrOfSlides;
    if (currentIx + nrOfSlides <= maxIx) {
        currentIx += nrOfSlides;
    } else {
        currentIx = maxIx;
    }
}

// Funktion för att hantera dubbelklick (mus + touch)
function handleClick(e) {
    let clickedElem = e.currentTarget;
    let currentTime = new Date().getTime();

    if (clickedElem === lastClickedElem && (currentTime - lastClickTime) < 500) {
        // Dubbelklick upptäckt

        // 1. Temporär färgändring
        clickedElem.style.backgroundColor = "lightblue";
        setTimeout(() => {
            clickedElem.style.backgroundColor = "";
        }, 500);

        // 2. Hitta index för det klickade elementet
        const allSlides = Array.from(document.querySelectorAll(".slide"));
        const index = allSlides.indexOf(clickedElem);

        // 3. Visa produkter
        switch (index) {
            case 0:
                showProducts(chocolate);
                break;
            case 1:
                showProducts(caramel);
                break;
            case 2:
                showProducts(softcandy);
                break;
            default:
                noProducts();
        }
    }

    // Uppdatera senaste klick
    lastClickedElem = clickedElem;
    lastClickTime = currentTime;
}