const ClientError = require('../../exceptions/ClientError');

class AlbumHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;
    this.postHandler = this.postHandler.bind(this);
    this.getHandlerById = this.getHandlerById.bind(this);
    this.putHandlerById = this.putHandlerById.bind(this);
    this.deleteHandlerById = this.deleteHandlerById.bind(this);
  }

  async postHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);

      const { name, year } = request.payload;
      const resultid = await this._services.add({ name, year });

      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId: resultid,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);

      return response;
    }
  }

  async getHandlerById(request, h) {
    try {
      const { id } = request.params;
      const album = await this._services.getById(id);

      const response = h.response({
        status: 'success',
        data: {
          album: album[0],
        },
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);

      return response;
    }
  }

  async putHandlerById(request, h) {
    try {
      const { id } = request.params;
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      await this._services.editById(id, { name, year });

      const response = h.response({
        status: 'success',
        message: 'Album berhasil diperbarui',
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  async deleteHandlerById(request, h) {
    try {
      const { id } = request.params;
      await this._services.deleteById(id);

      const response = h.response({
        status: 'success',
        message: 'Album berhasil dihapus',
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);

      return response;
    }
  }
}

module.exports = AlbumHandler;
