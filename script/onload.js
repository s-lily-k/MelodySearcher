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