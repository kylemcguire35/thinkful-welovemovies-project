const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function read(reviewId) {
  return knex("reviews").select("*").where("review_id", reviewId).first();
}

function update(updatedReview) {
  const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
  });

  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .where("r.review_id", updatedReview.review_id)
    .update(updatedReview, "*")
    .then(() => {
      return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("r.*", "c.*")
        .where("r.review_id", updatedReview.review_id)
        .then((reviews) => reviews.map((review) => addCritic(review)))
        .then((review) => review[0]);
    });
}

function destroy(reviewId) {
  return knex("reviews").where("review_id", reviewId).del();
}

module.exports = {
  read,
  update,
  delete: destroy,
};
