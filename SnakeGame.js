const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const boxSize = 40;

const canvasSize = 600;
const topPadding = 40;  // Space for the score area
const usableCanvasHeight = canvasSize - topPadding;  // Height for game area
let snake = [{ x: boxSize * 2, y: boxSize * 2 }];
let direction = 'RIGHT';
let food = { x: boxSize * 5, y: boxSize * 5 };
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0; // Load high score from localStorage
let gameStarted = false;
let gameOverFlag = false;

// Load the snake image
const snakeImg = new Image();
snakeImg.src = 'snake.png'; // Path to the snake image

// Load the food GIF
const foodGif = new Image();
foodGif.src = 'food.gif'; // Path to the food GIF

// Listen for key presses
document.addEventListener('keydown', handleKeyPress);

// Wait until the GIF is loaded before starting the game
foodGif.onload = function() {
    console.log('Food GIF loaded!');
};

// Wait until the snake image is loaded before starting the game
snakeImg.onload = function() {
    console.log('Snake image loaded!');
};

// Draw the game elements
function drawGame() {
    if (!gameStarted) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Press SPACE to Start', canvasSize / 4, canvasSize / 2);
        return;
    }

    // Clear the canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw the border on all four sides
    ctx.strokeStyle = 'black';  // Border color
    ctx.lineWidth = 4;  // Border thickness
    ctx.strokeRect(0, 0, canvasSize, canvasSize); // Draw border around the entire canvas

    // Draw the score area background
    ctx.fillStyle = '#f0f0f0'; // Light gray background for score area
    ctx.fillRect(0, 0, canvasSize, topPadding); // Draw score area at the top

    // Draw the food (GIF)
    ctx.drawImage(foodGif, food.x, food.y, boxSize, boxSize);

    // Draw the snake (using the snake image)
    for (let segment of snake) {
        ctx.drawImage(snakeImg, segment.x, segment.y, boxSize, boxSize); // Draw each segment as an image
    }

    // Move the snake
    const head = { ...snake[0] };

    switch (direction) {
        case 'UP': head.y -= boxSize; break;
        case 'DOWN': head.y += boxSize; break;
        case 'LEFT': head.x -= boxSize; break;
        case 'RIGHT': head.x += boxSize; break;
    }

    // Check if the snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize,
            y: Math.floor(Math.random() * (usableCanvasHeight / boxSize)) * boxSize + topPadding, // Ensure food stays below the score area
        };
        if (score % 5 === 0) {  // Increase the speed every 5 points
            clearInterval(gameInterval);
            gameInterval = setInterval(drawGame, Math.max(100 - score, 50)); // Minimum interval of 50ms
        }
    } else {
        snake.pop(); // Remove the tail
    }

    // Update high score if the current score is greater
    if (score > highScore) {
        highScore = score;
        // Save the new high score to localStorage
        localStorage.setItem('highScore', highScore);
    }

    // Check for collisions with boundaries and itself
    if (
        head.x < 0 || head.y < topPadding || head.x >= canvasSize || head.y >= canvasSize ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver();
        return;
    }

    snake.unshift(head); // Add the new head

    // Display the score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Display the high score on the top-right corner
    ctx.fillText(`High Score: ${highScore}`, canvasSize - 180, 30);
}

// Handle key presses
function handleKeyPress(event) {
    if (event.keyCode === 32) { // Spacebar
        if (!gameStarted && !gameOverFlag) {
            // If game has not started and game over screen is not active, start the game
            gameStarted = true;
            clearInterval(gameInterval);
            gameInterval = setInterval(drawGame, 100);
        } else if (gameOverFlag) {
            // If game is over, reset the game
            restartGame();
        }
    } else if (gameStarted) {  // Change direction only if the game is started
        const key = event.keyCode;
        if (key === 37 && direction !== 'RIGHT') direction = 'LEFT';
        if (key === 38 && direction !== 'DOWN') direction = 'UP';
        if (key === 39 && direction !== 'LEFT') direction = 'RIGHT';
        if (key === 40 && direction !== 'UP') direction = 'DOWN';
    }
}

// Game Over
function gameOver() {
    gameOverFlag = true; // Set the flag that the game is over
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText(`Game Over! Your score: ${score}`, canvasSize / 4, canvasSize / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press SPACE to Restart', canvasSize / 4, canvasSize / 2 + 40);
    clearInterval(gameInterval); // Stop the game loop
}

// Restart the game
function restartGame() {
    snake = [{ x: boxSize * 2, y: boxSize * 2 }];
    direction = 'RIGHT';
    food = { x: boxSize * 5, y: boxSize * 5 };
    score = 0;
    gameStarted = true;
    gameOverFlag = false;
    clearInterval(gameInterval);
    gameInterval = setInterval(drawGame, 100); // Start the game loop again
}

// Run the game loop
let gameInterval = setInterval(drawGame, 100);





