// LOCAL STORAGE HANDLING ==============
const INITIAL_COINS = 30;
const COSTS = [0, 2, 4, 6];

// Load or create at start
if (!localStorage.getItem("gameState")) {
   initGameState(10);
   console.log("First game")
}

data = JSON.parse(localStorage.getItem("gameState"));


function initGameState(nStories) {
   const stories = Array.from({ length: nStories }, () =>
      Array.from({ length: 3 }, () => ({
         clue: 1,
         completed: false
      }))
   );

   const state = {
      coins: INITIAL_COINS,
      listStory: stories
   };

   localStorage.setItem("gameState", JSON.stringify(state));
}

function saveGameState() {
   localStorage.setItem("gameState", JSON.stringify(data));
}

// =====================================

// Info from main page
id_story = PAGE_DATA.id_story
id_step = PAGE_DATA.id_step
hash = PAGE_DATA.hash

// ==== DOM elements ====
const coinsDisplay = document.getElementById("coins");
const clues = Array.from(document.querySelectorAll("#clues .clue"));
const revealBtn = document.getElementById("reveal-button");

// ==== Update displayed coins ====
coinsDisplay.textContent = data.coins;


// Is it the end of the story?
if(id_step == 3) {
   document.getElementById("clues").classList.add("hidden");
   document.getElementById("reveal-button").classList.add("hidden");
   document.getElementById("scan-container").classList.add("hidden");
}

// ==== Reveal saved clues ====
clues.forEach((clue, index) => {
   if (index < data.listStory[id_story][id_step].clue) {
      clue.classList.remove("hidden");
   }
});

// ==== Update button label on load ====
updateButtonLabel();

// ===================================
// ========== CLICK LOGIC ============
// ===================================
revealBtn.addEventListener("click", () => {
   if (data.listStory[id_story][id_step].clue >= clues.length) return;

   // Pay cost and reveal clue
   data.coins -= COSTS[data.listStory[id_story][id_step].clue];
   coinsDisplay.textContent = data.coins;

   clues[data.listStory[id_story][id_step].clue].classList.remove("hidden");
   data.listStory[id_story][id_step].clue++;
   saveGameState();

   // Update label
   updateButtonLabel();

});

function updateButtonLabel() {
   if (data.listStory[id_story][id_step].clue >= 4) {
      revealBtn.disabled = true;
      revealBtn.textContent = "All clues revealed";
      revealBtn.background = "#b4b2ae";   // any CSS color

   } else {
      revealBtn.textContent = `Reveal next clue — cost ${COSTS[data.listStory[id_story][id_step].clue]} coins`;
   }
}
