document.addEventListener('DOMContentLoaded', () => {
    const board = Array(9).fill(null);
    let currentPlayer = 'X'; // Human is X, AI is O
    let gameActive = true;
    let scores = { player: 0, ai: 0, draws: 0 };

    // Winning conditions
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    // Initialize the board
    function initializeBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }

    // Handle player move
    function handleCellClick(e) {
        const cellIndex = parseInt(e.target.getAttribute('data-index'));
        
        if (board[cellIndex] !== null || !gameActive) return;
        
        makeMove(cellIndex, currentPlayer);
        
        if (checkWinner()) return;
        if (checkDraw()) return;
        
        // Switch to AI's turn
        currentPlayer = 'O';
        statusDisplay.textContent = "AI is thinking...";
        
        setTimeout(() => {
            aiMove();
            currentPlayer = 'X';
            statusDisplay.textContent = "Your turn (X)";
        }, 500);
    }

    // Make a move on the board
    function makeMove(index, player) {
        board[index] = player;
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase()); // Add class for color
    }

    // Check for a winner
    function checkWinner() {
        for (const condition of winConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                gameActive = false;
                highlightWinningCells(condition);
                
                if (board[a] === 'X') {
                    scores.player++;
                    statusDisplay.textContent = "You win!";
                } else {
                    scores.ai++;
                    statusDisplay.textContent = "AI wins!";
                }
                updateScores();
                return true;
            }
        }
        return false;
    }

    // Highlight winning cells
    function highlightWinningCells(cells) {
        cells.forEach(index => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            cell.classList.add('winning-cell');
        });
    }

    // Check for a draw
    function checkDraw() {
        if (board.every(cell => cell !== null)) {
            gameActive = false;
            scores.draws++;
            statusDisplay.textContent = "It's a draw!";
            updateScores();
            return true;
        }
        return false;
    }

    // AI move using Minimax
    function aiMove() {
        let bestScore = -Infinity;
        let bestMove;
        
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                const score = minimax(board, 0, false);
                board[i] = null;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        makeMove(bestMove, 'O');
        checkWinner();
        checkDraw();
    }

    // Minimax algorithm
    function minimax(board, depth, isMaximizing) {
        if (checkWinnerForMinimax('O')) return 10 - depth;
        if (checkWinnerForMinimax('X')) return depth - 10;
        if (board.every(cell => cell !== null)) return 0;
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = 'O';
                    const score = minimax(board, depth + 1, false);
                    board[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = 'X';
                    const score = minimax(board, depth + 1, true);
                    board[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    // Helper function for Minimax
    function checkWinnerForMinimax(player) {
        for (const condition of winConditions) {
            const [a, b, c] = condition;
            if (board[a] === player && board[b] === player && board[c] === player) {
                return true;
            }
        }
        return false;
    }

    // Update score display
    function updateScores() {
        document.getElementById('player-score').textContent = scores.player;
        document.getElementById('ai-score').textContent = scores.ai;
        document.getElementById('draw-score').textContent = scores.draws;
    }

    // Reset the game
    function resetGame() {
        board.fill(null);
        gameActive = true;
        currentPlayer = 'X';
        statusDisplay.textContent = "Your turn (X)";
        initializeBoard();
        
        // Remove winning highlights
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('winning-cell', 'x', 'o');
            cell.textContent = '';
        });
    }

    // DOM elements
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('reset');

    // Event listeners
    resetButton.addEventListener('click', resetGame);

    // Initialize the game
    initializeBoard();
    updateScores();
});
