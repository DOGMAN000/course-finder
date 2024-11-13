// script.js

let data = [];
let urls = ['data/summer2024.txt','data/fall2024.txt','data/winter2024.txt','data/spring2024.txt']

for (let i = 0; i<urls.length; i++){
  fetch(urls[i])
    .then(response => response.text())
    .then(text => {
        data[i] = text.split(/\r?\n/); 
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}
console.log(data)
const courseInput = document.getElementById('courseCode');
const suggestionsContainer = document.getElementById('suggestions');
const termsList = document.getElementById("terms");
const yearsList = document.getElementById("years");
const percentageFilter = document.getElementById("percentage");
function updateSuggestions() {
    let filteredData = [];
    let years = [];
    let terms = [];
    const input = courseInput.value.trim().toUpperCase();
    for (const child of termsList.children) {
      const checkbox = child.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked){
        terms.push(checkbox.value)
      }
    }
    for (const child of yearsList.children) {
      const checkbox = child.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked){
        years.push(checkbox.value)
      }
    }
    let index = 0;
    for (let i = 0; i < urls.length; i++) {
        for (let j =0; j<years.length; j++){
          for (let k=0; k<terms.length; k++){
            if (urls[i].includes(years[j])&&urls[i].includes(terms[k])){
              filteredData[index] = data[index].filter(line => line.startsWith(input));
              index++
              }
          }
        }
    }
    showSuggestions(filteredData);
}
courseInput.addEventListener('input', updateSuggestions);
percentageFilter.addEventListener('input', updateSuggestions);
for (const child of termsList.children) {
      const input = child.querySelector('input[type="checkbox"]');
      if (input)
      input.addEventListener('change', updateSuggestions);
}
for (const child of yearsList.children) {
      const input = child.querySelector('input[type="checkbox"]');
      if (input)
      input.addEventListener('change', updateSuggestions);
}
function getColorForPercentage(percentage) {
    // Calculate the RGB values based on the percentage
    const red = Math.round((100 - percentage) * 2.55); // Red increases as percentage decreases
    const green = Math.round(percentage * 2.55); // Green increases as percentage increases
    return `rgb(${red}, ${green}, 0)`; // Return the RGB color
}

function showSuggestions(suggestions) {
  suggestionsContainer.innerHTML = '';
  console.log(suggestions)
  for(let x=0; x<suggestions.length; x++){
    if (suggestions[x].length > 0) {
        suggestionsContainer.style.display = 'block';
        suggestions[x].forEach(suggestion => {
            const parts = suggestion.split(' ');
            const percentageA = ((parseInt(parts[parts.length - 9]) / parseInt(parts[parts.length - 1])) * 100).toFixed(2);
            if (!percentageFilter.value || percentageA > percentageFilter.value) {
              console.log(percentageA)
            const color = getColorForPercentage(percentageA);
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `
                <span>${suggestion}</span>
                <span class="percentage-a" style="background-color: ${color};">${percentageA}%</span>
            `;
            suggestionsContainer.appendChild(div);
            }

        });
    } else {
        suggestionsContainer.style.display = 'none';
    }
  }
}
