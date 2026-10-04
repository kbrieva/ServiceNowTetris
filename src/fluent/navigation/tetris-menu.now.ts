import { ApplicationMenu, Record } from "@servicenow/sdk/core";

const applicationMenu = ApplicationMenu({
  $id: Now.ID["tetris_app_menu"],
  title: "Tetris",
  active: true,
});

Record({
  $id: Now.ID["tetris_game_module"],
  table: "sys_app_module",
  data: {
    title: "Play Tetris",
    application: applicationMenu,
    link_type: "DIRECT",
    query: "tetris_game.do",
    active: true,
    order: 100,
  },
});
