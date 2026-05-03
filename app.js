const BASE_WIDTH = 1536;
const BASE_HEIGHT = 1152;

const hotspots = [
  { word: "Kuh", x: 300, y: 440, width: 480, height: 300 },
  { word: "Kalb", x: 840, y: 350, width: 270, height: 250 },
  { word: "Katze", x: 800, y: 650, width: 210, height: 260 },
  { word: "Kanne", x: 20, y: 820, width: 220, height: 230 },
  { word: "Kiste", x: 0, y: 640, width: 300, height: 180 },
  { word: "Kette", x: 210, y: 720, width: 260, height: 100 },
  { word: "Kissen", x: 230, y: 850, width: 250, height: 150 },
  { word: "Kuchen", x: 0, y: 360, width: 170, height: 130 },
  { word: "Koch", x: 210, y: 170, width: 200, height: 300 },
  { word: "Kamera", x: 530, y: 890, width: 330, height: 170 },
  { word: "Kerze", x: 1010, y: 900, width: 110, height: 180 },
  { word: "Käfer", x: 890, y: 970, width: 130, height: 90 },
  { word: "Karotten", x: 1200, y: 400, width: 270, height: 230 },
  { word: "Traktor", x: 520, y: 110, width: 470, height: 350 },
  { word: "Jacke", x: 950, y: 560, width: 250, height: 240 },
  { word: "Rucksack", x: 1280, y: 610, width: 240, height: 270 },
  { word: "Zucker", x: 1410, y: 810, width: 120, height: 220 },
  { word: "Decke", x: 1100, y: 930, width: 270, height: 150 },
  { word: "Becher", x: 1300, y: 900, width: 160, height: 150 }
];

const layer = document.getElementById("hotspotLayer");
const imageStage = document.getElementById("imageStage");
const foundCount = document.getElementById("foundCount");
const totalCount = document.getElementById("totalCount");
const lastWord = document.getElementById("lastWord");
const toggleHotspots = document.getElementById("toggleHotspots");
const resetButton = document.getElementById("resetButton");

let showHelp = false;
const found = new Set();

totalCount.textContent = String(hotspots.length);

function speak(word) {
  if (!("speechSynthesis" in window)) {
    lastWord.textContent = word;
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "de-DE";
  utterance.rate = 0.85;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

function layoutHotspots() {
  const rect = imageStage.getBoundingClientRect();
  const scaleX = rect.width / BASE_WIDTH;
  const scaleY = rect.height / BASE_HEIGHT;

  document.querySelectorAll(".hotspot").forEach((button) => {
    const index = Number(button.dataset.index);
    const spot = hotspots[index];
    button.style.left = `${spot.x * scaleX}px`;
    button.style.top = `${spot.y * scaleY}px`;
    button.style.width = `${spot.width * scaleX}px`;
    button.style.height = `${spot.height * scaleY}px`;
  });
}

function updateCount() {
  foundCount.textContent = String(found.size);
}

function createHotspots() {
  layer.innerHTML = "";

  hotspots.forEach((spot, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot";
    button.dataset.index = String(index);
    button.setAttribute("aria-label", spot.word);
    button.title = spot.word;

    button.addEventListener("click", () => {
      found.add(spot.word);
      button.classList.add("found");
      lastWord.textContent = spot.word;
      updateCount();
      speak(spot.word);
    });

    layer.appendChild(button);
  });

  layoutHotspots();
}

toggleHotspots.addEventListener("click", () => {
  showHelp = !showHelp;
  toggleHotspots.setAttribute("aria-pressed", String(showHelp));
  toggleHotspots.textContent = showHelp ? "Hilfen ausblenden" : "Hilfen anzeigen";
  document.querySelectorAll(".hotspot").forEach((button) => {
    button.classList.toggle("show", showHelp);
  });
});

resetButton.addEventListener("click", () => {
  found.clear();
  updateCount();
  lastWord.textContent = "Noch kein Wort gewählt.";
  document.querySelectorAll(".hotspot").forEach((button) => button.classList.remove("found"));
  window.speechSynthesis?.cancel();
});

window.addEventListener("resize", layoutHotspots);
window.addEventListener("orientationchange", () => setTimeout(layoutHotspots, 250));

createHotspots();
