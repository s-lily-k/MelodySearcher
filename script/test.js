// ------------------------------------------------------------------------ //
// ---------------------------------TEST----------------------------------- //
// ------------------------------------------------------------------------ //


function checkIsKeyDown() {
    // let values = Object.values(isKeyDown);
    let values = pitchArray.join(",");
    MyConsole3.textContent = values;
}

let keys_ = Object.keys(pianoKeys);
// MyConsole3.textContent = keys_.join(",");

function checkInputPitchArray() {
    MyConsole5.textContent = "[inputPitchArray] : \n";
    if (inputPitchArray.length > 0) {
        MyConsole5.textContent += inputPitchArray.join(" ");
    }
}

function checkInputLyricsArray() {
    MyConsole6.textContent = "[inputLyricsArray] : \n";
    if (inputLyricsArray.length > 0) {
        MyConsole6.textContent += inputLyricsArray; // string
    }
}

function checkNewLineIndices() {
    MyConsole2.textContent = newLineIndices.join(", ");
}

function checkIsKeyDown() {
    MyConsole2.textContent = "[isThisKeyFirstDown] : \n";
    let n = 54;
    // let values = Object.values(isKeyDown);
    let values = Object.values(isThisKeyFirstDown);
    values = values.map(value => value ? ' true' : 'false');
    
    let result = '';
    for (let i = 0; i < values.length; i++) {
        if (i !== 0 && i % n === 0) {
            result += '\n';
        }
        result += values[i] + ', ';
    }
    
    MyConsole2.textContent += result;
}

setInterval(checkIsKeyDown, 10);
setInterval(checkInputPitchArray, 10);
setInterval(checkInputLyricsArray, 10);
// setInterval(checkNewLineIndices, 10);
setInterval(checkIsKeyDown, 10);