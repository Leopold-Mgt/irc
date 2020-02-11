const channels = [];

const addChannel = ({ channel }) => {
  channel = channel.trim();

  if (channels.some(chan => chan === channel)) {
    // channel existe déjà
  } else { // channel existe pas
    channels.push(channel);
  }
}

const removeChannel = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getChannel = (id) => users.find((user) => user.id === id);

const getChannels = () => { return channels };

module.exports = { 
    addChannel, 
    removeChannel, 
    getChannel, 
    getChannels
};