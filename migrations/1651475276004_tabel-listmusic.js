/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("listmusic", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    song_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("listmusic");
};
