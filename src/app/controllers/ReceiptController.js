import { createCanvas } from 'canvas';
import Bet from '../models/Bet';

class ReceiptController {
  generate(request, response) {
    try {
      const bet = new Bet(request.body);

      let receiptString = bet.generateReceiptString();
      receiptString = receiptString.split('\n');

      let y = 12;
      const x = 18;
      const canvas = createCanvas(200, 200);
      const context = canvas.getContext('2d');
      const font = '16px Courier new';

      context.font = font;

      const maxStrWidth = receiptString
        .map(e => {
          return context.measureText(e).width;
        })
        .sort((a, b) => {
          return b - a;
        });

      // configura a largura do canvas dinamicamente
      canvas.width = maxStrWidth[0] + 9;
      canvas.height = x * receiptString.length;

      // seta a cor do background do canvas
      context.fillStyle = '#ffffe6';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // escreve o texto
      context.font = font;
      context.fillStyle = '#000';
      receiptString.forEach(e => {
        context.fillText(e, 3, y);
        y += x;
      });

      return response.json({ base64: canvas.toDataURL() });
    } catch (error) {
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
