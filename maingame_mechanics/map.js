//@ts-check

import { elements } from "../elements.js"
import { player } from "./player.js"

var path = [
    { rx: -5, ry: 0 },
    { rx: 5, ry: 0 },
    { rx: 5, ry: 5 },
    { rx: 10, ry: 5 },
    { rx: 10, ry: 15 },
    { rx: 5, ry: 15 },
    { rx: 5, ry: 20 },
    { rx: -5, ry: 20 },
    { rx: -5, ry: 15 },
    { rx: -10, ry: 15 },
    { rx: -10, ry: 5 },
    { rx: -5, ry: 5 },
    { rx: -5, ry: 0 },
    { rx: -4, ry: 0 },
]

const images = {
    grass: new Image(),
    track_bottom: new Image(),
    track_top: new Image(),
    track_left: new Image(),
    track_right: new Image(),
    track_corner_rb: new Image(),
    track_corner_lt: new Image(),
    track_corner_rt: new Image(),
    track_corner_lb: new Image(),
    track_bigcorner_rt: new Image(),
    track_bigcorner_rb: new Image(),
    track_bigcorner_lt: new Image(),
    track_bigcorner_lb: new Image(),
    track_full: new Image(),
}

const canvas = document.createElement("canvas")

/**
 * @type {CanvasRenderingContext2D | null}
 */
let context = null

/**
 * @param {number} number
 * @param {number} fix
 * @returns
 */
const roundToTheFix = (number, fix) => Math.round(number / fix) * fix

async function generateMap() {
    if (!context) return

    const imageScale = 100

    //fill the empty space with grass
    for (
        let w = Math.floor(-roundToTheFix(canvas.width, imageScale) / 2) - imageScale * 1.5;
        w < Math.ceil(roundToTheFix(canvas.width, imageScale) / 2) + imageScale * 0.5;
        w += imageScale
    ) {
        for (
            let h = Math.floor(-roundToTheFix(canvas.height, imageScale) / 2) - imageScale * 1.5;
            h < Math.ceil(roundToTheFix(canvas.height, imageScale) / 2) + imageScale * 0.5;
            h += imageScale
        ) {
            context.drawImage(images.grass, w - (player.x % 1) * imageScale, h - (player.y % 1) * imageScale, imageScale, imageScale)
        }
    }

    for (let k = 1; k < path.length; k++) {
        const dx = path[k].rx - path[k - 1].rx
        const dy = path[k].ry - path[k - 1].ry
        for (let i = 0; i < Math.abs(dx) + Math.abs(dy); i++) {
            const x = path[k - 1].rx + (dx / (Math.abs(dx) + Math.abs(dy))) * i - player.x
            const y = path[k - 1].ry + (dy / (Math.abs(dx) + Math.abs(dy))) * i - player.y

            context.drawImage(images.track_corner_lt, (x - 1) * imageScale - imageScale / 2, (y + 1) * imageScale - imageScale / 2, imageScale, imageScale)
            context.drawImage(images.track_corner_rt, (x + 1) * imageScale - imageScale / 2, (y + 1) * imageScale - imageScale / 2, imageScale, imageScale)
            context.drawImage(images.track_corner_lb, (x - 1) * imageScale - imageScale / 2, (y - 1) * imageScale - imageScale / 2, imageScale, imageScale)
            context.drawImage(images.track_corner_rb, (x + 1) * imageScale - imageScale / 2, (y - 1) * imageScale - imageScale / 2, imageScale, imageScale)
        }
    }
    for (let k = 1; k < path.length; k++) {
        const dx = path[k].rx - path[k - 1].rx
        const dy = path[k].ry - path[k - 1].ry
        for (let i = 0; i < Math.abs(dx) + Math.abs(dy); i++) {
            const x = path[k - 1].rx + (dx / (Math.abs(dx) + Math.abs(dy))) * i - player.x
            const y = path[k - 1].ry + (dy / (Math.abs(dx) + Math.abs(dy))) * i - player.y

            context.drawImage(images.track_left, (x - 1) * imageScale - imageScale / 2, y * imageScale - imageScale / 2, imageScale, imageScale)
            context.drawImage(images.track_right, (x + 1) * imageScale - imageScale / 2, y * imageScale - imageScale / 2, imageScale, imageScale)
            context.drawImage(images.track_bottom, x * imageScale - imageScale / 2, (y + 1) * imageScale - imageScale / 2, imageScale, imageScale)
            context.drawImage(images.track_top, x * imageScale - imageScale / 2, (y - 1) * imageScale - imageScale / 2, imageScale, imageScale)
        }
    }
    for (let k = 1; k < path.length; k++) {
        const dx = path[k].rx - path[k - 1].rx
        const dy = path[k].ry - path[k - 1].ry
        for (let i = 0; i < Math.abs(dx) + Math.abs(dy); i++) {
            const x = path[k - 1].rx + (dx / (Math.abs(dx) + Math.abs(dy))) * i - player.x
            const y = path[k - 1].ry + (dy / (Math.abs(dx) + Math.abs(dy))) * i - player.y
            context.drawImage(images.track_full, x * imageScale - imageScale / 2, y * imageScale - imageScale / 2, imageScale, imageScale)
        }

        const dx2 = path[(k + 1) % path.length].rx - path[k].rx
        const dy2 = path[(k + 1) % path.length].ry - path[k].ry
        const x = path[k].rx - player.x
        //
        if ((dx > 0 && dy2 > 0) || (dx2 < 0 && dy < 0)) {
            context.drawImage(images.track_bigcorner_lb, (x - 1) * imageScale - imageScale / 2, (path[k].ry + 1) * imageScale - imageScale / 2, imageScale, imageScale)
        } else if ((dx < 0 && dy2 > 0) || (dx2 > 0 && dy < 0)) {
            context.drawImage(images.track_bigcorner_rb, (x + 1) * imageScale - imageScale / 2, (path[k].ry + 1) * imageScale - imageScale / 2, imageScale, imageScale)
        } else if ((dx > 0 && dy2 < 0) || (dx2 < 0 && dy > 0)) {
            context.drawImage(images.track_bigcorner_lt, (x - 1) * imageScale - imageScale / 2, (path[k].ry - 1) * imageScale - imageScale / 2, imageScale, imageScale)
        } else if ((dx < 0 && dy2 < 0) || (dx2 > 0 && dy > 0)) {
            context.drawImage(images.track_bigcorner_rt, (x + 1) * imageScale - imageScale / 2, (path[k].ry - 1) * imageScale - imageScale / 2, imageScale, imageScale)
        }
    }
}

export function start() {
    canvas.width = elements.maingameDiv.offsetWidth
    canvas.height = elements.maingameDiv.offsetHeight
    elements.maingameDiv.appendChild(canvas)
    context = canvas.getContext("2d")

    context?.translate(canvas.width / 2, canvas.height / 2)

    Promise.all(
        Object.entries(images).map((img) => {
            return new Promise((resolve) => {
                img[1].onload = resolve
                img[1].src = `imgs/map/${img[0]}.png`
            })
        })
    ).then(tick)
}

function tick() {
    canvas.width = elements.maingameDiv.offsetWidth
    canvas.height = elements.maingameDiv.offsetHeight
    context?.translate(canvas.width / 2, canvas.height / 2)
    generateMap()
    setTimeout(tick, 10)
}
