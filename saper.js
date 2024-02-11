const bombCount = 20;
const board = document.getElementById("board");
let boardData = [];
const boardSizeX = 10;
const boardSizeY = 10;
document.getElementById('board').style.gridTemplateColumns = `repeat(${boardSizeX}, 30px)`;

function checkArray(array, element) {
    return array.some(subArray => JSON.stringify(subArray) === JSON.stringify(element)) 
}

function getBox(x, y) {
    let box = []
    for (let i = y === 0? 0 : y - 1; i <= (y == boardSizeY - 1? boardSizeY - 1: y + 1); i++) {
        for (let j = x === 0? 0 : x - 1; j <= (x == boardSizeX - 1? boardSizeX - 1 : x + 1); j++) {
            box.push([i, j]);
        }
    }
    return box;
}  
function initializeBoard() {
    // Create an empty board
    for (let i = 0; i < boardSizeY; i++) {
      boardData[i] = [];
      for (let j = 0; j < boardSizeX; j++) {
        boardData[i][j] = { isBomb: false, isRevealed: false, adjacentBombs: 0 };
      }
    }
}
function initializeBomb(x, y) {
    let box = getBox(x, y);
    // Place bombs randomly
    for (let i = 0; i < bombCount; i++) {   
        let x, y;
        do {
            y = Math.floor(Math.random() * boardSizeX);
            x = Math.floor(Math.random() * boardSizeY);
        } while (boardData[x][y].isBomb || checkArray(box, [y, x]));
        boardData[x][y].isBomb = true;
    }
    // Calculate adjacent bombs
    for (let i = 0; i < boardSizeY; i++) {
        for (let j = 0; j < boardSizeX; j++) {
            if (!boardData[i][j].isBomb) {
                boardData[i][j].adjacentBombs = countAdjacentBombs(i, j);
            }
        }
    }
}
function countAdjacentBombs(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newX = x + i;
        const newY = y + j;
        if (newX >= 0 && newX < boardSizeY && newY >= 0 && newY < boardSizeX && boardData[newX][newY].isBomb) {
          count++;
        }
      }
    }
    return count;
}
let firstCell = true
function revealCell(x, y) { //Перевірка ,коли нажати на клітинку
    if (firstCell) {
        firstCell = false;
        initializeBomb(x, y)
    }
    if (x < 0 || x >= boardSizeX || y < 0 || y >= boardSizeY || boardData[x][y].isRevealed) {
      return;
    }

    boardData[x][y].isRevealed = true;
    const cell = document.getElementById(`cell-${x}-${y}`);
    cell.innerHTML = boardData[x][y].isBomb ? '💣' : boardData[x][y].adjacentBombs;
    cell.style.backgroundColor = boardData[x][y].isBomb ? 'red' : '#ddd';

    if (boardData[x][y].isBomb) {
      // Game over
      alert('Game Over!');
    } else if (boardData[x][y].adjacentBombs === 0) {
      // Continue revealing adjacent cells if no bombs nearby
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          revealCell(x + i, y + j);
        }
      }
    }
}
  
function createBoard() {
    initializeBoard();
    for (let i = 0; i < boardSizeY; i++) {
      for (let j = 0; j < boardSizeX; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${i}-${j}`;
        cell.addEventListener('click', () => revealCell(i, j));
        board.appendChild(cell);
      }
    }
}
createBoard();
