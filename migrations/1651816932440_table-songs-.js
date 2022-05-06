/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("song", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "TEXT",
      notNull: true,
    },
    year: {
      type: "Integer",
      notNull: true,
    },
    performer: {
      type: "TEXT",
      notNull: true,
    },
    genre: {
      type: "TEXT",
      notNull: true,
    },
    duration: {
      type: "Integer",
      notNull: true,
    },
    album_id: {
      type: "VARCHAR(50)",
    },
  });
  pgm.addConstraint(
    "song",
    "fk_song.album_id_album.id",
    "FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("song");
};
