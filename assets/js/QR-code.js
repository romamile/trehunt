const cameraWrapper = document.getElementById("camera-wrapper");
const cameraDiv = document.getElementById("my-camera");
const activateDiv = document.getElementById("activate");
const resultDiv = document.getElementById("result");

const html5Qr = new Html5Qrcode("my-camera");

if( data.listStory[id_story][id_step].completed ) {
   cameraWrapper.classList.add("hidden");
   activateDiv.classList.add("hidden");

   resultDiv.classList.remove("hidden");
   resultDiv.textContent = "You found me already!\nClick on me to go to the next page";
}


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

         // QR code should be the first 15 char of SHA-256 of id_story+_+id_step
         // Do the verification on a server when ... we'll use one
         shortHash(id_story+"_"+id_step)
         .then(resultHash => {
            console.log(decodedText)
            console.log(resultHash)
            if(resultHash == decodedText) {
               cameraWrapper.classList.add("hidden");
               resultDiv.classList.remove("hidden");
               resultDiv.textContent = "You found me!\nClick on me to go to the next page";

               data.listStory[id_story][id_step].completed = true;

               if(id_step==3) { // Finished a story, you get more coins!
                  data.coins += 10;
                  coinsDisplay.textContent = data.coins;
               }
               
               saveGameState();
            } else {
               activateDiv.classList.remove("hidden");
               cameraWrapper.classList.add("hidden");
               activateDiv.textContent = "Not the correct QR code!\nClick on me to scan again";
            }
         });

      });
    },
    (err) => {}
  );
};


function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  return crypto.subtle.digest("SHA-256", data).then(buffer => {
    return [...new Uint8Array(buffer)]
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  });
}

function shortHash(str, length = 15) {
  return sha256(str).then(hash => hash.slice(0, length));
}
