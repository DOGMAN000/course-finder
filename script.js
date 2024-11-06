// script.js

let data = [];
let filteredData = []; // Store filtered results for suggestions
let urls = ['data/summer2024.txt','data/fall2024.txt','data/winter2024.txt','data/spring2024.txt']
// Fetch the data from data.txt

for (let i = 0; i<urls.length; i++){
  fetch(urls[i])
    .then(response => response.text())
    .then(text => {
        data[i] = text.split(/\r?\n/); // Split into lines
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}
console.log(data)
const courseInput = document.getElementById('courseCode');
const suggestionsContainer = document.getElementById('suggestions');

courseInput.addEventListener('input', function() {
    const input = courseInput.value.trim().toUpperCase();
    for (let i=0; i<urls.length; i++){
      filteredData.push(data[i].filter(line => line.startsWith(input)));
    }
    showSuggestions(filteredData);
});

function getColorForPercentage(percentage) {
    // Calculate the RGB values based on the percentage
    const red = Math.round((100 - percentage) * 2.55); // Red increases as percentage decreases
    const green = Math.round(percentage * 2.55); // Green increases as percentage increases
    return `rgb(${red}, ${green}, 0)`; // Return the RGB color
}

function showSuggestions(suggestions) {
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions
  console.log(suggestions);
  for(let x=0; x<suggestions.length; x++){
    if (suggestions[x].length > 0) {
        suggestionsContainer.style.display = 'block'; // Show suggestions
        suggestions[x].forEach(suggestion => {
            const parts = suggestion.split(' ');
            const percentageA = ((parseInt(parts[parts.length - 9]) / parseInt(parts[parts.length - 1])) * 100).toFixed(2); // Calculate percentage of A's
            const color = getColorForPercentage(percentageA); // Get color for the percentage
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `
                <span>${suggestion}</span>
                <span class="percentage-a" style="background-color: ${color};">${percentageA}%</span>
            `; // Append percentage of A's with dynamic color
            suggestionsContainer.appendChild(div);
        });
    } else {
        suggestionsContainer.style.display = 'none'; // Hide if no suggestions
    }
  }
}
