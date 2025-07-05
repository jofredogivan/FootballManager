// js/temporada.js

import { clubesSerieA, clubesSerieB } from "./clubes.js";
import { myTeam } from "./team.js";

let rodadaAtual = 1;
let totalRodadas = 38;

const tabela = {};
const jogos = [];

export function iniciarTemporada() {
  const todosOsTimes = [...clubesSerieA];
  if (!todosOsTimes.includes(myTeam.name)) todosOsTimes[0] = myTeam.name;

  todosOsTimes.forEach(time => {
    tabela[time] = {
      time,
      pts: 0,
      v: 0,
      e: 0,
      d: 0,
      gp: 0,
      gc: 0
    };
  });

  while (jogos.length < totalRodadas) {
    const adversarios = todosOsTimes.filter(t => t !== myTeam.name);
    const sorteado = adversarios[Math.floor(Math.random() * adversarios.length)];
    if (!jogos.includes(sorteado)) jogos.push(sorteado);
  }
}

export function simularRodada() {
  if (rodadaAtual > totalRodadas) return { fim: true, mensagem: verificarFimTemporada() };

  const adversario = jogos[rodadaAtual - 1];
  const golsMeuTime = Math.floor(Math.random() * 5);
  const golsAdversario = Math.floor(Math.random() * 5);

  tabela[myTeam.name].gp += golsMeuTime;
  tabela[myTeam.name].gc += golsAdversario;
  tabela[adversario].gp += golsAdversario;
  tabela[adversario].gc += golsMeuTime;

  if (golsMeuTime > golsAdversario) {
    tabela[myTeam.name].pts += 3;
    tabela[myTeam.name].v++;
    tabela[adversario].d++;
  } else if (golsMeuTime < golsAdversario) {
    tabela[adversario].pts += 3;
    tabela[adversario].v++;
    tabela[myTeam.name].d++;
  } else {
    tabela[myTeam.name].pts += 1;
    tabela[adversario].pts += 1;
    tabela[myTeam.name].e++;
    tabela[adversario].e++;
  }

  rodadaAtual++;
  return {
    rodada: rodadaAtual - 1,
    adversario,
    placar: `${golsMeuTime} x ${golsAdversario}`,
    fim: false
  };
}

export function getClassificacao() {
  const tabelaArray = Object.values(tabela);
  tabelaArray.sort((a, b) => b.pts - a.pts || (b.gp - b.gc) - (a.gp - a.gc));
  return tabelaArray.map((t, i) => ({ pos: i + 1, ...t }));
}

function verificarFimTemporada() {
  const tabelaAtual = getClassificacao();
  const posicao = tabelaAtual.find(t => t.time === myTeam.name)?.pos;

  if (posicao <= 4) {
    return `🏆 Parabéns! Você terminou em ${posicao}º lugar e está classificado para a Libertadores!`;
  } else if (posicao <= 12) {
    return `✅ Boa campanha! Você terminou em ${posicao}º e garantiu vaga na Sul-Americana.`;
  } else if (posicao >= 17) {
    return `❌ Infelizmente você foi rebaixado. ${posicao}º lugar.`;
  } else {
    return `😐 Temporada encerrada com ${posicao}º lugar. Objetivo cumprido.`;
  }
}
