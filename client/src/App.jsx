import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000/"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId, setSocketId] = useState("");

  const [allMessages, setAllMessage] = useState([{}]);

  function handleFormSubmit(event) {
    event.preventDefault();
    setAllMessage((mess) => [...mess, { message, type: "going" }]);
    socket.emit("message", { message, room });
    setMessage("");
    console.log(allMessages);
  }

  function handleJoinRoom(e) {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
      socket.on("welcome", (mess) => {
        console.log(mess);
      });
    });

    socket.on("receive-message", (message) => {
      setAllMessage((allmess) => [...allmess, { message, type: "coming" }]);
      console.log(allMessages);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h6>Welcome to socket.io - {socketId}</h6>

      <div>
        <h2 style={{ color: "red" }}>
          {allMessages.map((mess, idx) => {
            return (
              <div key={idx}>
                {mess.type === "going" ? (
                  <div style={{ color: "orange", paddingLeft: "300px" }}>
                    {mess.message}
                  </div>
                ) : (
                  <div style={{ color: "green", paddingLeft: "10px" }}>
                    {mess.message}
                  </div>
                )}
              </div>
            );
          })}
        </h2>
      </div>

      <form onSubmit={handleJoinRoom}>
        <input
          type="text"
          value={roomName}
          placeholder="Enter Room Name"
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button type="submit">join Room</button>
      </form>
      <br />
      <br />
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={message}
          placeholder="Enter message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />
        <input
          type="text"
          value={room}
          placeholder="Enter Room Name or ID"
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <button type="submit">send</button>
      </form>
    </div>
  );
};

export default App;
