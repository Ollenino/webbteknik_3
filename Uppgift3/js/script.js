/* Uppgift U3 */
// --------------------------------------------------
// Globala variabler
let subjectInfoElem, courseListElem;	// Div-element där inläst data ska skrivas
let xmlDoc = null; // Lagrar inläst XML så vi inte laddar om den i onödan

// --------------------------------------------------
// Initiering av globala variabler och händelsehanterare
function init() {
    subjectInfoElem = document.querySelector("#subjectInfo");
    courseListElem = document.querySelector("#courseList");
    document.querySelector("#subjectMenu").addEventListener("change", selectSubject);
}
window.addEventListener("load", init); // init aktiveras då sidan är inladdad

// --------------------------------------------------
// Avläs menyn för val av ämne
function selectSubject() {
    let selectedSubject = document.querySelector("#subjectMenu").value;
    if (selectedSubject === "Välj ämne ...") return;

    // Förhindra att samma ämne laddas flera gånger
    if (subjectInfoElem.innerHTML.includes(`<h3>${selectedSubject}</h3>`)) {
        return;
    }

    if (xmlDoc) {
        handleXML(selectedSubject);
        return;
    }

    fetch("data/subjects.xml")
        .then(response => {
            if (!response.ok) throw new Error(`HTTP-fel! Status: ${response.status}`);
            return response.text();
        })
        .then(xmlText => {
            let parser = new DOMParser();
            xmlDoc = parser.parseFromString(xmlText, "text/xml");
            handleXML(selectedSubject);
        })
        .catch(error => console.error("Fel vid inläsning av XML:", error));
}

// --------------------------------------------------
// Hantera inläst XML och uppdatera sidan
function handleXML(selectedSubject) {
    let subjects = xmlDoc.getElementsByTagName("subject");

    if (subjects.length === 0) return;

    let notAvailableElement = xmlDoc.getElementsByTagName("not_awailable")[0];
    let notAvailableText = notAvailableElement ? notAvailableElement.textContent.trim() : "Ämnet finns inte i denna värld.";

    let found = false;

    for (let subject of subjects) {
        let nameElement = subject.getElementsByTagName("name")[0];
        if (!nameElement) continue;

        let name = nameElement.textContent;
        if (name === selectedSubject) {
            found = true;
            let info = subject.getElementsByTagName("info")[0]?.textContent || "Ingen information tillgänglig.";
            let courseFile = subject.getElementsByTagName("courselist")[0]?.textContent || null;
            let url = subject.getAttribute("url") || "#";

            subjectInfoElem.innerHTML = `<h3 style="font-style: italic; font-weight: bold; color: #A04D19;">${name}</h3>
                                         <p>${info}</p>
                                         <p><a href="${url}" target="_blank">Läs mer</a></p>`;

            if (courseFile) {
                fetchCourses(courseFile);
            } else {
                courseListElem.innerHTML = "<p>Inga kurser tillgängliga för detta ämne.</p>";
            }
            break;
        }
    }

    if (!found) {
        subjectInfoElem.innerHTML = `<p>${notAvailableText}</p>`;
        courseListElem.innerHTML = "";
    }
}

// --------------------------------------------------
// Hämta JSON-kursdata och uppdatera sidan
function fetchCourses(jsonFile) {
    let filePath = jsonFile.startsWith("data/") ? jsonFile : `data/${jsonFile}`; // Säkerställa korrekt sökväg

    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP-fel! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            let coursesHtml = `<h3>Kurser inom ${data.subject}</h3><ul>`;
            data.course.forEach(course => {
                let courseCode = course.code ? course.code : "Okänd kod";
                let courseTitle = course.title ? course.title.swedish : "Okänd kurs";
                let credits = course.credits ? `${course.credits}hp` : "Okänt antal hp";
                let description = course.description || "Ingen beskrivning tillgänglig";
                let website = course.website ? course.website.url : "#";
                let teacher = course.teacher ? `<li>Lärare: ${course.teacher}</li>` : "";

                // Inline CSS för att matcha lärarens format utan att ändra CSS-filen
                coursesHtml += `
                    <li>
                        <span style="color: #A04D19; font-weight: bold; font-style: italic;">
                            ${courseCode}, ${courseTitle}, ${credits}
                        </span>
                        <ul>
                            <li>${description}</li>
                            ${teacher}
                            <li><a href="${website}" target="_blank">Webbplats</a></li>
                        </ul>
                    </li>`;
            });
            coursesHtml += "</ul>";
            courseListElem.innerHTML = coursesHtml;

            // Återställ menyn efter att kurserna är inladdade
            document.querySelector("#subjectMenu").value = "Välj ämne ...";
        })
        .catch(error => console.error("Fel vid inläsning av JSON:", error));
}
