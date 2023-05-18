import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import defaultProfileImage from "./default_profile_image.png";

// const socket = io.connect("http://localhost:3001");

function App() {
  const [notifications, setNotifications] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [socketError, setSocketError] = useState(null);
  const [socket, setSocket] = useState(null);

  const handleLogin = () => {
    const connectSocket = io("http://localhost:3001");
    setSocket(connectSocket);
    setSocketError(null);
    setNotifications([]);
  };
  const handleLogout = () => {
    socket.disconnect();
    setUser(null);
  };
  useEffect(() => {
    if (socket) {
      socket.once("connect", () => {
        socket.emit("authenticate", {
          username,
          password,
        });
      });
      socket.on("error", (err) => {
        setSocketError(err?.message);
        console.log(err?.message);
      });
      socket.on("unauthorized", (data) => {
        setSocketError("unauthorized: ", data);
      });
      socket.on("authorized", () => {
        socket.emit("getUser");
      });
      socket.on("notifications", (data) => {
        setNotifications(data);
      });
      socket.on("messages", (data) => {
        setMessages(data);
      });
      socket.on("received_message", (incomminMessage, username) => {
        const li = document.createElement('li');
        li.className = 'received_message';
        li.innerHTML = `<span>${username}: ${incomminMessage}</span>`;
        document.querySelector('.message_area').appendChild(li);
      })
      socket.on("user", (data) => {
        setUser(data);
      });
      socket.on("disconnect", (data) => {
        console.log("disconnected");
      });
      socket.on('typingnow', (username)=>{
        const feedback = document.querySelector('.feedback');
        feedback.innerHTML = `<p>${username} is typing</p>`;
        setTimeout(() => {
          feedback.innerHTML = ''
        }, 2000);
      })
    }
    return () => {
      socket?.off();
      socket?.disconnect();
    };
  }, [password, socket, username]);

  const getNotifications = (userID) => {
    socket.emit("getNotifications", userID);
  };
  const getMessages = (userID) => {
    socket.emit("getMessages", userID);
  };
  const sendMessage = () => {
    socket.emit("send_message", message ,user.username)
    const input = document.querySelector('input');
    input.value = '';
    const li = document.createElement('li');
    li.className = 'message'
    li.innerHTML = `<span>${message}</span>`
    document.querySelector('.message_area').appendChild(li)  
    
  }
  return (
    <div className="App">
      {user ? (
        <div className="main_page">
          <header>Chat-App</header>
          <div className="user__container">
            <span>Welcome {user?.username}</span>
            <img
              src={user?.profileImage ? user?.profileImage : defaultProfileImage}
              alt="Profile"
            />
            {socket.connected ? (
              <span>🟢 Connected</span>
            ) : (
              <span>🔴 Disconnected</span>
            )}

            <button type="button" onClick={handleLogout}>
              Logout
            </button>
            <button
              onClick={() => getNotifications(user.id)}
              disabled={!socket?.connected}
            >
              Get notifications
            </button>
            {notifications && notifications?.length !== 0 ? (
              <ul>
                {notifications.map((item) => (
                  <li key={item._id}>
                    id: {item._id}, title: {item.title}, text: {item.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notifications</p>
            )}
            <button
              onClick={() => getMessages(user.id)}
              disabled={!socket?.connected}
            >
              Get Messages
            </button>
            {messages && messages?.length !== 0 ? (
              <ul>
                {messages.map((item) => (
                  <li key={item._id}>
                    id: {item._id}, senderID: {item.senderID}, title: {item.title}
                    , message: {item.message}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No messages</p>
            )}
          </div>
          <ul className="message_area"></ul>
          <divaaa className = "feedback"></divaaa>
          <div className="chat_area">      
            <input type="text" placeholder="message.." onChange={e => {
              setMessage(e.target.value)
              socket.emit('typing', username);
            }}></input>
            <button onClick={() => sendMessage()}>Send</button>
          </div>
        </div>
      ) : (
        <div className="login_container">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={handleLogin}>
              Login
            </button>
          </form>
        </div>
      )}
      {socketError ? <p>{socketError}</p> : null}
    </div>
  );
}

export default App;
