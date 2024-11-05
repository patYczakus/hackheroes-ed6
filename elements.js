export const elements = {
    minigameDiv: (() => {
        let element = document.createElement("div")
        element.id = "minigame"
        document.body.appendChild(element)
        return element
    })(),
    maingameDiv: (() => {
        let element = document.createElement("div")
        element.id = "maingame"
        document.body.appendChild(element)
        return element
    })(),
}
