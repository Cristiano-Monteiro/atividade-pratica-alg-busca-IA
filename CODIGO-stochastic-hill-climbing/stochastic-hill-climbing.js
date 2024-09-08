// Problema das n rainhas com Stochastic Hill Climbing (TESTE 3)
// Aluno: Cristiano da Silva Monteiro

//=================== PARÂMETROS DO ALGORITMO ===================
const quantidadeRainhas = 8;
const numExecAlgoritmo = 50;
const numMaxMovimentos = 500;
//===============================================================

// Gera um estado inicial aleatório
function gerarEstadoInicial(numRainhas){
  // numRainhas -> Quantidade de rainhas no tabuleiro (também define o tamanho do tabuleiro)
  if(numRainhas > 3){
    let estadoAux = [];
    for(let i = 0; i < numRainhas; i++){
      let numRandom = Math.floor(Math.random() * numRainhas);
      estadoAux[i] = numRandom;
    };
    return estadoAux;
  } else {
    console.log('[ERRO] Quantidade de rainhas menor que 3!');
  };
};

// Gera um conjunto dos sucessores do estado atual a partir do movimento de uma rainha 
function gerarEstadosSucessores(estadoAtual, col, posAtual){
  // col -> coluna onde o movimento da rainha é realizado
  // posAtual -> posição da rainha na coluna col
  let estadosSucessores = [];
  let posRainha = 0;
  for(let estado = 0; estado < estadoAtual.length-1; estado++){
    (posRainha === posAtual) && (posRainha++);
    let estadoAux = [...estadoAtual];
    estadoAux[col] = posRainha;

    let h = funcaoObjetivo(estadoAux);
    estadosSucessores.push({
      estado: estadoAux,
      h: h,
    });
    
    posRainha++;
  };
  return estadosSucessores;
};

// Escolhe um estado sucessor de forma aleatória
function escolherEstadoSucessor(estadosSucessores){
  // Ordena de forma decrescente os estados com base em h
  let melhoresSucessores = estadosSucessores.toSorted((a,b) => {return a.h - b.h});

  // Index aleatório para escolher entre os 3 melhores estados
  let indexRand = Math.floor(Math.random() * 3);

  return {
    estadoSucessor: melhoresSucessores[indexRand].estado, 
    hSucessor: melhoresSucessores[indexRand].h
  };
};

// Calcula o número de colisões entre rainhas
function funcaoObjetivo(estado){
  if(estado){
    let h = 0;
    let posItemAtual = 0;

    while(true){
      for(let i = posItemAtual+1; i < estado.length; i++){
        let testeColisao = 
        estado[posItemAtual] == estado[i] || 
        Math.abs(estado[posItemAtual] - estado[i]) == Math.abs(posItemAtual - i);
        testeColisao && (h++);
      };
      posItemAtual++;
      if(posItemAtual == estado.length-1){
        break;
      };
    };
    return h;
  };
};

function hillClimbing(){
  const inicioExecucao = new Date().getTime();
  let numIteraçõesMin = 0;

  let estadoAtual = gerarEstadoInicial(quantidadeRainhas);

  //console.log(`# Estado inicial: ${estadoAtual}`);
  //console.log('-----------------------------');

  let colMov = 0; // Coluna onde a rainha será movimentada

  for(let i = 0; i < numMaxMovimentos; i++){
    numIteraçõesMin = i;

    colMov === estadoAtual.length && (colMov = 0);

    let estadosSucessores = gerarEstadosSucessores(estadoAtual, colMov, estadoAtual[colMov]);
    let {estadoSucessor, hSucessor} = escolherEstadoSucessor(estadosSucessores);

    let hAtual = funcaoObjetivo(estadoAtual);
  
    /* console.log(`# Iteração ${i+1}`);
    console.log('-> Estados sucessores:');
    console.table(estadosSucessores);
    console.log(`[${estadoAtual}] - h (Atual) = ${hAtual}`);
    console.log(`[${estadoSucessor}] - h (Sucessor) = ${hSucessor}`);
    console.log('-----------------------------'); */
  
    if(hSucessor > hAtual){
      //console.log(`Melhor estado ==> [${estadoAtual}] h = ${hAtual}`);
      const fimExecucao = new Date().getTime();
      const tempoExecucao = fimExecucao - inicioExecucao;

      return {
        estado: estadoAtual,
        iteracoes: numIteraçõesMin,
        tempoExecucao,
        h: hAtual,
      };
    };
  
    estadoAtual = estadoSucessor;
    colMov++;
  };

  const hAtual = funcaoObjetivo(estadoAtual);
  const fimExecucao = new Date().getTime();
  const tempoExecucao = fimExecucao - inicioExecucao;
  return {
    estado: estadoAtual,
    iteracoes: numIteraçõesMin,
    tempoExecucao,
    h: hAtual,
  };
};

function executarAlgSHC(){
  let iteracoesArr = [];
  let tempoExecArr = [];
  let estadosArr = [];

  for(let i = 0; i < numExecAlgoritmo; i++){
    let {estado, iteracoes, tempoExecucao, h} = hillClimbing();

    estadosArr.push({estado: estado, h: h});
    iteracoesArr.push(iteracoes);
    tempoExecArr.push(tempoExecucao);
  };

  // Média e desvio padrão do núm. mínimo de iterações necessário para parar o algoritmo
  let somaIteracoes = iteracoesArr.reduce((soma, it) => soma+it);
  let mediaIteracoes = somaIteracoes / numExecAlgoritmo;

  let somatorioIteracoes = iteracoesArr.reduce((soma, it) => {
    let aux = Math.pow(it - mediaIteracoes, 2);
    return soma+aux;
  });
  let desvioPadraoIteracoes = Math.sqrt((somatorioIteracoes / numExecAlgoritmo));
  
  // Média e desvio padrão do tempo de execução do algoritmo
  let somaTempoExec = tempoExecArr.reduce((soma, te) => soma+te);
  let mediaTempoExec = somaTempoExec / numExecAlgoritmo;

  let somatorioTempoExec = tempoExecArr.reduce((soma, te) => {
    let aux = Math.pow(te - mediaTempoExec, 2);
    return soma+aux;
  });
  let desvioPadraoTempoExec = Math.sqrt((somatorioTempoExec / numExecAlgoritmo));

  // Mostre as cinco melhores soluções distintas encontradas pelo algoritmo
  estadosArr.sort((a,b) => {return a.h - b.h});

  console.log('------- STOCHASTIC HILL CLIMBING -------');
  console.log('======= PARÂMETROS DO ALGORITMO =======');
  console.log(`# Quantidade de rainhas: ${quantidadeRainhas}`);
  console.log(`# Núm. de execução do alg.: ${numExecAlgoritmo}`);
  console.log(`# Núm. máximo de movimentos: ${numMaxMovimentos}`);
  console.log('=======================================');
  console.log('# NÚM. MÍN. DE ITERAÇÕES');
  console.table({'Média': mediaIteracoes, 'Desvio padrão': desvioPadraoIteracoes});
  console.log('');
  console.log('# TEMPO DE EXECUÇÃO DO ALGORITMO');
  console.table({'Média': `${mediaTempoExec} ms`, 'Desvio padrão': `${desvioPadraoTempoExec.toFixed(2)} ms`});
  console.log('=======================================');
  console.log('========== 5 MELHORES SOLUÇÕES ==========');
  for(let i = 0; i < 5; i++){
    console.log(`(${i+1}) ${estadosArr[i].estado}  h = ${estadosArr[i].h}`);
  };
};

executarAlgSHC();