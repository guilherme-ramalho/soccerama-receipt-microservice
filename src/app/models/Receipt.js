import Intl from 'intl';
import ptBrIntl from 'intl/locale-data/jsonp/pt-BR';
import { createCanvas, loadImage } from 'canvas';

class Receipt {
  constructor(bet) {
    this.bet = bet;
    this.canvas = createCanvas(700, this.bet.eventos.length * 40);
    this.context = this.canvas.getContext('2d');
    this.logoWidth = 250;
    this.logoHeight = 70;
    this.canvasMiddlePoint = this.canvas.width / 2;
    this.headerRowHeight = 30;
    this.context.font = '16px Courier new';
    this.currentDrawingLine = 0;

    // binding functions to the class context
    this.formatMoney = this.formatMoney.bind(this);
    this.drawHeader = this.drawHeader.bind(this);
    this.setBackgroundRect = this.setBackgroundRect.bind(this);
    this.drawLogo = this.drawLogo.bind(this);
  }

  formatMoney(value) {
    return new Intl.NumberFormat(ptBrIntl, {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  getSatusMessage(status) {
    switch (status) {
      case 'VNC':
        return 'Venceu';
      case 'CLD':
        return 'Cancelada';
      case 'PRD':
        return 'Perdeu';
      default:
        return 'Aguardando';
    }
  }

  setBackgroundRect() {
    this.context.fillStyle = '#ffffe6';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  async drawLogo() {
    await loadImage(
      'http://bet.msports.online/assets/images/navbar-logo.png'
    ).then(image => {
      this.context.drawImage(
        image,
        (this.canvas.width - this.logoWidth) / 2,
        10,
        this.logoWidth,
        this.logoHeight
      );
    });

    this.currentDrawingLine = 90;
  }

  drawHeader() {
    const header = {
      Apostador: this.bet.nomeApostador,
      Valor: this.formatMoney(this.bet.valorApostado),
      Código: this.bet.codigo,
      Prêmio: this.formatMoney(this.bet.valorPremio),
      Data: this.bet.data,
      Status: this.getSatusMessage(this.bet.status),
    };

    let itemsPerRow = 1;
    let loopCount = 0;

    Object.entries(header).map(item => {
      const title = item[0];
      const value = item[1];
      const xPoint = itemsPerRow === 2 ? this.canvasMiddlePoint : 0;
      const yPoint = 90 + Math.floor(loopCount) * this.headerRowHeight;

      this.context.fillStyle =
        Math.ceil(loopCount) % 2 === 0 ? '#fafa89' : '#dbdb23';
      this.context.fillRect(
        xPoint,
        yPoint,
        this.canvasMiddlePoint,
        this.headerRowHeight
      );
      this.context.fillStyle = '#000';
      this.context.font = '20px Georgia';
      this.context.fillText(`${title}: ${value}`, xPoint + 10, yPoint + 25);

      if (itemsPerRow === 2) {
        itemsPerRow = 1;
        this.currentDrawingLine += this.headerRowHeight + 10;
      } else {
        itemsPerRow += 1;
      }

      // itemsPerRow = itemsPerRow === 2 ? 1 : itemsPerRow + 1;
      loopCount += 0.5;
    });
  }

  drawBody() {
    this.context.fillStyle = '#000';
    this.context.font = '20px Georgia';
    this.context.fillText('teste', 10, this.currentDrawingLine);
  }

  getBase64() {
    return this.canvas.toDataURL();
  }
}

export default Receipt;
