const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistServices {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async verifyOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlist WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("playlist tidak ditemukan");
    }
    const note = result.rows[0];
    if (note.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }
  async verifyAccess(playlistId, userId) {
    try {
      await this.verifyOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlist VALUES($1,$2,$3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getPlaylist(owner) {
    const query = {
      text: "SELECT p.id,p.name,u.username FROM playlist p INNER JOIN users u ON p.owner = u.id WHERE owner = $1 ",
      values: [owner],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist Tidak ditemukan");
    }
    return result.rows;
  }
  async addSongToPlaylist(playlistId, { songId }) {
    const id = `listsong-${nanoid(16)}`;
    const querySong = {
      text: "SELECT * FROM song WHERE id = $1",
      values: [songId],
    };
    const query = {
      text: "INSERT INTO listsong VALUES ($1,$2,$3) RETURNING id",
      values: [id, songId, playlistId],
    };
    const checkSong = await this._pool.query(querySong);
    if (!checkSong.rows.length) {
      throw new NotFoundError(
        "song gagal ditambahkan ke Playlist,Song tidak ditemukan"
      );
    }
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("song gagal ditambahkan ke Playlist");
    }
    return result.rows[0].id;
  }
  async getSongByPlaylist(playlistId) {
    const queryPlaylist = {
      text: "SELECT p.id,p.name,u.username FROM playlist p INNER JOIN users u ON p.owner = u.id WHERE p.id = $1",
      values: [playlistId],
    };
    const querySong = {
      text: "SELECT s.id,s.title,s.performer FROM listsong l JOIN song s ON l.song_id = s.id WHERE l.playlist_id = $1",
      values: [playlistId],
    };
    const playlist = await this._pool.query(queryPlaylist);
    const song = await this._pool.query(querySong);

    if (!playlist.rows.length) {
      throw new InvariantError("Playlist tidak ditemukan");
    }
    const result = {
      ...playlist.rows[0],
      songs: [...song.rows],
    };
    return result;
  }
  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlist WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(
        "Playlist gagal dihapus . Playlist tidak ditemukan"
      );
    }
    return result.rows[0].id;
  }
  async deleteSongFromPlaylist(playlistId, { songId }) {
    const query = {
      text: "DELETE FROM listsong WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(
        "Song dalam Playlist gagal dihapus . Song tidak ditemukan"
      );
    }
    return result.rows[0].id;
  }
}

module.exports = PlaylistServices;
