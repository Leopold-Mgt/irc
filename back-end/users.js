const users = [];

const addUser = ({ id, username, channel }) => {
  username = username.trim();
  channel = channel.trim();

  const existingUser = users.find((user) => user.channel === channel && user.username === username);

  if(!username || !channel) return { error: 'Username and channel are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  const user = { id, username, channel };

  users.push(user);

  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInChannel = (channel) => users.filter((user) => user.channel === channel);

module.exports = { 
    addUser, 
    removeUser, 
    getUser, 
    getUsersInChannel
};