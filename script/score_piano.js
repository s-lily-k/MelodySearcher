/* ピアノの鍵盤上の文字を変更する(移動できるようにするかも) */
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

/* movingLineの次の瞬間の位置を計算する */
function GoToNextLine() {
    /* 一周の時間を計る */
    if (positionOfMovingLine == movingLineOffsetLeft + movingLineOffset) {
        startTime = Date.now();
    }
    positionOfMovingLine += movingLineOffset;
    positionOfMovingLine = Math.round(positionOfMovingLine * 1000) / 1000;
    // MyConsole.textContent = "bar: " + positionOfMovingLine;

    /* 右端に到達した時 */
    if (positionOfMovingLine > 100) {
        // autoClearがonなら譜面を消す
        if (autoClearCheckBox.checked) {
            clearScore();
        }
        positionOfMovingLine = movingLineOffsetLeft + movingLineOffset;

        /* 経過時間を計算する */
        if (startTime != null) {
            let delta = Date.now() - startTime;
            BPMdisp.textContent = "BPM: " + scoreBPM;
            // BPMdisp.textContent += " | keisan: " + (254 / scoreBPM).toFixed(3);
            BPMdisp.textContent += " | deltaTime: " + (delta / 1000) + "(s)";
        }
    }

    // ここで位置を更新
    scoreMovingLine.style.left = positionOfMovingLine + "%";
}

/* Activeかどうか切り替える */
function flipScore() {
    scoreIsActive = !scoreIsActive; // 反転させる
    scoreStartStopButtonLabel.textContent = (scoreIsActive ? "STOP": "PLAY");
}

function moveLine() {
    // activeかつtab1が選ばれていれば
    if (type01Tab.classList.contains('is-current') && scoreIsActive) {
        // 次の位置へ移動
        GoToNextLine();
    }
    setTimeout(moveLine, (1000 / 64) * (253.968 / scoreBPM)); // 253.968は人(環境)によるかもしれない……(BPMと実数値が正しくなるように計算した値。)
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
    // activeかつtab1が選ばれていれば
    if (type01Tab.classList.contains('is-current') && scoreIsActive) {
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
scoreStartStopButton.addEventListener('click', flipScore);
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
    // tab1が選ばれていれば
    // autoClearがoffになっていれば
    // Backspaceキーが押された場合
    if (type01Tab.classList.contains('is-current')) {
        if (autoClearCheckBox != null) {
            if (!autoClearCheckBox.checked) {
                if (event.key === 'Backspace' || event.key === 8) {
                    clearScore();
                }
            }
        }
    }
});

window.addEventListener('keyup', (event) => {
    // tab1が選ばれていれば
    // space key で on/off切り替え用
    if (type01Tab.classList.contains('is-current')) {
        if (event.key == ' ') {
            // scoreIsActive = !scoreIsActive;
            scoreStartStopButton.click();
        }
    }
});

window.addEventListener('keydown', (event) => {
    var key = event.key.toUpperCase();
    if(keyboardBindings[key]) {
        setKeyIsDown(keyboardBindings[key]);
    }
});

window.addEventListener('keyup', (event) => {
    // isKeyDownでKey入力されているかどうかを保持
    var key = event.key.toUpperCase();
    if(keyboardBindings[key]) {
        setKeyIsNotDown(keyboardBindings[key]);
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