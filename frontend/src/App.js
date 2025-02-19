
import io from "socket.io-client";
import Chat from "./component/Chat";
import "./App.css";
import { useState,useEffect } from "react";

const socket = io.connect(["http://localhost:5000","https://chat-backend-9dua.onrender.com"]);

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const leaveChat = () => {
    socket.emit("leave_room", room); 
    setShowChat(false); 
    setUsername(""); 
    setRoom(""); 
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join a Chat Room</h3>
          <input
            type="text"
            placeholder="Enter your name..."
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} leaveChat={leaveChat} />
      )}
    </div>
  );
}

export default App;
