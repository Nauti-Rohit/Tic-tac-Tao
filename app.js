// Mode Selection
const playHumanBtn = document.getElementById("play-human");
const playComputerBtn = document.getElementById("play-computer");
const modeSelection = document.querySelector(".mode-selection");
const mainGame = document.querySelector("main");
const turnIndicator = document.getElementById("turn-indicator");

let playWithComputer = false;

// Game Elements
let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true; // O = Player, X = Opponent or Computer
let count = 0;

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

// Start Game
playHumanBtn.addEventListener("click", () => {
  playWithComputer = false;
  modeSelection.classList.add("hide");
  mainGame.classList.remove("hide");
  resetGame(true);
  updateTurnMsg();
});

playComputerBtn.addEventListener("click", () => {
  playWithComputer = true;
  modeSelection.classList.add("hide");
  mainGame.classList.remove("hide");
  resetGame(true);
  updateTurnMsg();
});

// Box Click
boxes.forEach((box, idx) => {
  box.addEventListener("click", () => {
    if (box.innerText !== "" || msgContainer.classList.contains("show")) return;

    if (playWithComputer) {
      if (!turnO) return; // Wait for computer's turn to end
      box.innerText = "O";
      box.disabled = true;
      turnO = false;
      count++;
      updateTurnMsg();

      if (checkWinner()) return;
      if (count === 9) return gameDraw();

      setTimeout(() => {
        computerMove();
      }, 500);
    } else {
      // Player vs Player Mode
      box.innerText = turnO ? "O" : "X";
      box.disabled = true;
      turnO = !turnO;
      count++;
      updateTurnMsg();

      if (checkWinner()) return;
      if (count === 9) return gameDraw();
    }
  });
});

// Turn Message
const updateTurnMsg = () => {
  if (msgContainer.classList.contains("show")) return;
  turnIndicator.innerText = playWithComputer
    ? turnO
      ? "Your Move"
      : "Computer's Move"
    : turnO
    ? "O's Turn"
    : "X's Turn";
};

// Computer Move Logic
const computerMove = () => {
  // Try to win
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    let values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
    if (values.filter((v) => v === "X").length === 2 && values.includes("")) {
      let idx = pattern[values.indexOf("")];
      makeComputerMove(idx);
      return;
    }
  }

  // Try to block player
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    let values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
    if (values.filter((v) => v === "O").length === 2 && values.includes("")) {
      let idx = pattern[values.indexOf("")];
      makeComputerMove(idx);
      return;
    }
  }

  // Otherwise choose random
  let emptyBoxes = [];
  boxes.forEach((box, i) => {
    if (box.innerText === "") emptyBoxes.push(i);
  });

  if (emptyBoxes.length > 0) {
    let randomIdx = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    makeComputerMove(randomIdx);
  }
};

const makeComputerMove = (index) => {
  boxes[index].innerText = "X";
  boxes[index].disabled = true;
  turnO = true;
  count++;
  updateTurnMsg();

  if (checkWinner()) return;
  if (count === 9) return gameDraw();
};

// Winner Check
const checkWinner = () => {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    let val1 = boxes[a].innerText;
    let val2 = boxes[b].innerText;
    let val3 = boxes[c].innerText;

    if (val1 !== "" && val1 === val2 && val2 === val3) {
      showWinner(val1);
      return true;
    }
  }
  return false;
};

// Draw & Win
const gameDraw = () => {
  msg.innerText = `Draw`;
  msgContainer.classList.remove("hide");
  msgContainer.classList.add("show");
  disableBoxes();
};

const showWinner = (winner) => {
  msg.innerText = `Congratulations, Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  msgContainer.classList.add("show");
  disableBoxes();
};

// Reset Game
const resetGame = (initial = false) => {
  turnO = true;
  count = 0;
  msgContainer.classList.add("hide");
  msgContainer.classList.remove("show");
  enableBoxes();
  if (!initial) {
    mainGame.classList.add("hide");
    modeSelection.classList.remove("hide");
  }
  updateTurnMsg();
};

const disableBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });
};

// Buttons
newGameBtn.addEventListener("click", () => resetGame());
resetBtn.addEventListener("click", () => resetGame());
