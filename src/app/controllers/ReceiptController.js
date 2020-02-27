import Receipt from '../models/Receipt';

class ReceiptController {
  async generate(request, response) {
    try {
      const bet = request.body;

      const receipt = new Receipt(bet);

      // setting canvas background color
      receipt.setBackgroundRect();

      // drawing logo on the top of the page
      await receipt.drawLogo();

      // drawing canvas header
      receipt.drawHeader();

      // drawing events on canvas
      receipt.drawBody();

      return response.json({ base64: receipt.getBase64() });
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
