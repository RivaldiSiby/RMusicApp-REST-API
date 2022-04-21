require("dotenv").config();

const Hapi = require("@hapi/hapi");
const album = require("./api/album");
const song = require("./api/song");
const AlbumServices = require("./services/postgres/AlbumServices");
const SongServices = require("./services/postgres/SongServices");
const AlbumValidator = require("./validator/album");
const SongValidator = require("./validator/song");

// users
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersServices");
const UsersValidator = require("./validator/users");

const init = async () => {
  const albumServices = new AlbumServices();
  const songServices = new SongServices();
  const usersService = new UsersService();
  const server = Hapi.server({
    port: process.env.port,
    host: process.env.host,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: album,
      options: {
        service: albumServices,
        validator: AlbumValidator,
      },
    },
    {
      plugin: song,
      options: {
        service: songServices,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);
  await server.start();
  console.log(`Server Berjalan pada ${server.info.uri}`);
};
init();
