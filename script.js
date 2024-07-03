// variable //
const MyConsole = document.getElementById("console");
const MyConsole2 = document.getElementById("console2");
const MyConsole3 = document.getElementById("console3");

// 鍵盤のリスト (key, blackKey)
let pianoKeys = {};

// キーのリスト
const keys = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', ':', ']'];
// 各キーが押されているかどうかを保持するオブジェクト
let isKeyDown = {};
// 初期化
keys.forEach(key => {
    isKeyDown[key] = false;
});

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
    MyConsole.textContent = "bar: " + positionOfMovingLine;
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
    Object.entries(keyboardBindings).forEach(([key, value]) => {
        try {
            let bar = document.getElementById("bar" + value);
            bar.innerHTML = value; // 中身を初期化
        } catch (error) {
            // nothing
        }
    });
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

// キーボードを押した時、movingLineがある部分の配列の中身をtrueにする
function drawScore() {
    Object.entries(isKeyDown).forEach(([key, value]) => {
        if (value === true) {
            MyConsole2.textContent = "key: " + key + "\n";
            let targetKey = keyboardBindings[key];
            MyConsole2.textContent += "scale: " + targetKey + "\n";
            try {
                let bar = document.getElementById("bar" + targetKey);
                let nowat = scoreMovingLine.style.left;
                let target = find456(parseFloat(nowat));
                target = (target + 1.56 > 100 ? 98.44 : target); // 左端処理
                target = (target < 4 ? 4 : target); // 右端処理
                // MyConsole2.textContent = "target: " + target;
                let addString = '<div class="highlight" style="left: ' + target + '%;"></div>';
                bar.innerHTML += addString;
            } catch (error) {
                // nothing
            }
        }
    });
}
setInterval(drawScore, 1);

function playSound(note) { }
function fadeOutSound(note) { }
function stopSound(note) { }


// addEventListener //
scoreStartButton.addEventListener('click', startScore);
scoreStopButton.addEventListener('click', stopScore);
BPMinputButton.addEventListener('click', setBPM);
scoreClearButton.addEventListener('click', clearScore);

// keydownイベント
window.addEventListener('keydown', (event) => {
    var key = event.key.toUpperCase();
    if (keys.includes(key)) {
        isKeyDown[key] = true;
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

// keyupイベント
window.addEventListener('keyup', (event) => {
    var key = event.key;
    if (keys.includes(key.toUpperCase())) {
        isKeyDown[key.toUpperCase()] = false;
    }
});

window.addEventListener('keydown', function(e){
    var key = e.key.toUpperCase();
    if(keyboardBindings[key]) {
        pianoKeys[keyboardBindings[key]].classList.add('active');
    }
})

window.addEventListener('keyup', function (e) {
    let key = e.key.toUpperCase();
    if (keyboardBindings[key]) {
        pianoKeys[keyboardBindings[key]].classList.remove('active');
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
            playSound(this.dataset.note);
        });
        key.addEventListener('mouseup', function () {
            fadeOutSound(this.dataset.note);
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
                playSound(this.dataset.note);
            });
            blackKey.addEventListener('mouseup', function () {
                fadeOutSound(this.dataset.note);
            });
            document.getElementById('piano').appendChild(blackKey);
            // 鍵盤リストに追加
            pianoKeys[blackKey.dataset.note] = blackKey;
        }
    }
}
// 鍵盤に文字を追加
changePianoKeyText();


let scales = new Array(numOfScales); // 各音階

for (let i = 0; i < numOfScales; i++) {
    scales[i] = new Array(64); // 2小節分
    scales[i].fill(0);
}


// ------------------------------------------------------------------------ //
// ---------------------------------TEST----------------------------------- //
// ------------------------------------------------------------------------ //

// let mm = 1.56;
// for (let i = 0; i < 10; i++) {
//     for (let t = 0; t < 100; t++) {
//         let tmp = i + 0.01*t;
//         let tmp2 = findN(tmp, mm);
//         // MyConsole.textContent += "i.k " + tmp + " => " + tmp2 + "\r\n";
//     }
// }


// function testDraw() {
//     let bartestC = document.getElementById("barC4");
//     let nowat = scoreMovingLine.style.left;
//     let percentage = findN(parseFloat(nowat));
//     let target = find456(parseFloat(nowat));
//     target = (target+1.56 > 100 ? 100-1.56: target);
//     target = (target < 4.0 ? 4.0: target);
//     let addString = '<div class="highlight" style="left: ' + target + '%;"></div>';
//     bartestC.innerHTML += addString;
//     // MyConsole.textContent += "nowat: " + target + "\n";
//     // MyConsole.textContent += addString;
// }
// scoreStartButton.addEventListener('click', testDraw);

function checkIsKeyDown() {
    MyConsole3.textContent = keys.join(",") + "\n";
    let values = Object.values(isKeyDown);
    MyConsole3.textContent += values.join(",");
}
// setInterval(checkIsKeyDown, 10);

let values = Object.keys(pianoKeys);
MyConsole3.textContent = values.join(",");




// ・音を鳴らす
// ・emptyじゃなかったらどんどん保存していくモードを追加する
// start stop wo spaceに割り当て

//piano(鍵盤)もpiano(音程)もキーボード(PC)もkey:valueもkey…


// Sharpを追加する
// startするまで描けないようにする
// クリックにも割当て
// アニメーション割当て
