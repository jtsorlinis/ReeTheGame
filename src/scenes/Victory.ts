export default class VictoryScene extends Phaser.Scene {
  creditsText!: Phaser.GameObjects.Text;
  nyxy!: Phaser.GameObjects.Sprite;
  sylveon!: Phaser.GameObjects.Sprite;
  pika!: Phaser.GameObjects.Sprite;
  constructor() {
    super("Victory");
  }

  preload() {
    this.load.audio("music_credits", "./assets/Credits/finished.mp3");
    this.load.spritesheet("nyxySit", "./assets/Level3/NyxySit.png", {
      frameWidth: 42,
      frameHeight: 60,
    });
    this.load.spritesheet("pikachu", "./assets/Level2/pikachu.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("sylveon", "./assets/Level1/sylveon.png");
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000);
    this.sound.play("music_credits");

    // Load animations
    this.anims.create({
      key: "sit",
      frames: this.anims.generateFrameNumbers("nyxySit", {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("pikachu", { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1,
    });

    this.nyxy = this.add.sprite(400, 1300, "nyxysit").setScale(3).play("sit");

    this.sylveon = this.add.sprite(400, 700, "sylveon").setScale(1.2);

    this.pika = this.add.sprite(400, 930, "pikachu").setScale(3).play("down");

    this.creditsText = this.add
      .text(
        400,
        800,
        "Thanks for playing Ree!\n\n\n\n\n\n\n\n\nI hope you had fun Miu!\n\n\n\n\n\n\n\n\n\n\n\n\nI love you sooooo much!",
        {
          align: "center",
          fontSize: "30px",
        }
      )
      .setOrigin(0.5, 0);
  }

  update(time: number, delta: number): void {
    this.creditsText.y -= delta / 15;
    this.nyxy.y -= delta / 15;
    this.sylveon.y -= delta / 15;
    this.pika.y -= delta / 15;
  }
}
