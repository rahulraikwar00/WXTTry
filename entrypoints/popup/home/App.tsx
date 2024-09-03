import { useState } from "react";
import "./App.css";

function App() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<
    { id: number; source: string; text: string }[]
  >([]);

  const handleButtonClick = async (props: string) => {
    // Add the user's message
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now(), source: props, text: value },
    ]);

    try {
      const response = await browser.runtime.sendMessage({
        messages: value,
      });

      // Check if the response is defined before updating the state
      if (response !== undefined) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now(),
            source: "background",
            text: JSON.stringify(response.message),
          },
        ]);
      } else {
        console.error("Received undefined response from background script");
      }
    } catch (error) {
      console.error("Error sending message to background script:", error);
    }

    setValue("");
  };

  return (
    <>
      <div className="card">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          onClick={() => {
            handleButtonClick("popup");
          }}
        >
          Send
        </button>
      </div>
      {messages.map((message) => (
        <div key={message.id} className="card">
          <b>{message.source}:</b> {message.text}
        </div>
      ))}
    </>
  );
}

export default App;
