console.log('[DevTufao] Flappy Bird');

let frames = 0;
const som_HIT = new Audio();
som_HIT.src = './efeitos/efeitos_hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// [Plano de Fundo]
const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura
        );
      
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura
        );
    },
};

// [Chao]
function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            chao.x = chao.x - movimentoDoChao;

            if (chao.x <= -repeteEm) {
                chao.x = 0;
            }
        },
        desenha() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura
            );
    
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura
            );
        },
    };
    return chao;
}

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY) {
        return true;
    }
    return false;
}

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pula() {
            flappyBird.velocidade = - flappyBird.pulo;
        },
        gravidade: 0.25,
        velocidade: 0,
        atualiza() {
            if (fazColisao(flappyBird, globais.chao)) {
                som_HIT.play();

                setTimeout(() => {
                    mudaParaTela(Telas.INICIO);
                }, 500);
                return;
            }

            flappyBird.velocidade += flappyBird.gravidade;
            flappyBird.y += flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0 }, // asa para cima
            { spriteX: 0, spriteY: 26 }, // asa no meio
            { spriteX: 0, spriteY: 52 }, // asa para baixo
            { spriteX: 0, spriteY: 26 }, // asa no meio
        ],
        frameAtual: 0,
        atualizaOFrameAtual() {
            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if (passouOIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;
            }
        },
        desenha() {
            flappyBird.atualizaOFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            contexto.drawImage(
                sprites,
                spriteX, spriteY,
                flappyBird.largura, flappyBird.altura,
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura
            );
        },
    };
    return flappyBird;
}

// [mensagemGetReady]
const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h
        );
    },
};

// [Canos]
function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        pares: [],
        desenha() {
            canos.pares.forEach(function(par) {
                const yRandom = par.y;
                const espacamentoEntreCanos = 90;

                // [Cano do céu]
                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura
                );

                // [Cano do chao]
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura
                );
            });
        },
        
        temColisaoComOFlappyBird(par) {
            const flappyBird = globais.flappyBird;
            const cabecaDoFlappy = flappyBird.y;
            const peDoFlappy = flappyBird.y + flappyBird.altura;

            if (flappyBird.x + flappyBird.largura >= par.x) {
                // Verifica colisão com o cano do céu
                if (cabecaDoFlappy <= par.y + canos.altura) {
                    return true;
                }

                // Verifica colisão com o cano do chão
                if (peDoFlappy >= par.y + canos.altura + canos.espaco) {
                    return true;
                }
            }

            return false;
        },
        
        atualiza() {
            const passou100Frames = frames % 100 === 0;
            if (passou100Frames) {
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                });
            }

            canos.pares.forEach(function(par) {
                par.x -= 2;

                if (canos.temColisaoComOFlappyBird(par)) {
                    som_HIT.play();

                    setTimeout(() => {
                        mudaParaTela(Telas.INICIO);
                    }, 500);
                }

                if (par.x + canos.largura <= 0) {
                    canos.pares.shift(); // remove o primeiro cano quando ele sair da tela
                }
            });
        },
    };
    return canos;
}

function criaPlacar() {
    const placar = {
        pontuacao: 0,
        desenha() {
            contexto.font = '50px serif';
            contexto.fillStyle = 'white';
            contexto.fillText(`hello world ${placar.pontuacao}`, 50, 90);
            placar.pontuacao
        },
        atualiza() {

        }
    }
    return placar;
}

// [Telas]
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.flappyBird.desenha();
            globais.chao.desenha();
            mensagemGetReady.desenha();
        },
        click() {
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {
            globais.chao.atualiza();
        },
    },
    JOGO: {
        inicializa() {
            globais.placar = criaPlacar();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.canos.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            globais.placar.desenha();
        },
        click() {
            globais.flappyBird.pula();
        },
        atualiza() {
            globais.canos.atualiza();
            globais.flappyBird.atualiza();
            globais.chao.atualiza();
            globais.placar.atualiza();
        },
    },
};

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames += 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click', function () {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(Telas.INICIO);
loop();
