import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const container = 'mongo-tarefas-rs';
const volume = 'mongo-tarefas-rs-data';

function executar(args, { permitirFalha = false } = {}) {
  const resultado = spawnSync('docker', args, { encoding: 'utf8' });
  if (resultado.error) throw resultado.error;
  if (resultado.status !== 0 && !permitirFalha) {
    throw new Error(resultado.stderr.trim() || `docker ${args[0]} falhou.`);
  }
  return resultado;
}

async function subir() {
  const existente = executar(['inspect', container], { permitirFalha: true });
  if (existente.status === 0) {
    executar(['start', container]);
  } else {
    executar([
      'run', '-d',
      '--name', container,
      '-p', '127.0.0.1:27017:27017',
      '-v', `${volume}:/data/db`,
      'mongo:8',
      'mongod', '--replSet', 'rs0', '--bind_ip_all'
    ]);
  }

  let pronto = false;
  for (let tentativa = 0; tentativa < 30; tentativa++) {
    const ping = executar([
      'exec', container, 'mongosh', '--quiet', '--eval',
      'db.adminCommand({ping: 1}).ok'
    ], { permitirFalha: true });
    if (ping.status === 0 && ping.stdout.trim() === '1') {
      pronto = true;
      break;
    }
    await sleep(1000);
  }
  if (!pronto) throw new Error('MongoDB local não iniciou a tempo.');

  const inicializar = executar([
    'exec', container, 'mongosh', '--quiet', '--eval',
    "try { rs.status(); print('ok') } catch (error) { rs.initiate({_id: 'rs0', members: [{_id: 0, host: '127.0.0.1:27017'}]}); print('ok') }"
  ]);
  if (!inicializar.stdout.includes('ok')) {
    throw new Error('Não foi possível iniciar o replica set local.');
  }

  for (let tentativa = 0; tentativa < 30; tentativa++) {
    const primario = executar([
      'exec', container, 'mongosh', '--quiet', '--eval',
      'db.hello().isWritablePrimary'
    ], { permitirFalha: true });
    if (primario.status === 0 && primario.stdout.trim() === 'true') {
      console.log('MongoDB local pronto (replica set rs0).');
      return;
    }
    await sleep(1000);
  }
  throw new Error('O replica set local não elegeu um primário.');
}

const comando = process.argv[2];
if (comando === 'up') {
  await subir();
} else if (comando === 'down') {
  executar(['stop', container]);
} else if (comando === 'logs') {
  const processo = spawn('docker', ['logs', '-f', container], { stdio: 'inherit' });
  processo.on('exit', codigo => process.exitCode = codigo ?? 1);
} else {
  throw new Error('Use: node src/scripts/mongo-local.js up|down|logs');
}
