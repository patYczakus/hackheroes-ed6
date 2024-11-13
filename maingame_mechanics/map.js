import { localizatorHandler } from "../communicator.js"
import { elements } from "../elements.js"
import { rubbishData } from "../lists/rubbish.js"
import { itemsOnMapHandler } from "./items.js"
import { NPCsInfo } from "./npcs.js"
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
const NPCsImages = {}
const otherImages = {
    sign: new Image(),
    location: new Image(),
    home1: new Image(),
    home2: new Image(),
    home3: new Image(),
    home4: new Image(),
}

const canvas = document.createElement("canvas")

/**
 * @type {CanvasRenderingContext2D | null}
 */
let context = null

const imageScale = 100
const itemScale = 50
const maxSize = 2500 // Maksymalne wymiary, przy których skala wynosi 1
window.scale = 1 // Zmienna do przechowywania skali

const iteminfo = (() => {
    const adas = document.createElement("div")
    adas.className = "iteminfo"
    return adas
})()

/**
 * @param {number} number
 * @param {number} fix
 * @returns
 */
const roundToTheFix = (number, fix, fixAddition = 0) => (Math.round(number / fix) + fixAddition) * fix

async function generateMap() {
    if (!context) return

    // Wypełnij pustą przestrzeń trawą
    for (
        let w = Math.floor(-roundToTheFix(canvas.width, imageScale * scale, 3) / 2) - imageScale * scale * 1.5;
        w < Math.ceil(roundToTheFix(canvas.width, imageScale * scale, 3) / 2) + imageScale * scale * 0.5;
        w += imageScale * scale
    ) {
        for (
            let h = Math.floor(-roundToTheFix(canvas.height, imageScale * scale, 3) / 2) - imageScale * scale * 1.5;
            h < Math.ceil(roundToTheFix(canvas.height, imageScale * scale, 3) / 2) + imageScale * scale * 0.5;
            h += imageScale * scale
        ) {
            context.drawImage(mapImages.grass, w - (player.x % 1) * imageScale * scale, h - (player.y % 1) * imageScale * scale, imageScale * scale, imageScale * scale)
        }
    }

    for (let k = 1; k < path.length; k++) {
        const dx = path[k].rx - path[k - 1].rx
        const dy = path[k].ry - path[k - 1].ry
        for (let i = 0; i < Math.abs(dx) + Math.abs(dy); i++) {
            const x = path[k - 1].rx + (dx / (Math.abs(dx) + Math.abs(dy))) * i - player.x
            const y = path[k - 1].ry + (dy / (Math.abs(dx) + Math.abs(dy))) * i - player.y

            context.drawImage(
                mapImages.track_corner_lt,
                (x - 1) * imageScale * scale - (imageScale / 2) * scale,
                (y + 1) * imageScale * scale - (imageScale / 2) * scale,
                imageScale * scale,
                imageScale * scale
            )
            context.drawImage(
                mapImages.track_corner_rt,
                (x + 1) * imageScale * scale - (imageScale / 2) * scale,
                (y + 1) * imageScale * scale - (imageScale / 2) * scale,
                imageScale * scale,
                imageScale * scale
            )
            context.drawImage(
                mapImages.track_corner_lb,
                (x - 1) * imageScale * scale - (imageScale / 2) * scale,
                (y - 1) * imageScale * scale - (imageScale / 2) * scale,
                imageScale * scale,
                imageScale * scale
            )
            context.drawImage(
                mapImages.track_corner_rb,
                (x + 1) * imageScale * scale - (imageScale / 2) * scale,
                (y - 1) * imageScale * scale - (imageScale / 2) * scale,
                imageScale * scale,
                imageScale * scale
            )
        }
    }
    for (let k = 1; k < path.length; k++) {
        const dx = path[k].rx - path[k - 1].rx
        const dy = path[k].ry - path[k - 1].ry
        for (let i = 0; i < Math.abs(dx) + Math.abs(dy); i++) {
            const x = path[k - 1].rx + (dx / (Math.abs(dx) + Math.abs(dy))) * i - player.x
            const y = path[k - 1].ry + (dy / (Math.abs(dx) + Math.abs(dy))) * i - player.y
            context.drawImage(
                mapImages.track_left,
                (x - 1) * imageScale * scale - (imageScale / 2) * scale,
                y * imageScale * scale - (imageScale / 2) * scale,
                imageScale * scale,
                imageScale * scale
            )
            context.drawImage(
                mapImages.track_right,
                (x + 1) * imageScale * scale - (imageScale / 2) * scale,
                y * imageScale * scale - (imageScale / 2) * scale,
                imageScale * scale,
                imageScale * scale
            )
            context.drawImage(
                mapImages.track_bottom,
                x * imageScale * scale - (imageScale / 2) * scale,
                (y + 1) * imageScale * scale - (imageScale / 2) * scale,
                imageScale * scale,
                imageScale * scale
            )
            context.drawImage(
                mapImages.track_top,
                x * imageScale * scale - (imageScale / 2) * scale,
                (y - 1) * imageScale * scale - (imageScale / 2) * scale,
                imageScale * scale,
                imageScale * scale
            )
        }
    }
    for (let k = 1; k < path.length; k++) {
        const dx = path[k].rx - path[k - 1].rx
        const dy = path[k].ry - path[k - 1].ry
        for (let i = 0; i < Math.abs(dx) + Math.abs(dy); i++) {
            const x = path[k - 1].rx + (dx / (Math.abs(dx) + Math.abs(dy))) * i - player.x
            const y = path[k - 1].ry + (dy / (Math.abs(dx) + Math.abs(dy))) * i - player.y
            context.drawImage(
                mapImages.track_full,
                x * imageScale * scale - (imageScale / 2) * scale,
                y * imageScale * scale - (imageScale / 2) * scale,
                imageScale * scale,
                imageScale * scale
            )
        }

        const dx2 = path[(k + 1) % path.length].rx - path[k].rx
        const dy2 = path[(k + 1) % path.length].ry - path[k].ry
        const x = path[k].rx - player.x
        const y = path[k].ry - player.y

        if ((dx > 0 && dy2 > 0) || (dx2 < 0 && dy < 0))
            context.drawImage(
                mapImages.track_bigcorner_lb,
                (x - 1) * imageScale * scale - (imageScale / 2) * scale,
                (y + 1) * imageScale * scale - (imageScale / 2) * scale,
                imageScale * scale,
                imageScale * scale
            )
        else if ((dx < 0 && dy2 > 0) || (dx2 > 0 && dy < 0))
            context.drawImage(
                mapImages.track_bigcorner_rb,
                (x + 1) * imageScale * scale - (imageScale / 2) * scale,
                (y + 1) * imageScale * scale - (imageScale / 2) * scale,
                imageScale * scale,
                imageScale * scale
            )
        else if ((dx > 0 && dy2 < 0) || (dx2 < 0 && dy > 0))
            context.drawImage(
                mapImages.track_bigcorner_lt,
                (x - 1) * imageScale * scale - (imageScale / 2) * scale,
                (y - 1) * imageScale * scale - (imageScale / 2) * scale,
                imageScale * scale,
                imageScale * scale
            )
        else if ((dx < 0 && dy2 < 0) || (dx2 > 0 && dy > 0))
            context.drawImage(
                mapImages.track_bigcorner_rt,
                (x + 1) * imageScale * scale - (imageScale / 2) * scale,
                (y - 1) * imageScale * scale - (imageScale / 2) * scale,
                imageScale * scale,
                imageScale * scale
            )
    }

    const fixedCursorLoc = {
        x: cursorLoc.x - player.x * imageScale * scale,
        y: cursorLoc.y - player.y * imageScale * scale,
    }

    //--------------

    itemsOnMapHandler.get().forEach((e) => {
        const img = (() => {
            switch (e.parentID) {
                case "rubbish":
                    return rimages[e.properties.displayRubbishImg]
                case "sign":
                    return otherImages.sign
                case "interactiveElement":
                    return undefined
            }
        })()
        if (img)
            context?.drawImage(
                img,
                (e.cords[0] - player.x) * imageScale * scale - (itemScale / 2) * scale,
                (e.cords[1] - player.y) * imageScale * scale - (itemScale / 2) * scale,
                itemScale * scale,
                itemScale * scale
            )
    })

    //--------------

    context.drawImage(
        otherImages.home1,
        (-1 - player.x) * imageScale * scale - (imageScale / 2) * scale,
        (-4 - player.y) * imageScale * scale - (imageScale / 2) * scale,
        2 * imageScale * scale,
        3 * imageScale * scale
    )
    context.drawImage(
        otherImages.home2,
        (-6 - player.x) * imageScale * scale - (imageScale / 2) * scale,
        (-4 - player.y) * imageScale * scale - (imageScale / 2) * scale,
        2 * imageScale * scale,
        3 * imageScale * scale
    )
    context.drawImage(
        otherImages.home3,
        (4 - player.x) * imageScale * scale - (imageScale / 2) * scale,
        (-4 - player.y) * imageScale * scale - (imageScale / 2) * scale,
        2 * imageScale * scale,
        3 * imageScale * scale
    )
    context.drawImage(
        otherImages.home4,
        (-15 - player.x) * imageScale * scale - (imageScale / 2) * scale,
        (3 - player.y) * imageScale * scale - (imageScale / 2) * scale,
        3 * imageScale * scale,
        3 * imageScale * scale
    )

    //--------------

    Object.keys(NPCsInfo).forEach((e) => {
        context.drawImage(
            NPCsImages[`${e}_main_f${NPCsInfo[e].tick}`],
            (NPCsInfo[e].x - player.x) * imageScale * scale - (imageScale / 2) * scale,
            (NPCsInfo[e].y - player.y) * imageScale * scale - (imageScale / 2) * scale,
            imageScale * scale,
            imageScale * scale
        )
    })

    //--------------

    if (player.state == "walk") context.strokeStyle = "#ffff00"
    else if (
        player.y + Math.round(fixedCursorLoc.y / 100 / scale) > 22 ||
        player.y + Math.round(fixedCursorLoc.y / 100 / scale) < -2 ||
        player.x + Math.round(fixedCursorLoc.x / 100 / scale) < -12 ||
        player.x + Math.round(fixedCursorLoc.x / 100 / scale) > 12
    )
        context.strokeStyle = "#ff0000"
    else context.strokeStyle = "#00ff00"

    context.lineWidth = 10 * scale
    context.strokeRect(
        cursorLoc.x - player.x * imageScale * scale - (imageScale / 2) * scale,
        cursorLoc.y - player.y * imageScale * scale - (imageScale / 2) * scale,
        imageScale * scale,
        imageScale * scale
    )
    context.drawImage(pimages[`${player.state}_${player.direction}_f${player.frame}`], (-imageScale / 2) * scale, (-imageScale / 2) * scale, imageScale * scale, imageScale * scale)

    //--------------

    const findSign = itemsOnMapHandler.get().find((x) => x.cords[0] === player.x && x.cords[1] === player.y && x.parentID == "sign")
    if (findSign) {
        context.font = "20px monospace"
        const textMeasures = context.measureText(findSign.properties.display.map((x) => x.text).join(""))
        context.beginPath()
        context.fillStyle = "white"
        context.strokeStyle = "black"
        context.lineWidth = 7.5
        context.rect(-textMeasures.width / 2 - 10, -imageScale * scale, textMeasures.width + 20, 40)
        context.fill()
        context.stroke()
        context.closePath()
        let x = -textMeasures.width / 2
        for (let i = 0; i < findSign.properties.display.length; i++) {
            context.font = "20px monospace"
            context.textAlign = "left"
            context.textBaseline = "middle"
            context.fillStyle = findSign.properties.display[i].color || "black"
            context.fillText(findSign.properties.display[i].text, x, -imageScale * scale + 20)
            x += context.measureText(findSign.properties.display[i].text).width
        }
    }
}

