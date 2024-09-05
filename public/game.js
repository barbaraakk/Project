document.addEventListener('DOMContentLoaded', function() {
    const botaoInicio = document.getElementById('startGame');
    const canvasJogo = document.getElementById('gameCanvas');
    const telaIntro = document.getElementById('introScreen');
    const botaoIniciarJogo = document.getElementById('startGameButton');

    telaIntro.classList.add('hidden');
    canvasJogo.style.display = 'none';
    botaoInicio.style.display = 'block';

    botaoInicio.addEventListener('click', function() {
        botaoInicio.classList.add('clicked');
        setTimeout(() => {
            botaoInicio.style.display = 'none';
            telaIntro.classList.remove('hidden');
            telaIntro.classList.add('visible');
        }, 300);
    });

    botaoIniciarJogo.addEventListener('click', function() {
        telaIntro.classList.remove('visible');
        telaIntro.classList.add('hidden');
        setTimeout(() => {
            telaIntro.style.display = 'none';
            canvasJogo.style.display = 'block';
            iniciarJogo();
        }, 500);
    });

    function iniciarJogo() {
        const ctx = canvasJogo.getContext('2d');

        const imagemFundo = new Image();
        imagemFundo.src = 'images/background.png';
        const imagemCesta = new Image();
        imagemCesta.src = 'images/pou.png'; // Imagem da cesta
        const imagemGameOver = new Image();
        imagemGameOver.src = 'images/game-over-background.jpg';
        const imagemComida = new Image(); // Imagem da comida
        imagemComida.src = 'images/food.png'; // Substitua com o caminho correto para a sua imagem de comida
        const imagemComidaRuim = new Image();
        imagemComidaRuim.src = 'images/bad-food.png';
        const imagemFundoPontuacao = new Image(); // Imagem do fundo dos pontos
        imagemFundoPontuacao.src = 'images/brush.png'; // Substitua com o caminho correto para a sua imagem de fundo dos pontos

        const cesta = {
            x: canvasJogo.width / 2 - 35,
            y: canvasJogo.height - 50,
            width: 70,
            height: 40,
            dx: 5
        };
        let comidas = [];
        let comidasRuins = [];
        let velocidadeComida = 2;
        let pontuacao = 0;
        let vidas = 3;
        let jogoAcabou = false;

        let teclaDireitaPressionada = false;
        let teclaEsquerdaPressionada = false;

        function desenharFundo() {
            const proporcaoCanvas = canvasJogo.width / canvasJogo.height;
            const proporcaoImagem = imagemFundo.width / imagemFundo.height;

            let larguraDesenho, alturaDesenho, deslocamentoX, deslocamentoY;

            if (proporcaoCanvas > proporcaoImagem) {
                larguraDesenho = canvasJogo.width;
                alturaDesenho = canvasJogo.width / proporcaoImagem;
                deslocamentoX = 0;
                deslocamentoY = (canvasJogo.height - alturaDesenho) / 2;
            } else {
                alturaDesenho = canvasJogo.height;
                larguraDesenho = canvasJogo.height * proporcaoImagem;
                deslocamentoX = (canvasJogo.width - larguraDesenho) / 2;
                deslocamentoY = 0;
            }

            ctx.drawImage(imagemFundo, deslocamentoX, deslocamentoY, larguraDesenho, alturaDesenho);
        }

        function desenharSobreposicao() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvasJogo.width, canvasJogo.height);
        }

        function desenharCesta() {
            ctx.drawImage(imagemCesta, cesta.x, cesta.y, cesta.width, cesta.height);
        }

        function desenharComida(comida) {
            ctx.drawImage(imagemComida, comida.x - comida.radius, comida.y - comida.radius, comida.radius * 2, comida.radius * 2);
        }

        function desenharPontuacao() {
            ctx.drawImage(imagemFundoPontuacao, -1, -5, 200, 60); // Usando a imagem do fundo dos pontos
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 20px 'Righteous', sans-serif";
            ctx.fillText("Pontuação: " + pontuacao, 30, 30);
        }

        function desenharVidas() {
            ctx.drawImage(imagemFundoPontuacao, canvasJogo.width - 165, -5, 160, 60); // Usando a imagem do fundo dos pontos
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 20px 'Righteous', sans-serif";
            ctx.fillText("Vidas: " + vidas, canvasJogo.width - 130, 30);
        }

        function desenharGameOver() {
            ctx.clearRect(0, 0, canvasJogo.width, canvasJogo.height);
            ctx.drawImage(imagemGameOver, 0, 0, canvasJogo.width, canvasJogo.height);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 40px 'Righteous', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Game Over", canvasJogo.width / 2, canvasJogo.height / 2 - 20);
            ctx.font = "bold 20px 'Righteous', sans-serif";
            ctx.fillText("Pontuação Final: " + pontuacao, canvasJogo.width / 2, canvasJogo.height / 2 + 20);
            ctx.fillText("Clique para Reiniciar", canvasJogo.width / 2, canvasJogo.height / 2 + 60);
        }

        function desenharComidaRuim(comidaRuim) {
            ctx.drawImage(comidaRuim.image, comidaRuim.x - comidaRuim.radius, comidaRuim.y - comidaRuim.radius, comidaRuim.radius * 2, comidaRuim.radius * 2);
        }

        function criarComida() {
            let comida;
            let sobreposicao;

            do {
                let x = Math.random() * (canvasJogo.width - 30) + 15;
                comida = {
                    x: x,
                    y: 0,
                    radius: 30 // Ajuste o raio para se adequar ao tamanho da imagem
                };
                sobreposicao = comidas.some(comidaExistente => checarColisao(comida, comidaExistente));
            } while (sobreposicao);

            comidas.push(comida);
        }

        function criarComidaRuim() {
            let comidaRuim;
            let sobreposicao;

            do {
                let x = Math.random() * (canvasJogo.width - 30) + 15;
                comidaRuim = {
                    x: x,
                    y: 0,
                    radius: 30,
                    image: imagemComidaRuim
                };
                sobreposicao = comidasRuins.some(comidaRuimExistente => checarColisao(comidaRuim, comidaRuimExistente));
            } while (sobreposicao);

            comidasRuins.push(comidaRuim);
        }

        function atualizarComida() {
            comidas.forEach((comida, index) => {
                comida.y += velocidadeComida;
                if (comida.y > canvasJogo.height) {
                    comidas.splice(index, 1);
                }
                if (comida.y + comida.radius > cesta.y &&
                    comida.x > cesta.x && comida.x < cesta.x + cesta.width) {
                    comidas.splice(index, 1);
                    pontuacao++;
                    aumentarDificuldade();
                }
            });
        }

        function atualizarComidasRuins() {
            comidasRuins.forEach((comidaRuim, index) => {
                comidaRuim.y += velocidadeComida;
                if (comidaRuim.y > canvasJogo.height) {
                    comidasRuins.splice(index, 1);
                }
                if (comidaRuim.y + comidaRuim.radius > cesta.y &&
                    comidaRuim.x > cesta.x && comidaRuim.x < cesta.x + cesta.width) {
                    comidasRuins.splice(index, 1);
                    vidas--;
                    if (vidas <= 0) {
                        jogoAcabou = true;
                    }
                }
            });
        }

        function aumentarDificuldade() {
            if (pontuacao % 10 === 0) {
                velocidadeComida += 1;
                for (let i = 0; i < 2; i++) {
                    criarComida();
                }
            }
            if (pontuacao >= 50 && pontuacao % 50 === 0) {
                for (let i = 0; i < 2; i++) {
                    criarComida();
                }
            }
        }

        function checarColisao(obj1, obj2) {
            let dx = obj1.x - obj2.x;
            let dy = obj1.y - obj2.y;
            let distancia = Math.sqrt(dx * dx + dy * dy);
            return distancia < obj1.radius + obj2.radius;
        }

        function moverCesta() {
            if (teclaDireitaPressionada && cesta.x + cesta.width < canvasJogo.width) {
                cesta.x += cesta.dx;
            }
            if (teclaEsquerdaPressionada && cesta.x > 0) {
                cesta.x -= cesta.dx;
            }
        }

        function desenhar() {
            if (jogoAcabou) {
                desenharGameOver();
                return;
            }
            ctx.clearRect(0, 0, canvasJogo.width, canvasJogo.height);
            desenharFundo();
            desenharSobreposicao();
            desenharCesta();
            comidas.forEach(desenharComida);
            comidasRuins.forEach(desenharComidaRuim);
            desenharPontuacao();
            desenharVidas();
        }

        function atualizar() {
            if (jogoAcabou) return;
            moverCesta();
            atualizarComida();
            atualizarComidasRuins();
        }

        function loopJogo() {
            desenhar();
            atualizar();
            if (!jogoAcabou) {
                if (Math.random() < 0.02) criarComidaRuim();
                if (Math.random() < 0.03) criarComida();
                atualizarComidasRuins();
                requestAnimationFrame(loopJogo);
            }
        }

        function teclaPressionada(e) {
            if (e.key === "Right" || e.key === "ArrowRight") {
                teclaDireitaPressionada = true;
            }
            if (e.key === "Left" || e.key === "ArrowLeft") {
                teclaEsquerdaPressionada = true;
            }
        }

        function teclaLiberada(e) {
            if (e.key === "Right" || e.key === "ArrowRight") {
                teclaDireitaPressionada = false;
            }
            if (e.key === "Left" || e.key === "ArrowLeft") {
                teclaEsquerdaPressionada = false;
            }
        }

        function cliqueNoCanvas() {
            if (jogoAcabou) {
                document.location.reload();
            }
        }

        document.addEventListener("keydown", teclaPressionada);
        document.addEventListener("keyup", teclaLiberada);
        canvasJogo.addEventListener("click", cliqueNoCanvas);

        loopJogo();
    }
});
