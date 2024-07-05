// variables //
const MyConsole = document.getElementById("console");
const MyConsole2 = document.getElementById("console2");
const MyConsole3 = document.getElementById("console3");

// 鍵盤のリスト (key, blackKey)
let pianoKeys = {};

// 各ピアノのキーが押されているかどうかを保持するオブジェクト
let isKeyDown = {};

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

const defaultScoreBPM = 150;
let scoreBPM = defaultScoreBPM;

let startTime = null;

let keysPressed = {};
let audioElements = {};

// HTML要素を取得
const switchingTabs = document.querySelectorAll('.js-switchingTab');
const switchingContents = document.querySelectorAll('.js-switchingContents');
const type01Tab = document.querySelector('.js-switchingTab[data-switch-tab="type01"]');