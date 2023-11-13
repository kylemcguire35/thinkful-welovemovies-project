const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function list() {
  return knex("movies").select("*");
}

function listIsShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where("mt.is_showing", true)
    .groupBy("m.movie_id");
}

function read(movieId) {
  return knex("movies").select("*").where("movie_id", movieId);
}

function theatersShowing(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("t.*")
    .where("mt.movie_id", movieId)
    .where("mt.is_showing", true)
    .groupBy("t.theater_id");
}

function reviewsForMovie(movieId) {
  const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    created_at: "critic.created_at",
    updated_at: "critic.updated_at",
  });

  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where("r.movie_id", movieId)
    .then((reviews) => reviews.map((review) => addCritic(review)));
}

module.exports = {
  list,
  listIsShowing,
  read,
  theatersShowing,
  reviewsForMovie,
};
