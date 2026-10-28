# 🛡️ Lab Prático: Code Review Defensivo & Segurança em APIs

Repositório oficial para a atividade prática da disciplina de **Fundamentos de Segurança da Informação** do curso de Análise e Desenvolvimento de Sistemas (ADS) — **IFCE Campus Boa Viagem**.

- **Docente:** Prof. Esp. Wesnei de Paiva Batista
- **Objetivo:** Aplicar conceitos de **Defesa em Profundidade** e **Programação Defensiva** através da auditoria e refatoração de um sistema backend legado.

## ⚠️ Nota da Auditoria (Aviso Importante)
O código disponibilizado neste repositório **é intencionalmente feio, desorganizado e repleto de más práticas**. Ele simula fielmente um sistema legado real criado às pressas. O seu objetivo como Engenheiro de Segurança não é reescrever a aplicação do zero, mas sim realizar o *Code Review*, rastrear as brechas escondidas e aplicar o *refactoring* estritamente necessário para blindar a segurança da API.

## 📋 Contexto da Atividade (O Desafio)
Você e sua dupla acabam de ser contratados como **Engenheiros de Segurança Defensiva** por uma empresa fictícia (*Banco Exemplo*). O time de auditoria externa emitiu um relatório alertando que a API interna de contas em produção apresenta falhas graves de segurança.

O seu objetivo é clonar este repositório, subir o servidor localmente, investigar o código-fonte em busca de brechas e realizar o *refactoring* seguro.

## ⚙️ Pré-requisitos
Para executar este projeto na sua máquina, você precisa ter instalado:
- **Node.js** (versão 16 ou superior recomendada)
- **Git**
- Uma ferramenta de testes de API (ex: **Postman**, **Insomnia** ou terminal com **cURL**)

## 🚀 Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Wesnei/ifce-fsi-code-review-defensivo.git
   cd ifce-fsi-code-review-defensivo

```

2. Instale as dependências:
npm install

```

3. **Inicie o servidor local:**
```bash
npm start

```


*O terminal deverá exibir a mensagem:* `[boot] API do Banco Exemplo ouvindo em http://localhost:3000`

## 🔑 Credenciais de Acesso (Mocks para Teste)

O sistema legado já possui utilizadores simulados pré-cadastrados para o laboratório. Utilize as credenciais abaixo para testar a rota de `/login`:

* **E-mail:** `ana@exemplo.com` | **Senha:** `ana-lab-123`
* **E-mail:** `bruno@exemplo.com` | **Senha:** `bruno-lab-123`
* **E-mail:** `carla@exemplo.com` | **Senha:** `carla-lab-123`

## 🔍 A Missão da Dupla (O que deve ser resolvido)

O relatório de auditoria aponta que existem **três vulnerabilidades críticas ocultas** neste código legado. Investiguem as rotas, os arquivos de configuração e os endpoints para resolver:

1. **Credenciais Expostas (Hardcoded):** Retirar as senhas e chaves sensíveis do código-fonte e isolá-las em um arquivo de variáveis de ambiente (`.env`), utilizando um `.env.example` no repositório.
2. **Quebra de Autorização (Controle de Acesso):** Corrigir a rota de consulta de contas para garantir que um utilizador autenticado só pode consultar os seus próprios dados financeiros (evitando IDOR).
3. **Falta de Sanitização (Prevenção contra XSS):** Tratar e escapar as entradas do usuário no canal de feedback para evitar a injeção de scripts maliciosos no painel HTML.

## 📤 Instruções de Entrega

Ao final da atividade, **apenas um membro da dupla** deve fazer o *push* das soluções propostas e resolvidas para um repositório no GitHub e enviar o link do repositório corrigido para o professor. Certifiquem-se de que o arquivo `.env` **não** foi enviado para o GitHub (utilizem o `.env.example`).
