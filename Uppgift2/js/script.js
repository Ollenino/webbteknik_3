/* Uppgift U2 */
// --------------------------------------------------
// Globala variabler och konstanter
let cart = [];  // Varukorg

function CartItem(artnr) {
    this.artnr = artnr;
    this.quantity = 1;
}

// Initiering av programmet. Visa produkter och hämta varukorg.
function init() {
    switch (document.querySelector("body").className) {
        case "chocolate": showProducts(chocolate); break;
        case "caramel": showProducts(caramel); break;
        case "softcandy": showProducts(softcandy); break;
    }
    getCart();
} // Slut init
window.addEventListener("load", init);
// --------------------------------------------------
// Skapa HTML-kod för visning av produkterna i parametern products.
// Lägg händelselyssnare på knapparna.
function showProducts(products) {
    let htmlCode = "";
    for (let i = 0; i < products.length; i++) {
        htmlCode +=
            "<div>" +
            "<img src='" + products[i].img + "' alt='produkt'>" +
            "<h4>" + products[i].name + "</h4>" +
            "<p>Pris: " + products[i].price.toFixed(2) + " kr.</p>" +
            "<button type='button' class='order'>Lägg i korg</button>" +
            "</div>";
    }
    document.querySelector("#products").innerHTML = htmlCode;
    let btns = document.querySelectorAll("#products .order");
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () { addToCart(products[i].artnr) });
    }
} // Slut showProducts
// --------------------------------------------------
// Returnera objekt för produkten med artikelnumret artnr.
// Finns det ingen sådan produkt, returneras null.
function getProduct(artnr) {
    let products;
    switch (artnr[0]) { // Välj produktvariabel utifrån artikelnumrets första tecken
        case "c": products = chocolate; break;
        case "k": products = caramel; break;
        case "m": products = softcandy; break;
    }
    for (let i = 0; i < products.length; i++) {
        if (products[i].artnr == artnr) return products[i]; // Produktens objekt
    }
    return null; // Produkten finns inte
} // Slut getProduct
// --------------------------------------------------
// Om produkten redan finns i varukorgen, uppdateras mängden.
// Annars läggs produkten in som en ny vara i varukorgen.
function addToCart(artnr) {
    let item = getCartItem(artnr)

    if (item) {
        item.quantity++;
    } else {
        let newItem = new CartItem(artnr);
        cart.push(newItem);
    }
    console.log(cart);
    saveCart();
    showCart();
} // Slut addToCart
// --------------------------------------------------
// Ta bort den vara som indexeras av index.
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    showCart();
} // Slut removeFromCart
// --------------------------------------------------
// Returnera objekt för varan med artikelnumret artnr.
// Finns det ingen sådan vara i varukorgen, returneras null.
function getCartItem(artnr) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].artnr == artnr) return cart[i]; // Objektet i varukorgen
    }
    return null; // Produkten finns inte i varukorgen
} // Slut getCartItem
// --------------------------------------------------
// ----- Extramerit
// Uppdatera varans mängd med amount, som ska vara antingen -1 eller +1.
function changeQuantityInCart(index, amount) {

} // Slut changeQuantityInCart
// --------------------------------------------------
// Skapa HTML-kod för visning av varukorgen.
// Beräkna också pris, både för varje vara och totalt för alla varor.
// Lägg händelselyssnare på knapparna.
function showCart() {
    let cartElement = document.getElementById("cart");
    cartElement.innerHTML = "";
    let totalPrice = 0;

    cart.forEach((item, index) => {
        let product = getProduct(item.artnr);
        if (!product) return;

        let productPrice = product.price * item.quantity;
        totalPrice += productPrice;

        let div = document.createElement("div");
        div.innerHTML = `
        <h4>${product.name}</h4>
        <button type="button" class="del" data-index="${index}"></button>
        <p>Antal: ${item.quantity}</p>
        <p>Pris: ${productPrice.toFixed(2)} kr.</p>
    `; 
        cartElement.appendChild(div);
    });

    document.getElementById("totPrice").innerText = `Total: ${totalPrice.toFixed(2)} kr.`;

    document.querySelectorAll(".del").forEach(button => {
        button.addEventListener("click", () => removeFromCart(button.CDATA_SECTION_NODE.index));
    });
} // Slut showCart
// --------------------------------------------------
// Konvertera varukorgen till en sträng m.h.a. JSON och spara i localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
} // Slut saveCart
// --------------------------------------------------
// Läs in från localStorage och konvertera till varukorgens datatyp m.h.a. JSON
function getCart() {
    let savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        cart = [];
    }
    showCart();
} // Slut getCart
// --------------------------------------------------
