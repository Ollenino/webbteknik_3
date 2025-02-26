/* Uppgift U6-1 */
// --------------------------------------------------
// Globala variabler och konstanter
const myApiKey = "ef613a81486a76320dc01145298bc636";	// API-nyckel
let search;         // Objekt med element och data för en sökning av bilder
let largeImg;		// Objekt med element för förstorad bild
let moreImgElem;    // Element för fler bilder
let map;            // Objekt för kartan
let marker;         // Objekt för markör på kartan
// --------------------------------------------------
// Initiering av globala variabler och händelsehanterare
function init() {
    search = {
        formElem: document.querySelector("#flickrSearch"),          // Sökformuläret
        resultElem: document.querySelector("#flickrSearch div"),    // Element för de sökta bilderna
        pageNrElem: document.querySelector("#flickrSearch span"),   // Element för sidnummer
        tags: "",   // Taggar som anges i formuläret
        pageNr: 1   // Aktuellt sidnummer
    }
    search.formElem.searchBtn.addEventListener("click", serchImgs);
    search.formElem.prevBtn.addEventListener("click", prevPage);
    search.formElem.nextBtn.addEventListener("click", nextPage);
    largeImg = {
        imgElem: document.querySelector("#largeImg img"),     // Element för bilden
        captionElem: document.querySelector("#largeImg p"),   // Element för bildtext
        locationElem: document.querySelector("#largeImg p:nth-of-type(2)")   // Element för latitud och longitud
    }
    moreImgElem = document.querySelector("#moreImgs");
    
    // Skapa kartan
    initMap("imgMap");
} // Slut init
window.addEventListener("load", init);
// --------------------------------------------------
// Initiera en ny sökning
function serchImgs() {
    search.tags = search.formElem.tags.value;
    search.pageNr = 1;
    fetchNewImgs();
} // Slut serchImgs
// --------------------------------------------------
// Hämta data för nya bilder
async function fetchNewImgs() {
    search.resultElem.innerHTML = "<img src='img/progress.gif' style='border:none;'>";
    search.pageNrElem.innerText = search.pageNr;
    let response = await fetch("https://api.flickr.com/services/rest/?api_key=" + myApiKey + "&method=flickr.photos.search&tags=" + search.tags + "&per_page=5&page=" + search.pageNr + "&format=json&nojsoncallback=1&has_geo=1");
    if (response.ok) {
        let data = await response.json();
        newImgs(data);
    }
    else flickrImgElem.innerText = "Fel vid hämtning: " + response.status;
} // Slut fetchNewImgs
// --------------------------------------------------
// Tolka svaret och visa upp bilderna.
function newImgs(jsonData) {
    search.resultElem.innerHTML = "";
    for (let i = 0; i < jsonData.photos.photo.length; i++) {
        const photo = jsonData.photos.photo[i]; // Ett foto i svaret
        const imgUrl = "https://live.staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_s.jpg";
        const newElem = document.createElement("img");
        newElem.setAttribute("src", imgUrl);
        newElem.setAttribute("data-photo", JSON.stringify(photo)); // Spara data om fotot, behövs i en annan funktion
        newElem.addEventListener("click", enlargeImg);
        search.resultElem.appendChild(newElem);
    }
} // Slut newImgs
// --------------------------------------------------
// Hämta föregående uppsättning bilder
function prevPage() {
    if (search.pageNr > 1) {
        search.pageNr--;
        fetchNewImgs();
    }
} // Slut prevPage
// --------------------------------------------------
// Hämta nästa uppsättning bilder
function nextPage() {
    search.pageNr++;
    fetchNewImgs();
} // Slut nextPage
// --------------------------------------------------
// Visa större bild av den som användaren klickat på
function enlargeImg() {
    const photo = JSON.parse(this.getAttribute("data-photo")); // Objekt med data om fotot
    const imgUrl = "https://live.staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_z.jpg";
    largeImg.imgElem.src = imgUrl;
    largeImg.captionElem.innerText = photo.title;
    
    // Anropa fetchLocation för att hämta koordinater
    fetchLocation(photo.id);
} // Slut enlargeImg
// --------------------------------------------------
// Hämta bildens geodata
async function fetchLocation(id) {
    let response = await fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=${myApiKey}&photo_id=${id}&format=json&nojsoncallback=1`);
    
    if (response.ok) {
        let data = await response.json();
        if (data.stat === "ok") {
            let lat = data.photo.location.latitude;
            let lon = data.photo.location.longitude;

            // Visa latitud och longitud
            largeImg.locationElem.innerText = `Latitud: ${lat}, Longitud: ${lon}`;
            
            // Uppdatera kartan med ny plats
            newMapLocation(lat, lon);
            
            // Hämta fler bilder från samma plats
            fetchImgsByLocation(lat, lon);
        } else {
            largeImg.locationElem.innerText = "Platsdata saknas";
        }
    } else {
        largeImg.locationElem.innerText = "Fel vid hämtning av platsdata";
    }
} // Slut fetchLocation
// --------------------------------------------------
// Hämta nya bilder baserat på koordinater
async function fetchImgsByLocation(lat, lon) {
    moreImgElem.innerHTML = "<img src='img/progress.gif' style='border:none;'>";
    let response = await fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${myApiKey}&lat=${lat}&lon=${lon}&per_page=5&format=json&nojsoncallback=1`);
    
    if (response.ok) {
        let data = await response.json();
        moreImgElem.innerHTML = "";
        for (let i = 0; i < data.photos.photo.length; i++) {
            const photo = data.photos.photo[i]; 
            const imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_s.jpg`;
            const imgElem = document.createElement("img");
            imgElem.setAttribute("src", imgUrl);
            moreImgElem.appendChild(imgElem);
        }
    } else {
        moreImgElem.innerText = "Fel vid hämtning av bilder";
    }
} // Slut fetchImgsByLocation
// --------------------------------------------------
// ---------- Karta med Leaflet och OpenStreetMap ----------
// Skapa kartan
function initMap(id) {
    map = L.map(id).setView([59.3293, 18.0686], 5); // Startvy: Stockholm

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    marker = L.marker([59.3293, 18.0686]).addTo(map); // Skapa en markör
} 
// --------------------------------------------------
// Visa karta och markering för latitud och longitud
function newMapLocation(lat, lon) {
    map.setView([lat, lon], 10); // Flytta kartan till den nya platsen
    marker.setLatLng([lat, lon]); // Flytta markören
} 
// --------------------------------------------------