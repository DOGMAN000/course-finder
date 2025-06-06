// script.js

let data = {}
let urls = ['data/summer2024.txt','data/fall2024.txt','data/winter2024.txt','data/spring2024.txt','data/fall2025.txt','data/summer2025.txt']

Promise.all(urls.map(url =>
  fetch(url)
    .then(response => response.text())
    .then(text => {
      data[url] = text.split(/\r?\n/);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    })
))

const courseInput = document.getElementById('courseCode');
const suggestionsContainer = document.getElementById('suggestions');
const termsList = document.getElementById("terms");
const yearsList = document.getElementById("years");
const percentageFilter = document.getElementById("percentage");
const honorsFilter = document.getElementById("honors");
const onlineFilter = document.getElementById("online");

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
              filteredData[index] = data[urls[i]].filter(line => line.startsWith(input));
              index++
              }
          }
        }
    }
    showSuggestions(filteredData);
}
courseInput.addEventListener('input', updateSuggestions);
percentageFilter.addEventListener('input', updateSuggestions);
onlineFilter.addEventListener('input', updateSuggestions);
honorsFilter.addEventListener('input', updateSuggestions);


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

    // Build table structure
    let table = document.createElement('table');
    table.className = 'results-table';

    let thead = document.createElement('thead');
    thead.innerHTML = `<tr>
        <th>Term</th>
        <th>Course</th>
        <th>Name</th>
        <th>Meth</th>
        <th>Succ%</th>
        <th>Compl%</th>
        <th>A</th>
        <th>B</th>
        <th>C</th>
        <th>IPP</th>
        <th>D</th>
        <th>F</th>
        <th>INP</th>
        <th>W</th>
        <th>Total</th>
        <th>A%</th>
    </tr>`;
    table.appendChild(thead);

    let tbody = document.createElement('tbody');

    for (let x = 0; x < suggestions.length; x++) {
        if (suggestions[x].length > 0) {
            suggestions[x].forEach(suggestion => {
                const parts = suggestion.split(' ');
                const percentageA = ((parseInt(parts[parts.length - 11]) / parseInt(parts[parts.length - 3])) * 100).toFixed(2);
                if (!percentageFilter.value || percentageA > Number(percentageFilter.value)) {
                    const row = document.createElement('tr');
                    const color = getColorForPercentage(percentageA);
                    let name = parts[1] + " " + parts[2]
                    if (parts.length>=18){
                      name = parts[1] + " " + parts[2] + " " + parts[3]
                    }
                    if (!parts[1]){
                    }
                    else if (onlineFilter.checked && parts[parts.length - 14] != "ONLIN"){
                      
                    }
                    else if (honorsFilter.checked && parts[0][parts[0].length-1] != "H"){
                      
                    }
                    else{
                    row.innerHTML =
                        `<td>${parts[parts.length - 2]+ " " + parts[parts.length - 1]}</td>
                        <td>${parts[0]}</td>
                        <td>${name}</td>
                        <td>${parts[parts.length - 14]}</td>
                        <td>${parts[parts.length - 13]}</td>
                        <td>${parts[parts.length - 12]}</td>  
                        <td>${parts[parts.length - 11]}</td>                        
                        <td>${parts[parts.length - 10]}</td>
                        <td>${parts[parts.length - 9]}</td>
                        <td>${parts[parts.length - 8]}</td>
                        <td>${parts[parts.length - 7]}</td>
                        <td>${parts[parts.length - 6]}</td>
                        <td>${parts[parts.length - 5]}</td>
                        <td>${parts[parts.length - 4]}</td>
                        <td>${parts[parts.length - 3]}</td>
                        <td style="color: ${color}; font-weight: bold;">${percentageA}%</td>
                    `;
                    tbody.appendChild(row);
                  }
                }
            });
        }
    }

    table.appendChild(tbody);
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    wrapper.appendChild(table);
    suggestionsContainer.appendChild(wrapper);

}
