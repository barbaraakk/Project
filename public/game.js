document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startGame');
    const gameCanvas = document.getElementById('gameCanvas');
    const introScreen = document.getElementById('introScreen');
    const startGameButton = document.getElementById('startGameButton');

    introScreen.classList.add('hidden');
    gameCanvas.style.display = 'none';
    startButton.style.display = 'block';

    startButton.addEventListener('click', function() {
        startButton.classList.add('clicked');
        setTimeout(() => {
            startButton.style.display = 'none';
            introScreen.classList.remove('hidden');
            introScreen.classList.add('visible');
        }, 300);
    });

    function triggerGameOver() {
        gameOver = true;
        draw(); // Desenha o estado atual do canvas, incluindo o Game Over
    }
    

    

    startGameButton.addEventListener('click', function() {
        introScreen.classList.remove('visible');
        introScreen.classList.add('hidden');
        setTimeout(() => {
            introScreen.style.display = 'none';
            gameCanvas.style.display = 'block';
            startGame();
        }, 500);
    });

    function startGame() {
        const ctx = gameCanvas.getContext('2d');
        const backgroundImage = new Image();
        backgroundImage.src = 'images/background.png';

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
        let hazards = [];
        let foodSpeed = 2;
        let hazardSpeed = 3;
        let score = 0;
        let lives = 3;
        let gameOver = false;
        let gameOverImage = new Image();
        gameOverImage.src = 'images/game-over-background.jpg'; // Substitua pelo caminho da sua imagem de game over

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
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
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
            ctx.fillStyle = "#008000";
            ctx.fill();
            ctx.closePath();
        }

        function drawHazard(hazard) {
            ctx.beginPath();
            ctx.arc(hazard.x, hazard.y, hazard.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#FF0000";
            ctx.fill();
            ctx.closePath();
        }

        function drawScore() {
            ctx.drawImage(img, -1, -5, 200, 60);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 20px 'Righteous', sans-serif";
            ctx.fillText("Pontuação: " + score, 30, 30);
        }

        function drawLives() {
            ctx.drawImage(img, gameCanvas.width - 165, -5, 160, 60);
            ctx.fillStyle = "#ffffff";
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
        
        let badFoods = []; // Array para armazenar alimentos negativos

        function createBadFood() {
        let badFood;
        let isOverlapping;

        do {
            let x = Math.random() * (gameCanvas.width - 30) + 15;
            badFood = {
            x: x,
            y: 0,
            radius: 15,
            color: "#FFFFF" // Cor para identificar o alimento negativo
            };

            isOverlapping = foods.some(existingFood => checkCollision(badFood, existingFood)) ||
                        hazards.some(existingHazard => checkCollision(badFood, existingHazard));
        } while (isOverlapping);

        badFoods.push(badFood);
        }

        function updateBadFoods() {
        badFoods.forEach((badFood, index) => {
            badFood.y += foodSpeed;

            if (badFood.y > gameCanvas.height) {
            badFoods.splice(index, 1);
            }

            if (badFood.y + badFood.radius > basket.y &&
                badFood.x > basket.x && badFood.x < basket.x + basket.width) {
            badFoods.splice(index, 1);
            lives--; // Diminui vida ao pegar alimento negativo
            if (lives <= 0) {
                gameOver = true;
            }
            }
        });
        }

        function drawGameOver() {
            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Limpa o canvas
            ctx.drawImage(gameOverImage, 0, 0, gameCanvas.width, gameCanvas.height);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 40px 'Righteous', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Game Over", gameCanvas.width / 2, gameCanvas.height / 2 - 20);
            ctx.font = "bold 20px 'Righteous', sans-serif";
            ctx.fillText("Pontuação Final: " + score, gameCanvas.width / 2, gameCanvas.height / 2 + 20);
            ctx.fillText("Clique para Reiniciar", gameCanvas.width / 2, gameCanvas.height / 2 + 60);
        }
        

        function drawBadFood(badFood) {
        ctx.beginPath();
        ctx.arc(badFood.x, badFood.y, badFood.radius, 0, Math.PI * 2);
        ctx.fillStyle = badFood.color;
        ctx.fill();
        ctx.closePath();
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
                    increaseDifficulty(); // Aumenta a dificuldade a cada 5 pontos
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

        
        
        function increaseDifficulty() {
            if (score % 10 === 0) {
                foodSpeed += 1;
                hazardSpeed += 1;

                // Aumenta a frequência de alimentos e perigos
                for (let i = 0; i < 2; i++) {
                    createFood();
                    createHazard();
                }
            }
        }

        function draw() {
            if (gameOver) {
                drawGameOver();
                return;
            }

            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            drawBackground();
            drawOverlay();
            drawBasket();

            foods.forEach(drawFood);
            badFoods.forEach(drawBadFood);
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
                if (Math.random() < 0.02) createBadFood();
                if (Math.random() < 0.05) createFood();
                if (Math.random() < 0.03) createHazard();
                badFoods.forEach(drawBadFood);
                updateBadFoods();
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

        gameLoop();
    }
});
