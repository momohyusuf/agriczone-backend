const routeNotFoundError = async (req, res) => {
  await res
    .status(404)
    .send('Sorry route does not exist on our server check your url');
};

module.exports = routeNotFoundError;
