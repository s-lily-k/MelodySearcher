function changeLyricsText() {
    let inputText = InputLyrics.value;
    lyrics = inputText;

    let linesArray = lyrics.split("\n"); // 行ごとに分割

    // 音程の情報を配列として保持
    let pitchArray = ["C4", "D4", "E4", "F4", "G4"];

    let lyricsBox = document.getElementById("lyrics_display_box");
    lyricsBox.innerHTML = ""; // 一回初期化する。

    for (let i = 0; i < linesArray.length; i++) {
        let line = linesArray[i];
        let charactersArray = line.split(""); // 文字ごとに分割

        for (let j = 0; j < charactersArray.length; j++) {
            let character = charactersArray[j];
            let pitch = pitchArray[j % pitchArray.length]; // 音程の配列が短い場合に対応

            let charDiv = document.createElement("div");
            charDiv.style.display = "inline-block"; // 文字を横に並べる
            charDiv.style.textAlign = "center"; // 中央揃えにする

            let spanLyrics = document.createElement("span");
            spanLyrics.className = "lyrics";
            spanLyrics.textContent = character === " " ? "\u00A0" : character; // 空白文字を表示
            charDiv.appendChild(spanLyrics);

            // 文字が空白でない場合のみ音程情報を表示
            if (character.trim() !== "") {
                let spanPitchInfo = document.createElement("span");
                spanPitchInfo.className = "pitch-info";
                spanPitchInfo.textContent = pitch; // 括弧を外す
                charDiv.appendChild(spanPitchInfo);

                if (pitch === "C4") {
                    spanLyrics.style.color = "red"; // "C"音程の文字を赤色に
                    spanPitchInfo.style.color = "red"; // 音程情報も同じ色に
                } else if (pitch === "D4") {
                    spanLyrics.style.color = "blue"; // "D"音程の文字を青色に
                    spanPitchInfo.style.color = "blue"; // 音程情報も同じ色に
                } else if (pitch === "G4") {
                    spanLyrics.style.color = "purple"; // "G"音程の文字を紫色に
                    spanLyrics.style.textDecoration = "underline"; // "G"音程の文字に下線をつける
                    spanPitchInfo.style.color = "purple"; // 音程情報も同じ色に
                } else {
                    spanLyrics.style.color = "green"; // その他の音程の文字を緑色に
                    spanPitchInfo.style.color = "green"; // 音程情報も同じ色に
                }
            }

            lyricsBox.appendChild(charDiv);
        }

        // 行の終わりに改行を追加
        lyricsBox.appendChild(document.createElement("br"));
    }
}

changeLyricsButton.addEventListener('click', (e) => {
    // ボタンを無効化
    this.disabled = true;

    // Lyricsを入力の内容に変更
    changeLyricsText();

    // 1秒後にボタンを再度有効化
    setTimeout(() => {
        this.disabled = false;
    }, 1000);
});

let lyrics = `Now I'm ready, I'm ready to go
花が咲く時が来たんだ
Are you ready? わかるでしょ
やってみせる Make it through

ほら そんなソワソワしてたら
時は過ぎちゃうから 今すぐにさ
Let's work it out`
