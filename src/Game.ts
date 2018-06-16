import sky from './assets/sky.png'
import ground from './assets/platform.png'
import star from './assets/star.png'
import bomb from './assets/bomb.png'
import dude from './assets/dude.png'


const assets = {
    sky: sky,
    ground: ground,
    star: star,
    bomb: bomb,
    dude: dude,
}

console.log(assets)

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

        this.load.image("sky", assets.sky)
        this.load.image("ground", assets.ground)
        this.load.image("star", assets.star)
        this.load.image("bomb", assets.bomb)
        this.load.image(
            "dude",
            assets.dude,
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
