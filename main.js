import { start } from "./maingame_mechanics/map.js"
import { elements } from "./elements.js"
import { setWholePlayerData } from "./maingame_mechanics/player.js"

const mainchanger = document.createElement("div")

function mainmenu() {
    mainchanger.innerHTML = ""
    if (localStorage.getItem("data")) {
        const newGameButton = document.createElement("button")
        newGameButton.addEventListener("click", () => {
            if (confirm("To zresetuje cały postęp! Czy na pewno chcesz kontynuować?")) {
                elements.maingameDiv.innerHTML = ""
                start()
            }
        })
        newGameButton.innerText = "Nowa gra"
        mainchanger.appendChild(newGameButton)

        const existingGameButton = document.createElement("button")
        existingGameButton.addEventListener("click", () => {
            elements.maingameDiv.innerHTML = ""
            setWholePlayerData(JSON.parse(localStorage.getItem("data")))
            start()
        })
        existingGameButton.innerText = "Kontynuuj grę"
        mainchanger.appendChild(existingGameButton)
    } else {
        const startButton = document.createElement("button")
        startButton.addEventListener("click", () => {
            elements.maingameDiv.innerHTML = ""
            start()
        })
        startButton.innerText = "Rozpocznij Grę"
        mainchanger.appendChild(startButton)
    }
}

window.onload = () => {
    const idiv = document.createElement("div")
    idiv.className = "innerdiv"

    const title = document.createElement("h1")
    title.textContent = "Recycling Masters"
    title.style.fontSize = "50px"
    idiv.appendChild(title)

    mainmenu()

    idiv.appendChild(mainchanger)
    elements.maingameDiv.appendChild(idiv)
    elements.maingameDiv.classList.add("startmenu")
}
