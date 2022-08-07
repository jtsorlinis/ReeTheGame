import Phaser from "phaser";

export default class Level2 extends Phaser.Scene {
  constructor() {
    super("Level2");
  }
  preload() {}
  create() {
    this.cameras.main.setBackgroundColor(0x175703);
  }

  update() {}
}
