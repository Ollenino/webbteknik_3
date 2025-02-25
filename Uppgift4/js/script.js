/* Uppgift U4 */
// --------------------------------------------------
// Globala variabler
// Inga globala variabler får läggas till
// --------------------------------------------------
// Initiering av globala variabler och händelsehanterare.
function init() {
    document.querySelector("#linkBtn").addEventListener("click", listLinks);
    const courseElems = document.querySelectorAll("#courses2 li");
    for (let i = 0; i < courseElems.length; i++) {
        courseElems[i].addEventListener("click", addCourse);
    }
    document.querySelector("#teacherBtn").addEventListener("click", addTeachers); // Används i extramerit
} // Slut init
window.addEventListener("load", init); // init aktiveras då sidan är inladdad
// --------------------------------------------------
// Kopiera alla länkar ur huvudtexten och lägg upp dem i en lista.
function listLinks() {
    const linklist = document.getElementById("linkList");

    if (linklist.children.length > 0) {
        return;
    }

    const textDiv = document.querySelector("#courses1 div");
    const links = textDiv.querySelectorAll("a");

    links.forEach(link => {
        const clonedLink = link.cloneNode(true);
        clonedLink.setAttribute("target", "_blank");

        const li = document.createElement("li");
        li.appendChild(clonedLink);

        linklist.appendChild(li);
    });
} // Slut listLinks
// --------------------------------------------------
// Den kurs användaren klickat på, läggs in överst i kurslistan.
function addCourse(event) {
    const courseText = event.target.textContent;
    const courseList = document.getElementById("courseList");

    if ([...courseList.children].some(course => course.textContent.includes(courseText))){
        return;
    }

    const newCourse = document.createElement("p");
    newCourse.textContent = courseText;
    newCourse.addEventListener("click", removeCourse);

    courseList.prepend(newCourse);
    
} // Slut addCourse
// --------------------------------------------------
// Den kurs användaren klickat på i kurslistan, tas bort.
function removeCourse(event) {
    event.target.remove();
    
} // Slut removeCourse
// --------------------------------------------------
// ----- Extramerit -----
// Funktion som lägger till lärare i kurslistan
function addTeachers() {
    const teachers = ["Bathsheda Babbling", "Alastar Moody", "Filius Flitwick", "Minerva McGonagall", "Albus Dumbeldore"];
    const teacherLinks = ["https://www.hp-lexicon.org/character/bathsheda-babbling/", "https://www.hp-lexicon.org/character/alastor-mad-eye-moody/", "https://www.hp-lexicon.org/character/filius-flitwick/", "https://www.hp-lexicon.org/character/mcgonagall-family/minerva-mcgonagall/", "https://www.hp-lexicon.org/character/dumbledore-family/albus-dumbledore/"];
    
    
} // Slut addTeachers
// --------------------------------------------------
