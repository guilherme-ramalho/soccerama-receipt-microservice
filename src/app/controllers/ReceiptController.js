import { createCanvas, loadImage } from 'canvas';

class ReceiptController {
  async generate(request, response) {
    try {
      // constants
      const bet = request.body;
      const canvasWidth = 700;
      const canvasHeight = bet.eventos.length * 40;
      const logoWidth = 250;
      const logoHeight = 70;
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const context = canvas.getContext('2d');
      const headerRowHeight = 30;
      const canvasMiddlePoint = canvas.width / 2;
      context.font = '16px Courier new';

      // setting canvas background color
      context.fillStyle = '#ffffe6';
      context.fillRect(0, 0, canvas.width, canvas.height);

      const header = {
        Apostador: bet.nomeApostador,
        Valor: bet.valorApostado,
        Código: bet.codigo,
        Prêmio: bet.valorPremio,
        Data: bet.data,
        Status: bet.status,
      };

      let itemsPerRow = 1;
      let loopCount = 0;

      // drawing receipt header items
      Object.entries(header).map(item => {
        const title = item[0];
        const value = item[1];
        const xPoint = itemsPerRow === 2 ? canvasMiddlePoint : 0;
        const yPoint = 90 + Math.floor(loopCount) * headerRowHeight;

        context.fillStyle =
          Math.ceil(loopCount) % 2 === 0 ? '#fafa89' : '#dbdb23';
        context.fillRect(xPoint, yPoint, canvasMiddlePoint, headerRowHeight);
        context.fillStyle = '#000';
        context.font = '20px Georgia';
        context.fillText(`${title}: ${value}`, xPoint + 10, yPoint + 25);

        itemsPerRow = itemsPerRow === 2 ? 1 : itemsPerRow + 1;
        loopCount += 0.5;
      });

      // drawing logo on the top of the page
      await loadImage(
        'http://bet.msports.online/assets/images/navbar-logo.png'
      ).then(image => {
        context.drawImage(
          image,
          (canvasWidth - logoWidth) / 2,
          10,
          logoWidth,
          logoHeight
        );
      });

      return response.json({ base64: canvas.toDataURL() });
    } catch (error) {
      console.log(error);
      return response.json({
        meta: {
          status: 'error',
          message: 'Erro ao gerar comprovante',
        },
      });
    }
  }
}

export default new ReceiptController();
