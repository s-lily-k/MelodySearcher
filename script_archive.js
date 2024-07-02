const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackKeys = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];
const keyboardBindings = {
    'A': 'C3',
    'S': 'D3',
    'D': 'E3',
    'F': 'F3',
    'G': 'G3',
    'H': 'A3',
    'J': 'B3',
    'K': 'C4',
    'L': 'D4',
    ';': 'E4',
    ':': 'F4',
    ']': 'G4',
    'W': 'C#3',
    'E': 'D#3',
    'T': 'F#3',
    'Y': 'G#3',
    'U': 'A#3',
    'O': 'C#4',
    'P': 'D#4',
    '[': 'F#4',
};

let keysPressed = {};
let audioElements = {};

for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 7; j++) {
        let key = document.createElement('div');
        key.className = 'key';
        key.dataset.note = whiteKeys[j] + (i + 2); // Adjusted the octave
        key.addEventListener('mousedown', function () {
            playSound(this.dataset.note);
        });
        key.addEventListener('mouseup', function () {
            fadeOutSound(this.dataset.note);
        });
        document.getElementById('piano').appendChild(key);
        if (blackKeys[j]) {
            let blackKey = document.createElement('div');
            blackKey.className = 'key black';
            blackKey.dataset.note = blackKeys[j] + (i + 2); // Adjusted the octave
            blackKey.addEventListener('mousedown', function () {
                playSound(this.dataset.note);
            });
            blackKey.addEventListener('mouseup', function () {
                fadeOutSound(this.dataset.note);
            });
            document.getElementById('piano').appendChild(blackKey);
        }
    }
}


function playSound(note) {
    if (!keysPressed[note]) {
        // Replace '#' with 'sharp' in the note name for the file URL
        let fileName = note.replace('#', 'sharp');
        let audioUrl = './audio/' + fileName + '.mp3'; // Use the mp3 file
        audioElements[note] = new Audio(audioUrl);
        audioElements[note].play();
        keysPressed[note] = true;
    }
}

function fadeOutSound(note) {
    if (audioElements[note]) {
        let interval = setInterval(function () {
            if (audioElements[note].volume > 0.02) {
                audioElements[note].volume -= 0.02;
            } else {
                stopSound(note);
                clearInterval(interval);
            }
        }, 10);
    }
}

function stopSound(note) {
    if (audioElements[note]) {
        audioElements[note].pause();
        audioElements[note].currentTime = 0;
        delete audioElements[note];
        delete keysPressed[note];
    }
}

// Add event listener for keyboard input
window.addEventListener('keydown', function (e) {
    let key = e.key.toUpperCase();
    if (keyboardBindings[key]) {
        playSound(keyboardBindings[key]);
    }
});

window.addEventListener('keyup', function (e) {
    let key = e.key.toUpperCase();
    if (keyboardBindings[key]) {
        fadeOutSound(keyboardBindings[key]);
    }
});
