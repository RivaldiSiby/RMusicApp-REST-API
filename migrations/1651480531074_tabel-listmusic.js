/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("listsong", {
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
  pgm.addConstraint(
    "listsong",
    "fk_listsong.song_id_song.id",
    "FOREIGN KEY(song_id) REFERENCES song(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "listsong",
    "fk_listsong.playlist_id_playlist.id",
    "FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("listsong");
};
