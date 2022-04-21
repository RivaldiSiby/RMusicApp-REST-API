const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumServices {
  constructor() {
    this._pool = new Pool();
  }

  async add({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO album VALUES($1,$2,$3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album Gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getById(id) {
    const query = {
      text: 'SELECT * FROM album WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album Tidak ditemukan');
    }
    return result.rows;
  }

  async editById(id, { name, year }) {
    const query = {
      text: 'UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(
        'Gagal Memperbaharui Album . Album tidak ditemukan',
      );
    }
  }

  async deleteById(id) {
    const query = {
      text: 'DELETE FROM album WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus . Album tidak ditemukan');
    }
  }
}

module.exports = AlbumServices;
