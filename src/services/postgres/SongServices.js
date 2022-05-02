const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongServices {
  constructor() {
    this._pool = new Pool();
  }

  async add({ title, year, genre, performer, duration }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO song VALUES($1,$2,$3,$4,$5,$6) RETURNING id",
      values: [id, title, year, performer, genre, duration],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Song gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getAll() {
    const result = await this._pool.query("SELECT * FROM song");
    const all = [];
    result.rows.map((data) => {
      all.push({
        id: data.id,
        title: data.title,
        performer: data.performer,
      });
    });
    return all;
  }

  async getById(id) {
    const query = {
      text: "SELECT * FROM song WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Song Tidak ditemukan");
    }
    return result.rows;
  }

  async editById(id, { title, year, genre, performer, duration }) {
    const query = {
      text: "UPDATE song SET title = $1, year = $2, genre = $3, performer = $4, duration = $5 WHERE id = $6 RETURNING id",
      values: [title, year, genre, performer, duration, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(
        "Gagal Memperbaharui Song . Song tidak ditemukan"
      );
    }
  }

  async deleteById(id) {
    const query = {
      text: "DELETE FROM song WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Song gagal dihapus . Song tidak ditemukan");
    }
  }
}

module.exports = SongServices;
