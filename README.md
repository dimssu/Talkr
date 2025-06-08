# Cha-ai Chatbot Package

A simple, easily installable chatbot component for React applications.

## Features
- Plug-and-play React chatbot component
- Supports Markdown in chat messages
- Chat history is persisted in localStorage
- Uses the last N messages as context for LLM calls
- File upload and feedback support
- Customizable styling and theming

## Installation

```bash
npm install cha-ai
```

## Usage

Import the component and required CSS files:

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

## Implementation & Props

The `ChatBot` component supports a variety of props for customization:

```tsx
<ChatBot
  backendUrl="YOUR_BACKEND_URL" // or use directLlmConfig for direct LLM API
  headerTitle="Chat Assistant"
  theme="light" // 'light', 'dark', or 'system'
  position="bottom-right" // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  showTimestamps={true}
  enableFileUpload={true}
  enableFeedback={true}
  suggestedQuestions={["What can you do?", "Help me with my order."]}
  styling={{
    widgetColor: '#4f46e5',
    textColor: '#fff',
    userMessageBackground: '#4f46e5',
    botMessageBackground: '#9692e4',
    // ...other style overrides
  }}
  maxHeight="600px"
  persistChat={true} // Persist chat history in localStorage
/>
```

### Key Props
- `backendUrl`: Your backend endpoint for chat completion (required unless using directLlmConfig)
- `directLlmConfig`: Direct config for OpenAI/Gemini/Claude APIs
- `theme`: 'light', 'dark', or 'system'
- `position`: Where the chat widget appears
- `showTimestamps`: Show message timestamps
- `enableFileUpload`: Allow users to upload files
- `enableFeedback`: Allow users to rate bot responses
- `suggestedQuestions`: Array of suggested questions
- `styling`: Object for customizing colors, fonts, etc.
- `persistChat`: Persist chat history in localStorage

## Markdown Support
- Chat messages support **Markdown** (bold, italics, links, code, lists, etc.)
- Markdown is sanitized for security

## Chat History & Context
- Chat history is automatically persisted in localStorage
- When making LLM calls, the last N messages are used as context for better, more relevant responses
- You can clear localStorage to reset the chat history

## Build

```bash
npm run build
```

This will compile the TypeScript files and copy all CSS files to the `dist/components` directory.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT 