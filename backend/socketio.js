const User = require('./databaseEvents/userSchema');
const Notification = require('./databaseEvents/notificationSchema');
const Message = require('./databaseEvents/messageSchema');
const _ = require("underscore");

const socketEvents = (io) =>{

    _.each(io.nsps, function (nsp) { 
      nsp.on("connect", function (socket) {
          if (!socket.auth) {
            console.log("removing socket from", nsp.name);
            delete nsp.connected[socket.id];
          }
        });
      });

      io.on("connection", (socket) => {
        socket.auth = false;
        socket.on("authenticate", async (auth) => {
          const { username, password } = auth;
          // Find user
          const user = await User.findOne({ username }).exec();
          if (user === null) {
            socket.emit("error", { message: "No user found" });
          } else if (user.password !== password) {
            socket.emit("error", { message: "Wrong password" });
          } else {
            socket.auth = true;
            socket.user = user;
          }
        });
        setTimeout(() => {
          // If the authentication failed, disconnect socket
          if (!socket.auth) {
            console.log("Unauthorized: Disconnecting socket ", socket.id);
            return socket.disconnect("unauthorized");
          }
          // If authentication succeeded, restore socket to the namespace
          _.each(io.nsps, function (nsp) {
            if (_.findWhere(nsp.sockets, { id: socket.id })) {
              nsp.connected[socket.id] = socket;
            }
          });
          return socket.emit("authorized");
        }, 1000);
        console.log("🔥 Socket connected: ", socket.id);
        socket.on("getNotifications", async (userID) => {
          const notification = await Notification.find({ userID }).lean().exec();
          if (notification === null) {
            socket.emit("notifications", []);
          } else {
            socket.emit("notifications", notification);
          }
        });
        socket.on("getMessages", async (userID) => {
          const message = await Message.find({ userID }).lean().exec();
          if (message === null) {
            socket.emit("messages", []);
          } else {
            socket.emit("messages", message);
          }
        });
        socket.on("getUser", () => {
          socket.emit("user", {
            id: socket.user._id,
            username: socket.user.username,
            profileImage: socket.user.profileImage,
          });
        });
        socket.on("send_message", (message, username) =>{
          socket.broadcast.emit("received_message", message, username)
        } )
        socket.on("disconnect", () => {
          socket.disconnect("disconnect");
        });
        socket.on('typing', username =>{
          socket.broadcast.emit('typingnow', username)
        })
      });
}

module.exports = socketEvents;