import sky_path from './assets/sky.png'
import ground_path from './assets/platform.png'
import star_path from './assets/star.png'
import bomb_path from './assets/bomb.png'
import dude_path from './assets/dude.png'


const assets = {
    sky: { name: "sky", path: sky_path },
    ground: { name: "ground", path: ground_path },
    star: { name: "star", path: star_path },
    bomb: { name: "bomb", path: bomb_path },
    dude: { name: "dude", path: dude_path },
}

export class Game {
    constructor () {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { y: 300 },
                    debug: false,
                }
            },
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

        this.load.image(assets.sky.name, assets.sky.path)
        this.load.image(assets.ground.name, assets.ground.path)
        this.load.image(assets.star.name, assets.star.path)
        this.load.image(assets.bomb.name, assets.bomb.path)
        this.load.spritesheet(
            assets.dude.name,
            assets.dude.path,
            { frameWidth: 32, frameHeight: 48 }
        )

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create () {
        console.log("Game.create")

        this.add.image(400, 300, assets.sky.name)

        const platforms = this.physics.add.staticGroup()
        platforms.create(400, 568, assets.ground.name).setScale(2).refreshBody()
        platforms.create(600, 400, assets.ground.name)
        platforms.create(50, 250, assets.ground.name)
        platforms.create(750, 220, assets.ground.name)
        this.platforms = platforms

        const player = this.physics.add.sprite(100, 450, assets.dude.name)
        player.setBounce(0.2)
        player.setCollideWorldBounds(true)
        player.body.setGravityY(300)
        this.physics.add.collider(player, platforms)
        this.player = player

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers(
                assets.dude.name,
                { start: 0, end: 3 }
            ),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "turn",
            frames: [ { key: "dude", frame: 4 }],
            frameRate: 20
        })

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers(
                "dude",
                { start: 5, end: 8 }
            ),
            frameRate: 10,
            repeat: -1
        })
    }
    update () {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160)
            this.player.anims.play("left", true)
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160)
            this.player.anims.play("right", true)
        } else {
            this.player.setVelocityX(0)
            this.player.anims.play("turn")
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330)
        }
    }
}
