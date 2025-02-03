import { Router } from 'express';
import auth from './auth';
import tasks from './task'

const routes = Router();

routes.use('/auth', auth);
routes.use('/tasks', tasks);

export default routes;
