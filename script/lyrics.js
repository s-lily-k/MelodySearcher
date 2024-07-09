function popBackFromInputNotes() {
    if (inputPitchArray.length) { // 空じゃなければ
        /* 空白じゃなくなるまで消す */
        let k = inputPitchArray.length;
        let rest = k;
        for (let i = 0; i < k; i++) {
            if (inputPitchArray[k - i - 1] === "_" || inputPitchArray[k - i - 1] === "　") {
                inputPitchArray.pop();
                rest--;
            }
            else {
                break;
            }
        }
        inputPitchArray.pop();
    }
}

function inputNotesToLyrics(note) {
    if (inputPitchArray.length < inputLyricsArray.length) { // 歌詞の文字数より音程列が大きくならないようにする
        if (note) {
            let gap = inputLyricsArray.length - inputPitchArray.length;

            inputPitchArray.push(note);

            if (gap >= 1) {
                for (let i = 0; i < gap; i++) {
                    if (inputLyricsArray[inputPitchArray.length + i] === " " || inputLyricsArray[inputPitchArray.length + i] === "　") {
                        inputPitchArray.push("_");
                    }
                    else {
                        break;
                    }
                }
            }
        }
    }
}

function changeLyricsTextColor() {
    if (type02Tab.classList.contains('is-current')) {
        let linesArray = inputLyricsArray.split("\n"); // 行ごとに分割
        lyricsBox.innerHTML = ""; // 一回初期化する。

        let absoluteIndex = 0; // 全体の文字列に対する絶対的なインデックス

        for (let i = 0; i < linesArray.length; i++) {
            let line = linesArray[i];
            let charactersArray = line.split(""); // 文字ごとに分割

            for (let j = 0; j < charactersArray.length; j++) {
                if (newLineIndices.includes(absoluteIndex)) {
                    // ここに書く
                    lyricsBox.appendChild(document.createElement("br"));
                }
                let character = charactersArray[j];
                // 全角空白は半角空白として扱う
                if (character === "　") {
                    character = " ";
                }

                let pitch = inputPitchArray[absoluteIndex]; // 音程の配列から音程を取得
                let color = pitchColorDict[pitch] ? "rgb(" + pitchColorDict[pitch].join(",") + ")" : "rgb(128,128,128)"; // 音程に対応する色を取得、もしくはgray

                let charDiv = document.createElement("div");
                charDiv.style.display = "inline-block"; // 文字を横に並べる
                charDiv.style.textAlign = "center"; // 中央揃えにする

                let spanLyrics = document.createElement("span");
                spanLyrics.className = "lyrics";
                spanLyrics.textContent = character === " " ? "\u00A0" : character; // 空白文字を表示
                spanLyrics.style.color = color; // 文字の色を設定
                charDiv.appendChild(spanLyrics);

                // 空白のときは音程情報を表示しない
                if (character !== " ") {
                    // 音程情報がある場合のみ音程情報を表示
                    if (pitch && pitch !== "rgb(128,128,128)") {
                        let spanPitchInfo = document.createElement("span");
                        spanPitchInfo.className = "pitch-info";
                        spanPitchInfo.textContent = pitch;
                        spanPitchInfo.style.color = color; // 音程情報も同じ色に
                        charDiv.appendChild(spanPitchInfo);
                    }
                    else { // 大抵grayの時
                        let spanPitchInfo = document.createElement("span");
                        spanPitchInfo.className = "pitch-info";
                        spanPitchInfo.textContent = "_";
                        spanPitchInfo.style.color = color; // 音程情報も同じ色に
                        charDiv.appendChild(spanPitchInfo);
                    }
                }
                absoluteIndex++; // 絶対的なインデックスをインクリメント
                lyricsBox.appendChild(charDiv);

            }

            // 行の終わりに改行を追加
            lyricsBox.appendChild(document.createElement("br"));
        }
    }
}
setInterval(changeLyricsTextColor, 50);

function changeLyricsText() {
    // 入力ボックスから取ってきてinputLyricsArrayで保持する
    inputLyricsArray = inputLyrics.value;

    // 後ろの空白は削除する
    while (inputLyricsArray.endsWith(" ")) {
        inputLyricsArray = inputLyricsArray.slice(0, -1); // pop()と同じ
    }

    // 改行位置を初期化し、新たに保持する
    newLineIndices = [];
    for(let i = 0; i < inputLyricsArray.length; i++) {
        if(inputLyricsArray[i] === '\n') {
            newLineIndices.push(i);
        }
    }
    inputLyricsArray = inputLyricsArray.replace(/\n/g, '');

    // inputPitchArrayのサイズを調整する // 多い分だけpopで減らす
    if (inputPitchArray.length > inputLyricsArray.length) {
        inputPitchArray.pop();
    }
}

changeLyricsButton.addEventListener('click', changeLyricsText);
