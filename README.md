# Talkr Chatbot Package

A simple, easily installable chatbot component for React applications.

## Installation

```bash
npm install talkr-test
```

## Usage

```tsx
import { ChatBot } from 'talkr-test';
import 'talkr-test/dist/components/ChatBot.css';
import 'talkr-test/dist/components/ChatInput.css';
import 'talkr-test/dist/components/ChatMessage.css';
import 'talkr-test/dist/components/ChatSuggestions.css';
import 'talkr-test/dist/components/ChatFeedback.css';
import 'talkr-test/dist/components/ChatFileUpload.css';

function App() {
  return <ChatBot backendUrl="YOUR_BACKEND_URL" />;
}
```

> **Note:** You must import the CSS files for the chatbot to be styled correctly. You can import only the components you use, or all of them as shown above.

## Build

```bash
npm run build
```

This will compile the TypeScript files and copy all CSS files to the `dist/components` directory.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT 