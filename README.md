# Quick-Reply Portal

This project is a simple web application to send questions or the body of an email to ChatGPT. If the text looks like an email, ChatGPT replies with a draft response. Otherwise it answers the question. The interface includes a dark/light mode toggle.

## Requirements

- Node.js (v18 or later)
- NPM
- An OpenAI API key

## Setup

```bash
npm install
```

Create a `.env` file in the project root. The application uses the
[`dotenv`](https://www.npmjs.com/package/dotenv) package to load this file, so
your OpenAI key can be stored outside the code. Example `.env` file:

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

If the UI displays `Failed to fetch response` the browser could not reach the
server. Make sure the Node.js process is running and accessible at the
configured URL. If you instead see `API key not configured`, verify that the
`OPENAI_API_KEY` variable is loaded for the server process (for example via a
`.env` file or your hosting provider's environment settings).
