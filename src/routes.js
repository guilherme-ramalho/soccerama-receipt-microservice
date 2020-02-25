import { Router } from 'express';
import ReceiptController from './app/controllers/ReceiptController';

const routes = new Router();

routes.post('/receipt/generate', ReceiptController.generate);

export default routes;
