const homePage = require('./homePage');
const login = require('./login');
const logout = require('./logout');
module.exports = function (router, db) {

  //  render index page
  homePage(router, db);

  // GET /users/login
  login(router, db);

  // POST /users/logout
  logout(router, db);

  return router;
}

