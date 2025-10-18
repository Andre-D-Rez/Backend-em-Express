import dotenv from 'dotenv';
dotenv.config();

import { startServer } from './app';

const PORT = process.env.PORT || 3000;

startServer(Number(PORT));
