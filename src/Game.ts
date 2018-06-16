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
        let self = this
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
                preload: function () {
                    self.preload.bind(this)(self)
                },
                create: function () {
                    self.create.bind(this)(self)
                },
                update: function () {
                    self.update.bind(this)(self)
                },
            }
        };

        const game = new Phaser.Game(config)
    }

    preload (self) {
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

        self.cursors = this.input.keyboard.createCursorKeys()
        self.score = 0
        self.gameOver = false
    }

    create (self) {
        console.log("Game.create")

        this.add.image(400, 300, assets.sky.name)

        const platforms = this.physics.add.staticGroup()
        platforms.create(400, 568, assets.ground.name).setScale(2).refreshBody()
        platforms.create(600, 400, assets.ground.name)
        platforms.create(50, 250, assets.ground.name)
        platforms.create(750, 220, assets.ground.name)
        self.platforms = platforms

        const player = this.physics.add.sprite(100, 450, assets.dude.name)
        player.setBounce(0.2)
        player.setCollideWorldBounds(true)
        self.player = player

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

        const stars = this.physics.add.group({
            key: "star",
            repeat: 1,
            setXY: { x: 12, y: 0, stepX: 70 }
        })

        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        })

        self.stars = stars

        const bombs = this.physics.add.group()
        self.bombs = bombs

        self.scoreText = this.add.text(16, 16, "score: 0", { fontSize: "32px", fill: "#000" })

        this.physics.add.collider(player, platforms)
        this.physics.add.collider(stars, platforms)
        this.physics.add.collider(bombs, platforms)

        this.physics.add.overlap(player, stars, function (p, s) { self.collectStar.bind(this)(self, p, s) }, null, this)
        this.physics.add.collider(player, bombs, function (p, b) { self.hitBomb.bind(this)(self, p, b) }, null, this)
    }

    update (self) {
        if (self.gameOver) {
            return
        }

        if (self.cursors.left.isDown) {
            self.player.setVelocityX(-160)
            self.player.anims.play("left", true)
        } else if (self.cursors.right.isDown) {
            self.player.setVelocityX(160)
            self.player.anims.play("right", true)
        } else {
            self.player.setVelocityX(0)
            self.player.anims.play("turn")
        }

        if (self.cursors.up.isDown && self.player.body.touching.down) {
            self.player.setVelocityY(-330)
        }
    }

    collectStar (self, player, star) {
        console.log("Game.collectStar: " + star)
        star.disableBody(true, true)
        self.score += 10
        self.scoreText.setText("score: " + self.score)

        if (self.stars.countActive(true) !== 0) {
            return
        }

        self.stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true)
        })

        const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

        const bomb = self.bombs.create(x, 16, "bomb")
        bomb.setBounce(1)
        bomb.setCollideWorldBounds(true)
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
        bomb.allowGravity = false
    }

    hitBomb (self, player, bomb) {
        this.physics.pause()
        player.setTint(0xff0000)
        player.anims.play("turn")
        self.gameOver = true
    }
}
