import 'dotenv/config';
import app from './app.js';
import { conectar, desconectar } from './config/database.js';

try {
  await conectar();
  console.log('Conectado ao MongoDB');
} catch (error) {
  console.error('Não foi possível conectar ao MongoDB. Verifique MONGODB_URI, MONGODB_DB_NAME e se o servidor está em execução.');
  console.error(error.message);
  process.exit(1);
}

const servidor = app.listen(3000, () => console.log('API em http://localhost:3000'));

async function encerrar() {
  servidor.close();
  await desconectar();
  process.exit(0);
}

process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);