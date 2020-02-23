class ReceiptController {
  generate(request, response) {
    return response.json({ teste: 'teste' });
  }
}

export default new ReceiptController();
