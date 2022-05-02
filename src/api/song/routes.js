const routes = (handler) => [
  {
    method: "POST",
    path: "/songs",
    handler: handler.postHandler,
    // options: {
    //   auth: "musicapp_jwt",
    // },
  },
  {
    method: "GET",
    path: "/songs",
    handler: handler.getHandlerAll,
    // options: {
    //   auth: "musicapp_jwt",
    // },
  },
  {
    method: "GET",
    path: "/songs/{id}",
    handler: handler.getHandlerById,
    // options: {
    //   auth: "musicapp_jwt",
    // },
  },
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: handler.putHandlerById,
    // options: {
    //   auth: "musicapp_jwt",
    // },
  },
  {
    method: "DELETE",
    path: "/songs/{id}",
    handler: handler.deleteHandlerById,
    // options: {
    //   auth: "musicapp_jwt",
    // },
  },
];

module.exports = routes;
