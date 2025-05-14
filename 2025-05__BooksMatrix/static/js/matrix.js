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
  matrix = text.trim().split("\n").map(row => row.split(",").map(Number));
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
//Calculate!!!
calculateBtn.addEventListener("click", () => {
  if (!matrix.length) return;

  const dist = dijkstraAllPairs(matrix);
  const path = dist.map(row => row.map(v => (v < Infinity ? 1 : 0)));

  // Exzentrizitäten
  const eccentricities = dist.map(row => {
    const reachable = row.filter(v => v < Infinity && v > 0);
    return reachable.length ? Math.max(...reachable) : null;
  });

  // Radius, Durchmesser
  const validEcc = eccentricities.filter(e => e !== null);
  const radius = validEcc.length ? Math.min(...validEcc) : "–";
  const diameter = validEcc.length ? Math.max(...validEcc) : "–";

  // Potenzmatrizen A^2 bis A^5 berechnen
  const power2 = multiplyMatrix(matrix, matrix);
  const power3 = multiplyMatrix(power2, matrix);
  const power4 = multiplyMatrix(power3, matrix);
  const power5 = multiplyMatrix(power4, matrix);

  // Formatiert eine Matrix für die Anzeige (∞ statt Infinity) --> noch notwendig?
  const formatMatrix = m =>
    m.map(row => row.map(v => (v === Infinity ? "∞" : v)).join(", ")).join("\n");

  // Ergebnis-Ausgabe
  const resultHTML = `
    <div class="result-row"><span>Eccentricities:</span><span>${eccentricities.map(e => e ?? "–").join(", ")}</span></div>
    <div class="result-row"><span>Radius:</span><span>${radius}</span></div>
    <div class="result-row"><span>Diameter:</span><span>${diameter}</span></div>
    <div class="result-row"><span>Dijkstra Distance Matrix:</span><pre>${formatMatrix(dist)}</pre></div>
    <div class="result-row"><span>Path Matrix:</span><pre>${path.map(r => r.join(", ")).join("\n")}</pre></div>
    <div class="result-row"><span>Power Matrix 2:</span><pre>${power2.map(r => r.join(", ")).join("\n")}</pre></div>
    <div class="result-row"><span>Power Matrix 3:</span><pre>${power3.map(r => r.join(", ")).join("\n")}</pre></div>
    <div class="result-row"><span>Power Matrix 4:</span><pre>${power4.map(r => r.join(", ")).join("\n")}</pre></div>
    <div class="result-row"><span>Power Matrix 5:</span><pre>${power5.map(r => r.join(", ")).join("\n")}</pre></div>
  `;
  resultOutput.innerHTML = resultHTML;
});



//here the work begins
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

// Dijkstra für alle Startknoten
function dijkstraAllPairs(adjMatrix) {
  const n = adjMatrix.length;
  const distMatrix = Array.from({ length: n }, () => Array(n).fill(Infinity));

  function dijkstra(start) {
    const distances = Array(n).fill(Infinity);
    const visited = Array(n).fill(false);
    distances[start] = 0;

    for (let i = 0; i < n; i++) {
      let u = -1;
      for (let j = 0; j < n; j++) {
        if (!visited[j] && (u === -1 || distances[j] < distances[u])) {
          u = j;
        }
      }
      if (u === -1 || distances[u] === Infinity) break;
      visited[u] = true;

      for (let v = 0; v < n; v++) {
        if (adjMatrix[u][v] && distances[u] + 1 < distances[v]) {
          distances[v] = distances[u] + 1;
        }
      }
    }

    return distances;
  }

  for (let i = 0; i < n; i++) {
    distMatrix[i] = dijkstra(i);
  }

  return distMatrix;
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
