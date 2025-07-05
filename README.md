# Cha-ai Chatbot Package

A simple, easily installable chatbot component for React applications.

---

## Features
- Plug-and-play React chatbot component
- Supports **Markdown** in chat messages
- **Chat history** is persisted in localStorage (with unique `chatId` support)
- Uses the last N messages as **context** for LLM calls
- **File upload** and **feedback** support
- **Customizable styling** and theming
- **Custom chat button** (icon, Lottie, image, or full JSX component)
- **Accessibility**: Keyboard navigation, ARIA labels
- Works with **OpenAI, Gemini, Claude**, or your own backend

---

## Installation

```bash
npm install cha-ai
```

---

## Usage

Import the component and required CSS files:

```tsx
import { ChatBot } from 'cha-ai';

function App() {
  return <ChatBot backendUrl="YOUR_BACKEND_URL" />;
}
```

---

## Implementation Examples

### Direct OpenAI Integration

```tsx
import { ChatBot } from 'cha-ai';

function App() {
  return (
    <div>
      <h1>Direct OpenAI Integration</h1>
      <ChatBot
        directLlmConfig={{
          provider: 'openai',
          apiKey: process.env.REACT_APP_OPENAI_API_KEY,
          model: 'gpt-3.5-turbo',
          systemPrompt: 'You are a helpful assistant that specializes in web development.'
        }}
        headerTitle="Dev Assistant"
        theme="light"
        showTimestamps={true}
        suggestedQuestions={[
          "Help me with React",
          "Explain TypeScript",
          "CSS best practices",
          "JavaScript tips"
        ]}
      />
    </div>
  )
}
```

This example shows how to use the chatbot with OpenAI directly, passing your API key and model. You can use similar patterns for Gemini, Claude, or your own backend.

---

## Props & Customization

### Main Props
| Prop                | Type                                   | Description |
|---------------------|----------------------------------------|-------------|
| `backendUrl`        | `string`                               | Your backend endpoint for chat completion (required unless using `directLlmConfig`) |
| `directLlmConfig`   | `DirectLlmConfig`                      | Direct config for OpenAI/Gemini/Claude APIs |
| `theme`             | `'light' \| 'dark' \| 'system'`        | Color theme for the chat widget |
| `position`          | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | Where the chat widget appears |
| `headerTitle`       | `string`                               | Custom header title |
| `showTimestamps`    | `boolean`                              | Show message timestamps |
| `enableFileUpload`  | `boolean`                              | Allow users to upload files |
| `enableFeedback`    | `boolean`                              | Allow users to rate bot responses |
| `suggestedQuestions`| `string[]`                             | Array of suggested questions |
| `styling`           | `ChatBotStyling`                       | Object for customizing colors, fonts, button, etc. |
| `maxHeight`         | `string`                               | Maximum height of the chat window |
| `persistChat`       | `boolean`                              | Persist chat history in localStorage |
| `chatId`            | `string`                               | Unique identifier for chat instance (prevents shared history across multiple chatbots) |
| `chatButtonIcon`    | `string \| React.ReactNode`            | Custom icon for chat button (URL, Lottie, or React component) |
| `customChatButton`  | `string \| React.ReactNode`            | Complete custom chat button (image URL, Lottie URL, or JSX component) |
| `botAvatarUrl`      | `string`                               | Custom avatar URL for the bot |
| `onBeforeSend`      | `(message: string) => string \| false` | Function to call before sending message to backend |
| `onAfterResponse`   | `(response: string) => string`          | Function to call after receiving response |
| `onFeedbackSubmit`  | `(messageId: string, rating: 'positive' \| 'negative', comment?: string) => void` | Called when feedback is submitted |
| `onFileUpload`      | `(file: File) => Promise<void>`         | Called when a file is uploaded |
| `allowedFileTypes`  | `string[]`                             | Allowed file types for upload |
| `maxFileSizeMB`     | `number`                               | Max file size in MB |
| `llmWordLimit`      | `number`                               | Word limit for LLM responses (default: 150) |
| `className`         | `string`                               | Custom class name for the container |

