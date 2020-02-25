import Intl from 'intl';
import ptBrIntl from 'intl/locale-data/jsonp/pt-BR';

class Bet {
  constructor(bet) {
    this.bet = bet;
  }

  formatMoney(value) {
    new Intl.NumberFormat(ptBrIntl, {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  generateReceiptString() {
    const divider = {
      hash: `${'#'.repeat(32)}\n`,
      line: `${'-'.repeat(32)}\n`,
      equal: `${'='.repeat(32)}`,
    };

    const header =
      `Cod. Aposta: ${this.bet.codigo}\n` +
      `Apostador: ${this.bet.nomeApostador}\n` +
      `Valor Apostado: ${this.bet.valorApostado}\n` +
      `Valor Premio: ${this.bet.valorPremio}\n` +
      `Data Aposta: ${this.bet.data}\n` +
      `Qtd. Partidas: ${this.bet.eventos.length}\n`;

    const events = this.bet.eventos.reduce((stringHolder, event) => {
      const eventString =
        `${divider.line}${event.competidorCasa} X ${event.competidorFora}\n` +
        `Mod.:${event.palpite.modalidadeCotacao}${
          event.palpite.aoVivo ? '(Ao Vivo)' : ''
        }\n` +
        `Tipo: ${event.palpite.chaveCotacao}\n` +
        `Cotacao: ${event.palpite.valorCotacao}\n` +
        `Data/Hora: ${event.data}\n`;

      return stringHolder + eventString;
    }, '');

    return `${header + events}\n`;
  }
}

export default Bet;
