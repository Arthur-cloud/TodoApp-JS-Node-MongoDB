module.exports = (app) => {
    require("./auth-router")(app);
    require("./post-router")(app)
    require("./user-router")(app)
    require("./group-router")(app)
  }