# Growtwitter ( Projeto Full Stack III )

Uma rede social estilo Twitter desenvolvida com React, TypeScript, MAterial UI, Redux Toolkit, React Router DOM e Vite.

## Tecnologias

- React 18
- TypeScript
- Vite
- Material UI
- Redux Toolkit
- React Router DOM

## Como rodar o projeto

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
# Copie o arquivo .env.example para .env
cp .env.example .env

# Edite o arquivo .env se necessário
# VITE_API_BASE_URL=
```

3. Rode o projeto em modo desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:5173
```

## Funcionalidades

- Login e cadastro de usuários
- Feed de tweets com abas "Para você" e "Seguindo"
- Criar tweets e respostas
- Curtir tweets
- Seguir e deixar de seguir usuários
- Visualizar perfis de usuários
- Tema claro e escuro

## API

O projeto consome a API do Growtwitter. A URL da API é configurada através da variável de ambiente `VITE_API_BASE_URL`.

**Variáveis de ambiente disponíveis:**
- `VITE_API_BASE_URL`: URL base da API (obrigatório)

## Build para produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.
