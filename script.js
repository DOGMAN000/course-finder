// script.js

let data = [];
let filteredData = []; // Store filtered results for suggestions

// Fetch the data from data.txt
fetch('data.txt')
    .then(response => response.text())
    .then(text => {
        data = text.split(/\r?\n/); // Split into lines
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

const courseInput = document.getElementById('courseCode');
const suggestionsContainer = document.getElementById('suggestions');

courseInput.addEventListener('input', function() {
    const input = courseInput.value.trim();
    filteredData = data.filter(line => line.startsWith(input));
    showSuggestions(filteredData);
});

function showSuggestions(suggestions) {
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions
    if (suggestions.length > 0) {
        suggestionsContainer.style.display = 'block'; // Show suggestions
        suggestions.forEach(suggestion => {
            const div = document.createElement('div');
            div.textContent = suggestion;
            div.className = 'suggestion-item';
            div.onclick = () => selectSuggestion(suggestion); // Select suggestion on click
            suggestionsContainer.appendChild(div);
        });
    } else {
        suggestionsContainer.style.display = 'none'; // Hide if no suggestions
    }
}

function selectSuggestion(suggestion) {
    courseInput.value = suggestion; // Populate input with selected suggestion
    suggestionsContainer.style.display = 'none'; // Hide suggestions
}

document.getElementById('searchBtn').addEventListener('click', function() {
    const courseCode = courseInput.value.trim();
    const filteredResults = data.filter(line => line.startsWith(courseCode));
    const output = filteredResults.length > 0 ? filteredResults.join('\n') : 'No results found.';
    document.getElementById('output').textContent = output;
    suggestionsContainer.style.display = 'none'; // Hide suggestions after search
});
/*
  This is your site JavaScript code - you can add interactivity!
*/

// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
console.log("Hello 🌎");

/* 
Make the "Click me!" button move when the visitor clicks it:
- First add the button to the page by following the steps in the TODO 🚧
*/
const btn = document.querySelector("button"); // Get the button from the page
if (btn) { // Detect clicks on the button
  btn.onclick = function () {
    // The 'dipped' class in style.css changes the appearance on click
    btn.classList.toggle("dipped");
  };
}


// ----- GLITCH STARTER PROJECT HELPER CODE -----

// Open file when the link in the preview is clicked
let goto = (file, line) => {
  window.parent.postMessage(
    { type: "glitch/go-to-line", payload: { filePath: file, line: line } }, "*"
  );
};
// Get the file opening button from its class name
const filer = document.querySelectorAll(".fileopener");
filer.forEach((f) => {
  f.onclick = () => { goto(f.dataset.file, f.dataset.line); };
});
