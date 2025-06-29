import { getTracks } from "./ncsSongs.js";

const songIcon = document.getElementById('song-icon');
const songName = document.getElementById('song-name');
const songArtist = document.getElementById('song-artist');
const songSeek = document.getElementById('song-seek');
const songAudio = document.getElementById('song-audio')
const previousButton = document.getElementById('previous-button');
const pauseButton = document.getElementById('pause-button');
const nextButton = document.getElementById('next-button');

const playFlatIcon = '<i class="fi fi-sr-play"></i>';
const pauseFlatIcon = '<i class="fi fi-sr-pause"></i>';

let ncsTracks = null
let songIndex = 0;
let songPaused = true;

let userIsSeeking = false;

songSeek.oninput = async () => {
    disbleButtons();
    if (!songPaused)
        handlePauseButtonStatus();
    songAudio.currentTime = songSeek.value;
    handlePauseButtonStatus();
    enableButtons();
}

songAudio.ontimeupdate = () => {
    updateSeeker(songAudio.currentTime);
}

songAudio.onended = async () => {
    songIndex++;
    await playMusic(songIndex);
}

previousButton.onclick = async () => {
    await handlePreviousButtonPress();
}

pauseButton.onclick = () => {
    handlePauseButtonStatus();
}

nextButton.onclick = async () => {
    songIndex++;
    await playMusic(songIndex);
}

async function handlePreviousButtonPress() {
    if (songAudio.currentTime < 2) {
        songIndex--;
        await playMusic(songIndex);
    }
    else
        await playMusic(songIndex);
}

function changePauseButtonIcon() {
    if (songPaused == true)
        pauseButton.innerHTML = playFlatIcon;
    else
        pauseButton.innerHTML = pauseFlatIcon;
}

function handlePauseButtonStatus() {
    if (songPaused == true)
        songAudio.play();
    else
        songAudio.pause();
    songPaused = !songPaused;
    changePauseButtonIcon();
}

function enableButtons() {
    pauseButton.disabled = false;
    nextButton.disabled = false;
    previousButton.disabled = false;
}

function disbleButtons() {
    pauseButton.disabled = true;
    nextButton.disabled = true;
    previousButton.disabled = true;
}

function updateSeeker(currentSongTime) {
    songSeek.value = currentSongTime;
}

async function playMusic(newSongIndex) {
    songIndex = newSongIndex;

    disbleButtons();
    await loadMusic();
    songAudio.onloadedmetadata = () => {
        songAudio.play();
        songPaused = false;
        changePauseButtonIcon();
        enableButtons();
    }
}

function initializeSeeker() {
    const songDuration = songAudio.duration;
    songSeek.max = songDuration;
    songSeek.value = 0;
}

async function loadMusic() {
    songIcon.src = await ncsTracks[songIndex].Icon;
    songName.textContent = ncsTracks[songIndex].Title;
    songArtist.textContent = ncsTracks[songIndex].Artist;
    songAudio.src = await ncsTracks[songIndex].Song;

    songPaused = true;
    changePauseButtonIcon();
    disbleButtons();

    songAudio.onloadedmetadata = () => {
        initializeSeeker();
        enableButtons();
    };
}

export async function loadInititalSetup() {
    if (ncsTracks == null)
        ncsTracks = await getTracks();
    songIndex = Math.floor(Math.random() * ncsTracks.length);
    await loadMusic();
}