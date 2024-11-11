//@ts-check

import { localizatorHandler } from "../communicator.js"
import { elements } from "../elements.js"
import { rubbishData } from "../lists/rubbish.js"
import { itemsOnMapHandler } from "./items.js"
import { player } from "./player.js"

var cursorLoc = { x: 0, y: 0 }

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

const mapImages = {
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
const pimages = {}
const rimages = {}

const canvas = document.createElement("canvas")

/**
 * @type {CanvasRenderingContext2D | null}
 */
let context = null

const imageScale = 100
const itemScale = 50

/**
 * @param {number} number
 * @param {number} fix
 * @returns
 */
const roundToTheFix = (number, fix, fixAddition = 0) => (Math.round(number / fix) + fixAddition) * fix

async function generateMap() {
    if (!context) return

    //fill the empty space with grass
    for (
        let w = Math.floor(-roundToTheFix(canvas.width, imageScale, 3) / 2) - imageScale * 1.5;
        w < Math.ceil(roundToTheFix(canvas.width, imageScale, 3) / 2) + imageScale * 0.5;
        w += imageScale
    ) {
        for (
            let h = Math.floor(-roundToTheFix(canvas.height, imageScale, 3) / 2) - imageScale * 1.5;
            h < Math.ceil(roundToTheFix(canvas.height, imageScale, 3) / 2) + imageScale * 0.5;
            h += imageScale
        ) {
            context.drawImage(mapImages.grass, w - (player.x % 1) * imageScale, h - (player.y % 1) * imageScale, imageScale, imageScale)
        }
    }

    for (let k = 1; k < path.length; k++) {
        const dx = path[k].rx - path[k - 1].rx
        const dy = path[k].ry - path[k - 1].ry
        for (let i = 0; i < Math.abs(dx) + Math.abs(dy); i++) {
            const x = path[k - 1].rx + (dx / (Math.abs(dx) + Math.abs(dy))) * i - player.x
            const y = path[k - 1].ry + (dy / (Math.abs(dx) + Math.abs(dy))) * i - player.y

            context.drawImage(mapImages.track_corner_lt, (x - 1) * imageScale - imageScale / 2, (y + 1) * imageScale - imageScale / 2, imageScale, imageScale)
            context.drawImage(mapImages.track_corner_rt, (x + 1) * imageScale - imageScale / 2, (y + 1) * imageScale - imageScale / 2, imageScale, imageScale)
            context.drawImage(mapImages.track_corner_lb, (x - 1) * imageScale - imageScale / 2, (y - 1) * imageScale - imageScale / 2, imageScale, imageScale)
            context.drawImage(mapImages.track_corner_rb, (x + 1) * imageScale - imageScale / 2, (y - 1) * imageScale - imageScale / 2, imageScale, imageScale)
        }
    }
    for (let k = 1; k < path.length; k++) {
        const dx = path[k].rx - path[k - 1].rx
        const dy = path[k].ry - path[k - 1].ry
        for (let i = 0; i < Math.abs(dx) + Math.abs(dy); i++) {
            const x = path[k - 1].rx + (dx / (Math.abs(dx) + Math.abs(dy))) * i - player.x
            const y = path[k - 1].ry + (dy / (Math.abs(dx) + Math.abs(dy))) * i - player.y
            context.drawImage(mapImages.track_left, (x - 1) * imageScale - imageScale / 2, y * imageScale - imageScale / 2, imageScale, imageScale)
            context.drawImage(mapImages.track_right, (x + 1) * imageScale - imageScale / 2, y * imageScale - imageScale / 2, imageScale, imageScale)
            context.drawImage(mapImages.track_bottom, x * imageScale - imageScale / 2, (y + 1) * imageScale - imageScale / 2, imageScale, imageScale)
            context.drawImage(mapImages.track_top, x * imageScale - imageScale / 2, (y - 1) * imageScale - imageScale / 2, imageScale, imageScale)
        }
    }
    for (let k = 1; k < path.length; k++) {
        const dx = path[k].rx - path[k - 1].rx
        const dy = path[k].ry - path[k - 1].ry
        for (let i = 0; i < Math.abs(dx) + Math.abs(dy); i++) {
            const x = path[k - 1].rx + (dx / (Math.abs(dx) + Math.abs(dy))) * i - player.x
            const y = path[k - 1].ry + (dy / (Math.abs(dx) + Math.abs(dy))) * i - player.y
            context.drawImage(mapImages.track_full, x * imageScale - imageScale / 2, y * imageScale - imageScale / 2, imageScale, imageScale)
        }

        const dx2 = path[(k + 1) % path.length].rx - path[k].rx
        const dy2 = path[(k + 1) % path.length].ry - path[k].ry
        const x = path[k].rx - player.x
        const y = path[k].ry - player.y

        if ((dx > 0 && dy2 > 0) || (dx2 < 0 && dy < 0))
            context.drawImage(mapImages.track_bigcorner_lb, (x - 1) * imageScale - imageScale / 2, (y + 1) * imageScale - imageScale / 2, imageScale, imageScale)
        else if ((dx < 0 && dy2 > 0) || (dx2 > 0 && dy < 0))
            context.drawImage(mapImages.track_bigcorner_rb, (x + 1) * imageScale - imageScale / 2, (y + 1) * imageScale - imageScale / 2, imageScale, imageScale)
        else if ((dx > 0 && dy2 < 0) || (dx2 < 0 && dy > 0))
            context.drawImage(mapImages.track_bigcorner_lt, (x - 1) * imageScale - imageScale / 2, (y - 1) * imageScale - imageScale / 2, imageScale, imageScale)
        else if ((dx < 0 && dy2 < 0) || (dx2 > 0 && dy > 0))
            context.drawImage(mapImages.track_bigcorner_rt, (x + 1) * imageScale - imageScale / 2, (y - 1) * imageScale - imageScale / 2, imageScale, imageScale)
    }

    const fixedCursorLoc = {
        x: cursorLoc.x - player.x * imageScale,
        y: cursorLoc.y - player.y * imageScale,
    }

    if (player.state == "walk") context.strokeStyle = "#ffff00"
    else if (
        player.y + Math.round(fixedCursorLoc.y / 100) > 22 ||
        player.y + Math.round(fixedCursorLoc.y / 100) < -2 ||
        player.x + Math.round(fixedCursorLoc.x / 100) < -12 ||
        player.x + Math.round(fixedCursorLoc.x / 100) > 12
    )
        context.strokeStyle = "#ff0000"
    else context.strokeStyle = "#00ff00"
    context.lineWidth = 10

    itemsOnMapHandler.get().forEach((e) => {
        const img = rimages[e.properties.displayRubbishImg]
        if (img) context?.drawImage(img, (e.cords[0] - player.x) * imageScale - itemScale / 2, (e.cords[1] - player.y) * imageScale - itemScale / 2, itemScale, itemScale)
    })

    context.strokeRect(cursorLoc.x - player.x * imageScale - imageScale / 2, cursorLoc.y - player.y * imageScale - imageScale / 2, imageScale, imageScale)
    context.drawImage(pimages[`${player.state}_${player.direction}_f${player.frame}`], -imageScale / 2, -imageScale / 2, imageScale, imageScale)
}

export async function start() {
    canvas.width = elements.maingameDiv.offsetWidth
    canvas.height = elements.maingameDiv.offsetHeight
    elements.maingameDiv.appendChild(canvas)
    context = canvas.getContext("2d")

    context?.translate(canvas.width / 2, canvas.height / 2)

    await Promise.all(
        Object.entries(mapImages).map((e) => {
            return new Promise((resolve) => {
                e[1].onload = () => {
                    console.log(`[DEBUG] Załadowano zdjęcie imgs/map/${e[0]}.png`)
                    resolve(undefined)
                }
                e[1].src = `imgs/map/${e[0]}.png`
            })
        })
    )

    const pconstruction = {
        frames: {
            idle: 4,
            walk: 4,
        },
        directions: ["up", "down", "left", "right"],
    }

    pconstruction.directions.forEach((direction) => {
        Object.entries(pconstruction.frames).forEach((frame) => {
            for (let i = 0; i < frame[1]; i++) {
                pimages[`${frame[0]}_${direction}_f${i}`] = new Image()
            }
        })
    })

    rubbishData.forEach((e) => {
        rimages[e.img.toString().split("/").at(-1)?.split(".").at(0)] = new Image()
        if (e.variantImgs)
            e.variantImgs.forEach((img, ind) => {
                rimages[img.toString().split("/").at(-1)?.split(".").at(0)] = new Image()
            })
    })

    await Promise.all(
        Object.entries(pimages).map((e) => {
            return new Promise((resolve) => {
                e[1].onload = () => {
                    console.log(`[DEBUG] Załadowano zdjęcie imgs/player/${e[0]}.png`)
                    resolve(undefined)
                }
                e[1].onerror = () => {
                    console.error(`Failed to load image: imgs/player/${e[0]}.png`)
                    resolve(undefined)
                }
                e[1].src = `imgs/player/${e[0]}.png`
            })
        })
    )

    await Promise.all(
        Object.entries(rimages).map((e) => {
            return new Promise((resolve) => {
                e[1].onload = () => {
                    console.log(`[DEBUG] Załadowano zdjęcie imgs/rubbish/${e[0]}.png`)
                    resolve(undefined)
                }
                e[1].src = `imgs/rubbish/${e[0]}.png`
            })
        })
    )

    localizatorHandler.set("maingame")

    tick()
}

function tick() {
    if (localizatorHandler.get() == "maingame") {
        canvas.width = elements.maingameDiv.offsetWidth
        canvas.height = elements.maingameDiv.offsetHeight
        context?.translate(canvas.width / 2, canvas.height / 2)
        generateMap()
    }
    setTimeout(tick, 10)
}

document.addEventListener("mousemove", (e) => {
    //localize where the player will go
    const x = player.x * imageScale + roundToTheFix(e.clientX - canvas.width / 2, imageScale)
    const y = player.y * imageScale + roundToTheFix(e.clientY - canvas.height / 2, imageScale)
    if (localizatorHandler.get() == "maingame" && (cursorLoc.x !== x || cursorLoc.y !== y) && player.state == "idle")
        console.log(
            `[DEBUG/less] Zmiana położenia lokalizacji klocka (x=${x / 100}, y=${y / 100}, rx=${roundToTheFix(e.clientX - canvas.width / 2, imageScale) / 100}, ry=${
                roundToTheFix(e.clientY - canvas.height / 2, imageScale) / 100
            })`
        )
    if (player.state == "idle") cursorLoc = { x, y }
})
