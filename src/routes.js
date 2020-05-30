import { Router } from 'express';
import ReceiptController from './app/controllers/ReceiptController';
import betValidation from './app/middlewares/validation';

const routes = new Router();

routes.use(betValidation);
routes.post('/recibo/gerar', ReceiptController.generate);

export default routes;
