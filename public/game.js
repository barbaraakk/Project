document.addEventListener('DOMContentLoaded', function () {
    const botaoInicio = document.getElementById('startGame');
    const canvasJogo = document.getElementById('gameCanvas');
    const telaIntro = document.getElementById('introScreen');
    const botaoIniciarJogo = document.getElementById('startGameButton');

    telaIntro.classList.add('hidden');
    canvasJogo.style.display = 'none';
    botaoInicio.style.display = 'block';

    botaoInicio.addEventListener('click', function () {
        botaoInicio.classList.add('clicked');
        setTimeout(() => {
            botaoInicio.style.display = 'none';
            telaIntro.classList.remove('hidden');
            telaIntro.classList.add('visible');
        }, 300);
    });

    const musicaFundo = new Audio('sounds/musgafundo.mp3')
    musicaFundo.loop = true;  // Define para repetir a música
    musicaFundo.volume = 0.5; // Define o volume da música

    function tocarMusicaFundo() {
        musicaFundo.play();
    }
    
    function pararMusicaFundo() {
        musicaFundo.pause();
        musicaFundo.currentTime = 0; // Reseta o tempo da música
    }
    

    botaoIniciarJogo.addEventListener('click', function () {
        telaIntro.classList.remove('visible');
        telaIntro.classList.add('hidden');
        setTimeout(() => {
            telaIntro.style.display = 'none';
            canvasJogo.style.display = 'block';
            tocarMusicaFundo();
            iniciarJogo();
        }, 500);
    });

    

    function iniciarJogo() {
        // Definição e carregamento das imagens
        const ctx = canvasJogo.getContext('2d');
        const somDano = new Audio('sounds/dano.mp3');
        const somMorte = new Audio('sounds/Morte.mp3');
        const videofim = new Audio('sounds/videofim.mp3')


        const imagens = {
            fundo: new Image(),
            cesta: new Image(),
            gameOver: new Image(),
            comida: new Image(),
            comidaRuim: new Image(),
            fundoPontuacao: new Image(),
            imagemAceite: new Image()
        };

        imagens.fundo.src = 'images/background.png';
        imagens.cesta.src = 'images/zat.png';
        imagens.gameOver.src = 'images/game-over-background.png';
        imagens.comida.src = 'images/food.png';
        imagens.comidaRuim.src = 'images/bad-food.png';
        imagens.fundoPontuacao.src = 'images/brush.png';
        imagens.imagemAceite.src = 'images/aceite.png';

        let todasImagensCarregadas = 0;
        const totalImagens = Object.keys(imagens).length;
        let imagemTempo = 0;
        
        imagens.imagemPontos = new Image();
        imagens.imagemPontos.src = 'images/image.png'; // Substitua pelo caminho da imagem que deseja usar


        for (const key in imagens) {
            imagens[key].onload = () => {
                todasImagensCarregadas++;
                if (todasImagensCarregadas === totalImagens) {
                    iniciarLoopJogo();
                }
            };
        }

        // Reinicializa os parâmetros do jogo
        let cesta = {
            x: canvasJogo.width / 2 - 35,
            y: 480,
            width: 160,
            height: 80,
            dx: 5
        };
        let comidas = [];
        let comidasRuins = [];
        let velocidadeComida = 1.5;
        let pontuacao = 0;
        let vidas = 3;
        let jogoAcabou = false;
        let mostrarImagem = false;

        let teclaDireitaPressionada = false;
        let teclaEsquerdaPressionada = false;

        let jogoPausado = false;
        


        // Restante da função para configurar o jogo, desenhar e atualizar
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
            ctx.save(); // Salva o estado atual do canvas
            ctx.translate(comida.x, comida.y); // Move o ponto de origem para o centro da comida
            ctx.rotate(comida.angulo); // Rotaciona o canvas
            ctx.drawImage(imagens.comida, -comida.radius, -comida.radius, comida.radius * 2, comida.radius * 2);
            ctx.restore(); // Restaura o estado do canvas
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

        function cliqueNoBotaoAceitar() {
            ctx.clearRect(0, 0, canvasJogo.width, canvasJogo.height);
            ctx.drawImage(imagens.imagemAceite, 0, 0, canvasJogo.width, canvasJogo.height);
            jogoPausado();
            console.log("Aceitar clicado!");  // Debug para garantir que o botão está funcionando
        }


        function desenharGameOver() {
            if (imagens.gameOver.complete) {
                ctx.clearRect(0, 0, canvasJogo.width, canvasJogo.height);
                ctx.drawImage(imagens.gameOver, 0, 0, canvasJogo.width, canvasJogo.height);

                // Desenha a pontuação final no meio da tela
                ctx.font = "bold 15px, sans-serif";
                ctx.fillText("Pontuação Final: " + pontuacao, 345, 62);

                // Desenha os botões
                const larguraBotao = 150;
                const alturaBotao = 40;
                const espacoEntreBotoes = 20;
                const posY = canvasJogo.height / 2 + 40; // Ajusta a posição Y dos botões

                // Ajuste a posição X do botão "Tentar Novamente"
                const ajusteEsquerda = 290; // Ajuste para mover o botão para a esquerda
                const posXTentativa = canvasJogo.width / 2 - (larguraBotao + espacoEntreBotoes) / 2 - ajusteEsquerda; // Pos X do botão "Tentar Novamente"

                // Ajuste a posição X do botão "Aceitar"
                const ajusteDireita = 180; // Ajuste para mover o botão "Aceitar" para a direita
                const posXAceitar = canvasJogo.width / 2 + espacoEntreBotoes / 2 + ajusteDireita; // Pos X do botão "Aceitar"

                // Botão "Tentar Novamente"
                ctx.fillStyle = "#333"; // Cor de fundo escura
                ctx.fillRect(posXTentativa, posY, larguraBotao, alturaBotao);
                ctx.strokeStyle = "#555"; // Cor da borda (não desenha a borda)
                ctx.lineWidth = 3; // Largura da borda (não desenha a borda)
                ctx.strokeRect(posXTentativa, posY, larguraBotao, alturaBotao);
                ctx.fillStyle = "#fff"; // Cor do texto
                ctx.font = "bold 15px 'Righteous', sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("Tentar Novamente", posXTentativa + larguraBotao / 2, posY + alturaBotao / 2 + 5);

                // Botão "Aceitar"
                ctx.fillStyle = "#333"; // Cor de fundo escura
                ctx.fillRect(posXAceitar, posY, larguraBotao, alturaBotao);
                ctx.strokeStyle = "#555"; // Cor da borda (não desenha a borda)
                ctx.lineWidth = 3; // Largura da borda (não desenha a borda)
                ctx.strokeRect(posXAceitar, posY, larguraBotao, alturaBotao);
                ctx.fillStyle = "#fff"; // Cor do texto
                ctx.font = "bold 15px 'Righteous', sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("Aceitar", posXAceitar + larguraBotao / 2, posY + alturaBotao / 2 + 5);

                // Adiciona eventos de movimento do mouse e clique
                canvasJogo.addEventListener('mousemove', function (event) {
                    const rect = canvasJogo.getBoundingClientRect();
                    const mouseX = event.clientX - rect.left;
                    const mouseY = event.clientY - rect.top;

                    // Verifica se o mouse está sobre os botões
                    if (mouseX >= posXTentativa && mouseX <= posXTentativa + larguraBotao &&
                        mouseY >= posY && mouseY <= posY + alturaBotao ||
                        mouseX >= posXAceitar && mouseX <= posXAceitar + larguraBotao &&
                        mouseY >= posY && mouseY <= posY + alturaBotao) {
                        canvasJogo.style.cursor = 'pointer'; // Define o cursor como uma mãozinha
                    } else {
                        canvasJogo.style.cursor = 'default'; // Define o cursor como padrão quando não estiver sobre os botões
                    }
                });

                canvasJogo.addEventListener('click', function (event) {
                    const rect = canvasJogo.getBoundingClientRect();
                    const mouseX = event.clientX - rect.left;
                    const mouseY = event.clientY - rect.top;

                    if (mouseX >= posXTentativa && mouseX <= posXTentativa + larguraBotao &&
                        mouseY >= posY && mouseY <= posY + alturaBotao) {
                        pararMusicaFundo()
                        location.reload();
                    }

                    if (mouseX >= posXAceitar && mouseX <= posXAceitar + larguraBotao &&
                        mouseY >= posY && mouseY <= posY + alturaBotao) {
                        cliqueNoBotaoAceitar();
                    }
                });
            }
        }




        function desenharComidaRuim(comidaRuim) {
            ctx.save(); // Salva o estado atual do canvas
            ctx.translate(comidaRuim.x, comidaRuim.y); // Move o ponto de origem para o centro da comida ruim
            ctx.rotate(comidaRuim.angulo); // Rotaciona o canvas
            ctx.drawImage(comidaRuim.image, -comidaRuim.radius, -comidaRuim.radius, comidaRuim.radius * 2, comidaRuim.radius * 2);
            ctx.restore(); // Restaura o estado do canvas
        }

        function criarComida() {
            let comida;
            let sobreposicao;

            do {
                let x = Math.random() * (canvasJogo.width - 30) + 15;
                comida = {
                    x: x,
                    y: 0,
                    radius: 30,
                    angulo: Math.random() * 2 * Math.PI, // Adiciona ângulo inicial
                    velocidadeRotacao: Math.random() * 0.05 + 0.01 // Adiciona velocidade de rotação
                };
                sobreposicao = comidas.some(comidaExistente => checarColisao(comida, comidaExistente));
            } while (sobreposicao);

            comidas.push(comida);
        }

        function criarComidaRuim() {
            let x, y, comidaRuim;
            let sobreposicao;
            const espacoMinimo = 60; // Ajuste para aumentar o espaço entre comidas ruins
            const numeroMaximoComidasRuins = 5; // Limita o número máximo de comidas ruins
        
            // Verifica o número atual de comidas ruins
            if (comidasRuins.length >= numeroMaximoComidasRuins) {
                return; // Não cria novas comidas ruins se o limite for alcançado
            }
        
            do {
                x = Math.random() * (canvasJogo.width - 30) + 15;
                y = 0;
                comidaRuim = {
                    x: x,
                    y: y,
                    radius: 30, // Pode ser ajustado conforme a necessidade
                    image: imagens.comidaRuim,
                    angulo: Math.random() * 2 * Math.PI,
                    velocidadeRotacao: Math.random() * 0.02 + 0.01 // Reduz a velocidade de rotação
                };
        
                // Verifica se há sobreposição com outras comidas ruins
                sobreposicao = comidasRuins.some(comidaRuimExistente => checarColisao(comidaRuim, comidaRuimExistente));
            } while (sobreposicao);
        
            comidasRuins.push(comidaRuim);
        }
        

        function atualizarComida() {
            comidas.forEach((comida, index) => {
                comida.y += velocidadeComida;
                comida.angulo += comida.velocidadeRotacao; // Atualiza o ângulo de rotação
                if (comida.y > canvasJogo.height) {
                    comidas.splice(index, 1);
                }
                if (comida.y + comida.radius > cesta.y &&
                    comida.x > cesta.x && comida.x < cesta.x + cesta.width) {
                    comidas.splice(index, 1);
                    pontuacao++;
        
                    // Se a pontuação chegar a 5, o jogo pausa e o vídeo aparece
                    if (pontuacao === 100) {
                        pararMusicaFundo(); // Função para parar a música de fundo
                        jogoPausado = true; // Pausa o jogo
                        mostrarImagem = true
                        
                        
                    }
        
                    aumentarDificuldade(); // Aumenta a dificuldade conforme a pontuação
                }
            });
        
            
            


        }
        function atualizarComidasRuins() {
            comidasRuins.forEach((comidaRuim, index) => {
                comidaRuim.y += velocidadeComida;
                comidaRuim.angulo += comidaRuim.velocidadeRotacao;
                if (comidaRuim.y > canvasJogo.height) {
                    comidasRuins.splice(index, 1);
                }
                if (comidaRuim.y + comidaRuim.radius > cesta.y &&
                    comidaRuim.x > cesta.x && comidaRuim.x < cesta.x + cesta.width) {
                    comidasRuins.splice(index, 1);
                    vidas--;
                    somDano.play();
                    if (vidas <= 0) {
                        somMorte.play()
                        jogoAcabou = true;
                        console.log("Jogo acabou, vidas esgotadas.");
                    }
                }
            });
        }


        function aumentarDificuldade() {
            if (pontuacao >= 50 && pontuacao % 50 === 0) {
                for (let i = 0; i < 1; i++) { // Cria menos comidas
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
            if (mostrarImagem) {
                ctx.drawImage(imagens.imagemPontos, 0, 0, canvasJogo.width, canvasJogo.height);
                
            }
            
        }

        function atualizar() {
            if (jogoPausado) {
                return; // Interrompe a execução se o jogo estiver pausado
            }
            if (jogoAcabou) return;
            moverCesta();
            atualizarComida();
            atualizarComidasRuins();
        }

        function loopJogo() {
            if (jogoAcabou) {
                desenharGameOver();
            } else {
                desenhar();
                atualizar();
                if (Math.random() < 0.02) criarComidaRuim();
                if (Math.random() < 0.03) criarComida();
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

        document.addEventListener("keydown", teclaPressionada);
        document.addEventListener("keyup", teclaLiberada);

        function iniciarLoopJogo() {
            loopJogo();
        }

    }
});
