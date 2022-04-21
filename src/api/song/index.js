const SongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'song',
  version: '1.0.0',
  register: (server, { service, validator }) => {
    const songHandler = new SongHandler(service, validator);
    server.route(routes(songHandler));
  },
};
