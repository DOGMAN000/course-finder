let data = {};
let urls = [
  "data/summer2023.txt",
  "data/fall2023.txt",
  "data/winter2023.txt",
  "data/spring2023.txt",
  "data/summer2024.txt",
  "data/fall2024.txt",
  "data/winter2024.txt",
  "data/spring2024.txt",
  "data/fall2025.txt",
  "data/summer2025.txt",
  "data/winter2025.txt",
];

Promise.all(
  urls.map((url) =>
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        data[url] = text.split(/\r?\n/);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
  )
);

const courseInput = document.getElementById("courseCode");
const instructorInput = document.getElementById("instructorName");
const suggestionsContainer = document.getElementById("suggestions");
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
    if (checkbox && checkbox.checked) {
      terms.push(checkbox.value);
    }
  }
  for (const child of yearsList.children) {
    const checkbox = child.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
      years.push(checkbox.value);
    }
  }
  let combinedData = [];
  for (let i = 0; i < urls.length; i++) {
    for (let j = 0; j < years.length; j++) {
      for (let k = 0; k < terms.length; k++) {
        if (urls[i].includes(years[j]) && urls[i].includes(terms[k])) {
          const matches = data[urls[i]].filter((line) =>
            line.startsWith(input)
          );
          combinedData.push(...matches); // ⬅ spread into flat array
        }
      }
    }
  }
  showSuggestions(combinedData);
}
function debounce(func, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };
}
const debouncedUpdate = debounce(updateSuggestions, 150);

courseInput.addEventListener("input", debouncedUpdate);
instructorInput.addEventListener("input", debouncedUpdate);
percentageFilter.addEventListener("input", debouncedUpdate);
onlineFilter.addEventListener("input", debouncedUpdate);
honorsFilter.addEventListener("input", debouncedUpdate);

termsList
  .querySelectorAll('input[type="checkbox"]')
  .forEach((cb) => cb.addEventListener("change", debouncedUpdate));
yearsList
  .querySelectorAll('input[type="checkbox"]')
  .forEach((cb) => cb.addEventListener("change", debouncedUpdate));

for (const child of termsList.children) {
  const input = child.querySelector('input[type="checkbox"]');
  if (input) input.addEventListener("change", updateSuggestions);
}
for (const child of yearsList.children) {
  const input = child.querySelector('input[type="checkbox"]');
  if (input) input.addEventListener("change", updateSuggestions);
}
function getColorForPercentage(percentage) {
  const red = Math.round((100 - percentage) * 2.55);
  const green = Math.round(percentage * 2.55);
  return `rgb(${red}, ${green}, 0)`;
}

function showSuggestions(suggestions) {
  while (suggestionsContainer.firstChild) {
    suggestionsContainer.removeChild(suggestionsContainer.firstChild);
  }
  // Build table structure
  let table = document.createElement("table");
  table.className = "results-table";

  let thead = document.createElement("thead");
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

  let tbody = document.createElement("tbody");
  let fragment = document.createDocumentFragment();
  for (let x = 0; x < suggestions.length; x++) {
    if(x>500){
      break;
    }
    const suggestion = suggestions[x];
    const parts = suggestion.split(" ");
    const percentageA = (
      (parseInt(parts[parts.length - 11]) / parseInt(parts[parts.length - 3])) *
      100
    ).toFixed(2);
    const pInput = instructorInput.value.trim().toLowerCase();

    if (
      !percentageFilter.value ||
      percentageA > Number(percentageFilter.value)
    ) {
      const row = document.createElement("tr");
      const color = getColorForPercentage(percentageA);
      let name = parts[1] + " " + parts[2];
      if (parts.length >= 18) {
        name = parts[1] + " " + parts[2] + " " + parts[3];
      }

      if (!parts[1]) {
        // Skip if no instructor name
      } else if (onlineFilter.checked && parts[parts.length - 14] !== "ONLIN") {
        // Skip if online filter is checked and it's not online
      } else if (
        honorsFilter.checked &&
        parts[0][parts[0].length - 1] !== "H"
      ) {
        // Skip if honors filter is checked and it's not honors
      } else if (!name.toLowerCase().includes(pInput)) {
        // Skip if name doesn't match search input
      } else {
        row.innerHTML = `<td>${
          parts[parts.length - 2] + " " + parts[parts.length - 1]
        }</td>
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
                <td style="color: ${color}; font-weight: bold;">${percentageA}%</td>`;

        fragment.appendChild(row);
      }
    }
  }
  tbody.appendChild(fragment);
  table.appendChild(tbody);
  const wrapper = document.createElement("div");
  wrapper.className = "table-wrapper";
  wrapper.appendChild(table);
  suggestionsContainer.appendChild(wrapper);
}
