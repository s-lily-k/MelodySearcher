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



// 配列を用意する
// ・音を鳴らす
// ・emptyじゃなかったらどんどん保存していくモードを追加する

//piano(鍵盤)もpiano(音程)もキーボード(PC)もkey:valueもkey…
