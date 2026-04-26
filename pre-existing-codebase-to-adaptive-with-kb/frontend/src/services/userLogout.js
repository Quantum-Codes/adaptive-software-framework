import { buildDefaultAdaptiveSchema } from "../adaptive/defaultSchema";

function userLogout() {
  localStorage.removeItem("loggedUser");

  return {
    headers: null,
    isAuth: false,
    loggedUser: {
      bio: null,
      email: "",
      image: null,
      token: "",
      username: "",
      adaptiveSchema: buildDefaultAdaptiveSchema("guest"),
    },
  };
}

export default userLogout;
