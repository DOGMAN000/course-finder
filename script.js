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
