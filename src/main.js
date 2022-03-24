import Game from "./game.js"

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const audio = document.querySelector(".audio")
let head = document.querySelector(".count")
let crtLv = document.querySelector(".level")
let fin = document.querySelector(".fin")

const GAME_WIDTH = (canvas.width = 800)
const GAME_HEIGHT = (canvas.height = 600)

let game = new Game(GAME_WIDTH, GAME_HEIGHT)

let lastTime = 0
function gameLoop(timestamp) {
	let deltaTime = timestamp - lastTime
	lastTime = timestamp

	ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

	game.update(deltaTime)
	game.draw(ctx)
	game.count(head)
	game.countLevel(crtLv)
	game.gameClear(fin)
	game.playAudio(audio)

	requestAnimationFrame(gameLoop)
}

gameLoop()
