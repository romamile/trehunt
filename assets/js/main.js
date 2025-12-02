const INITIAL_COINS = 30;
const COSTS = [0, 2, 4, 6];

// ==== DOM elements ====
const coinsDisplay = document.getElementById("coins");
const clues = Array.from(document.querySelectorAll("#clues .clue"));
const revealBtn = document.getElementById("reveal-button");

// ==== Load saved state or initialize ====
let data = JSON.parse(localStorage.getItem("trehunt")) || {
    coins: INITIAL_COINS,
    revealed: 1 // Start with first clue visible
};

let coins = data.coins;
let nextToReveal = data.revealed;

// ==== Update displayed coins ====
coinsDisplay.textContent = coins;

// ==== Reveal saved clues ====
clues.forEach((clue, index) => {
    if (index < nextToReveal) {
        clue.classList.remove("hidden");
    }
});

// ==== Update button label on load ====
updateButtonLabel();

// Disable if all clues already visible
if (nextToReveal >= clues.length) {
    revealBtn.disabled = true;
    revealBtn.textContent = "All clues revealed";
}

// ===================================
// ========== CLICK LOGIC ============
// ===================================
revealBtn.addEventListener("click", () => {
    print(nextToReveal)
    if (nextToReveal >= clues.length) return;

    const clueCost = COSTS[nextToReveal];

    // Pay cost
    coins -= clueCost;
    coinsDisplay.textContent = coins;

    // Reveal clue
    clues[nextToReveal].classList.remove("hidden");
    nextToReveal++;

    // Update label
    updateButtonLabel();

    // If finished
    if (nextToReveal >= clues.length) {
        revealBtn.disabled = true;
        revealBtn.textContent = "All clues revealed";
    }

    // Save progress
    localStorage.setItem(
        "trehunt",
        JSON.stringify({
            coins: coins,
            revealed: nextToReveal
        })
    );
});

// ===================================
// ======== BUTTON LABEL =============
// ===================================

function updateButtonLabel() {
    if (nextToReveal >= clues.length) return;

    const price = COSTS[nextToReveal];
    revealBtn.textContent = `Reveal next clue — cost ${price} coins`;
}
