function popBackFromInputNotes() {
    if (pitchArray.length) { // 空じゃなければ
        pitchArray.pop();
    }
}

function inputNotesToLyrics(note) {
    if (note) {
        pitchArray.push(note);
    }
}

function changeLyricsTextColor() {
    if (type02Tab.classList.contains('is-current')) {
        let linesArray = lyrics.split("\n"); // 行ごとに分割
        lyricsBox.innerHTML = ""; // 一回初期化する。

        for (let i = 0; i < linesArray.length; i++) {
            let line = linesArray[i];
            let charactersArray = line.split(""); // 文字ごとに分割

            for (let j = 0; j < charactersArray.length; j++) {
                let character = charactersArray[j];
                let pitch = pitchArray[j]; // 音程の配列から音程を取得
                let color = pitch ? "rgb(" + pitchColorDict[pitch].join(",") + ")" : "rgb(128,128,128)"; // 音程に対応する色を取得、もしくはgray

                let charDiv = document.createElement("div");
                charDiv.style.display = "inline-block"; // 文字を横に並べる
                charDiv.style.textAlign = "center"; // 中央揃えにする

                let spanLyrics = document.createElement("span");
                spanLyrics.className = "lyrics";
                spanLyrics.textContent = character === " " ? "\u00A0" : character; // 空白文字を表示
                spanLyrics.style.color = color; // 文字の色を設定
                charDiv.appendChild(spanLyrics);

                // 文字が空白でない場合のみ音程情報を表示
                if (character.trim() !== "" && pitch && pitch !== "rgb(128,128,128)") {
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

                lyricsBox.appendChild(charDiv);
            }

            // 行の終わりに改行を追加
            lyricsBox.appendChild(document.createElement("br"));
        }
    }
}
setInterval(changeLyricsTextColor, 50);

function changeLyricsText() {
    let inputText = InputLyrics.value;
    lyrics = inputText;
}

changeLyricsButton.addEventListener('click', changeLyricsText);
