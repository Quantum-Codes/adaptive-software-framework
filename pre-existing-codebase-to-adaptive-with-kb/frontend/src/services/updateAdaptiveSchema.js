import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function updateAdaptiveSchema({ adaptiveSchema, headers }) {
  try {
    const { data } = await axios({
      data: { user: { adaptiveSchema } },
      headers,
      method: "PUT",
      url: "api/user",
    });

    const loggedIn = { headers, isAuth: true, loggedUser: data.user };
    localStorage.setItem("loggedUser", JSON.stringify(loggedIn));

    return loggedIn;
  } catch (error) {
    errorHandler(error);
  }
}

export default updateAdaptiveSchema;

