import { createCanvas, loadImage } from 'canvas';

class ReceiptController {
  async generate(request, response) {
    try {
      const bet = request.body;

      const canvas = createCanvas(800, bet.eventos.length * 40);
      const context = canvas.getContext('2d');

      context.font = '16px Courier new';

      // setting canvas background color
      context.fillStyle = '#ffffe6';
      context.fillRect(0, 0, canvas.width, canvas.height);

      await loadImage(
        'http://bet.msports.online/assets/images/navbar-logo.png'
      ).then(image => {
        context.drawImage(image, 275, 10, 250, 70);
      });

      // const maxStrWidth = receiptString
      //   .map(e => {
      //     return context.measureText(e).width;
      //   })
      //   .sort((a, b) => {
      //     return b - a;
      //   });

      // // configura a largura do canvas dinamicamente
      // canvas.width = maxStrWidth[0] + 9;
      // canvas.height = x * receiptString.length;

      // // escreve o texto
      // context.font = font;
      // context.fillStyle = '#000';
      // receiptString.forEach(e => {
      //   context.fillText(e, 3, y);
      //   y += x;
      // });

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
