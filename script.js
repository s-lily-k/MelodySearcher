// variables //
const MyConsole = document.getElementById("console");
const MyConsole2 = document.getElementById("console2");
const MyConsole3 = document.getElementById("console3");

// 鍵盤のリスト (key, blackKey)
let pianoKeys = {};

// 各ピアノのキーが押されているかどうかを保持するオブジェクト
let isKeyDown = {};

const scaleList = [
    "C2", "D2", "E2", "F2", "G2", "A2", "B2", // 0 ~ 6
    "C3", "D3", "E3", "F3", "G3", "A3", "B3", // 7 ~ 13
    "C4", "D4", "E4", "F4", "G4", "A4", "B4", // 14 ~ 20
    "C5", "D5", "E5", "F5", "G5", "A5", "B5", // 21 ~ 28
    "C6", // 29
];

const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackKeys = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];
const numOfScales = 30; // C2 ~ C6
const keyboardBindings = {
    '': 'C2',
    '': 'D2',
    '': 'E2',
    '': 'F2',
    '': 'G2',
    '': 'A2',
    '': 'B2',
    '': 'C#2',
    '': 'D#2',
    '': 'F#2',
    '': 'G#2',
    '': 'A#2',
    'A': 'C3',
    'S': 'D3',
    'D': 'E3',
    'F': 'F3',
    'G': 'G3',
    'H': 'A3',
    'J': 'B3',
    'W': 'C#3',
    'E': 'D#3',
    'T': 'F#3',
    'Y': 'G#3',
    'U': 'A#3',
    'K': 'C4',
    'L': 'D4',
    ';': 'E4',
    ':': 'F4',
    ']': 'G4',
    'O': 'C#4',
    'P': 'D#4',
    '[': 'F#4',
    '': 'G#4',
    '': 'A#4',
    '': 'C5',
    '': 'D5',
    '': 'E5',
    '': 'F5',
    '': 'G5',
    '': 'A5',
    '': 'B5',
    '': 'C#5',
    '': 'D#5',
    '': 'F#5',
    '': 'G#5',
    '': 'A#5',
    '': 'C6',
};

const bars = document.getElementById("Bars");
const barsChildren = bars.getElementsByTagName("div");
const scoreStartButton = document.getElementById("score_start");
const scoreStopButton = document.getElementById("score_stop");
const scoreMovingLine = document.getElementById("moving_line");
const scoreClearButton = document.getElementById("clear_score_button");
const autoClearCheckBox = document.getElementById("check_auto_clear");
let scoreIsActive = false;
let positionOfMovingLine = 4.0; // 初期値
const movingLineOffset = 1.56;
const movingLineOffsetLeft = 4.0; // 初期値に戻す時に使う
const BPMinput = document.getElementById("set_bpm_input");
const BPMinputButton = document.getElementById("set_bpm_button");
const BPMdisp = document.getElementById("bpm_disp");
const interval = 10;
const PX = 1.56;

let defaultScoreBPM = 150;
let scoreBPM = defaultScoreBPM;

let startTime = null;

let keysPressed = {};
let audioElements = {};


// function //
function changePianoKeyText() {
    MyConsole3.textContent = "";
    for (let pianoKey in pianoKeys) {
        for (let keyBinding in keyboardBindings) {
            if (pianoKey == keyboardBindings[keyBinding]) {
                pianoKeys[pianoKey].textContent = keyBinding;
            }
        }
    }
}

function GoToNextLine() {
    if (positionOfMovingLine == movingLineOffsetLeft + movingLineOffset) {
        startTime = Date.now();
    }
    positionOfMovingLine += movingLineOffset;
    positionOfMovingLine = Math.round(positionOfMovingLine * 1000) / 1000;
    // MyConsole.textContent = "bar: " + positionOfMovingLine;
    if (positionOfMovingLine > 100) {
        // autoClearがonなら譜面を消す
        if (autoClearCheckBox.checked) {
            clearScore();
        }
        positionOfMovingLine = movingLineOffsetLeft + movingLineOffset;
        if (startTime != null) {
            let delta = Date.now() - startTime;
            BPMdisp.textContent = "BPM: " + scoreBPM + " | keisan: " + (254 / scoreBPM).toFixed(3) + " | deltaTime: " + delta + "(ms) = " + (delta / 1000) + "(s)";
        }
    }
}

