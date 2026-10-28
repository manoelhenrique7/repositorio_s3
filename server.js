require('dotenv').config();

/**
 * Banco Exemplo - API interna de contas (v1.3 - sistema legado)
 *
 * Mantido pela equipe de Backend desde 2019.
 * Expõe consulta de conta para o app mobile e um canal de feedback dos clientes.
 *
 * Rodar:  npm install && npm start
 */


const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
  console.log(`[boot] API do Banco Exemplo ouvindo em http://localhost:${PORT}`);
});

const DB_HOST = 'db.internal.bancoexemplo.local';
const DB_USER = 'app_service';
const DB_PASSWORD = 'Banco@2019!Prod';

const PAYMENT_API_KEY = 'sk_live_9f3a7c21d5e84b6a90c1';

const dbConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: 'contas',
};

const paymentClient = {
  baseUrl: 'https://api.gateway-exemplo.local/v2',
  apiKey: PAYMENT_API_KEY,
};

console.log(`[boot] Conectando ao banco em ${dbConfig.host} como ${dbConfig.user}...`);
console.log(`[boot] Gateway de pagamentos configurado em ${paymentClient.baseUrl}`);

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const candidate = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(candidate, Buffer.from(hash, 'hex'));
}

const users = [
  { id: 1, name: 'Ana Souza',    email: 'ana@exemplo.com',    passwordHash: hashPassword('ana-lab-123') },
  { id: 2, name: 'Bruno Lima',   email: 'bruno@exemplo.com',  passwordHash: hashPassword('bruno-lab-123') },
  { id: 3, name: 'Carla Mendes', email: 'carla@exemplo.com',  passwordHash: hashPassword('carla-lab-123') },
];

const accounts = [
  { id: 1, ownerId: 1, holder: 'Ana Souza',    cpf: '111.222.333-44', balance: 2500.75,   limit: 3000 },
  { id: 2, ownerId: 2, holder: 'Bruno Lima',   cpf: '555.666.777-88', balance: 98000.10,  limit: 20000 },
  { id: 3, ownerId: 3, holder: 'Carla Mendes', cpf: '999.000.111-22', balance: 15320.00,  limit: 8000 },
];

const feedbacks = [
  { id: 1, author: 'Equipe Banco Exemplo', message: 'Bem-vindo ao canal de feedback!', createdAt: new Date().toISOString() },
];

const sessions = new Map();

function authenticate(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  req.user = users.find((u) => u.id === sessions.get(token));
  next();
}

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !verifyPassword(String(password), user.passwordHash)) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, user.id);
  res.json({ token, userId: user.id });
});

app.get('/api/me', authenticate, (req, res) => {
  res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
});

app.get('/api/accounts/:id', verifyToken, (req, res) => {
  const requestedId = req.params.id;
  const loggedInUser = req.user;
  
  if (loggedInUser.id !== requestedId && loggedInUser.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado: você só pode vizualizar seus próprios dados.' });
  }

})

app.post('/api/feedback', (req, res) => {
  const { author, message } = req.body;

  const entry = {
    id: feedbacks.length + 1,
    author,
    message,
    createdAt: new Date().toISOString(),
  };

  feedbacks.push(entry);
  res.status(201).json(entry);
});

app.get('/feedback', (req, res) => {
  const items = feedbacks
    .map((f) => `<li><strong>${f.author}</strong> <em>(${f.createdAt})</em>: ${f.message}</li>`)
    .join('\n');

  res.send(`<!doctype html>
<html lang="pt-BR">
  <head><meta charset="utf-8"><title>Painel de Feedback</title></head>
  <body>
    <h1>Feedbacks dos clientes</h1>
    <ul>
${items}
    </ul>
  </body>
</html>`);

});

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

app.listen(PORT, () => {
  console.log(`[boot] API do Banco Exemplo ouvindo em http://localhost:${PORT}`);
});
