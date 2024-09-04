import { useState } from "react";
import "./App.css";
import { sendToBackground, sendToContent } from "@/utils/messaging";

function App() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<
    { id: number; source: string; message: string }[]
  >([]);

  const handleButtonClick = async (props: string) => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, source: props, message: value }]);
    setValue("");
    const response = await sendToBackground({ message: value });
    setMessages((prev) => [
      ...prev,
      { id, source: "background", message: response },
    ]);
    const response2 = await sendToContent({ message: value });
    setMessages((prev) => [
      ...prev,
      { id, source: "content", message: response2 },
    ]);
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
          <b>{message.source}:</b> {message.message}
        </div>
      ))}
    </>
  );
}

export default App;
