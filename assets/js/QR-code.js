const cameraWrapper = document.getElementById("camera-wrapper");
const cameraDiv = document.getElementById("my-camera");
const activateDiv = document.getElementById("activate");
const resultDiv = document.getElementById("result");

const html5Qr = new Html5Qrcode("my-camera");

activateDiv.onclick = async () => {
  activateDiv.classList.add("hidden");
  cameraWrapper.classList.remove("hidden");

  const cameras = await Html5Qrcode.getCameras();
  const camId = cameras[0].id;

  html5Qr.start(
    camId,
    {
      fps: 10,
      qrbox: (w, h) => ({ width: w * 0.8, height: w * 0.8 }),
    },
    (decodedText) => {
      html5Qr.stop().then(() => {

         //console.log(decodedText)
         if( isQRcodeGood(decodedText) ){
            cameraWrapper.classList.add("hidden");
            resultDiv.classList.remove("hidden");
            resultDiv.textContent = "You found me!\nClick on me to go to the next page";

         } else {
            activateDiv.classList.remove("hidden");
            cameraWrapper.classList.add("hidden");
            activateDiv.textContent = "Not the correct QR code!\nClick on me to scan again";
         }


      });
    },
    (err) => {}
  );
};

isQRcodeGood = (_str) => {
   return true;
}

generateShortHash = (input, length = 10) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  // SHA-256 digest
  const hashBuffer = crypto.subtle.digest("SHA-256", data);

  // Convert to hex
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  return hashHex.slice(0, length);
}

async function doItAll(input) {
  const h = generateShortHash(input, 10);
  console.log(input + " - " + h);
}

