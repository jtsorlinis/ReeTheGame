import Phaser from "phaser";
import config from "./config";
import Level1 from "./scenes/Level1";
import MenuScene from "./scenes/Menu";

new Phaser.Game(
  Object.assign(config, {
    scene: [Level1],
  })
);
