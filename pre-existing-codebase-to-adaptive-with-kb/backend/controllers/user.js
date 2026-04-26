const { UnauthorizedError } = require("../helper/customErrors");
const { bcryptHash } = require("../helper/bcrypt");
const { sanitizeSchema } = require("../adaptive/metadataSchema");
const { runAdaptationCycleIfDue } = require("../adaptive/adaptationService");

//* Current User
const currentUser = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    loggedUser.adaptiveSchema = sanitizeSchema(loggedUser.adaptiveSchema, loggedUser.id);
    setImmediate(() => runAdaptationCycleIfDue(loggedUser).catch(console.error));

    loggedUser.dataValues.email = req.headers.email;
    delete req.headers.email;

    res.json({ user: loggedUser });
  } catch (error) {
    next(error);
  }
};

//* Update User
const updateUser = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const {
      user: { password },
      user,
    } = req.body;

    Object.entries(user).forEach((entry) => {
      const [key, value] = entry;

      if (value !== undefined && key !== "password") loggedUser[key] = value;
    });

    if (password !== undefined && password !== "") {
      loggedUser.password = await bcryptHash(password);
    }

    if (user.adaptiveSchema !== undefined) {
      loggedUser.adaptiveSchema = sanitizeSchema(user.adaptiveSchema, loggedUser.id);
    }

    await loggedUser.save();

    res.json({ user: loggedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = { currentUser, updateUser };
