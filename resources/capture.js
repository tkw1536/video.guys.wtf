const videoElem = document.getElementById("capture_video");
const logElem = document.getElementById("capture_log");
const startElem = document.getElementById("capture_buttonStart");
const stopElem = document.getElementById("capture_buttonStop");
const cursorElem = document.getElementById("capture_cursorBox");

// options for the display media, TODO: read this from the DOM
let displayMediaOptions = {
    video: {
        cursor: undefined
    },
    audio: false
};

// Set event listeners for the start and stop buttons
startElem.addEventListener("click", function (evt) {
    startCapture();
}, false);

stopElem.addEventListener("click", function (evt) {
    stopCapture();
}, false);

// trap the log methods to log into the logElement
console.log = msg => logElem.innerHTML += `${msg}<br>`;
console.error = msg => logElem.innerHTML += `<span class="error">${msg}</span><br>`;
console.warn = msg => logElem.innerHTML += `<span class="warn">${msg}<span><br>`;
console.info = msg => logElem.innerHTML += `<span class="info">${msg}</span><br>`;

async function startCapture() {
    logElem.innerHTML = "";

    // disable the start button
    startElem.setAttribute('disabled', 'disabled');
    cursorElem.setAttribute('disabled', 'disabled');

    try {
        displayMediaOptions.video.cursor = cursorElem.options[cursorElem.selectedIndex].value;
        videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        dumpOptionsInfo();
    } catch (err) {
        console.error("Error: " + err);
        startButton.removeAttribute('disabled');
        cursorElem.removeAttribute('disabled');
        return
    }

    stopElem.removeAttribute('disabled');
}

function stopCapture(evt) {
    // enable the start button, disable the stop button
    stopElem.setAttribute('disabled', 'disabled');
    startElem.removeAttribute('disabled');
    cursorElem.removeAttribute('disabled');
    
    let tracks = videoElem.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;
}

function dumpOptionsInfo() {
    const videoTrack = videoElem.srcObject.getVideoTracks()[0];

    console.info("Track settings:");
    console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
    console.info("Track constraints:");
    console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

// enable the start element
startElem.removeAttribute('disabled');
cursorElem.removeAttribute('disabled');

