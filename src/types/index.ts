export interface ChatBotProps {
    backendUrl: string;
    context: string;
    responseType?: "friendly" | "formal" | "short" | "detailed";
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    styling?: {
      widgetColor?: string;
      textColor?: string;
      fontFamily?: string;
    };
    welcomeMessage?: string;
    botAvatar?: string;
    userAvatar?: string;
    placeholderText?: string;
    theme?: "light" | "dark";
  }
  