//@ts-check

import { localizatorHandler } from "../communicator.js"
import { elements } from "../elements.js"
import { rubbishCategoryFullname, rubbishData } from "../lists/rubbish.js"
import { InventoryItem } from "../maingame_mechanics/items.js"
import { itemsInIventory } from "../maingame_mechanics/player.js"

/**
 * @type {Array<InventoryItem>}
 */
const rubbishes = []
/**
 * @type {{ data: import("../lists/rubbish.js").RubbishFields, img: string | URL, i: number }}
 */
let randomElement

const rubbishDiv = document.createElement("div")
const text = document.createElement("div")
let hoveredCanType = ""
let canbeshown = true

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
            oldimage.draggable = false
            oldimage.className = "toCan"
            oldimage.width = 200
            oldimage.height = 200
            rubbishDiv.appendChild(oldimage)
            setTimeout(() => {
                oldimage.remove()
            }, 275)

            rubbishes.pop()
            const _t = getTrash()

            if (!_t) {
                setTimeout(() => {
                    localizatorHandler.set("l")
                    document.body.setAttribute("showtype", "loading")
                }, 300)
                setTimeout(() => {
                    localizatorHandler.set("maingame")
                    document.body.setAttribute("showtype", "maingame")
                }, 1300)
                return
            }

            const newimage = document.createElement("img")
            newimage.src = randomElement.img.toString()
            newimage.alt = randomElement.data.name
            newimage.draggable = false
            newimage.width = 200
            newimage.height = 200
            newimage.className = "toCenter"
            rubbishDiv.appendChild(newimage)

            canbeshown = false
            text.innerText = `... > ${rubbishCategoryFullname[canType]}?`
            setTimeout(() => {
                text.innerText = `${randomElement.data.name} > ${rubbishCategoryFullname[hoveredCanType] ?? "..."}?`
                canbeshown = true
            }, 250)

            element.classList.add("bounceAnimation")
            setTimeout(() => element.classList.remove("bounceAnimation"), 510)
        } else {
            element.classList.add("shakeAnimation")
            setTimeout(() => element.classList.remove("shakeAnimation"), 510)
        }
    }
}

function getTrash() {
    const rubbish = rubbishes.at(-1)
    if (!rubbish) return false
    randomElement = {
        data: rubbishData[rubbish.properties.rubbishID],
        img: `imgs/rubbish/${rubbish.properties.displayRubbishImg}.png`,
        i: rubbish.properties.rubbishID,
    }
    return true
}

export function game_segregation() {
    if (itemsInIventory.filter((x) => x.parentID == "rubbish").length == 0) return

    localizatorHandler.set("l")
    document.body.setAttribute("showtype", "loading")

    rubbishes.push(...itemsInIventory.filter((x) => x.parentID == "rubbish").sort(() => Math.random() - 0.5))

    elements.minigameDiv.innerHTML = ""
    elements.minigameDiv.appendChild(rubbishDiv)

    let rubbishCans = Object.keys(rubbishCategoryFullname)
    for (let i = 0; i < rubbishCans.length; i++) {
        const canType = rubbishCans[i]
        const element = document.createElement("button")
        element.type = "button"
        element.className = "rubbishCan"
        element.addEventListener("click", checkElements(canType, element))
        element.addEventListener("mouseover", () => {
            hoveredCanType = canType
            text.innerText = `${canbeshown ? randomElement.data.name : "..."} > ${rubbishCategoryFullname[canType]}?`
        })
        element.addEventListener("mouseout", () => {
            hoveredCanType = ""
            text.innerText = `${canbeshown ? randomElement.data.name : "..."} > ...`
        })
        element.innerHTML = `<img src="imgs/cans/${canType}.png" alt="${rubbishCategoryFullname[canType]}" width="130" height="130" draggable="false">`
        element.style.top = `${i * 130 + 50}px`
        elements.minigameDiv.appendChild(element)
    }

    getTrash()

    const newimage = document.createElement("img")
    elements.minigameDiv.className = "segregation"
    newimage.src = randomElement.img.toString()
    newimage.alt = randomElement.data.name
    newimage.draggable = false
    newimage.width = 200
    newimage.height = 200
    newimage.className = "toCenter"
    rubbishDiv.appendChild(newimage)

    text.id = "bottomtext"
    text.innerText = `${randomElement.data.name} > ...`
    elements.minigameDiv.appendChild(text)

    setTimeout(() => {
        localizatorHandler.set("segregation")
        document.body.setAttribute("showtype", "minigame")
    }, 1000)
}
