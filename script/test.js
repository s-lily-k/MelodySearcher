// ------------------------------------------------------------------------ //
// ---------------------------------TEST----------------------------------- //
// ------------------------------------------------------------------------ //


function checkIsKeyDown() {
    // let values = Object.values(isKeyDown);
    let values = pitchArray.join(",");
    MyConsole3.textContent = values;
}
setInterval(checkIsKeyDown, 10);

let keys_ = Object.keys(pianoKeys);
// MyConsole3.textContent = keys_.join(",");

function checkInputPitchArray() {
    MyConsole5.textContent = "[inputPitchArray] : \n";
    if (inputPitchArray.length > 0) {
        MyConsole5.textContent += inputPitchArray.join(" ");
    }
}
setInterval(checkInputPitchArray, 10);

function checkInputLyricsArray() {
    MyConsole6.textContent = "[inputLyricsArray] : \n";
    if (inputLyricsArray.length > 0) {
        MyConsole6.textContent += inputLyricsArray; // string
    }
}
setInterval(checkInputLyricsArray, 10);