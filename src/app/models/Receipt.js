import Intl from 'intl';
import ptBrIntl from 'intl/locale-data/jsonp/pt-BR';
import { createCanvas, loadImage } from 'canvas';

class Receipt {
  constructor(bet, bookmakerKey) {
    this.bet = bet;
    this.bookmakerKey = bookmakerKey;
    this.logoHeight = 70;
    this.headerRowHeight = 30;
    this.eventRectHeight = 165;
    this.canvasHeight =
      Math.ceil(this.bet.eventos.length / 2) * this.eventRectHeight +
      3 * this.headerRowHeight +
      this.logoHeight +
      100;
    this.canvas = createCanvas(850, this.canvasHeight);
    this.context = this.canvas.getContext('2d');
    this.logoWidth = 250;
    this.canvasMiddlePoint = this.canvas.width / 2;
    this.context.font = '16px Courier new';
    this.currentDrawingLine = 0;

    // binding functions to the class context
    this.formatMoney = this.formatMoney.bind(this);
    this.drawHeader = this.drawHeader.bind(this);
    this.setBackgroundRect = this.setBackgroundRect.bind(this);
    this.drawLogo = this.drawLogo.bind(this);
    this.drawEventItem = this.drawEventItem.bind(this);
    this.drawChallengeItem = this.drawChallengeItem.bind(this);
    this.bookmakerProps = this.getBookmakerProps(this.bookmakerKey);
  }

