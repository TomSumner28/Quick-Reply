# Quick-Reply Portal

This project is a simple web application to send questions or email text to ChatGPT and manage a knowledge base of uploaded documents. The UI offers a dark/light mode toggle and provides a dedicated Knowledge Base page (available at `/knowledge`) for viewing, uploading and deleting documents.

## Requirements

- Node.js (v18 or later)
- NPM
- An OpenAI API key

## Setup

```bash
npm install
```

Create a `.env` file or otherwise set the environment variable `OPENAI_API_KEY` with your OpenAI API key. Example `.env` file:

```
OPENAI_API_KEY=your-key-here
```

Ensure this variable is also configured in your hosting provider (for example in
Vercel's project settings) so the server can authenticate with OpenAI. If the
key is missing the server will respond with `API key not configured`.

## Running

```bash
npm start
```

The application runs on `http://localhost:3000`.

Uploaded files are stored in the `uploads/` directory (created automatically at runtime) and can be viewed or removed from `/knowledge`. These files are used as additional context when querying ChatGPT.

When the server starts, any files already in the `uploads/` folder are
automatically loaded back into the knowledge base.

If the UI displays `Failed to fetch response` the browser could not reach the
server. Make sure the Node.js process is running and accessible at the
configured URL. If you instead see `API key not configured`, verify that the
`OPENAI_API_KEY` variable is loaded for the server process (for example via a
`.env` file or your hosting provider's environment settings).
