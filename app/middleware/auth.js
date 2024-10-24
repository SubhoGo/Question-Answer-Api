const passport = require("passport");
const passportJWT = require("passport-jwt");
const Strategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;
const User = require("../modules/users/model/userModel");

const hiddenCode = {
  secretOrKey: process.env.JWT_SECRET || "MERN2024-2025",
  jwtFromRequest: extractJWT.fromHeader('x-access-token'),
};

module.exports = () => {
  const strategy = new Strategy(hiddenCode, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error, false);
    }
  });

  passport.use(strategy);

  return {
    initialize: () => {
      return passport.initialize();
    },
    authenticate: (req, res, next) => {
      passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res
            .status(401)
            .send({ message: "Unauthorized, please login" });
        }
        req.user = user;
        
        return next();
      })(req, res, next);
    },
  };
};
