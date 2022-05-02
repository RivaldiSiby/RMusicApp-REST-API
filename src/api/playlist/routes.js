const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    handler: handler.postHandler,
    options: {
      auth: "musicapp_jwt",
    },
  },
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: handler.postSongToPlaylistHandler,
    options: {
      auth: "musicapp_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: handler.getPlaylistHandler,
    options: {
      auth: "musicapp_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: handler.getSongByPlaylistHandler,
    options: {
      auth: "musicapp_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: handler.deletePlaylistHandlerById,
    options: {
      auth: "musicapp_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: handler.deleteSongFromPlaylistHandler,
    options: {
      auth: "musicapp_jwt",
    },
  },
];

module.exports = routes;