function startScore() {
    scoreIsActive = true;
}
function stopScore() {
    scoreIsActive = false;
}
function moveLine() {
    if (scoreIsActive) {
        // 次の値
        GoToNextLine();
        // 更新
        scoreMovingLine.style.left = positionOfMovingLine + "%";
    }
    setTimeout(moveLine, (1000 / 64) * (253.968 / scoreBPM)); // 253.968は人によるかもしれない……
}
moveLine();

function setBPM() {
    let inputValue = BPMinput.value;
    scoreBPM = (!inputValue ? 1 : inputValue);
    BPMdisp.innerText = "BPM: " + scoreBPM;
}

function clearScore() {
    // barsの各divの中身を初期化する
    for (let i = 0; i < barsChildren.length; i++) {
        let initialstr = barsChildren[i].id[3] + barsChildren[i].id[4]; // 左端の文字
        barsChildren[i].innerHTML = initialstr;
    }
}

// drawScore で使う
function find456(k) {
    let start = 4.0;
    let gap = movingLineOffset;
    if (k < start) { return -1; }
    else {
        while (start < k) {
            start += gap;
            start = Math.round(start * 1000) / 1000;
        }
        return Math.floor(start * 100) / 100 - gap * 1; // 一個前
    }
}

// キーボードorマウスで鍵盤を押した時、movingLineがある部分の配列の中身をtrueにする
function drawScore() {
    if (scoreIsActive) {
        Object.entries(isKeyDown).forEach(([note, value]) => {
            if (value === true) {
                MyConsole2.textContent = "note: " + note + "\n";
                try {
                    let nowat = scoreMovingLine.style.left;
                    let target = find456(parseFloat(nowat));
                    target = (target + 1.56 > 100 ? 98.44 : target); // 左端処理
                    target = (target < 4 ? 4 : target); // 右端処理

                    let addString; // htmlに追加する文字列
                    let bar; // CもC#も同じ扱いとする
                    
                    if (note[1] == '#') {
                        bar = document.getElementById("bar" + note[0] + note[2]);
                        addString = '<div class="highlight sharp" style="left: ' + target + '%;"></div>';
                    }
                    else {
                        bar = document.getElementById("bar" + note[0] + note[1]);
                        addString = '<div class="highlight" style="left: ' + target + '%;"></div>';
                    }
                    bar.innerHTML += addString;
                } catch (error) {
                    MyConsole.textContent = error;
                }
            }
        });
    }
}
setInterval(drawScore, 1);

function isPlaying(audioElement) {
    return !audioElement.paused;
}

function PlaySound() {
    MyConsole.textContent = "";
    if (scoreIsActive) {
        Object.keys(pianoKeys).forEach(note => {
            if (isKeyDown[note] == true) {
                if (audioElements[note]) {
                    MyConsole.textContent += note + "1\n"; // debug
                }
                else {
                    MyConsole.textContent += note + "2\n"; // debug
    
                    let fileName = note.replace('#', 'sharp');
                    let audioUrl = './audio/' + fileName + '.mp3'; // Use the mp3 file
                    audioElements[note] = new Audio(audioUrl);
                    audioElements[note].play().catch(error => {MyConsole.textContent += error});
                }
            }
        });
    }
}
setInterval(PlaySound, 1);

function playSound(note) { }
function fadeOutSound(note) { }
function stopSound(note) { }


// addEventListener //
scoreStartButton.addEventListener('click', startScore);
scoreStopButton.addEventListener('click', stopScore);
BPMinputButton.addEventListener('click', setBPM);
scoreClearButton.addEventListener('click', clearScore);

// isKeyDownでKey入力されているかどうかを保持
// キーボードとマウス両方に対応できるようにfunction化
function setKeyIsDown(note) {
    isKeyDown[note] = true;
}
function setKeyIsNotDown(note) {
    isKeyDown[note] = false;
}

window.addEventListener('keydown', (event) => {
    var key = event.key.toUpperCase();
    if(keyboardBindings[key]) {
        setKeyIsDown(keyboardBindings[key]);
    }
    // autoClearがoffになっていれば
    // Backspaceキーが押された場合
    if (autoClearCheckBox != null) {
        if (!autoClearCheckBox.checked) {
            if (event.key === 'Backspace' || event.key === 8) {
                clearScore();
            }
        }
    }
});

