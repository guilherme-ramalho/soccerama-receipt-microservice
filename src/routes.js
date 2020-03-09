import { Router } from 'express';
import ReceiptController from './app/controllers/ReceiptController';

const routes = new Router();

routes.post('/recibo/gerar', ReceiptController.generate);

export default routes;
