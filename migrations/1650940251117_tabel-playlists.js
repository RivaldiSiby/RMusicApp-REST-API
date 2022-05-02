/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("playlist", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(255)",
    },
  });

  // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint(
    "playlist",
    "fk_playlist.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  // menghapus constraint fk_playlist.owner_users.id pada tabel playlist
  // pgm.dropConstraint("playlist", "fk_playlist.owner_users.id");
  pgm.dropTable("playlist");
};
