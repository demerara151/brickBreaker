import { detectCollision } from "./collisionDetection.js"

export default class Brick {
  constructor(game, position) {
    this.image = document.querySelector("#img-brick")

    this.game = game
    this.position = position
    this.width = 40
    this.height = 38

    this.markedForDeletion = false
  }

  update() {
    if (detectCollision(this.game.ball, this)) {
      this.game.ball.speed.y = -this.game.ball.speed.y

      this.markedForDeletion = true
    }
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }
}
