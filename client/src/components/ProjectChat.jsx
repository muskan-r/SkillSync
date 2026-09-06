import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import socket from "../services/socket";
import * as messageService from "../services/messageService";

export default function ProjectChat({ projectId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await messageService.getProjectMessages(projectId);
        setMessages(res.data.messages);
      } catch (err) {
        console.error(err);
      }
    };
    loadHistory();

    socket.connect();
    socket.emit("join_project", projectId);

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    socket.emit("send_message", {
      projectId,
      senderId: user.id,
      senderName: user.name,
      content: input,
    });

    setInput("");
  };

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 flex flex-col h-96">
      <h3 className="text-sm font-bold text-white mb-3">Project Chat</h3>

      <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1">
        {messages.length === 0 ? (
          <p className="text-zinc-500 text-sm">No messages yet. Say hello!</p>
        ) : (
          messages.map((msg) => {
            const isMine = (msg.senderId || msg.sender?._id) === user.id;
            const senderName = msg.senderName || msg.sender?.name;
            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    isMine
                      ? "bg-[#00E5C7] text-black"
                      : "bg-zinc-800 text-zinc-200"
                  }`}
                >
                  {!isMine && (
                    <p className="text-[10px] font-semibold opacity-70 mb-0.5">
                      {senderName}
                    </p>
                  )}
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00E5C7]"
        />
        <button
          type="submit"
          className="bg-[#00E5C7] hover:bg-[#00c2a8] text-black font-semibold rounded px-4 py-2 text-sm transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}