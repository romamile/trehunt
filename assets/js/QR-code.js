// =====================
// CONFIGURATION
// =====================

// The exact content of the correct QR code
const correctCode = "http://fr.wikipedia.org/";

// The URL of the next page / clue
const nextPageUrl = "next_page.html";


// =====================
// DOM ELEMENT REFERENCES
// =====================

const errorOverlay    = document.getElementById("error-overlay");
const successOverlay  = document.getElementById("success-overlay");
const nextLink        = document.getElementById("next-link");
const closeSuccessBtn = document.getElementById("close-success");
const readerElement   = document.getElementById("reader");

let errorTimeoutId = null;
let html5QrcodeScanner = null;  // will be assigned if reader exists


// =====================
// OVERLAY HELPERS
// =====================

function showErrorOverlay() {
  // Reset any existing hide timer
  if (errorTimeoutId !== null) {
    clearTimeout(errorTimeoutId);
  }

  errorOverlay.style.display = "flex";

  // Hide after 3 seconds
  errorTimeoutId = setTimeout(() => {
    errorOverlay.style.display = "none";
    errorTimeoutId = null;
  }, 3000);
}

function hideErrorOverlay() {
  if (errorTimeoutId !== null) {
    clearTimeout(errorTimeoutId);
    errorTimeoutId = null;
  }
  errorOverlay.style.display = "none";
}

function showSuccessOverlay() {
  // Configure the link to the next page
  nextLink.href = nextPageUrl;
  successOverlay.style.display = "flex";
}

function hideSuccessOverlay() {
  successOverlay.style.display = "none";
}


// =====================
// QR SCANNER CALLBACKS
// =====================

function onScanSuccess(decodedText, decodedResult) {
  // Wrong QR code
  if (decodedText !== correctCode) {
    showErrorOverlay();
    return;
  }

  // Correct QR code
  hideErrorOverlay();
  showSuccessOverlay();
}

function onScanError(errorMessage) {
  // Ignored; these are often just "no QR in this frame"
  // console.warn("Scan error:", errorMessage);
}


// =====================
// EVENT LISTENERS
// =====================

if (closeSuccessBtn) {
  closeSuccessBtn.addEventListener("click", () => {
    hideSuccessOverlay();
  });
}


// =====================
// INITIALIZE SCANNER
// =====================

if (readerElement) {
  html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: { width: 250, height: 250 } },
    false
  );

  html5QrcodeScanner.render(onScanSuccess, onScanError);
}
