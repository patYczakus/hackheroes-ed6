//@ts-check

import { elements } from "../elements.js"
import { rubbishCategoryFullname, rubbishData } from "../rubbish.js"

let randomElement = rubbishData[0]

const rubbishDiv = document.createElement("div")
const infoDiv = document.createElement("div")

/**
 * @param {string} canType
 */
const checkElements = (canType) => {
    return () => {
        if (canType == randomElement.type) {
            generateTheRubbish()
        } else {
            infoDiv.innerHTML = `Źle! To nie ${rubbishCategoryFullname[canType]}!`
        }
    }
}

function generateTheRubbish() {
    let randomIndex = Math.floor(Math.random() * rubbishData.length)
    randomElement = rubbishData[randomIndex]
    rubbishDiv.innerHTML = `<img src="${randomElement.img}" alt="${randomElement.name}">`
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
        element.addEventListener("click", checkElements(canType))
        element.innerText = rubbishCategoryFullname[rubbishCans[i]]
        elements.minigameDiv.appendChild(element)

        generateTheRubbish()
    }

    elements.minigameDiv.appendChild(infoDiv)
}
