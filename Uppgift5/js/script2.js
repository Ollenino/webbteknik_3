/* Uppgift U5 */
// --------------------------------------------------
// Klassbaserad version av bildspelet

class ImageViewer {
    constructor(elem) {
        this.viewerElem = elem;
        this.titleElem = this.viewerElem.querySelector("h4");
        this.captionElem = this.viewerElem.querySelector("p");
        this.imgElem = this.viewerElem.querySelector("img");
        this.imgList = [];
        this.imgIx = 0;
        this.timer = null;

        if (this.viewerElem.querySelector(".leftBtn"))
            this.viewerElem.querySelector(".leftBtn").addEventListener("click", () => this.prevImg());
        if (this.viewerElem.querySelector(".rightBtn"))
            this.viewerElem.querySelector(".rightBtn").addEventListener("click", () => this.nextImg());
        if (this.viewerElem.querySelector(".autoBtn"))
            this.viewerElem.querySelector(".autoBtn").addEventListener("click", () => this.autoImg());
        if (this.viewerElem.querySelector(".closeBtn"))
            this.viewerElem.querySelector(".closeBtn").addEventListener("click", () => this.closeViewer());
    }

    async openViewer(url, modal) {
        let response = await fetch(url);
        if (response.ok) {
            let data = await response.json();
            this.getImages(data);
        } else {
            this.titleElem.innerText = "Fel vid hämtning: " + response.status;
        }
        if (modal) this.viewerElem.showModal();
    }

    closeViewer() {
        this.autoStop();
        if (this.viewerElem.querySelector(".autoBtn")) 
            this.viewerElem.querySelector(".autoBtn").style.background = "";
        this.viewerElem.close();
    }

    getImages(json) {
        this.titleElem.innerText = json.category;
        this.imgList = json.image;
        this.imgIx = 0;
        this.showImg();
    }

    prevImg() {
        if (this.imgIx > 0) this.imgIx--;
        else this.imgIx = this.imgList.length - 1;
        this.showImg();
    }

    nextImg() {
        if (this.imgIx < this.imgList.length - 1) this.imgIx++;
        else this.imgIx = 0;
        this.showImg();
    }

    showImg() {
        this.imgElem.src = this.imgList[this.imgIx].url;
        if (this.captionElem) {
            this.captionElem.innerText = (this.imgIx + 1) + ". " + this.imgList[this.imgIx].caption;
        }
    }

    autoImg() {
        if (this.timer == null) {
            this.autoStart(3000);
            this.viewerElem.querySelector(".autoBtn").style.backgroundColor = "green";
        } else {
            this.autoStop();
            this.viewerElem.querySelector(".autoBtn").style.backgroundColor = "";
        }
    }

    autoStart(interval) {
        this.timer = setInterval(() => this.nextImg(), interval);
    }

    autoStop() {
        if (this.timer != null) clearInterval(this.timer);
        this.timer = null;
    }
}

// --------------------------------------------------
// Initiering då webbsidan laddats in
function init() {
    const viewerInstance = new ImageViewer(document.querySelector("#largeViewer"));
    document.querySelector("#categoryMenu").addEventListener("change", (e) => {
        viewerInstance.openViewer("data/images" + e.currentTarget.selectedIndex + ".json", true);
        e.currentTarget.selectedIndex = 0;
    });

    // Skapa fyra små bildspel
    for (let i = 1; i <= 4; i++) {
        let smallViewer = new ImageViewer(document.querySelector("#viewer" + i));
        smallViewer.openViewer("data/images" + i + ".json", false);

        let viewerElem = document.querySelector("#viewer" + i);
        
        viewerElem.addEventListener("mouseenter", () => smallViewer.autoStart(300));
        viewerElem.addEventListener("mouseleave", () => smallViewer.autoStop());
        viewerElem.addEventListener("click", () => {
            viewerInstance.openViewer("data/images" + i + ".json", true);
        });
    }
} 
window.addEventListener("load", init);

