function initCategories() {
    let wrapperElem = document.querySelector("#imgViewer .slideshow div");
    wrapperElem.innerHTML = "";

    const slides = [];

    for (let i = 0; i < categories.group.length; i++) {
        let cat = categories.group[i];

        let divElem = document.createElement("div");
        let imgElem = document.createElement("img");
        let h4Elem = document.createElement("h4");

        divElem.className = "slide";
        imgElem.src = cat.img;
        imgElem.alt = "kategoribild";
        h4Elem.innerText = cat.name;

        divElem.appendChild(imgElem);
        divElem.appendChild(h4Elem);
        wrapperElem.appendChild(divElem);

        divElem.addEventListener("pointerdown", dragStart);

        // Dubbelklick (skickar vidare till index.js)
        divElem.addEventListener("click", handleClick); // Funktion finns i index.js

        slides.push(divElem);
    }
}
function showProducts(jsonCode) {
    document.querySelector("#products h3").innerText = jsonCode.category;
    let wrapperElem = document.querySelector("#products div");
    wrapperElem.innerHTML = "";

    for (let i = 0; i < jsonCode.products.length; i++) {
        let prod = jsonCode.products[i];

        let divElem = document.createElement("div");
        let imgElem = document.createElement("img");
        let h4Elem = document.createElement("h4");
        let pElem = document.createElement("p");
        let buttonElem = document.createElement("button");

        divElem.className = "product";
        imgElem.src = prod.img;
        imgElem.alt = "produkt";
        h4Elem.innerText = prod.name;
        pElem.innerText = "Pris: " + prod.price.toFixed(2) + " kr.";
        buttonElem.type = "button";
        buttonElem.className = "order";
        buttonElem.innerText = "Lägg i korg";

        divElem.appendChild(imgElem);
        divElem.appendChild(h4Elem);
        divElem.appendChild(pElem);
        divElem.appendChild(buttonElem);
        wrapperElem.appendChild(divElem);

        buttonElem.addEventListener("click", () => cart.addItem(prod.artnr));
    }
}
function noProducts() {
    document.querySelector("#products h3").innerText = "";
    document.querySelector("#products div").innerText = "Tyvärr finns inte dessa varor i lager ännu.";
}
