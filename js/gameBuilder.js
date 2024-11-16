const playerXInput = document.getElementById("player-x");
const playerOInput = document.getElementById("player-o");
const boardSizeSelect = document.getElementById("board-size");
const startButton = document.getElementById("start-game");
const gameBoard = document.getElementById("game-board");
const statusText = document.getElementById("status");
const winMessage = document.getElementById("winner");

let board = [];
let currentPlayer = "X";
let playerXName = "Player X";
let playerOName = "Player O";
let boardSize = 3;
let gameActive = false;

// Update player names dynamically
function updatePlayerNames() {
	playerXName = playerXInput.value || playerXInput.placeholder;
	playerOName = playerOInput.value || playerOInput.placeholder;
	updateStatusText();
}

// Update status text
function updateStatusText() {
	const currentPlayerName = currentPlayer === "X" ? playerXName : playerOName;
	statusText.textContent = gameActive ? `${currentPlayerName}'s turn!` : `${playerXName} goes first!`;
}

// Handle start/restart game button
startButton.addEventListener("click", () => {
	boardSize = parseInt(boardSizeSelect.value);
	resetGame();
	// Change button text after game starts
	startButton.textContent = "Restart";
});

// Initialize board
function createBoard(size) {

	// Clear previous board
	gameBoard.innerHTML = "";

	// Reset board array
	board = Array(size).fill().map(() => Array(size).fill(null));

	// Set grid layout for selected board size
	gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
	gameBoard.style.gridTemplateRows = `repeat(${size}, 1fr)`;

	// Create cells for new board
	for (let row = 0; row < size; row++) {
		for (let col = 0; col < size; col++) {
			const cell = document.createElement("div");
			cell.classList.add("cell");
			cell.dataset.row = row;
			cell.dataset.col = col;
			cell.addEventListener("click", handleCellClick);
			gameBoard.appendChild(cell);
		}
	}
}

// Handle cell click events
function handleCellClick(e) {
	if (!gameActive) return;

	const row = parseInt(e.target.dataset.row);
	const col = parseInt(e.target.dataset.col);

	if (board[row][col]) return; // Cell already filled

	// Make the play
	board[row][col] = currentPlayer;

	// Display current player symbol and color
	e.target.textContent = currentPlayer;
	e.target.style.color = currentPlayer === "X" ? "firebrick" : "royalblue";

	// Check for outcomes
	if (checkVictory(row, col)) {
		endGame(true); // Victory
	} else if (board.flat().every(cell => cell !== null)) {
		endGame(false); // Draw
	} else {
		switchPlayer();
	}
}

// Switch to next player and update status text
function switchPlayer() {
	currentPlayer = currentPlayer === "X" ? "O" : "X";
	updateStatusText();
}

// End game and display result
function endGame(victory) {
	gameActive = false;
	if (victory) {
		winMessage.style.display = "block";
		statusText.textContent = `${currentPlayer === "X" ? playerXName : playerOName} wins!`;

		// Change highlight according to winner; box-shadow inherits from color property
		if (currentPlayer === "X") {
			winMessage.style.color = "firebrick"; // Player X's
		} else {
			winMessage.style.color = "royalblue"; // Player O's
		}
	} else {
		winMessage.removeAttribute("style");
		statusText.textContent = "You're both losers!";
	}
	startButton.textContent = "Restart";
}

// Check if current player wins
function checkVictory(row, col) {
	return checkRow(row) || checkColumn(col) || checkDiagonalDown() || checkDiagonalUp();
}

// Check current row
function checkRow(row) {
	return board[row].every(cell => cell === currentPlayer);
}

// Check current column
function checkColumn(col) {
	return board.every(row => row[col] === currentPlayer);
}

// Check downward diagonal
function checkDiagonalDown() {
	return board.every((row, idx) => row[idx] === currentPlayer);
}

// Check upward diagonal
function checkDiagonalUp() {
	return board.every((row, idx) => row[boardSize - 1 - idx] === currentPlayer);
}

// Reset game state
function resetGame() {
	gameActive = true;
	currentPlayer = "X";
	updateStatusText();
	createBoard(boardSize);
	winMessage.removeAttribute("style");
}

// Initialize page with initial status
window.addEventListener("load", updatePlayerNames);
playerXInput.addEventListener("input", updatePlayerNames);
playerOInput.addEventListener("input", updatePlayerNames);
