# Quick-Reply Portal

This project is a simple web application to send questions or email text to ChatGPT and manage a knowledge base of uploaded documents. The UI offers a dark/light mode toggle and provides a dedicated Knowledge Base page (available at `/knowledge.html`) for viewing, uploading and deleting documents.

## Requirements

- Node.js (v18 or later)
- NPM
- An OpenAI API key

## Setup

```bash
npm install
```

Create a `.env` file or set the environment variable `OPENAI_API_KEY` with your OpenAI API key. Example `.env` file:

```
OPENAI_API_KEY=your-key-here
```

## Running

```bash
npm start
```

The application runs on `http://localhost:3000`.

Uploaded files are stored in the `uploads/` directory (created automatically at runtime) and can be viewed or removed from `knowledge.html`. These files are used as additional context when querying ChatGPT.
