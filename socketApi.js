let socket_io = require("socket.io");
let io = socket_io();
let socketApi = {};
const { getUser, getUsersInRoom, removeUser, addUser } = require("./users");
//Your socket logic here
io.on("connection", (socket) => {
  console.log("socket connection made successfully", socket.id);
  /**
   *  ON JOIN
   */
  socket.on("join", ({ name, room }, callback) => {
    //adduser
    const { user, error } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);
    /**
     * socket.join is a socket method to add sockets into specific rooms
     */
    socket.join(user.room);
    /**
     * Sending a welcome message from admin (for everyone)
     */
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, Welcome to room ${user.room}`,
    });
    /**
     * announcing that the user had joined
     */
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });

    /**
     * displaying the users of specific room
     */
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  /**
   *  ON sendMessage
   */
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    //the callback will empty the messages array on the formnt end
    callback();
  });
  /**
   *  ON disconnect
   */
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

socketApi.io = io;
module.exports = socketApi;
