import { createCanvas } from 'canvas';

class ReceiptController {
  generate(request, response) {
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');

    // Write "Awesome!"
    ctx.font = '30px Impact';
    ctx.rotate(0.1);
    ctx.fillText('Awesome!', 50, 100);

    // Draw line under text
    const text = ctx.measureText('Awesome!');
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.lineTo(50, 102);
    ctx.lineTo(50 + text.width, 102);
    ctx.stroke();

    return response.json({ base64: canvas.toDataURL() });
  }
}

export default new ReceiptController();