function getItemInfo() {
    const item = itemsOnMapHandler.get().find((item) => item.cords[0] === cursorLoc.x / 100 && item.cords[1] === cursorLoc.y / 100)
    iteminfo.innerHTML = ""
    if (item) {
        console.log(`[DEBUG] Znaleziono przedmiot o ID ${item.UID}, wyświetlanie informacji...`)
        const box = document.createElement("div")
        box.style.width = "400px"
        box.style.minHeight = "120px"
        box.style.background = "rgb(0,0,0,0.5)"
        box.style.border = "5px solid rgb(0,0,0,0.75)"
        box.style.color = "white"
        const img = (() => {
            switch (item.parentID) {
                case "rubbish":
                    return rimages[item.properties.displayRubbishImg]
                case "sign":
                    return otherImages.sign
                case "interactiveElement":
                    return otherImages.location
            }
        })()
        img.alt = "ITEM"
        img.width = 100
        img.height = 100
        img.style.marginTop = "10px"
        img.style.float = "left"
        img.style.marginRight = "10px"
        const name = document.createElement("h1")
        name.innerText = item.name
        name.style.float = "left"
        name.style.width = "280px"
        const info = document.createElement("span")
        info.innerText = `Typ: ${{ rubbish: "śmieć", sign: "tabliczka", interactiveElement: "interakcja" }[item.parentID]}`
        info.style.clear = "both"
        info.style.fontSize = "15px"
        info.style.maxWidth = "280px"
        box.appendChild(img)
        box.appendChild(name)
        box.appendChild(document.createElement("br"))
        box.appendChild(info)
        iteminfo.appendChild(box)
    }
}

