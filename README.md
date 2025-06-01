# Cha-ai Chatbot Package

A simple, easily installable chatbot component for React applications.

## Installation

```bash
npm install cha-ai
```

## Usage

```tsx
import { ChatBot } from 'cha-ai';
import 'cha-ai/dist/components/ChatBot.css';
import 'cha-ai/dist/components/ChatInput.css';
import 'cha-ai/dist/components/ChatMessage.css';
import 'cha-ai/dist/components/ChatSuggestions.css';
import 'cha-ai/dist/components/ChatFeedback.css';
import 'cha-ai/dist/components/ChatFileUpload.css';

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