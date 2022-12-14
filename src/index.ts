import Phaser from "phaser";
import config from "./config";
import Level1 from "./scenes/Level1";
import Level2 from "./scenes/Level2";
import Level3 from "./scenes/Level3";
import Level4 from "./scenes/Level4";
import MenuScene from "./scenes/Menu";
import VictoryScene from "./scenes/Victory";

new Phaser.Game(
  Object.assign(config, {
    scene: [Level4, MenuScene, Level1, Level2, Level3, VictoryScene],
  })
);