export async function start() {
    localizatorHandler.set("l")
    document.body.setAttribute("showtype", "loading")

    canvas.width = elements.maingameDiv.offsetWidth
    canvas.height = elements.maingameDiv.offsetHeight
    elements.maingameDiv.appendChild(canvas)
    context = canvas.getContext("2d")

    elements.maingameDiv.appendChild(iteminfo)

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
    Object.keys(NPCsInfo).forEach((e) => {
        for (let i = 0; i < 4; i++) {
            NPCsImages[`${e}_main_f${i}`] = new Image()
        }
    })

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

    await Promise.all(
        Object.entries(otherImages).map((e) => {
            return new Promise((resolve) => {
                e[1].onload = () => {
                    console.log(`[DEBUG] Załadowano zdjęcie imgs/others/${e[0]}.png`)
                    resolve(undefined)
                }
                e[1].src = `imgs/others/${e[0]}.png`
            })
        })
    )

    await Promise.all(
        Object.entries(NPCsImages).map((e) => {
            return new Promise((resolve) => {
                e[1].onload = () => {
                    console.log(`[DEBUG] Załadowano zdjęcie imgs/npcs/${e[0]}.png`)
                    resolve(undefined)
                }
                e[1].src = `imgs/npcs/${e[0]}.png`
            })
        })
    )

    calculateScale()
    tick()

    localizatorHandler.set("maingame")
    document.body.removeAttribute("showtype")
}

