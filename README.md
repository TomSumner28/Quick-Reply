# Quick-Reply Portal

This project is a simple web application to send questions or email text to ChatGPT and manage a knowledge base of uploaded documents. The UI offers a dark/light mode toggle and allows viewing and deleting uploaded documents.

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

Uploaded files are stored in the `uploads/` directory and can be viewed or removed from the Knowledge Base modal. They are used as additional context when querying ChatGPT.
