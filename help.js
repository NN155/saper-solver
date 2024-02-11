let redCells = new Set();
let checkedCells = new Set();
class Cords {
    constructor(x, y, value = null) {
      this.y = y;
      this.x = x;
      this.value = value;
    }
    toString() {
        if (this.value === null) {
            return `${this.x}-${this.y}`
        }
        return `${this.x}-${this.y}-${this.value}`
    }
}

function toCords(str) {
    let lst = str.split("-");
    if (lst.length > 2) {
        return new Cords(Number(lst[0]), Number(lst[1]), Number(lst[2]))
    } 
    return new Cords(Number(lst[0]), Number(lst[1]))
}
function* getBoxHelp(xGetBoxHelp, yGetBoxHelp) { //Генератор, координатів навколо заданих координат.
    for (let i = (yGetBoxHelp === 0? 0 : yGetBoxHelp - 1); i <= (yGetBoxHelp == boardSizeY - 1? boardSizeY - 1 : yGetBoxHelp + 1); i++) {
        for (let j = (xGetBoxHelp === 0? 0 : xGetBoxHelp - 1); j <= (xGetBoxHelp == boardSizeX - 1? boardSizeX - 1 : xGetBoxHelp + 1); j++) {
            yield new Cords(j, i)
        }
    }
}
function checkRedCells (xCheckCell, yCheckCell) {
    let noVision = 0;
    let cords = []
    for (let {x, y} of getBoxHelp(xCheckCell, yCheckCell)) { //Пошук не відкритих клітинок
        let cell = boardData[y][x]
        cell.isRevealed
        if (!cell.isRevealed) {
            noVision++
            cords.push(new Cords(x, y))
        }
    }
    let cell = boardData[yCheckCell][xCheckCell]
    if (cell.adjacentBombs === noVision) {
        for (let {x, y} of cords) {
            document.getElementById(`cell-${y}-${x}`).style.backgroundColor = "red";
            redCells.add(new Cords(x, y).toString())
        }
    }
}
function checkGreenCells (xCheckCell, yCheckCell) {
    let noVision = 0;
    for (let {x, y} of getBoxHelp(xCheckCell, yCheckCell)) { //Пошук всіх червоних клітинок
            let cell = boardData[y][x]
            if (!cell.isRevealed &&  redCells.has(new Cords(x, y).toString())) {
                noVision++
            }
    }
    if (boardData[yCheckCell][xCheckCell].adjacentBombs === noVision) { 
        checkedCells.add(new Cords(xCheckCell, yCheckCell).toString())
        for (let {x, y} of getBoxHelp(xCheckCell, yCheckCell)) { //Пошук всіх решта клітинок, які не червоні і закриті.
                let cell = boardData[y][x]
                if (!cell.isRevealed && !redCells.has(new Cords(x, y).toString())) {
                document.getElementById(`cell-${y}-${x}`).style.backgroundColor = "green";
                }
            }
        }
}
function helpSaperLvl1 () { //Пошук очевидних клітинок
    for(let y = 0; y < boardData.length; y++) {
        for(let x = 0; x < boardData[y].length; x++) {
            let cell = boardData[y][x]
            if (cell.isRevealed && cell.adjacentBombs != 0 && !checkedCells.has(new Cords(x, y).toString())) { //Перевірка, чи Поле невідоме, чи не є пустим(0 мін поблизу), чи вже є попередньо перевіреним 
                checkRedCells(x,y)
                checkGreenCells(x,y)
            }
        }
    }
}
let countMini = 0
function mergeArray(array, dict) {
    function mergeMini(key) {
        for (let value of array[key]) {
            if (cash.has(value)) {
                cash.delete(value)
                mergeMini(value)
                temp.add(value)
            }
        }
    }
    let cash = new Set(dict)
    let temp;
    let merged = []
    for (let key in array) {
        temp = new Set();
        if (cash.has(key)) {
                mergeMini(key)
                merged.push(temp)
        }
    }
    return merged;
}

