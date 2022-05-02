const routes = (handler) => [
  {
    method: "POST",
    path: "/albums",
    handler: handler.postHandler,
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: handler.getHandlerById,
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: handler.putHandlerById,
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: handler.deleteHandlerById,
  },
];

module.exports = routes;
