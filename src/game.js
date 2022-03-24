import Paddle from "./paddle.js"
import InputHandler from "./input.js"
import Ball from "./ball.js"
import { buildLevel, level1, level2, level3, level4 } from "./level.js"

const GAMESTATE = {
	PAUSED: 0,
	RUNNING: 1,
	MENU: 2,
	GAMEOVER: 3,
	NEWLEVEL: 4,
}

export default class Game {
	constructor(gameWidth, gameHeight) {
		this.gameWidth = gameWidth
		this.gameHeight = gameHeight
		this.gamestate = GAMESTATE.MENU
		this.ball = new Ball(this)
		this.paddle = new Paddle(this)
		this.gameObjects = []
		this.bricks = []
		this.lives = 3
		this.levels = [level1, level2, level3, level4]
		this.currentLevel = 0

		new InputHandler(this.paddle, this)
	}

	start() {
		if (
			this.gamestate !== GAMESTATE.MENU &&
			this.gamestate !== GAMESTATE.NEWLEVEL
		)
			return

		this.bricks = buildLevel(this, this.levels[this.currentLevel])
		this.ball.reset()
		this.gameObjects = [this.ball, this.paddle]

		this.gamestate = GAMESTATE.RUNNING
	}

	update(deltaTime) {
		if (this.lives === 0) this.gamestate = GAMESTATE.GAMEOVER

		if (
			this.gamestate === GAMESTATE.PAUSED ||
			this.gamestate === GAMESTATE.MENU ||
			this.gamestate === GAMESTATE.GAMEOVER
		)
			return

		if (this.bricks.length === 0) {
			if (this.currentLevel === 3) {
				this.gamestate = GAMESTATE.MENU
				this.currentLevel = 0
				this.lives = 3
			} else {
				this.currentLevel++
				this.gamestate = GAMESTATE.NEWLEVEL
				this.start()
			}
		}

		;[...this.gameObjects, ...this.bricks].forEach(object =>
			object.update(deltaTime)
		)

		this.bricks = this.bricks.filter(brick => !brick.markedForDeletion)
	}

	draw(ctx) {
		;[...this.gameObjects, ...this.bricks].forEach(object =>
			object.draw(ctx)
		)

		switch (this.gamestate) {
			case GAMESTATE.PAUSED:
				ctx.rect(0, 0, this.gameWidth, this.gameHeight)
				ctx.fillStyle = "rgba(0,0,0,0.5)"
				ctx.fill()

				ctx.font = "30px Arial"
				ctx.fillStyle = "white"
				ctx.textAlign = "center"
				ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2)
				break

			case GAMESTATE.MENU:
				ctx.rect(0, 0, this.gameWidth, this.gameHeight)
				ctx.fillStyle = "rgba(0,0,0,1)"
				ctx.fill()

				ctx.font = "30px Arial"
				ctx.fillStyle = "white"
				ctx.textAlign = "center"
				ctx.fillText(
					"Press Enter to Start",
					this.gameWidth / 2,
					this.gameHeight / 2
				)
				break

			case GAMESTATE.GAMEOVER:
				ctx.rect(0, 0, this.gameWidth, this.gameHeight)
				ctx.fillStyle = "rgba(0,0,0,1)"
				ctx.fill()

				ctx.font = "30px Arial"
				ctx.fillStyle = "white"
				ctx.textAlign = "center"
				ctx.fillText(
					"GAME OVER",
					this.gameWidth / 2,
					this.gameHeight / 2
				)
				break
		}
	}

	togglePause() {
		switch (this.gamestate) {
			case GAMESTATE.PAUSED:
				this.gamestate = GAMESTATE.RUNNING
				break
			case GAMESTATE.RUNNING:
				this.gamestate = GAMESTATE.PAUSED
				break
			case GAMESTATE.MENU:
				break
		}
	}

	count(head) {
		if (this.lives >= 2) {
			head.textContent = this.lives + " Balls Left"
		} else if (this.lives >= 1) {
			head.textContent = this.lives + " Ball Left"
		} else if (this.lives >= 0) {
			head.textContent = "GAME OVER"
		}
	}

	countLevel(crtLv) {
		if (this.currentLevel < 3) {
			crtLv.textContent = "LEVEL " + (this.currentLevel + 1)
		} else if (this.currentLevel === 3) {
			crtLv.textContent = "FINAL STAGE"
		}
	}

	playAudio(audio) {
		switch (this.gamestate) {
			case GAMESTATE.RUNNING:
				audio.play()
				break
			case GAMESTATE.PAUSED:
				audio.pause()
				break
			case GAMESTATE.MENU:
				audio.pause()
				break
			case GAMESTATE.GAMEOVER:
				audio.pause()
				audio.currentTime = 0
				break
		}
	}

	gameClear(fin) {
		if (this.bricks.length === 0) {
			if (this.currentLevel === 3) {
				fin.innerHTML =
					"<span style='background-image: linear-gradient(to left, violet, indigo, aqua, green, yellow, orange, red); color: transparent; background-clip: text;'>Congratulations!!</span>"
			}
		}
	}
}
