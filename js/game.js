// Variables parameters to change
var rows = 24;
var cols = 24;
var playing = false;
var grid = new Array(rows);
var nextGrid = new Array(rows);
var timer;
var reproductionTime = 100;

/**
 * Initialize game of life
 */
function init() {
    create();
    initGrids();
    resetGrids();
    setControlBtn();
}

/**
 * Create game board
 */
function create() {
    let grid = document.getElementById("grid");
    let table = document.createElement("table");

    for (var i = 0; i < rows; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = clickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }

    grid.appendChild(table);
}


/**
 * Initialize grids
 */
function initGrids() {
    for (var i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

/**
 * Reset grids to 0
 */
function resetGrids() {
    for (var i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

/**
 * Copy the grid and reset
 */
function copyAndResetGrid() {
    for (var i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

/**
 * Click handler 
 */
function clickHandler() {
    let rowcol = this.id.split("_");
    let row = rowcol[0];
    let col = rowcol[1];
    let classes = this.getAttribute("class");

    // Get old state and switch state
    classes.indexOf("live") > -1 ? this.setAttribute("class", "dead") : this.setAttribute("class", "live");
    grid[row][col] = classes.indexOf("live") > -1 ? 0 : 1;
}

/**
 * Update view game
 */
function updateView() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = document.getElementById(i + "_" + j);
            grid[i][j] == 0 ? cell.setAttribute("class", "dead") : cell.setAttribute("class", "live");
        }
    }
}

/**
 * Set buttons actions
 */
function setControlBtn() {
    // Btn start
    var startBtn = document.getElementById("start");
    startBtn.onclick = startBtnHandler;
    // Btn clear
    var clearBtn = document.getElementById("clear");
    clearBtn.onclick = clearBtnHandler;
}

/**
 * Event clear button
 */
function clearBtnHandler() {
    let startBtn = document.getElementById("start");
    let cellList = document.getElementsByClassName("live");
    let cells = [];

    startBtn.innerHTML = "start";
    playing = false;

    clearTimeout(timer);

    for (var i = 0; i < cellList.length; i++) {
        cells.push(cellList[i]);
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    resetGrids();
}


/**
 * Click start button
 */
function startBtnHandler() {
    if (playing) {
        playing = false;
        this.innerHTML = "continue";
        clearTimeout(timer);
    } else {
        playing = true;
        this.innerHTML = "pause";
        play();
    }
}

/**
 * playing game
 */
function play() {
    computeNextGeneration();
    // Deploy loop generation
    if (playing) timer = setTimeout(play, reproductionTime);
}

/**
 * Compute result for next generation
 */
function computeNextGeneration() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    copyAndResetGrid();
    updateView();
}


/**
 * Apply rule game of life
 */
function applyRules(row, col) {
    let numNeighbors = countNeighbors(row, col);

    if (grid[row][col] == 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if ([2, 3].includes(numNeighbors)) {
            nextGrid[row][col] = 1;
        } else {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
        if (numNeighbors == 3) {
            nextGrid[row][col] = 1;
        }
    }
}

/**
 * Count neighbor of cell
 */
function countNeighbors(row, col) {
    var count = 0;
    if (row - 1 >= 0) {
        if (grid[row - 1][col] == 1) count++;
    }
    if (row - 1 >= 0 && col - 1 >= 0) {
        if (grid[row - 1][col - 1] == 1) count++;
    }
    if (row - 1 >= 0 && col + 1 < cols) {
        if (grid[row - 1][col + 1] == 1) count++;
    }
    if (col - 1 >= 0) {
        if (grid[row][col - 1] == 1) count++;
    }
    if (col + 1 < cols) {
        if (grid[row][col + 1] == 1) count++;
    }
    if (row + 1 < rows) {
        if (grid[row + 1][col] == 1) count++;
    }
    if (row + 1 < rows && col - 1 >= 0) {
        if (grid[row + 1][col - 1] == 1) count++;
    }
    if (row + 1 < rows && col + 1 < cols) {
        if (grid[row + 1][col + 1] == 1) count++;
    }
    return count;
}

// Start event 
window.onload = init();