import { defineConfig } from "cypress";
import axios from "axios";
import User from "./src/models/User";
import Org from "./src/models/Org";
import Todo from "./src/models/Todo";

const url = "http://localhost:3000";
export default defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration

  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      on("task", {
        // deconstruct the individual properties
        async signUp({ email, password, orgCode }) {
          await axios.post(url + "/signup", {
            email: email,
            password: password,
            orgCode: orgCode,
          });
          return null;
        },
        async prepareDB() {
          await axios.post(url + "/reset");
          return null;
        },
      });
    },
  },
});
