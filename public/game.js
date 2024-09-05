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

        const imagens = {
            fundo: new Image(),
            cesta: new Image(),
            gameOver: new Image(),
            comida: new Image(),
            comidaRuim: new Image(),
            fundoPontuacao: new Image()
        };

        imagens.fundo.src = 'images/background.png';
        imagens.cesta.src = 'images/pou.png';
        imagens.gameOver.src = 'images/game-over-background.jpg';
        imagens.comida.src = 'images/food.png';
        imagens.comidaRuim.src = 'images/bad-food.png';
        imagens.fundoPontuacao.src = 'images/brush.png';

        let todasImagensCarregadas = 0;
        const totalImagens = Object.keys(imagens).length;

        for (const key in imagens) {
            imagens[key].onload = () => {
                todasImagensCarregadas++;
                if (todasImagensCarregadas === totalImagens) {
                    iniciarLoopJogo();
                }
            };
        }

        let cesta = {
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
            const proporcaoImagem = imagens.fundo.width / imagens.fundo.height;

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

            ctx.drawImage(imagens.fundo, deslocamentoX, deslocamentoY, larguraDesenho, alturaDesenho);
        }

        function desenharSobreposicao() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvasJogo.width, canvasJogo.height);
        }

        function desenharCesta() {
            ctx.drawImage(imagens.cesta, cesta.x, cesta.y, cesta.width, cesta.height);
        }

        function desenharComida(comida) {
            ctx.drawImage(imagens.comida, comida.x - comida.radius, comida.y - comida.radius, comida.radius * 2, comida.radius * 2);
        }

        function desenharPontuacao() {
            ctx.drawImage(imagens.fundoPontuacao, -1, -5, 200, 60);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 20px 'Righteous', sans-serif";
            ctx.fillText("Pontuação: " + pontuacao, 30, 30);
        }

        function desenharVidas() {
            ctx.drawImage(imagens.fundoPontuacao, canvasJogo.width - 165, -5, 160, 60);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 20px 'Righteous', sans-serif";
            ctx.fillText("Vidas: " + vidas, canvasJogo.width - 130, 30);
        }

        function desenharGameOver() {
            if (imagens.gameOver.complete) { // Verifica se a imagem foi carregada
                ctx.clearRect(0, 0, canvasJogo.width, canvasJogo.height);
                ctx.drawImage(imagens.gameOver, 0, 0, canvasJogo.width, canvasJogo.height);
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 40px 'Righteous', sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("Game Over", canvasJogo.width / 2, canvasJogo.height / 2 - 20);
                ctx.font = "bold 20px 'Righteous', sans-serif";
                ctx.fillText("Pontuação Final: " + pontuacao, canvasJogo.width / 2, canvasJogo.height / 2 + 20);
                ctx.fillText("Clique para Reiniciar", canvasJogo.width / 2, canvasJogo.height / 2 + 60);
            } else {
                console.log('Imagem de Game Over ainda não carregada.');
            }
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
                    radius: 30
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
                    image: imagens.comidaRuim
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
                        console.log("Jogo acabou, vidas esgotadas.");
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
                requestAnimationFrame(loopJogo);
                atualizarComidasRuins()
            } else {
                console.log('O jogo acabou.');
                desenharGameOver(); // Garantir que desenharGameOver seja chamado após o fim do jogo
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

        function iniciarLoopJogo() {
            loopJogo();
        }
    }
});
