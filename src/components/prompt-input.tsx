import { useRef } from "react";
import { PromptInputTextarea } from "./ui/prompt-input";
import { useTypingAnimation } from "../hooks/typing-animation";

export function PromptInputTextareaWithTypingAnimation() {
  const placeholderRef = useRef<HTMLTextAreaElement>(null);

  const exampleIdeas = [
    "a personal finance tracking tool",
    "a social media app for book lovers",
    "a tool for managing remote teams",

  ];

  const { displayText } = useTypingAnimation({
    texts: exampleIdeas,
    baseText: "I want to build",
    typingSpeed: 100,
    erasingSpeed: 50,
    pauseDuration: 2000,
    initialDelay: 500,
  });

  return (
    <PromptInputTextarea
      ref={placeholderRef}
      placeholder={displayText}
      className="min-h-[100px] w-full bg-transparent dark:bg-transparent backdrop-blur-sm pr-12"
      onBlur={() => {}}
    />
  );
}
