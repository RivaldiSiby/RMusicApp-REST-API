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
  });
};

exports.down = (pgm) => {
  pgm.dropTable("song");
};
