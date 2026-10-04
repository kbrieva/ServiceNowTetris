import { UiPage } from "@servicenow/sdk/core";
import page from "../../client/index.html";

export const tetris_game = UiPage({
  $id: Now.ID["tetris_game"],
  endpoint: "tetris_game.do",
  html: page,
  direct: true,
});
