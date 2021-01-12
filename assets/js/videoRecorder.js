const videoRecorderContainer = document.querySelector("#jsVideoRecorder");
const videoPreview = document.querySelector("#jsVideoPreview");
const recordBtn = document.querySelector("#jsRecordBtn");
// const downloadBtn = document.querySelector("#jsdownloadBtn")

const constraints = {
    audio: true,
    video: { width: 1280, height: 720 }
}
// const options = {mimeType: 'video/webm;codecs=vp9'};

let videoRecorder;
let streamObject;
// let data = [];

function init() {
    if(videoRecorderContainer) {
        recordBtn.addEventListener("click", handleClickRecordBtn);
    }
}

function handleVideoData(event) {
    // data.push(event.data);
    // const recordedBlob = new Blob(data, options);
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(event.data);
    downloadLink.download = "RecordedVideo.webm";
    document.body.appendChild(downloadLink);
    downloadLink.click(); 
    // TODO : after click, remove the link?
    document.body.removeChild(downloadLink);
}

function stopRecording(event) {
    videoRecorder.stop();
    recordBtn.removeEventListener("click", stopRecording);
    recordBtn.addEventListener("click", handleClickRecordBtn);
    recordBtn.innerHTML = "Start Recording";
}

function startRecording() {
    videoRecorder = new MediaRecorder(streamObject);
    // Starts the recording process by calling recorder.start()
    videoRecorder.start();
    // Sets up the handler for the dataavailable event. 
    videoRecorder.addEventListener("dataavailable", handleVideoData); 
    recordBtn.addEventListener("click", stopRecording);
}


async function handleClickRecordBtn() {
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoPreview.srcObject = stream;
        videoPreview.muted = true;
        videoPreview.play();
        recordBtn.innerHTML = "Stop Recording";
        streamObject = stream;
        startRecording();

    } catch(err) {
        console.log("Exception: " + err);
        recordBtn.innerHTML = "😢 Can't record..."
    } finally {
        recordBtn.removeEventListener("click", handleClickRecordBtn);
    }
}


init();