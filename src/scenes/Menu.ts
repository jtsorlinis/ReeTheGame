import Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor(0x33a5e7);

    const centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.add
      .text(centerX, 200, "Ree Ree\nThe Game", {
        fontSize: "32px",
        align: "center",
      })
      .setOrigin(0.5);

    const startButton = this.add.rectangle(centerX, 400, 200, 50, 0xf4a261);
    this.add
      .text(centerX, 400, "Start", {
        fontSize: "20px",
        align: "center",
      })
      .setOrigin(0.5);

    startButton.setInteractive();
    startButton.on("pointerover", () => {
      startButton.setFillStyle(0xe76f51);
    });
    startButton.on("pointerout", () => {
      startButton.setFillStyle(0xf4a261);
    });
    startButton.on("pointerup", () => {
      this.scene.start("Level1");
    });
  }
}