  formatMoney(value) {
    return new Intl.NumberFormat(ptBrIntl, {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  getStatus(status) {
    switch (status) {
      case 'VNC':
        return {
          label: 'Venceu',
          color: '#009900',
        };
      case 'CLD':
        return {
          label: 'Cancelado',
          color: '#ff9900',
        };
      case 'PRD':
        return {
          label: 'Perdeu',
          color: '#ff0000',
        };
      case 'ENC':
        return {
          label: 'Encerrado',
          color: '#7c7c7c',
        };
      case 'ANU':
        return {
          label: 'Anulado',
          color: '#0066ff',
        };
      default:
        return {
          label: 'Aguardando',
          color: '#000',
        };
    }
  }

  setBackgroundRect() {
    this.context.fillStyle = this.bookmakerProps.primaryColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getBookmakerProps(bookmakerKey = null) {
    switch (bookmakerKey) {
      case 'newbet':
        return {
          logoUrl: 'http://newbet.bet/assets/images/navbar-logo.png',
          primaryColor: '#144687',
        };
      case 'soccerama':
        return {
          logoUrl:
            'http://soccerama.atlanteti.com/assets/images/navbar-logo.png',
          primaryColor: '#144687',
        };
      default:
        return {
          logoUrl: 'http://bet.msports.online/assets/images/navbar-logo.png',
          primaryColor: '#990005',
        };
    }
  }

  async drawLogo() {
    const { logoUrl } = this.bookmakerProps;

    await loadImage(logoUrl).then(image => {
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
    };

    // Setting the status label text
    const status = this.getStatus(this.bet.status);
    header.Status = status.label;

    let itemsPerRow = 1;
    let loopCount = 0;

    Object.entries(header).map(item => {
      const title = item[0];
      const value = item[1];
      const xPoint = itemsPerRow === 2 ? this.canvasMiddlePoint : 0;
      const yPoint = 90 + Math.floor(loopCount) * this.headerRowHeight;

      this.context.fillStyle =
        Math.ceil(loopCount) % 2 === 0 ? '#F4F4F4' : '#cbcbcd';
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

  drawEventItem(xPoint, yPoint, event) {
    // drawing the event item texts
    this.context.fillStyle = this.bookmakerProps.primaryColor;
    this.context.font = 'bold 18px Georgia';
    this.context.fillText(
      `${event.competidorCasa} X ${event.competidorFora}`,
      xPoint + 10,
      yPoint + 25
    );
    this.context.fillStyle = '#000';
    this.context.font = '18px Georgia';
    this.context.fillText(
      `Modalidade: ${event.palpite.modalidadeCotacao +
        (event.palpite.aoVivo ? '(Ao Vivo)' : '')}`,
      xPoint + 10,
      yPoint + 50
    );
    this.context.fillText(
      `Palpite: ${event.palpite.chaveCotacao}`,
      xPoint + 10,
      yPoint + 75
    );
    this.context.fillText(
      `Valor: ${this.formatMoney(event.palpite.valorCotacao)}`,
      xPoint + 10,
      yPoint + 100
    );
    this.context.fillText(
      `Data/Hora: ${event.data}`,
      xPoint + 10,
      yPoint + 125
    );

    // Drawing status badge
    const status = this.getStatus(event.palpite.statusPalpite);

    this.context.save();
    this.context.fillStyle = status.color; // Background color

    const statusRect = {
      width: this.context.measureText(status.label).width,
      height: parseInt(this.context.font, 10),
    };

    this.context.fillRect(
      xPoint + 10,
      yPoint + 135,
      statusRect.width + 10,
      statusRect.height + 5
    );

    // Drawing status badge text
    this.context.fillStyle = '#fff';
    this.context.fillText(status.label, xPoint + 15, yPoint + 152.5);
    this.context.restore();
  }

  drawChallengeItem(xPoint, yPoint, event) {
    // drawing the event item texts
    this.context.fillStyle = this.bookmakerProps.primaryColor;
    this.context.font = 'bold 18px Georgia';
    this.context.fillText(`${event.desafio}`, xPoint + 10, yPoint + 25);
    this.context.fillStyle = '#000';
    this.context.font = '18px Georgia';
    this.context.fillText(`Tipo: Desafio`, xPoint + 10, yPoint + 50);
    this.context.fillText(`Palpite: ${event.opcao}`, xPoint + 10, yPoint + 75);
    this.context.fillText(
      `Valor: ${this.formatMoney(event.valorCotacao)}`,
      xPoint + 10,
      yPoint + 100
    );
    this.context.fillText(
      `Data/Hora: ${event.data}`,
      xPoint + 10,
      yPoint + 125
    );

    // Drawing status badge
    const status = this.getStatus(event.statusPalpite);

    this.context.save();
    this.context.fillStyle = status.color; // Background color

    const statusRect = {
      width: this.context.measureText(status.label).width,
      height: parseInt(this.context.font, 10),
    };

    this.context.fillRect(
      xPoint + 10,
      yPoint + 135,
      statusRect.width + 10,
      statusRect.height + 5
    );

    // Drawing status badge text
    this.context.fillStyle = '#fff';
    this.context.fillText(status.label, xPoint + 15, yPoint + 152.5);
    this.context.restore();
  }

  drawBody() {
    let itemsPerRow = 1;
    let loopCount = 1;

    // drawing the rects for each event on the bet
    this.bet.eventos.map(event => {
      const xPoint = itemsPerRow === 2 ? this.canvasMiddlePoint : 0;
      const yPoint = this.currentDrawingLine;

      this.context.fillStyle =
        Math.ceil(loopCount) % 2 === 0 ? '#F4F4F4' : '#cbcbcd';
      this.context.fillRect(
        xPoint,
        yPoint,
        this.canvasMiddlePoint,
        this.eventRectHeight
      );

      if (event.tipo === 'D') {
        this.drawChallengeItem(xPoint, yPoint, event);
      } else {
        this.drawEventItem(xPoint, yPoint, event);
      }

      if (itemsPerRow === 2) {
        itemsPerRow = 1;
        this.currentDrawingLine += this.eventRectHeight;
      } else {
        itemsPerRow += 1;
      }

      loopCount += 0.5;
    });
  }

  getBase64() {
    return this.canvas.toDataURL();
  }
}

export default Receipt;
