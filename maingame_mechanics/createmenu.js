//@ts-check

import { localizatorHandler } from "../communicator.js"
import { game_segregation } from "../minigames/segregation.js"
import { dialogSystem } from "./dialogs.js"
import { generateSomeRubbishOnMap, itemsOnMapHandler } from "./items.js"
import { player } from "./player.js"

const element = document.createElement("div")
element.id = "options"

function optionButton() {
    const x = document.createElement("div")
    x.style.width = "150px"
    x.style.height = "250px"
    x.style.background = "rgb(20, 20, 20)"
    x.style.border = "5px solid black"
    x.style.textAlign = "center"
    x.style.margin = "7px"
    x.style.padding = "15px"
    x.style.color = "white"
    x.className = "scaleOnHover"
    return x
}

export function generateOptions(type) {
    element.innerHTML = ""

    localizatorHandler.set("maingame_option")

    switch (type) {
        case "player":
            const sleep = optionButton()
            //h1
            const sleepH1 = document.createElement("h1")
            sleepH1.innerText = "Śpij do następnego dnia"
            const sleepSpan = document.createElement("span")
            sleepSpan.innerText = "Spanie powoduje zapis gry na później, regenerację śmieci i możliwości ponownej rozmowy"
            sleep.appendChild(sleepH1)
            sleep.appendChild(sleepSpan)
            sleep.addEventListener("click", () => {
                element.style.background = "black"
                element.style.color = "white"
                element.style.fontSize = "17px"
                element.innerHTML = `<span class="fadeB">Zasypianie...</span>`

                setTimeout(() => element.classList.add("fadingb"), 5500)
                setTimeout(() => {
                    document.body.removeChild(element)
                    element.classList.remove("fadingb")
                    localizatorHandler.set("maingame")
                    element.style.background = ""
                    element.style.color = ""
                    element.style.fontSize = ""
                }, 6500)

                player.direction = "down"
                generateSomeRubbishOnMap()
                player.memory.talkedToday = []
                localStorage.setItem("data", JSON.stringify(player))
            })
            element.appendChild(sleep)

            const segregationbtn = optionButton()
            const segregationH1 = document.createElement("h1")
            segregationH1.innerText = "Segregacja śmieci"
            segregationbtn.appendChild(segregationH1)
            segregationbtn.addEventListener("click", () => {
                document.body.removeChild(element)
                game_segregation()
                player.direction = "down"
            })
            element.appendChild(segregationbtn)

            break
    }

    //cancel button
    const cancelButton = document.createElement("button")
    cancelButton.innerText = "Anuluj"
    cancelButton.style.position = "fixed"
    cancelButton.style.bottom = "10px"
    cancelButton.style.left = "50%"
    cancelButton.style.transform = "translateX(-50%)"
    cancelButton.style.zIndex = "11"

    cancelButton.addEventListener("click", () => {
        document.body.removeChild(element)
        localizatorHandler.set("maingame")
    })
    element.appendChild(cancelButton)
    document.body.appendChild(element)
}
