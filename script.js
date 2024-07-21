let currentDifficulty = 'easy'; // Track the current difficulty level

function startGame(difficulty) {
    currentDifficulty = difficulty;
    closePopup('popup-game-over');
    closePopup('popup-game-won');
    const gameContainer = document.getElementById('game');
    gameContainer.innerHTML = '';

    let rows, cols, mines;
    if (difficulty === 'easy') {
        rows = 9;
        cols = 9;
        mines = 20;
    } else if (difficulty === 'medium') {
        rows = 10;
        cols = 12;
        mines = 40;
    } else if (difficulty === 'hard') {
        rows = 12;
        cols = 14;
        mines = 80;
    }

    const grid = createGrid(rows, cols);
    placeMines(grid, mines);

    renderGrid(gameContainer, grid, rows, cols);
}

function startCustomGame() {
    console.log("Start Custom Game Clicked"); // Debugging line
    const rows = parseInt(document.getElementById('custom-rows').value);
    const cols = parseInt(document.getElementById('custom-cols').value);
    const mines = parseInt(document.getElementById('custom-mines').value);
    const gameContainer = document.getElementById('game');
    gameContainer.innerHTML = '';

    const grid = createGrid(rows, cols);
    placeMines(grid, mines);

    renderGrid(gameContainer, grid, rows, cols);
    closeCustomOptions();
}

function createGrid(rows, cols) {
    const grid = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push({ mine: false, revealed: false, flagged: false, adjacentMines: 0 });
        }
        grid.push(row);
    }
    return grid;
}

function placeMines(grid, mines) {
    let placedMines = 0;
    const rows = grid.length;
    const cols = grid[0].length;

    while (placedMines < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        if (!grid[r][c].mine) {
            grid[r][c].mine = true;
            placedMines++;
            updateAdjacentCells(grid, r, c);
        }
    }
}

function updateAdjacentCells(grid, row, col) {
    const rows = grid.length;
    const cols = grid[0].length;

    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < rows && c >= 0 && c < cols && !(r === row && c === col)) {
                grid[r][c].adjacentMines++;
            }
        }
    }
}

function renderGrid(container, grid, rows, cols) {
    const table = document.createElement('table');
    grid.forEach((row, r) => {
        const tr = document.createElement('tr');
        row.forEach((cell, c) => {
            const td = document.createElement('td');
            td.addEventListener('click', () => revealCell(grid, r, c, rows, cols));
            td.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleFlag(grid, r, c);
            });
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    container.appendChild(table);
}

function revealCell(grid, row, col, rows, cols) {
    const cell = grid[row][col];
    if (cell.revealed || cell.flagged) return;

    cell.revealed = true;
    const td = document.querySelector(`tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
    td.classList.add('revealed');
    if (cell.mine) {
        td.classList.add('mine');
        showPopup('popup-game-over', 'Game Over!');
    } else {
        td.textContent = cell.adjacentMines > 0 ? cell.adjacentMines : '';
        if (cell.adjacentMines === 0) {
            revealAdjacentCells(grid, row, col);
        }
    }

    // Check if the game is won
    if (checkWin(grid, rows, cols)) {
        showPopup('popup-game-won', 'You Won!');
    }
}

function toggleFlag(grid, row, col) {
    const cell = grid[row][col];
    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    const td = document.querySelector(`tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
    td.classList.toggle('flagged');
}

function revealAdjacentCells(grid, row, col) {
    const rows = grid.length;
    const cols = grid[0].length;

    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < rows && c >= 0 && c < cols && !(r === row && c === col)) {
                revealCell(grid, r, c, rows, cols);
            }
        }
    }
}

function checkWin(grid, rows, cols) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!grid[r][c].mine && !grid[r][c].revealed) {
                return false;
            }
        }
    }
    return true;
}

function showPopup(popupId, message) {
    const popup = document.getElementById(popupId);
    const popupContent = popup.querySelector('.popup-content p');
    popupContent.textContent = message;
    popup.style.display = 'flex';
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    popup.style.display = 'none';
}

function restartGame() {
    closePopup('popup-game-over');
    closePopup('popup-game-won');
    startGame(currentDifficulty); // Restart the current difficulty game
}

function showCustomOptions() {
    console.log("Custom Options Button Clicked"); // Debugging line
    document.getElementById('custom-options').classList.remove('hidden');
}

function closeCustomOptions() {
    document.getElementById('custom-options').classList.add('hidden');
}

function toggleMode() {
    document.body.classList.toggle('dark-mode');
    const button = document.getElementById('switch-mode');
    button.textContent = document.body.classList.contains('dark-mode') ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}
