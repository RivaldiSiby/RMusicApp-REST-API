const ClientError = require("../../exceptions/ClientError");

class PlaylistHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;

    this.postHandler = this.postHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistHandlerById = this.deletePlaylistHandlerById.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongByPlaylistHandler = this.getSongByPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler =
      this.deleteSongFromPlaylistHandler.bind(this);
  }

  async postHandler(request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const result = await this._services.addPlaylist({
        name,
        owner: credentialId,
      });
      const response = h.response({
        status: "success",
        data: {
          playlistId: result,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      console.log(error);
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);

      return response;
    }
  }
  async getPlaylistHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const result = await this._services.getPlaylist(credentialId);
      const response = h.response({
        status: "success",
        data: {
          playlists: [...result],
        },
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      console.log(error);
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);

      return response;
    }
  }

  async postSongToPlaylistHandler(request, h) {
    try {
      this._validator.validateSongPlaylistPayload(request.payload);
      const { songId } = request.payload;
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._services.verifyAccess(id, credentialId);
      await this._services.addSongToPlaylist(id, {
        songId,
      });
      const response = h.response({
        status: "success",
        message: "Song Berhasil ditambahkan kedalam Playlist",
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      console.log(error);
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);

      return response;
    }
  }

  async getSongByPlaylistHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._services.verifyAccess(id, credentialId);
      const result = await this._services.getSongByPlaylist(id);
      const response = h.response({
        status: "success",
        data: {
          playlist: result,
        },
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      console.log(error);
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);

      return response;
    }
  }

  async deletePlaylistHandlerById(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._services.verifyOwner(id, credentialId);
      await this._services.deletePlaylistById(id);
      const response = h.response({
        status: "success",
        message: "Playlist berhasil dihapus",
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      console.log(error);
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);

      return response;
    }
  }
  async deleteSongFromPlaylistHandler(request, h) {
    try {
      this._validator.validateSongPlaylistPayload(request.payload);
      const { id } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      await this._services.verifyAccess(id, credentialId);
      console.log(id);
      await this._services.deleteSongFromPlaylist(id, { songId });
      const response = h.response({
        status: "success",
        message: "Song berhasil dihapus dari Playlist",
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      console.log(error);
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);

      return response;
    }
  }
}

module.exports = PlaylistHandler;
