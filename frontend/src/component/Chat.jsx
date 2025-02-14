import React, { useState, useEffect } from "react";
import "./Chat.css";

function Chat({ socket, username, room }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (message !== "") {
      const messageData = {
        room,
        author: username,
        message,
        time: new Date().toLocaleTimeString(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  return (
    <div className="chatContainer">
      <div className="chatHeader">
        <p>Chat Room: {room}</p>
      </div>
      <div className="chatBody">
        {messageList.map((msg, index) => (
          <div key={index} className={msg.author === username ? "you" : "other"}>
            <div className="messageContent">
              <p>{msg.message}</p>
            </div>
            <div className="messageMeta">
              <p>{msg.author}</p>
              <span>{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="chatFooter">
        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