### Styling Props (`ChatBotStyling`)
| Prop                    | Type                | Description |
|-------------------------|---------------------|-------------|
| `containerStyle`        | `CSSProperties`     | Style for the outer container |
| `headerStyle`           | `CSSProperties`     | Style for the header |
| `bodyStyle`             | `CSSProperties`     | Style for the chat body |
| `windowStyle`           | `CSSProperties`     | Style for the chat window |
| `buttonStyle`           | `CSSProperties`     | Style for the chat button |
| `chatButtonIconStyle`   | `CSSProperties`     | Style for the chat button icon |
| `customChatButtonStyle` | `CSSProperties`     | Style for the custom chat button wrapper |
| `widgetColor`           | `string`            | Main color for the widget |
| `textColor`             | `string`            | Main text color |
| `sendButtonTextColor`   | `string`            | Send button text color |
| `fontFamily`            | `string`            | Font family |
| `borderRadius`          | `string`            | Border radius |
| `boxShadow`             | `string`            | Box shadow |
| `chatBackground`        | `string`            | Chat background color |
| `userMessageBackground` | `string`            | User message background |
| `botMessageBackground`  | `string`            | Bot message background |

---

## Custom Chat Button: Full Guide

The `ChatBot` component allows you to fully customize the chat button that opens the chat window. You can use:

### 1. **Custom Icon Only (`chatButtonIcon`)**
- Use this if you want to keep the default button but change the icon inside it.
- Accepts a URL (image or Lottie) or a React component.

```tsx
<ChatBot chatButtonIcon="https://your-domain.com/logo.png" />
<ChatBot chatButtonIcon={<MyCustomIcon size={24} />} />
<ChatBot chatButtonIcon="https://lottie.host/your-lottie-url" />
```

### 2. **Complete Custom Button (`customChatButton`)**
- Use this if you want to replace the entire button (not just the icon).
- Accepts:
  - A string (image URL or Lottie URL)
  - A React component (JSX)

#### **a. Image URL**
```tsx
<ChatBot customChatButton="https://your-domain.com/chat-button.png" />
```

#### **b. Lottie Animation URL**
```tsx
<ChatBot customChatButton="https://lottie.host/your-animation-url" />
```

#### **c. JSX/React Component**
```tsx
<ChatBot 
  customChatButton={
    <div className="my-custom-chat-button">
      <img src="/my-logo.png" alt="Chat" />
      <span>Chat with us!</span>
    </div>
  }
/>
```

### 3. **Styling the Custom Button**
- Use the `styling.customChatButtonStyle` prop to style the wrapper of your custom button.
- Example:
```tsx
<ChatBot
  customChatButton="https://your-domain.com/button.png"
  styling={{
    customChatButtonStyle: {
      width: '80px',
      height: '80px',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }
  }}
/>
```

### 4. **How the Props Interact**
- If you provide `customChatButton`, it **replaces the entire button** and the `chatButtonIcon` prop is ignored.
- If you only provide `chatButtonIcon`, the default button is used with your custom icon inside.

### 5. **Accessibility & Behavior**
- The custom button is always clickable and keyboard accessible.
- Lottie and image URLs are automatically handled for pointer events and sizing.
- You can add your own ARIA labels or rely on the default.

---

**Summary Table:**

| Prop                | What it does                                      | Example usage                                 |
|---------------------|---------------------------------------------------|-----------------------------------------------|
| `chatButtonIcon`    | Changes the icon inside the default button        | `<ChatBot chatButtonIcon="url" />`          |
| `customChatButton`  | Replaces the entire button (icon, shape, etc.)    | `<ChatBot customChatButton={<JSX />} />`      |
| `customChatButtonStyle` | Styles the custom button wrapper              | `styling={{ customChatButtonStyle: {...} }}`  |

---

## Markdown Support
- Chat messages support **Markdown** (bold, italics, links, code, lists, etc.)
- Markdown is sanitized for security

---

## Chat History & Context
- Chat history is automatically persisted in localStorage when `persistChat={true}`
- Each chatbot instance can have its own separate chat history using the `chatId` prop
- When making LLM calls, the last N messages are used as context for better, more relevant responses
- You can clear localStorage to reset the chat history

### Multiple Chatbot Instances
If you have multiple chatbots on different pages or sections, use unique `chatId` values:

```tsx
// Support chat
<ChatBot chatId="support" persistChat={true} />

// Sales chat  
<ChatBot chatId="sales" persistChat={true} />

// FAQ chat
<ChatBot chatId="faq" persistChat={true} />
```

Each will maintain separate chat histories in localStorage.

---

## Accessibility
- All interactive elements are keyboard accessible
- ARIA labels for screen readers
- Focus outlines for custom and default buttons

---

## Build

```bash
npm run build
```

This will compile the TypeScript files and copy all CSS files to the `dist/components` directory.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT 

---

## LLM Word Limit
- Use the `llmWordLimit` prop to control the maximum number of words in the LLM's response.
- Default: `150`
- The chatbot will instruct the LLM to limit its response accordingly.

```tsx
<ChatBot llmWordLimit={100} />
``` 