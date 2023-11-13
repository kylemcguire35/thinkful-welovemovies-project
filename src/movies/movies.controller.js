const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Middleware
async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie.length > 0) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

//Functions
async function list(req, res, next) {
  const isShowingParam = req.query.is_showing;
  if (isShowingParam !== undefined) {
    const data = await service.listIsShowing();
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

function read(req, res, next) {
  const {
    movie: [data],
  } = res.locals;
  res.json({ data });
}

async function theatersShowing(req, res, next) {
  const data = await service.theatersShowing(req.params.movieId);
  res.json({ data });
}

async function reviewsForMovie(req, res, next) {
  const data = await service.reviewsForMovie(req.params.movieId);
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  theatersShowing: [asyncErrorBoundary(movieExists), theatersShowing],
  reviewsForMovie: [asyncErrorBoundary(movieExists), reviewsForMovie],
};
