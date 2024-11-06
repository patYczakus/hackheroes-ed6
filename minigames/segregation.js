//@ts-check

import { elements } from "../elements.js"
import { rubbishCategoryFullname, rubbishData } from "../rubbish.js"

/**
 * @type {{ data: import("../rubbish.js").RubbishFields, img: string | URL, i: number }}
 */
let randomElement

const rubbishDiv = document.createElement("div")

/**
 * @param {string} canType
 * @param {HTMLButtonElement} element
 */
const checkElements = (canType, element) => {
    return () => {
        if (canType == (randomElement.data.type ?? "zmieszane")) {
            rubbishDiv.innerHTML = ""

            const oldimage = document.createElement("img")
            oldimage.src = randomElement.img.toString()
            oldimage.alt = randomElement.data.name
            oldimage.className = "toCan"
            oldimage.width = 200
            oldimage.height = 200
            rubbishDiv.appendChild(oldimage)
            setTimeout(() => {
                oldimage.remove()
            }, 510)

            getRandomTrash()

            const newimage = document.createElement("img")
            newimage.src = randomElement.img.toString()
            newimage.alt = randomElement.data.name
            newimage.width = 200
            newimage.height = 200
            newimage.className = "toCenter"
            rubbishDiv.appendChild(newimage)
        }
    }
}

function getRandomTrash() {
    let randid = Math.floor(Math.random() * rubbishData.length)
    let random = rubbishData[randid]
    let images = random.variantImgs ?? []
    images.push(random.img)
    let image = images[Math.floor(Math.random() * images.length)]

    randomElement = { data: random, img: image, i: randid }
}

export function game_segregation() {
    elements.minigameDiv.innerHTML = ""

    elements.minigameDiv.appendChild(rubbishDiv)

    let rubbishCans = Object.keys(rubbishCategoryFullname)
    for (let i = 0; i < rubbishCans.length; i++) {
        const canType = rubbishCans[i]
        const element = document.createElement("button")
        element.type = "button"
        element.className = "rubbishCan"
        element.addEventListener("click", checkElements(canType, element))
        element.innerHTML = `<img src="imgs/cans/${canType}.png" alt="${rubbishCategoryFullname[canType]}" width="130" height="130">`
        element.style.top = `${i * 130}px`
        elements.minigameDiv.appendChild(element)
    }

    getRandomTrash()
    const newimage = document.createElement("img")
    newimage.src = randomElement.img.toString()
    newimage.alt = randomElement.data.name
    newimage.width = 200
    newimage.height = 200
    newimage.className = "toCenter"
    rubbishDiv.appendChild(newimage)

    document.body.setAttribute("showtype", "minigame")
}