function tick() {
    if (localizatorHandler.get().startsWith("maingame")) {
        canvas.width = elements.maingameDiv.offsetWidth
        canvas.height = elements.maingameDiv.offsetHeight
        context?.translate(canvas.width / 2, canvas.height / 2)
        generateMap()
    }

    if (player.state == "walk") iteminfo.innerHTML = ""

    setTimeout(tick, 10 + 40 * !document.hasFocus())
}

function calculateScale() {
    if (canvas.width > maxSize || canvas.height > maxSize) {
        var newScale = Math.max(canvas.width / maxSize, canvas.height / maxSize)
    } else {
        var newScale = 1
    }

    if (newScale !== scale) {
        scale = newScale
        console.log(`[DEBUG] Zmieniono skalę mapy na ${scale}`)
    }

    setTimeout(calculateScale, 100)
}

document.addEventListener("mousemove", (e) => {
    //localize where the player will go
    const x = player.x * imageScale * scale + roundToTheFix(e.clientX - canvas.width / 2, imageScale * scale)
    const y = player.y * imageScale * scale + roundToTheFix(e.clientY - canvas.height / 2, imageScale * scale)
    if ((cursorLoc.x !== x || cursorLoc.y !== y) && player.state == "idle") {
        if (localizatorHandler.get().startsWith("maingame"))
            console.log(
                `[DEBUG/less] Zmiana położenia lokalizacji klocka (x=${x / 100}, y=${y / 100}, rx=${roundToTheFix(e.clientX - canvas.width / 2, imageScale) / 100}, ry=${
                    roundToTheFix(e.clientY - canvas.height / 2, imageScale) / 100
                })`
            )
        cursorLoc = { x, y }
        if (localizatorHandler.get() == "maingame") getItemInfo()
    }
})
