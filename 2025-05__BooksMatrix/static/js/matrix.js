const matrixOutput = document.getElementById("matrixOutput");
const resultOutput = document.getElementById("resultOutput");
const fileInput = document.getElementById("csvInput");
const generateBtn = document.getElementById("generateRandom");
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const fileNameDisplay = document.getElementById("file-name");

let matrix = [];

// Gibt die Matrix aus
function displayMatrix(m) {
  matrixOutput.textContent = m.map(row => row.join(", ")).join("\n");
}

// Random simple ungerichtete Matrix
function generateRandomMatrix(size = 6, density = 0.5) {
  matrix = Array.from({ length: size }, () => Array(size).fill(0));
  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      if (Math.random() < density) {
        matrix[i][j] = 1;
        matrix[j][i] = 1; // Spiegelung für ungerichtet
      }
    }
  }
  displayMatrix(matrix);
}

// Random Matrix Button
generateBtn.addEventListener("click", () => {
  generateRandomMatrix();
});

// Liest  Matrix aus .csv
fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  fileNameDisplay.textContent = file.name;
  const text = await file.text();
  
  const firstLine = text.trim().split("\n")[0];
  const delimiter = firstLine.includes(";") ? ";" : ",";

  matrix = text
    .trim()
    .split("\n")
    .map(row =>
      row
        .split(delimiter)
        .map(cell => Number(cell.trim()))
    );

  displayMatrix(matrix);
});



// Setzt alles zurück
resetBtn.addEventListener("click", () => {
  matrix = [];
  matrixOutput.textContent = "";
  resultOutput.innerHTML = "";
  fileInput.value = "";
});

// Here the magic begins:

// Calculate!!!
calculateBtn.addEventListener("click", () => {
  if (!matrix.length) return;

  const n = matrix.length;

  // Potenzmatrizen A^1 bis A^(n-1) berechnen
  const powerMatrices = [];
  let currentMatrix = matrix.map(row => row.slice()); // A^1
  powerMatrices.push(currentMatrix);

  for (let i = 1; i < n - 1; i++) {
    currentMatrix = multiplyMatrix(currentMatrix, matrix);
    powerMatrices.push(currentMatrix);
  }

  // Distanzmatrix aus Potenzmatrizen
  const distMatrix = Array.from({ length: n }, () => Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) distMatrix[i][i] = 0; // Diagonale = 0

  for (let k = 0; k < powerMatrices.length; k++) {
    const power = powerMatrices[k];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j && power[i][j] > 0 && distMatrix[i][j] === Infinity) {
          distMatrix[i][j] = k + 1; // Erste Potenz mit Pfad => Distanz
        }
      }
    }
  }

  // Pfadmatrix aus Distanzmatrix
  const pathMatrix = distMatrix.map(row =>
    row.map(v => (v < Infinity ? 1 : 0))
  );

  // Exzentrizitäten berechnen
  const eccentricities = distMatrix.map(row => {
    const reachable = row.filter(v => v < Infinity);
    return reachable.length ? Math.max(...reachable) : null;
  });

  // Radius, Durchmesser
  const validEcc = eccentricities.filter(e => e !== null);
  const radius = validEcc.length ? Math.min(...validEcc) : "–";
  const diameter = validEcc.length ? Math.max(...validEcc) : "–";

  // Anzahl zusammenhängender Komponenten per DFS
  const componentCount = countConnectedComponents(matrix);

  // Zentrum: alle Knoten mit minimaler Exzentrizität
  const minEcc = Math.min(...validEcc);
  const centreNodes = eccentricities
    .map((e, i) => (e === minEcc ? i : null))
    .filter(i => i !== null);

// D y n a m i s c h e  HTML-Erzeugung für Potenzmatrizen mit Formatierung
let powersHTML = "";
if (powerMatrices.length) {
  powersHTML += `<h3 class="matrix-heading">Power Matrices</h3>`;
  powersHTML += powerMatrices.map((pm, index) => {
    const maxLength = Math.max(...pm.flat().map(v => String(v).length));
    const prettyMatrix = pm.map(row =>
      row.map(num => String(num).padStart(maxLength, " ")).join(", ")
    ).join("\n");

    return `
      <div class="result-row">
        <span>Power Matrix ${index + 1}:</span>
        <pre>${prettyMatrix}</pre>
      </div>
    `;
  }).join("");

  powersHTML += `
    <div class="result-row">
      <span style="font-style: italic;">All paths found.</span>
    </div>
  `;
}

// Ergebnisse in HTML ausgeben
const resultHTML = `
  <div class="result-row"><span>Eccentricities:</span><span>${eccentricities.map(e => e ?? "–").join(", ")}</span></div>
  <div class="result-row"><span>Radius:</span><span>${radius}</span></div>
  <div class="result-row"><span>Diameter:</span><span>${diameter}</span></div>
  <div class="result-row"><span>Connected Components:</span><span>${componentCount}</span></div>
  <div class="result-row"><span>Graph Centre:</span><span>${centreNodes.join(", ")}</span></div>
  <div class="result-row"><span>Distance Matrix:</span><pre>${distMatrix.map(r => r.map(v => v === Infinity ? "∞" : v).join(", ")).join("\n")}</pre></div>
  <div class="result-row"><span>Path Matrix:</span><pre>${pathMatrix.map(r => r.join(", ")).join("\n")}</pre></div>

  ${powersHTML}

  <div class="so-long-message">
    <a href="python.html">So long and thanks for all the fish!</a>
  </div>
`;

resultOutput.innerHTML = resultHTML;

});

// Multipliziert zwei Matrizen 
function multiplyMatrix(a, b) {
  const n = a.length;
  const result = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}

// Zählt die Anzahl zusammenhängender Komponenten per DFS
function countConnectedComponents(adjMatrix) {
  const n = adjMatrix.length;
  const visited = new Array(n).fill(false);
  let components = 0;

  function dfs(node) {
    visited[node] = true;
    for (let neighbor = 0; neighbor < n; neighbor++) {
      if (adjMatrix[node][neighbor] && !visited[neighbor]) {
        dfs(neighbor);
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfs(i);
      components++;
    }
  }

  return components;
}

// Aktiviert NavBar
document.querySelectorAll("nav a").forEach(link => {
  if (link.href.includes(location.pathname)) {
    link.classList.add("active");
  }
});





document.getElementById("hypno").addEventListener("click", () => {
  globalThis.location.href = "hypno.html";
});
