const gameContainer = document.getElementById('gameContainer');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives'); 
const boxSize = 20;
let snake = [{ x: 9 * boxSize, y: 9 * boxSize }];
let direction = { x: 0, y: 0 };
let food = {};
let score = 0;
let lives = 3; 
let speed = 100; 
let cacti = [];
const maxCacti = 3; 

// Função para mostrar o modal
function showModal(message) {
    const modalMessage = document.getElementById('modalMessage');
    const modal = document.getElementById('modal');
    modalMessage.textContent = message;
    modal.style.display = 'block'; // Exibe o modal
}

// Função para esconder o modal
function hideModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none'; // Esconde o modal
}

// Função para criar comida
function createFood() {
    do {
        food.x = Math.floor(Math.random() * (gameContainer.offsetWidth / boxSize)) * boxSize;
        food.y = Math.floor(Math.random() * (gameContainer.offsetHeight / boxSize)) * boxSize;
    } while (snake.some(part => part.x === food.x && part.y === food.y) || cacti.some(cactus => cactus.x === food.x && cactus.y === food.y));
}

// Função para desenhar a comida
function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.className = 'food';
    foodElement.style.width = boxSize + 'px';
    foodElement.style.height = boxSize + 'px';
    foodElement.style.left = food.x + 'px';
    foodElement.style.top = food.y + 'px';
    gameContainer.appendChild(foodElement);
}

// Função para criar e desenhar cactos
function createCactus() {
    if (cacti.length < maxCacti) {
        const cactus = {
            x: Math.floor(Math.random() * (gameContainer.offsetWidth / boxSize)) * boxSize,
            y: Math.floor(Math.random() * (gameContainer.offsetHeight / boxSize)) * boxSize,
        };

        if (!snake.some(part => part.x === cactus.x && part.y === cactus.y) &&
            !cacti.some(c => c.x === cactus.x && c.y === cactus.y)) {
            cacti.push(cactus);
        }
    }
}

// Função para desenhar cactos
function drawCacti() {
    cacti.forEach(cactus => {
        const cactusElement = document.createElement('div');
        cactusElement.className = 'cactus';
        cactusElement.style.left = cactus.x + 'px';
        cactusElement.style.top = cactus.y + 'px';
        gameContainer.appendChild(cactusElement);
    });
}

// Função para desenhar a cobra
function drawSnake() {
    gameContainer.innerHTML = ''; // Limpa a tela
    snake.forEach(part => {
        const snakeElement = document.createElement('div');
        snakeElement.className = 'snake';
        snakeElement.style.width = boxSize + 'px';
        snakeElement.style.height = boxSize + 'px';
        snakeElement.style.left = part.x + 'px';
        snakeElement.style.top = part.y + 'px';
        gameContainer.appendChild(snakeElement);
    });
    drawFood(); // Desenha a comida
    drawCacti(); // Desenha os cactos
    scoreElement.textContent = `Score: ${score}`;
    livesElement.textContent = `Vidas: ${lives}`;
}

// Função para atualizar o estado do jogo
function update() {
    const head = { x: snake[0].x + direction.x * boxSize, y: snake[0].y + direction.y * boxSize };

    // Verifica colisão com bordas
    if (head.x < 0 || head.x >= gameContainer.offsetWidth || head.y < 0 || head.y >= gameContainer.offsetHeight) {
        lives--;
        if (lives === 0) {
            showModal("Game Over! Você perdeu todas as vidas.");
            resetGame();
            return;
        } else {
            showModal("Você bateu na borda! Perdeu uma vida.");
            resetSnake();
            return;
        }
    }

    // Verifica colisão com a cobra
    if (snake.some((part, index) => index !== 0 && part.x === head.x && part.y === head.y)) {
        lives--;
        if (lives === 0) {
            showModal("Game Over! Você perdeu todas as vidas.");
            resetGame();
            return;
        } else {
            showModal("Você bateu na cobra! Perdeu uma vida.");
            resetSnake();
            return;
        }
    }

    // Verifica colisão com cactos
    if (cacti.some(cactus => cactus.x === head.x && cactus.y === head.y)) {
        lives--;
        if (lives === 0) {
            showModal("Game Over! Você perdeu todas as vidas.");
            resetGame();
            return;
        } else {
            showModal("Você bateu em um cacto! Perdeu uma vida.");
            resetSnake();
            return;
        }
    }

    // Verifica se comeu comida
    if (head.x === food.x && head.y === food.y) {
        score++;
        snake.unshift(head); // Adiciona a nova cabeça
        createFood(); // Cria novo alimento
    } else {
        snake.unshift(head); // Adiciona a nova cabeça
        snake.pop(); // Remove a cauda
    }

    drawSnake();
}

// Função para mudar a direção
function changeDirection(event) {
    event.preventDefault(); // Evita que a página se mova
    switch(event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
}

// Função para reiniciar a cobra
function resetSnake() {
    snake = [{ x: 9 * boxSize, y: 9 * boxSize }];
    direction = { x: 0, y: 0 };
    drawSnake();
}

// Função para reiniciar o jogo
function resetGame() {
    score = 0;
    lives = 3;
    cacti = []; // Reseta os cactos
    resetSnake();
    createFood();
    hideModal(); // Esconde o modal ao reiniciar
}

// Função principal do jogo
function gameLoop() {
    update();
    speed = Math.max(50, 100 - score * 5); // Aumenta a velocidade conforme o score
    if (Math.random() < 0.1) { // Chance de 10% de criar um novo cacto a cada iteração
        createCactus();
    }
    setTimeout(gameLoop, speed);
}

// Inicia o jogo
document.addEventListener('keydown', changeDirection);
document.getElementById('restartBtn').addEventListener('click', function() {
    hideModal();
    resetGame();
});
createFood();
gameLoop();
