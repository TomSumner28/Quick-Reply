# Quick-Reply Portal

This project is a simple web application to send questions to ChatGPT and manage a knowledge base of uploaded documents. A dark/light mode toggle is provided.

## Requirements

- Node.js (v18 or later)
- NPM
- An OpenAI API key

## Setup

```bash
npm install
```

Create a `.env` file or set the environment variable `OPENAI_API_KEY` with your API key.

## Running

```bash
npm start
```

The application runs on `http://localhost:3000`.

Uploaded files are stored in the `uploads/` directory and are used as additional context when querying ChatGPT.

## Deployment on Vercel

A `vercel.json` configuration is provided so the Express server can run as a serverless function. When you push the repository to Vercel, it will automatically build and serve `server.js` under the `/api` routes. The configuration also rewrites all paths to this server so that API calls such as `/api/upload` work correctly.
