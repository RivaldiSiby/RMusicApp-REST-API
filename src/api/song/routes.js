const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getHandlerAll,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getHandlerById,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putHandlerById,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteHandlerById,
  },
];

module.exports = routes;
