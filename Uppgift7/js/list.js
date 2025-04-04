// --------------------------------------------------
// Globala variabler
let dragOrigElem; // Det element man börjar dra
let dragElem;     // Klonen som följer pekaren
let dropElem;     // Den aktiva drop zone
let wishlist, cart; // Listobjecten

// --------------------------------------------------
// Initiering då webbsidan är inläst
function init() {
    // Skapa listobjekt
    wishlist = new ListObject(document.querySelector("#favorites .list"), "wishlist");
    cart = new ListObject(document.querySelector("#shoppingcart .list"), "cart");
}
window.addEventListener("load", init);

// --------------------------------------------------
// Påbörja en drag-operation
function dragStart(e) {
    e.preventDefault();
    if (!e.isPrimary) return;

    dragOrigElem = this;

    // Position och offset
    const rect = dragOrigElem.getBoundingClientRect();
    const dx = e.clientX - rect.x;
    const dy = e.clientY - rect.y;

    // Skapa klon
    dragElem = dragOrigElem.cloneNode(true);
    dragElem.classList.add("dragItemClone");
    dragElem.style.left = dragOrigElem.offsetLeft + "px";
    dragElem.style.top = dragOrigElem.offsetTop + "px";
    dragElem.style.width = dragOrigElem.offsetWidth + "px";
    dragElem.style.height = dragOrigElem.offsetHeight + "px";
    document.body.appendChild(dragElem);

    // Ändra opacity på originalelementet istället för att dölja det
    dragOrigElem.style.opacity = 0.4;

    // Drop zones: önskelista, varukorg och soptunna
    let dropElems = Array.from(document.querySelectorAll(".dropZone"));

    // Ta bort källistan från drop zones
    const parentList = dragOrigElem.closest(".dropZone");
    dropElems = dropElems.filter(el => el !== parentList);

    dropElem = null;

    // Händelser
    document.addEventListener("pointermove", dragMove);
    document.addEventListener("pointerup", dragEnd);
    document.addEventListener("pointercancel", dragEnd);

    // ----------
    function dragMove(e) {
        e.preventDefault();
        if (!e.isPrimary) return;

        dragElem.style.left = (e.pageX - dx) + "px";
        dragElem.style.top = (e.pageY - dy) + "px";

        let hoverElems = document.elementsFromPoint(e.clientX, e.clientY);
        let elem = overlapItem(dropElems, hoverElems);

        if (elem !== dropElem) {
            if (dropElem) dropElem.classList.remove("hiliteDropZone");
            if (elem) elem.classList.add("hiliteDropZone");
            dropElem = elem;
        }
    }

    // ----------
    function dragEnd(e) {
        e.preventDefault();
        if (!e.isPrimary) return;

        dragOrigElem.style.opacity = 1;
        dragElem.remove();
        document.removeEventListener("pointermove", dragMove);
        document.removeEventListener("pointerup", dragEnd);
        document.removeEventListener("pointercancel", dragEnd);

        if (dropElem) {
            dropElem.classList.remove("hiliteDropZone");

            const prodId = dragOrigElem.dataset.id;
            
            // Hitta källistan (där elementet drogs från)
            const parentList = dragOrigElem.closest(".dropZone");

            // Vilken lista släpper vi på?
            if (dropElem.id === "trashcan") {
                // Släpper på soptunnan - ta bort från källistan
                getListObject(parentList.id).removeItem(prodId);
            } else {
                // Släpper på en annan lista - lägg till i den nya listan och ta bort från källistan
                getListObject(dropElem.id).addItem(prodId);
                getListObject(parentList.id).removeItem(prodId);
            }
        }
    }
}

// --------------------------------------------------
// Returnera det första värdet i a1 som också finns i a2
function overlapItem(a1, a2) {
    for (let i = 0; i < a1.length; i++) {
        if (a2.includes(a1[i])) return a1[i];
    }
    return null;
}

// --------------------------------------------------
// Hjälpfunktion för att få rätt listobjekt
function getListObject(zoneId) {
    switch (zoneId) {
        case "shoppingcart":
            return cart;
        case "favorites":
            return wishlist;
        default:
            return null;
    }
}