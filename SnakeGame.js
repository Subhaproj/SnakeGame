const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const boxSize = 40;
const canvasSize = 600;
const reservedTop = 40;  // Reserve the top 40px for the score and high score
let snake = [{ x: boxSize * 2, y: boxSize * 2 }];
let direction = 'RIGHT';
let food = { x: boxSize * 5, y: boxSize * 5 };
let score = 0;
let highScore = 0;
let gameStarted = false;
let gameOverFlag = false;

// Load the snake and food images
const snakeImg = new Image();
snakeImg.src = 'snake.png';  // Path to snake image

const foodImg = new Image();
foodImg.src = 'food.gif';  // Use a GIF for food

// Load sound effects
const eatSound = new Audio('eat.wav');
const gameOverSound = new Audio('gameover.wav');

// Listen for key presses
document.addEventListener('keydown', handleKeyPress);

// Load the high score from localStorage
if (localStorage.getItem('highScore')) {
  highScore = parseInt(localStorage.getItem('highScore'));
}

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
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, canvasSize, canvasSize);

  // Draw the food (check if it's loaded and in the right position)
  if (foodImg.complete) {
    ctx.drawImage(foodImg, food.x, food.y, boxSize, boxSize);
  } else {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
  }

  // Draw the snake
  for (let segment of snake) {
    if (snakeImg.complete) {
      ctx.drawImage(snakeImg, segment.x, segment.y, boxSize, boxSize);
    } else {
      ctx.fillStyle = 'green';
      ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    }
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
    eatSound.play();
    food = generateFood(); // Generate new food in a safe area
    if (score % 5 === 0) {  // Increase the speed every 5 points
      clearInterval(gameInterval);
      gameInterval = setInterval(drawGame, Math.max(100 - score, 50));
    }
  } else {
    snake.pop(); // Remove the tail
  }

  // Update high score if the current score is greater
  if (score > highScore) {
    highScore = score;
    // Save the high score to localStorage
    localStorage.setItem('highScore', highScore);
  }

  // Check for collisions with boundaries and itself
  if (
    head.x < 0 || head.y < reservedTop || head.x >= canvasSize || head.y >= canvasSize ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head); // Add the new head

  // Display the score
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, reservedTop - 10);

  // Display the high score on the top-right corner
  ctx.fillText(`High Score: ${highScore}`, canvasSize - 180, reservedTop - 10);
}

// Generate random food position, avoiding the top area for score
function generateFood() {
  let x, y;

  do {
    x = Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize;
    y = Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize;
  } while (y < reservedTop); // Ensure food doesn't appear in the top area

  return { x, y };
}

// Handle key presses
function handleKeyPress(event) {
  if (event.keyCode === 32) { // Spacebar
    if (!gameStarted && !gameOverFlag) {
      gameStarted = true;
      clearInterval(gameInterval);
      gameInterval = setInterval(drawGame, 100);
    } else if (gameOverFlag) {
      restartGame();
    }
  } else if (gameStarted) {
    const key = event.keyCode;
    if (key === 37 && direction !== 'RIGHT') direction = 'LEFT';
    if (key === 38 && direction !== 'DOWN') direction = 'UP';
    if (key === 39 && direction !== 'LEFT') direction = 'RIGHT';
    if (key === 40 && direction !== 'UP') direction = 'DOWN';
  }
}

// Game Over
function gameOver() {
  gameOverFlag = true;
  gameOverSound.play();
  ctx.fillStyle = 'black';
  ctx.font = '30px Arial';
  ctx.fillText(`Game Over! Your score: ${score}`, canvasSize / 4, canvasSize / 2);
  ctx.font = '20px Arial';
  ctx.fillText('Press SPACE to Restart', canvasSize / 4, canvasSize / 2 + 40);
  clearInterval(gameInterval);
}

// Restart the game
function restartGame() {
  snake = [{ x: boxSize * 2, y: boxSize * 2 }];
  direction = 'RIGHT';
  food = generateFood(); // Generate new food
  score = 0;
  gameStarted = true;
  gameOverFlag = false;
  clearInterval(gameInterval);
  gameInterval = setInterval(drawGame, 100);
}

// Run the game loop
let gameInterval = setInterval(drawGame, 100);







