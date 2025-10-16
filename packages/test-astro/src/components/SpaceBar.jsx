import { useState, useEffect } from "preact/hooks";

export default function SpaceBar({ className, messages }) {
  const getRandomMessage = () =>
    messages[Math.floor(Math.random() * messages.length)];
  const [message, setMessage] = useState(getRandomMessage());

  useEffect(() => {
    const handleSpacebar = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setMessage(getRandomMessage());
      }
    };
    window.addEventListener("keydown", handleSpacebar);
    return () => window.removeEventListener("keydown", handleSpacebar);
  }, [messages]);

  return (
    <button
      id="space-pop-culture"
      className={`flex w-full cursor-pointer text-left sm:text-balance ${className}`}
      title="Click Me!"
      onClick={() => setMessage(getRandomMessage())}
    >
      📻 Space Bar: {message}
    </button>
  );
}
