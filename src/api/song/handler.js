const ClientError = require('../../exceptions/ClientError');

class SongHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;
    this.postHandler = this.postHandler.bind(this);
    this.getHandlerAll = this.getHandlerAll.bind(this);
    this.getHandlerById = this.getHandlerById.bind(this);
    this.putHandlerById = this.putHandlerById.bind(this);
    this.deleteHandlerById = this.deleteHandlerById.bind(this);
  }

  async postHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const {
        title, year, genre, performer, duration,
      } = request.payload;
      const resultid = await this._services.add({
        title,
        year,
        genre,
        performer,
        duration,
      });

      const response = h.response({
        status: 'success',
        data: {
          songId: resultid,
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

  async getHandlerAll(request, h) {
    const songs = await this._services.getAll();
    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });
    return response;
  }

  async getHandlerById(request, h) {
    try {
      const { id } = request.params;
      const song = await this._services.getById(id);
      const response = h.response({
        status: 'success',
        data: {
          song: song[0],
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
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
      const {
        title, year, genre, performer, duration,
      } = request.payload;

      await this._services.editById(id, {
        title,
        year,
        genre,
        performer,
        duration,
      });
      const response = h.response({
        status: 'success',
        message: 'Song berhasil diperbarui',
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
        message: 'Song berhasil dihapus',
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

module.exports = SongHandler;
