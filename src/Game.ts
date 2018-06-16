export class Game {
    constructor () {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            scene: {
                preload: this.preload,
                create: this.create,
                update: this.update,
            }
        };

        this.game = new Phaser.Game(config)
    }

    preload () {
        console.log("Game.preload")

        this.load.image("sky", "assets/sky.png")
        this.load.image("ground", "assets/platform.png")
        this.load.image("star", "assets/star.png")
        this.load.image("bomb", "assets/bomb.png")
        this.load.image(
            "dude",
            "assets/dude.png",
            { frameWidth: 32, frameHeight: 48 }
        )
    }

    create () {
        console.log("Game.create")

        this.add.image(400, 300, "sky")
    }
    update () {
    }
}