function arraySplit(array) {
    let splited = {}
    for (let cords of array) { //Перебір всіх жовтих клітинок
        let cord = toCords(cords)
        let cash = new Set()
        for (let {x, y} of getBoxHelp(cord.x, cord.y)) { //Пошук чи межує жовта клітинка з іншими
            if (array.has(new Cords(x, y).toString())) {   
                cash.add(new Cords(x, y).toString())
            }
        }
        splited[cord] = cash
    }
    return splited;
}
function yellowCell(xCheckCell, yCheckCell) {
    for (let {x, y} of getBoxHelp(xCheckCell, yCheckCell)) { //Пошук всіх відомих клітинок
        let cell = boardData[y][x];
        if (!cell.isRevealed && !redCells.has(new Cords(x, y).toString())) {
            yellowCheck.add(new Cords(x,y).toString())
            orangeCheck.add(new Cords(xCheckCell,yCheckCell).toString())
            document.getElementById(`cell-${y}-${x}`).style.backgroundColor = "yellow"
            document.getElementById(`cell-${yCheckCell}-${xCheckCell}`).style.backgroundColor = "orange"
        }
    }
}
function yellowArray(xCheckCell, yCheckCell) {
    for (let {x, y} of getBoxHelp(xCheckCell, yCheckCell)) { //Пошук всіх відомих клітинок
        let cell = boardData[y][x];
        if (cell.isRevealed) {
            yellowCell(xCheckCell, yCheckCell)
        }
    }
}
let connectArray;
function connect() {
    connectArray = []
    if (yellowSplitedArrays.length == 1) {
        connectArray.push({"yellow": yellowSplitedArrays[0], "orange": orangeSplitedSArrays[0]})
        return null;
    }
    for (let cells of yellowSplitedArrays) {
        let cellsLst = Array.from(cells);
        let cord = toCords(cellsLst[0])
        for (let {x, y} of getBoxHelp(cord.x, cord.y)) {
            let tempBreak = false;
            for (let cords of orangeSplitedSArrays) {
                if (cords.has(new Cords(x, y).toString())) {
                    connectArray.push({"yellow": cells, "orange": cords})
                    tempBreak = true
                    break;
                }
            }
            if (tempBreak) {
                break;
            }
        }
    }
}
function orangeCordsUpdate() { //Обновити Оранжеві клітинки
    let copySet;
    let newSet;
    let bombs;
    for (let dict of connectArray) {
        copySet = new Set(dict["orange"])
        newSet = new Set();
        bombs = 0; 
        for (let cell of copySet) {
            cell = toCords(cell)
            value = boardData[cell.y][cell.x].adjacentBombs
            for (let cord of getBoxHelp(cell.x, cell.y)) { 
                if (redCells.has(cord.toString())) {
                    value -= 1;
                }
            }
            bombs += value
            cell = new Cords(cell.x, cell.y, value)
            newSet.add(cell.toString())
        }
        dict["orange"] = newSet;
        dict["bombs"] = bombs
    }
}
let connectRandom;
function allVariants() {
    connectRandom = []
    function decimalToBinaryArray(decimalNumber) {
        const binaryString = (decimalNumber >>> 0).toString(2);
        return binaryString.split('').map(Number);
    }
    function checkMax(array, max) {
        let count = 0;
        for (let i of array) {
            count += i
        }
        if (count > max) {
            console.log(count.max)
            return false
        }
        return true
    }
    function generateBinaryArrays(n, max) {
        const binaryArrays = [];
        for (let i = 0; i <= n; i++) {
            let temp = decimalToBinaryArray(i)
            if (checkMax(temp, max)) {
            binaryArrays.push(decimalToBinaryArray(i));
            }
        }
        return binaryArrays;
    }
    
    let bombs;
    let len;
    for (let dict of connectArray) {
        bombs = dict.bombs
        len = dict.yellow.size
        let array = generateBinaryArrays(2 ** (len + 1) - 1);
        connectRandom.push(array)
    }
}
function filterConnectArray() { //Кинув тут
    for (let dict of connectArray) {
        let mySet = dict.orange;
        for(let cell of mySet) {
            //cell //Кинув тут
        }
    }
}
let yellowCheck;
let yellowSplitedArrays;
let orangeSplitedSArrays;
let orangeCheck = new Set();
function helpSaperLvl2() { //Пошук перебором всіх можливих варіантів
    for (let cords of orangeCheck) {
        let {x, y} = toCords(cords)
        document.getElementById(`cell-${y}-${x}`).style.backgroundColor = "rgb(221, 221, 221)"

    }
    yellowCheck = new Set();
    orangeCheck = new Set();
    for(let y = 0; y < boardSizeY; y++) {
        for(let x = 0; x < boardSizeX; x++) {
            let cell = boardData[y][x]
            if (cell.isRevealed && cell.adjacentBombs != 0 && !checkedCells.has(new Cords(x, y).toString())) {
                yellowArray(x, y)
            }
        }
    }
    let yellowSplited = arraySplit(yellowCheck)
    yellowSplitedArrays = mergeArray(yellowSplited, yellowCheck)
    let orangeSplited = arraySplit(orangeCheck)
    orangeSplitedSArrays = mergeArray(orangeSplited, orangeCheck)
    connect()
    orangeCordsUpdate()
    allVariants()
}