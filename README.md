# Quick-Reply Portal

A minimal web app for quickly asking ChatGPT a question or pasting an email to
get a draft reply. The interface offers a light/dark mode toggle and a single
text box for your message.

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

Open the home page and type a question or paste an email into the box. The
response from ChatGPT will appear below the form. Use the *Dark Mode* button to
switch between light and dark themes.

