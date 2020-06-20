const users = [];

const addUser = ({ id, name, room }) => {
  room = room.trim().toLowerCase();
  name = name.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.name === name && user.room === room
  );
  //   if (!name || !room) return { error: "Username and room are required" };
  if (!name || !room) return { error: "Username and room are required." };
  if (existingUser) return { error: "Username is already taken!" };

  const user = { id, name, room };
  users.push(user);
  return { user };
};

const getUser = (id) => users.find((user) => user.id === id);

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { users, addUser, getUser, removeUser, getUsersInRoom };
