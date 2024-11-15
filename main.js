import { start } from "./maingame_mechanics/map.js"
import { elements } from "./elements.js"
import { setWholePlayerData } from "./maingame_mechanics/player.js"

const mainchanger = document.createElement("div")
mainchanger.style.maxWidth = "500px"

function mainmenu() {
    mainchanger.innerHTML = ""
    if (localStorage.getItem("data")) {
        const newGameButton = document.createElement("button")
        newGameButton.addEventListener("click", () => {
            if (confirm("To zresetuje cały postęp! Czy na pewno chcesz kontynuować?")) {
                elements.maingameDiv.classList.remove("startmenu")
                elements.maingameDiv.innerHTML = ""
                localStorage.removeItem("data")
                start()
            }
        })
        newGameButton.innerText = "Nowa gra"
        mainchanger.appendChild(newGameButton)

        const existingGameButton = document.createElement("button")
        existingGameButton.addEventListener("click", () => {
            elements.maingameDiv.classList.remove("startmenu")
            elements.maingameDiv.innerHTML = ""
            setWholePlayerData(JSON.parse(localStorage.getItem("data")))
            start()
        })
        existingGameButton.innerText = "Kontynuuj grę"
        mainchanger.appendChild(existingGameButton)
    } else {
        const startButton = document.createElement("button")
        startButton.addEventListener("click", () => {
            elements.maingameDiv.classList.remove("startmenu")
            elements.maingameDiv.innerHTML = ""
            start()
        })
        startButton.innerText = "Rozpocznij Grę"
        mainchanger.appendChild(startButton)
    }
    mainchanger.appendChild(document.createElement("br"))
    const fabułaButton = document.createElement("button")
    fabułaButton.innerText = "Fabuła"
    fabułaButton.addEventListener("click", fabuła)
    mainchanger.appendChild(fabułaButton)
}

function fabuła() {
    mainchanger.innerHTML = ""
    const fabuła = document.createElement("p")
    fabuła.innerText = `W niedalekiej przyszłości, świat pogrążył się w chaosie. Ludzie zapomnieli o segregacji śmieci, a planeta cierpi z powodu zanieczyszczeń. Ty jesteś jedyną osobą, która może uratować świat przed ekologiczną katastrofą. Twoim zadaniem jest zbieranie śmieci i segregowanie ich do odpowiednich pojemników. Poznasz też barwy Twoich sąsiadów, i postarasz się ich przekonać do wspólnej segregacji śmieci.`
    const button = document.createElement("button")
    button.innerText = "Powrót do menu"
    button.addEventListener("click", mainmenu)
    const fabułaDiv = document.createElement("div")
    fabułaDiv.appendChild(fabuła)
    fabułaDiv.appendChild(button)
    mainchanger.appendChild(fabułaDiv)
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
