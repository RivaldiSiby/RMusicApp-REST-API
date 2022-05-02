/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {};

exports.down = (pgm) => {
  // menghapus constraint fk_song.album_id_album.id pada tabel song
  // pgm.dropColumns("song", "album_id");
};
