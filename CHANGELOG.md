# Changelog

## v1.2.0 (2024-05-30)
- Added `llmWordLimit` prop to control LLM response length (default: 150 words)
- Fixed code/JSX overflow in chat bubbles (code blocks now scroll horizontally)
- Added `chatId` prop for unique chat history per instance
- Enhanced custom chat button: now supports Lottie, image, or JSX
- Improved documentation and usage examples
- Bugfix: Lottie iframe now allows button clicks (pointer-events fix)
- Accessibility improvements for custom chat button
- Changed default context message count to 5 