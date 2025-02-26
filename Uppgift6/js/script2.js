/* Uppgift U6-2 */
// --------------------------------------------------
// Globala variabler och konstanter
let mapLocationElem;	// Element för utskrift av koordinater
let myMap;				// Objekt för kartan
let addrMarkers = [];	// Array med objekt för knapparnas markörer
let userMarker;			// Objekt för markering där användaren klickar
const place = {         // Plats som kartan visar
    name: "Stockholm",  
    lat: 59.3293,  // Stockholms centrum
    lng: 18.0686,  
    zoom: 13
}
const markerData = [	// Data för markörer som hör till knapparna
    { position: { lat: 59.332231, lng: 18.063945 }, title: "Sergels torg" },
    { position: { lat: 59.320320, lng: 18.069988 }, title: "Slussen" },
    { position: { lat: 59.339512, lng: 18.042128 }, title: "Vasaparken" },
    { position: { lat: 59.326497, lng: 18.104857 }, title: "Skansen" },
    { position: { lat: 59.325955, lng: 18.122662 }, title: "Djurgården" }
];
// ----- Extrameriten med bilder från Flickr
const myApiKey = "ef613a81486a76320dc01145298bc636";	// Ersätt DIN-API-KEY med din egen Flickr API key
let flickrImgElem;		// Element där bilderna ska visas
// --------------------------------------------------
// Initiering av programmet
function init() {
    initMap("map");
    mapLocationElem = document.querySelector("#mapLocation");
    flickrImgElem = document.querySelector("#flickrImgs");

    // Loop för att koppla knappar till rätt markörer
    let buttons = document.querySelectorAll("#addrBtns button");
    buttons.forEach((btn, i) => {
        btn.innerText = markerData[i].title; // Sätt knappens text
        btn.addEventListener("click", () => showAddrMarker(i)); // Lägg till eventlyssnare
    });

} // Slut init
window.addEventListener("load", init);
// --------------------------------------------------
// Skapa en karta och markeringar
function initMap(id) {
    document.querySelector("#place").innerText = place.name;
    myMap = L.map(id).setView([place.lat, place.lng], place.zoom);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
    }).addTo(myMap);
    
    userMarker = L.marker();
    myMap.on("click", newUserMarker);

    // Loop för att skapa markörer och spara dem i addrMarkers-arrayen
    markerData.forEach(data => {
        let marker = L.marker(data.position).bindPopup(data.title);
        addrMarkers.push(marker);
    });

} // Slut initMap
// --------------------------------------------------
// Sätt markörens position där användaren klickade och lägg in den på kartan.
function newUserMarker(e) {
    hideMarkers();
    userMarker.setLatLng(e.latlng).addTo(myMap);

    // Skriv ut koordinater
    mapLocationElem.innerText = `Latitud: ${e.latlng.lat.toFixed(6)}, Longitud: ${e.latlng.lng.toFixed(6)}`;
    
} // Slut newUserMarker
// --------------------------------------------------
// Visa markör för den adressknapp som användaren klickat på
function showAddrMarker(index) { 
    hideMarkers();
    addrMarkers[index].addTo(myMap);
} // Slut showAddrMarker
// --------------------------------------------------
// Dölj alla markörer
function hideMarkers() {
    addrMarkers.forEach(marker => marker.remove());
    userMarker.remove();
    mapLocationElem.innerText = "";
} // Slut hideMarkers
// --------------------------------------------------
// ----- Foton från Flickr ----- Extramerit
// Ajax-begäran av nya bilder
async function fetchImgsByLocation(lat, lon) {
    
} // Slut fetchImgsByLocation
// --------------------------------------------------
// Tolka svaret och visa upp bilderna.
function showMoreImgs(jsonData) {
    
} // Slut showMoreImgs
// --------------------------------------------------
