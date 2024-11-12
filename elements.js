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
    loadingScreen: (() => {
        let element = document.createElement("div")
        element.id = "loading"
        element.innerHTML = "Loading..."
            .split("")
            .map((x, i) => `<span class="fading" style="animation_delay: ${i * 0.1}s">${x}</span>`)
            .join("")
        document.body.appendChild(element)
        return element
    })(),
}
