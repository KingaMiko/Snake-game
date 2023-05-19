const GAME_SIZE = 21;
const DIFFICULTY_LOOP_MS = 150;

let board; // html element
let gameLoop; // game interval

let gameBoard; // array with cells

let direction = "";
let lastAppliedDirection;
let snakePos = [];
let foodPos = {};
let score = 0;

const randomCoordinate = (min = 1, max = GAME_SIZE - 2) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const resetSnakePosition = () => {
  snakePos = [{ x: Math.floor(GAME_SIZE / 2), y: Math.floor(GAME_SIZE / 2) }];
};

const generateNewFood = () => {
  let x;
  let y;
  do {
    x = randomCoordinate();
    y = randomCoordinate();
  } while (snakePos.find((el) => el.x === x && el.y === y));
  foodPos.x = x;
  foodPos.y = y;
  score += 1;
};

function startGame() {
  direction = "";
  board.innerHTML = "";
  gameBoard = [];
  score = 0;

  for (let y = 0; y < GAME_SIZE; y += 1) {
    const rowEl = document.createElement("div");
    rowEl.classList.add("row");
    for (let x = 0; x < GAME_SIZE; x += 1) {
      const cellEl = document.createElement("div");
      cellEl.classList.add("cell");
      // cellEl.innerText = `${x} / ${y}`;

      if (!gameBoard[x]) {
        gameBoard[x] = [];
      }
      // gameBoard[0][0] => undefined[0] => error
      gameBoard[x][y] = cellEl;

      rowEl.append(cellEl);
    }
    board.append(rowEl);
  }

  resetSnakePosition();
  generateNewFood();

  clearInterval(gameLoop);
  gameLoop = setInterval(() => {
    calculateSnakePosition();
    updateBoard();
  }, DIFFICULTY_LOOP_MS);
}

const detectWallCollision = (pos) => {
  if (pos.x === GAME_SIZE || pos.y === GAME_SIZE || pos.x < 0 || pos.y < 0) {
    return true;
  }
  return false;
};

const collisionHandle = () => {
  Toastify({
    text: `game over with a score of ${score}`,
    duration: 5000,
  }).showToast();
  startGame();
};

const foodCollision = (pos) => pos.x === foodPos.x && pos.y === foodPos.y;

const detectSnakeOnSnakeCollision = (pos) =>
  snakePos.find((el, i) => el.x === pos.x && el.y === pos.y && i !== 0);

const calculateSnakePosition = () => {
  const lastSegmentPositon = {
    x: snakePos[snakePos.length - 1].x,
    y: snakePos[snakePos.length - 1].y,
  };

  for (let i = snakePos.length - 1; i >= 0; i -= 1) {
    const pos = snakePos[i];
    if (i === 0) {
      // snake's head
      if (direction === "up") {
        pos.y -= 1;
      }
      if (direction === "left") {
        pos.x -= 1;
      }
      if (direction === "down") {
        pos.y += 1;
      }
      if (direction === "right") {
        pos.x += 1;
      }
      lastAppliedDirection = direction;

      if (detectWallCollision(pos) || detectSnakeOnSnakeCollision(pos)) {
        collisionHandle();
        return;
      }
    } else {
      pos.x = snakePos[i - 1].x;
      pos.y = snakePos[i - 1].y;
    }

    if (foodCollision(pos)) {
      generateNewFood();
      snakePos.push(lastSegmentPositon);
    }
  }
};

const updateBoard = () => {
  gameBoard.forEach((row) => {
    row.forEach((cell) => {
      cell.classList = "cell";
    });
  });

  snakePos.forEach(({ x, y }) => {
    gameBoard[x][y].classList.add("snake");
  });

  gameBoard[foodPos.x][foodPos.y].classList.add("food");
};

window.addEventListener("load", () => {
  board = document.querySelector("#board");
  startGame();
});

document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowUp":
      if (lastAppliedDirection !== "down") direction = "up";
      break;
    case "ArrowDown":
      if (lastAppliedDirection !== "up") direction = "down";
      break;
    case "ArrowLeft":
      if (lastAppliedDirection !== "right") direction = "left";
      break;
    case "ArrowRight":
      if (lastAppliedDirection !== "left") direction = "right";
      break;
  }
});
