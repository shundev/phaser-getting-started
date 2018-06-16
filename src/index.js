import "./index.styl"

class Main {
  constructor () {
      const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
          preload: preload, create: create, update: update
      });
      function preload() {}
      function create() {}
      function update() {}
  }
}

window.addEventListener("DOMContentLoaded", () => new Main());
