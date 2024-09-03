document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startGame');
    const gameCanvas = document.getElementById('gameCanvas');
    const introScreen = document.getElementById('introScreen');
    const startGameButton = document.getElementById('startGameButton');

    // Inicializa o estado da página
    introScreen.classList.add('hidden'); // Oculta a tela de introdução inicialmente
    gameCanvas.style.display = 'none'; // Inicialmente oculta o canvas do jogo
    startButton.style.display = 'block'; // Garante que o botão START esteja visível

    // Adiciona um evento de clique ao botão START
    startButton.addEventListener('click', function() {
        startButton.classList.add('clicked'); // Adiciona a classe de clique para animação
        setTimeout(() => {
            startButton.style.display = 'none'; // Esconde o botão START
            introScreen.classList.remove('hidden'); // Mostra a tela de introdução com transição
            introScreen.classList.add('visible');
        }, 300); // Tempo para animação do botão
    });

    // Adiciona um evento de clique ao botão OK na tela de introdução
    startGameButton.addEventListener('click', function() {
        introScreen.classList.remove('visible'); // Remove a classe de visibilidade com transição
        introScreen.classList.add('hidden');
        setTimeout(() => {
            introScreen.style.display = 'none'; // Esconde a tela de introdução
            gameCanvas.style.display = 'block'; // Mostra o canvas do jogo
            startGame(); // Inicia o jogo
        }, 500); // Tempo suficiente para garantir que a tela de introdução esteja oculta
    });

    function startGame() {
        const ctx = gameCanvas.getContext('2d');
        const backgroundImage = new Image();
        backgroundImage.src = 'images/background.png'; // Substitua pelo caminho da sua imagem

        let img = new Image();
        img.src = 'images/brush.png';

        let basket = {
            x: gameCanvas.width / 2 - 35,
            y: gameCanvas.height - 50,
            width: 70,
            height: 40,
            dx: 5
        };

        let foods = [];
        let hazards = []; // Bolinhas que tiram vida
        let foodSpeed = 2;
        let hazardSpeed = 3;
        let score = 0;
        let lives = 3; // Número inicial de vidas
        let gameOver = false;

        let rightPressed = false;
        let leftPressed = false;

        function drawBackground() {
            const canvasAspectRatio = gameCanvas.width / gameCanvas.height;
            const imageAspectRatio = backgroundImage.width / backgroundImage.height;
            
            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasAspectRatio > imageAspectRatio) {
                drawWidth = gameCanvas.width;
                drawHeight = gameCanvas.width / imageAspectRatio;
                offsetX = 0;
                offsetY = (gameCanvas.height - drawHeight) / 2;
            } else {
                drawHeight = gameCanvas.height;
                drawWidth = gameCanvas.height * imageAspectRatio;
                offsetX = (gameCanvas.width - drawWidth) / 2;
                offsetY = 0;
            }

            ctx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);
        }

        function drawOverlay() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Ajuste a opacidade para escurecer o fundo
            ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        }

        function checkCollision(obj1, obj2) {
            let dx = obj1.x - obj2.x;
            let dy = obj1.y - obj2.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
        
            return distance < obj1.radius + obj2.radius;
        }

        function drawBasket() {
            ctx.fillStyle = "#0095DD";
            ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
        }

        function drawFood(food) {
            ctx.beginPath();
            ctx.arc(food.x, food.y, food.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#FF6347";
            ctx.fill();
            ctx.closePath();
        }

        function drawHazard(hazard) {
            ctx.beginPath();
            ctx.arc(hazard.x, hazard.y, hazard.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#FF0000"; // Cor das bolinhas que tiram vida
            ctx.fill();
            ctx.closePath();
        }

        function drawScore() {
            ctx.drawImage(img, -1, -5, 200, 60); // Desenha a imagem como fundo
            ctx.fillStyle = "#ffffff"; // Cor do texto
            ctx.font = "bold 20px 'Righteous', sans-serif";
            ctx.fillText("Pontuação: " + score, 30, 30);
        }
        
        function drawLives() {
            ctx.drawImage(img, gameCanvas.width - 165, -5, 160, 60); // Desenha a imagem como fundo
            ctx.fillStyle = "#ffffff"; // Cor do texto
            ctx.font = "bold 20px 'Righteous', sans-serif";
            ctx.fillText("Vidas: " + lives, gameCanvas.width - 130, 30);
        }
        
        function moveBasket() {
            if (rightPressed && basket.x + basket.width < gameCanvas.width) {
                basket.x += basket.dx;
            } else if (leftPressed && basket.x > 0) {
                basket.x -= basket.dx;
            }
        }

        function createFood() {
            let food;
            let isOverlapping;
        
            do {
                let x = Math.random() * (gameCanvas.width - 30) + 15;
                food = {
                    x: x,
                    y: 0,
                    radius: 15
                };
        
                isOverlapping = foods.some(existingFood => checkCollision(food, existingFood)) ||
                                hazards.some(existingHazard => checkCollision(food, existingHazard));
            } while (isOverlapping);
        
            foods.push(food);
        }
        
        function createHazard() {
            let hazard;
            let isOverlapping;
        
            do {
                let x = Math.random() * (gameCanvas.width - 30) + 15;
                hazard = {
                    x: x,
                    y: 0,
                    radius: 15
                };
        
                isOverlapping = hazards.some(existingHazard => checkCollision(hazard, existingHazard)) ||
                                foods.some(existingFood => checkCollision(hazard, existingFood));
            } while (isOverlapping);
        
            hazards.push(hazard);
        }
        
        function updateFood() {
            foods.forEach((food, index) => {
                food.y += foodSpeed;
                
                if (food.y > gameCanvas.height) {
                    foods.splice(index, 1);
                }

                if (food.y + food.radius > basket.y && 
                    food.x > basket.x && food.x < basket.x + basket.width) {
                    foods.splice(index, 1);
                    score++;
                }
            });
        }

        function updateHazards() {
            hazards.forEach((hazard, index) => {
                hazard.y += hazardSpeed;

                if (hazard.y > gameCanvas.height) {
                    hazards.splice(index, 1);
                }

                if (hazard.y + hazard.radius > basket.y && 
                    hazard.x > basket.x && hazard.x < basket.x + basket.width) {
                    hazards.splice(index, 1);
                    lives--;
                    if (lives <= 0) {
                        gameOver = true;
                    }
                }
            });
        }

        function draw() {
            if (gameOver) {
                ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
                ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
                ctx.fillStyle = "#ffffff";
                ctx.font = "50px 'Righteous', sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("Game Over", gameCanvas.width / 2, gameCanvas.height / 2);
                return;
            }

            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            drawBackground();
            drawOverlay(); // Adiciona a sobreposição escura
            drawBasket();
           
            foods.forEach(drawFood);
            hazards.forEach(drawHazard);
            drawScore();
            drawLives();
        }

        function update() {
            if (gameOver) return;

            moveBasket();
            updateFood();
            updateHazards();
        }

        function gameLoop() {
            draw();
            update();
            if (!gameOver) {
                if (Math.random() < 0.02) createFood();
                if (Math.random() < 0.01) createHazard();
                requestAnimationFrame(gameLoop);
            }
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Right' || e.key === 'ArrowRight') {
                rightPressed = true;
            } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                leftPressed = true;
            }
        });

        document.addEventListener('keyup', function(e) {
            if (e.key === 'Right' || e.key === 'ArrowRight') {
                rightPressed = false;
            } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                leftPressed = false;
            }
        });

        gameLoop(); // Inicia o loop do jogo
    }
});
