require("dotenv").config();

const Hapi = require("@hapi/hapi");
const album = require("./api/album");
const song = require("./api/song");
const AlbumServices = require("./services/postgres/AlbumServices");
const SongServices = require("./services/postgres/SongServices");
const AlbumValidator = require("./validator/album");
const SongValidator = require("./validator/song");
const Jwt = require("@hapi/jwt");
// users
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersServices");
const UsersValidator = require("./validator/users");

// authentications
const authentications = require("./api/authentications");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");

// playlist
const playlist = require("./api/playlist/index");
const PlaylistServices = require("./services/postgres/PlaylistServices");
const PlaylistValidator = require("./validator/playlist");

// collaborations
const collaborations = require("./api/collaborations/index");
const CollaborationsService = require("./services/postgres/CollaborationsService");
const CollaborationsValidator = require("./validator/collaborations");

const init = async () => {
  const albumServices = new AlbumServices();
  const songServices = new SongServices();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistService = new PlaylistServices();
  const collaborationsService = new CollaborationsService();
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
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy("musicapp_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: playlist,
      options: {
        service: playlistService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistService,
        validator: CollaborationsValidator,
      },
    },
  ]);
  await server.start();
  console.log(`Server Berjalan pada ${server.info.uri}`);
};
init();
