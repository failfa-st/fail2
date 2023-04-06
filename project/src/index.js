import { Noise } from "noisejs"
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const mouse = {
  x: 0,
  y: 0,
  down: false,
}
const wind = {
  force: { x: 0, y: 0 },
  strength: 0,
  update() {
    // Update wind force and strength
  },
  changeDirection(direction) {
    switch (direction) {
      case "left":
        this.force.x = -this.strength
        this.force.y = 0
        break
      case "right":
        this.force.x = this.strength
        this.force.y = 0
        break
      case "up":
        this.force.x = 0
        this.force.y = -this.strength
        break
      case "down":
        this.force.x = 0
        this.force.y = this.strength
        break
      default:
        break
    }
  },
}
const cloth = {
  points: [],
  sticks: [],
  density: 20,
  color: { r: 255, g: 255, b: 255 },
  draw() {
    // Draw cloth to canvas
  },
  update() {
    // Update cloth
  },
}
const net = {
  points: [],
  size: 100,
  draw() {
    // Draw net to canvas
  },
  update() {
    // Update net
  },
}
let paused = false
canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
  wind.force.x = ((mouse.x - canvas.width / 2) / 100) * wind.strength
  wind.force.y = ((mouse.y - canvas.height / 2) / 100) * wind.strength
  cloth.color.r = Math.floor((mouse.x / canvas.width) * 255)
  cloth.color.g = Math.floor((mouse.y / canvas.height) * 255)
})
canvas.addEventListener("mousedown", (e) => {
  mouse.down = true
})
canvas.addEventListener("mouseup", (e) => {
  mouse.down = false
})
canvas.addEventListener("wheel", (e) => {
  if (e.shiftKey) {
    net.size += e.deltaY / 10
    if (net.size < 10) net.size = 10
  } else {
    wind.strength += e.deltaY / 100
    if (wind.strength < 0) wind.strength = 0
  }
})
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault()
  cloth.density += e.shiftKey ? -1 : 1
  if (cloth.density < 1) cloth.density = 1
})
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    paused = !paused
  } else if (e.code.startsWith("Arrow")) {
    wind.changeDirection(e.key.toLowerCase().replace("arrow", ""))
  }
})
function init() {
  // Initialize cloth, net and wind
}
function update() {
  if (!paused) {
    cloth.update()
    wind.update()
    net.update()
  }
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  cloth.draw()
  net.draw()
}
function loop() {
  update()
  draw()
  requestAnimationFrame(loop)
}
init()
loop()
