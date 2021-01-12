const videoContainer = document.querySelector("#jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideo");
const playBtn = document.querySelector("#jsPlayBtn")
// const playBtnIcon = document.querySelector("#jsPlayIcon");
const volumeBtn = document.querySelector("#jsVolumeBtn");
const volumeSlider = document.querySelector("#jsVolumeSlider");
const expandBtn = document.querySelector("#jsExpandBtn");
const currentTimeSlot = document.querySelector("#jsCurrentTime");
const durationTimeSlot =document.querySelector("#jsDurationTime");
const progressBar = document.querySelector("#jsProgressSlider");
let currentVolume;
let timeIntervalId;
const WIDTH = 1000;
const HEIGHT = 562;


function updateViews() {
    const videoId = window.location.href.split("/videos/")[1];
    fetch(`/api/${videoId}/views`, {
        method: "POST"
    });
}

function handleVolume(event) {
    if (videoPlayer.muted)
        videoPlayer.muted = false;
    const volValue = event.target.value;
    videoPlayer.volume = (volValue)/volumeSlider.max;
    if (videoPlayer.volume === 0) { 
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (videoPlayer.volume < 0.6) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

function handleProgressBar(event) {
    const value = event.target.value;
    const max = event.target.max;
    const time = value/max * videoPlayer.duration;
    videoPlayer.currentTime = time;
}

function handleClickPlayBtn(event) {
    if(videoPlayer.paused) { // stop the video
        videoPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else { // run the video
        videoPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
    // playBtnIcon.classList.toggle("fa-play");
    // playBtnIcon.classList.toggle("fa-pause");
} 

function handleClickVolumeBtn(event) {
    if (!videoPlayer.muted) {
        currentVolume = videoPlayer.volume;
        videoPlayer.muted = true;
        videoPlayer.volume = 0;
        volumeSlider.value = 0;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        videoPlayer.muted = false;
        videoPlayer.volume = currentVolume;
        volumeSlider.value = currentVolume*volumeSlider.max;
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

function handleClickExpandBtn() {
    if (!document.fullscreenElement) {
        // videoPlayer.removeAttribute("style");
        if (videoContainer.requestFullscreen) {
            videoContainer.requestFullscreen();
        } else if (videoContainer.webkitRequestFullscreen) {
            videoContainer.webkitRequestFullscreen();
        } else if (videoContainer.mozRequestFullscreen) {
            videoContainer.mozRequestFullscreen();
        } else if (videoContainer.msRequestFullscreen) {
            videoContainer.msRequestFullscreen();
        }
        expandBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        // videoPlayer.style.width = WIDTH + "px";
        // videoPlayer.style.height = HEIGHT + "px";
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozExitFullscreen) {
            document.mozExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        expandBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
}

function handleEnded() {
    currentTimeSlot.innerText = "00:00:00";
    videoPlayer.currentTime = 0;
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    // clearInterval(timeIntervalId);
}


function setPlaybackTime() {
    const currentString = getTimeString(Math.floor(videoPlayer.currentTime));
    currentTimeSlot.innerText = currentString;
}

function setProgressBar() {
    const time = videoPlayer.currentTime;
    const max = progressBar.max;
    progressBar.value = (time/videoPlayer.duration) * max;
}

function setDuration() {
    const durationString = getTimeString(videoPlayer.duration);
    durationTimeSlot.innerText = durationString;
    timeIntervalId = setInterval(function(){ 
        setPlaybackTime();
        setProgressBar();
    }, 100);
}

function getTimeString(seconds) {
    seconds = parseInt(seconds);
    const minutes = Math.floor(seconds/60);
    const secondsFinal = seconds%60;
    const hours = Math.floor(minutes/60);
    const minutesFinal = minutes%60;
    const secs = (secondsFinal < 10) ? ("0"+secondsFinal) : secondsFinal.toString();
    const mins = (minutesFinal < 10) ? ("0"+minutesFinal) : minutesFinal.toString();
    const hrs  = (hours < 10) ? ("0"+hours) : hours.toString();
    return `${hrs}:${mins}:${secs}`
}

function handlePressEsc(event) {
    // console.log("keydown!");
    // console.log(document.fullscreenElement);
    if(event.key === "Escape" && !document.fullscreenElement) {
        expandBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
}


function init() {
    if (videoContainer) { 
        updateViews();
        videoPlayer.volume = 1;
        // when the video is loaded
        videoPlayer.addEventListener("loadedmetadata", setDuration);
        // when playback completes
        videoPlayer.addEventListener("ended", handleEnded);
        document.addEventListener("keydown", handlePressEsc);

        playBtn.addEventListener("click", handleClickPlayBtn);
        volumeBtn.addEventListener("click", handleClickVolumeBtn);
        volumeSlider.addEventListener("input", handleVolume); // "change"
        // ⚠️ Fullscreen button Disabled 🚧
        // expandBtn.addEventListener("click", handleClickExpandBtn);
        progressBar.addEventListener("input", handleProgressBar);

        // const w = videoPlayer.videoWidth;
        // const h = videoPlayer.videoHeight;
        videoPlayer.style.width = WIDTH + "px";
        videoPlayer.style.height = HEIGHT + "px";

    }
}

init();

