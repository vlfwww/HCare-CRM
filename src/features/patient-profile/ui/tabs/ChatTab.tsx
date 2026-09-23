import React, { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "server";
  timestamp: string;
}

export const ChatTab: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    const connect = () => {
      if (disposed) return;
      const ws = new WebSocket("wss://ws.ifelse.io");
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
      };
      ws.onerror = () => {
        setConnectionError("Unable to connect to the chat server.");
      };
      ws.onclose = () => {
        setIsConnected(false);
        if (!disposed) {
          reconnectTimer = setTimeout(connect, 3000);
        }
      };
      ws.onmessage = (event) => {
        const incomingText =
          typeof event.data === "string" ? event.data : "New message";
        const serverMessage: Message = {
          id: `${Date.now()}-server`,
          text: incomingText,
          sender: "server",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, serverMessage]);
      };
    };

    connect();
    return () => {
      disposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !input.trim() ||
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    )
      return;

    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socketRef.current.send(input);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs max-w-2xl mx-auto font-manrope">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-gray-800">
            Support Chat (WebSocket Extra)
          </h3>
          <p className="text-xs text-gray-500">
            Connected to wss://ws.ifelse.io
          </p>
          {connectionError && (
            <p className="text-xs text-red-600" role="alert">
              {connectionError} Retrying...
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-500"}`}
          />
          <span className="text-xs text-gray-600 font-medium">
            {isConnected ? "Online" : "Disconnected"}
          </span>
        </div>
      </div>

      <div className="h-72 overflow-y-auto bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 mb-4 flex flex-col">
        {messages.length === 0 ? (
          <div className="m-auto text-center text-gray-400 text-xs">
            No messages yet. Send something to test the echo server!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[75%] p-3 rounded-xl text-xs ${
                msg.sender === "user"
                  ? "bg-emerald-600 text-white self-end rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-200 self-start rounded-bl-none shadow-2xs"
              }`}
            >
              <p>{msg.text}</p>
              <span
                className={`block text-[10px] mt-1 text-right ${msg.sender === "user" ? "text-emerald-100" : "text-gray-400"}`}
              >
                {msg.timestamp}
              </span>
            </div>
          ))
        )}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:border-gray-900"
        />
        <button
          type="submit"
          disabled={!isConnected}
          className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};
