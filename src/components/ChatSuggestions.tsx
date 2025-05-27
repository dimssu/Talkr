import './ChatSuggestions.css';

interface ChatSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  styling?: {
    widgetColor?: string;
    textColor?: string;
  };
}

export const ChatSuggestions = ({
  suggestions,
  onSuggestionClick,
  styling = {},
}: ChatSuggestionsProps) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="suggestionsContainer">
      <div className="suggestionsLabel">Suggested questions:</div>
      <div className="suggestionsList">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestionButton"
            onClick={() => onSuggestionClick(suggestion)}
            style={{
              borderColor: styling.widgetColor || '#4f46e5',
              color: styling.widgetColor || '#4f46e5',
            }}
            aria-label={`Ask: ${suggestion}`}
          >
            <span className="suggestionIcon">?</span>
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}; 