window.addEventListener('keyup', (event) => {
    // isKeyDownでKey入力されているかどうかを保持
    var key = event.key.toUpperCase();
    if(keyboardBindings[key]) {
        setKeyIsNotDown(keyboardBindings[key]);
    }
    // space key で on/off切り替え用
    if (event.key == ' ') {
        scoreIsActive = !scoreIsActive;
    }
});


// これもキーボードとマウス用にfunction化
function setKeyActive(note) {
    pianoKeys[note].classList.add('active');
}

function setKeyInActive(note) {
    pianoKeys[note].classList.remove('active');
}

// key animation 用
window.addEventListener('keydown', function(e){
    let key = e.key.toUpperCase();
    if (keyboardBindings[key]) {
        setKeyActive(keyboardBindings[key]); // active化
    }
})

// key animation 用
window.addEventListener('keyup', function (e) {
    let key = e.key.toUpperCase();
    if (keyboardBindings[key]) {
        setKeyInActive(keyboardBindings[key]); // 非active化
    }
});



// onLoad
autoClearCheckBox.checked = true;
BPMdisp.innerText = "BPM: " + scoreBPM;
scoreMovingLine.style.left = movingLineOffset + "%";
for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 7; j++) {
        let key = document.createElement('div');
        key.className = 'key';
        key.dataset.note = whiteKeys[j] + (i + 2); // Adjusted the octave
        // key.textContent = key.dataset.note;
        key.addEventListener('mousedown', function () {
            playSound(this.dataset.note); // 音
            setKeyActive(this.dataset.note); // アニメーション
            setKeyIsDown(this.dataset.note); // 判定
        });
        key.addEventListener('mouseup', function () {
            fadeOutSound(this.dataset.note); // 音
            setKeyInActive(this.dataset.note); // アニメーション
            setKeyIsNotDown(this.dataset.note); // 判定
        });
        key.addEventListener('mouseout', function () {
            fadeOutSound(this.dataset.note); // 音
            setKeyInActive(this.dataset.note); // アニメーション
            setKeyIsNotDown(this.dataset.note); // 判定
        });
        document.getElementById('piano').appendChild(key);
        // 鍵盤リストに追加
        pianoKeys[key.dataset.note] = key;
        if (blackKeys[j]) {
            let blackKey = document.createElement('div');
            blackKey.className = 'key black';
            blackKey.dataset.note = blackKeys[j] + (i + 2); // Adjusted the octave
            // blackKey.textContent = blackKey.dataset.note;
            blackKey.addEventListener('mousedown', function () {
                playSound(this.dataset.note); // 音
                setKeyActive(this.dataset.note); // アニメーション
                setKeyIsDown(this.dataset.note); // 判定
            });
            blackKey.addEventListener('mouseup', function () {
                fadeOutSound(this.dataset.note); // 音
                setKeyInActive(this.dataset.note); // アニメーション
                setKeyIsNotDown(this.dataset.note); // 判定
            });
            blackKey.addEventListener('mouseout', function () {
                fadeOutSound(this.dataset.note); // 音
                setKeyInActive(this.dataset.note); // アニメーション
                setKeyIsNotDown(this.dataset.note); // 判定
            });
            document.getElementById('piano').appendChild(blackKey);
            // 鍵盤リストに追加
            pianoKeys[blackKey.dataset.note] = blackKey;
        }
    }
}
// 鍵盤に文字を追加
changePianoKeyText();
// pianoKeyIsDown 初期化
Object.keys(pianoKeys).forEach(key => {
    isKeyDown[key] = false;
});


let scales = new Array(numOfScales); // 各音階

for (let i = 0; i < numOfScales; i++) {
    scales[i] = new Array(64); // 2小節分
    scales[i].fill(0);
}


// ------------------------------------------------------------------------ //
// ---------------------------------TEST----------------------------------- //
// ------------------------------------------------------------------------ //


function checkIsKeyDown() {
    let values = Object.values(isKeyDown);
    MyConsole3.textContent = values.join(",");
}
setInterval(checkIsKeyDown, 10);

let keys_ = Object.keys(pianoKeys);
// MyConsole3.textContent = keys_.join(",");



// 配列を用意する
// ・音を鳴らす
// ・emptyじゃなかったらどんどん保存していくモードを追加する

//piano(鍵盤)もpiano(音程)もキーボード(PC)もkey:valueもkey…

// startするまで描けないようにする
// クリックにも割当て
