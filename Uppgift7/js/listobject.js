/* Hantering av varukorgen och önskelistan i uppgift U7.
   Detta är förenklade listor, eftersom uppgiften inte handlar om listornas struktur och innehåll.
   Istället är det interaktionen för att hantera listorna (flytta varor mellan listorna och slänga varor i soptunnan),
   som uppgiften går ut på, vilket är kod som du skriver i filen list.js. */

// --------------------------------------------------
// Definition av en class för att skapa listor (varukorg och önskelista).
class ListObject {
    constructor (elem, storageName) {
        this.listElem = elem;         // Element där listan ska visas (null = visa ej)
        this.storageName = storageName; // Namn för localStorage
        this.list = [];               // Startar med tom array

        this.getList();               // Läs in tidigare lista (om den finns)
        this.showList();              // Visa listan på sidan
    }

    // ----------------------
    // Lägg till produkt om den inte redan finns
    addItem(anr) {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].artnr == anr) return;
        }
        this.list.push({ artnr: anr, quantity: 1 });
        this.showList();
        this.saveList();
    }

    // ----------------------
    // Ta bort produkt med artikelnummer anr
    removeItem(anr) {
        let ix = -1;
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].artnr == anr) {
                ix = i;
                break;
            }
        }
        if (ix > -1) {
            this.list.splice(ix, 1);
            this.showList();
            this.saveList();
        }
    }

    // ----------------------
    // Skapa HTML-kod för visning av listan.
    showList() {
        if (this.listElem == null) return;
        this.listElem.innerHTML = "";

        for (let i = 0; i < this.list.length; i++) {
            let prod = this.getProduct(this.list[i].artnr);

            let divElem = document.createElement("div");
            let h4Elem = document.createElement("h4");
            let pElem = document.createElement("p");

            // Klass och attribut för drag-and-drop
            divElem.className = "product";
            divElem.dataset.id = prod.artnr;

            h4Elem.innerText = prod.name;
            pElem.innerText = prod.price + " kr";

            divElem.appendChild(h4Elem);
            divElem.appendChild(pElem);
            this.listElem.appendChild(divElem);

            // Lägg till pointerdown för att starta drag
            divElem.addEventListener("pointerdown", dragStart);
        }
    }

    // ----------------------
    // Hämta produktobjekt med artikelnummer (från data.js)
    getProduct(anr) {
        let products = [];

        switch (anr[0]) {
            case "c": products = chocolate.products; break;
            case "k": products = caramel.products; break;
            case "m": products = softcandy.products; break;
        }

        for (let i = 0; i < products.length; i++) {
            if (products[i].artnr == anr) return products[i];
        }

        return null;
    }

    // ----------------------
    // Spara listan till localStorage
    saveList() {
        let data = JSON.stringify(this.list);
        localStorage.setItem(this.storageName, data);
    }

    // ----------------------
    // Läs in lista från localStorage (om den finns)
    getList() {
        let data = localStorage.getItem(this.storageName);
        if (data) {
            this.list = JSON.parse(data);
        }
    }
} // 🔚 class ListObject

// --------------------------------------------------
