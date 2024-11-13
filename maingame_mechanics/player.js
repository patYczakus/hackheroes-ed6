import { localizatorHandler } from "../communicator.js"
import { elements } from "../elements.js"
import { InventoryItem, itemsOnMapHandler } from "./items.js"

export const player = {
    x: 0,
    y: 0,
    frame: 0,
    state: "idle",
    direction: "down",
    memory: {},
}

let isPlayerMoving = false

function idling() {
    if (!isPlayerMoving) player.frame = (player.frame + 1) % 4
    setTimeout(idling, 250)
}
idling()

/**
 *
 * @param {"x" | "y"} type
 * @param {number} step
 * @param {() => any} [then=undefined]
 */
window.movePlayer = (type, step, then) => {
    step = Math.round(step)

    if (isPlayerMoving || step == 0) {
        then?.()
        return false
    }
    isPlayerMoving = true

    player.frame = 0
    player.state = "walk"
    player.direction = type == "x" ? (step > 0 ? "right" : "left") : step > 0 ? "down" : "up"

    let max = 20 * Math.abs(step)

    for (let i = 1; i <= max; i++) {
        setTimeout(
            (increement, frame, maxFrame) => {
                player[type] += increement
                player[type] = Math.round(player[type] * 100) / 100
                player.frame = (Math.floor((frame - 1) / 5) + 1) % 4
                if (frame === maxFrame) {
                    isPlayerMoving = false
                    player.state = "idle"
                    then?.()
                }
            },
            50 * i,
            0.05 * (step / Math.abs(step)),
            i,
            max
        )
    }

    return true
}

document.addEventListener("mouseup", (e) => {
    if (localizatorHandler.get() == "maingame") {
        const rect = elements.maingameDiv.getBoundingClientRect()
        const x = e.clientX - rect.width / 2
        const y = e.clientY - rect.height / 2
        console.log(`[DEBUG] Rozpoczęcie ruchu dla postaci (x=${player.x + Math.round(x / 100)}, y=${player.y + Math.round(y / 100)})`)
        if (
            player.y + Math.round(y / 100 / scale) > 22 ||
            player.y + Math.round(y / 100 / scale) < -2 ||
            player.x + Math.round(x / 100 / scale) < -12 ||
            player.x + Math.round(x / 100 / scale) > 12
        )
            return
        movePlayer("x", x / 100 / scale, () =>
            movePlayer("y", y / 100 / scale, () => {
                const searchedItem = itemsOnMapHandler.get().find((item) => item.cords[0] === player.x && item.cords[1] === player.y)
                if (searchedItem) {
                    console.log(`[DEBUG] Znaleziono przedmiot`, [searchedItem])
                    switch (searchedItem.parentID) {
                        case "rubbish":
                            itemsInIventory.push(searchedItem.toInventoryItem())
                            itemsOnMapHandler.remove(searchedItem)
                            console.log(`[DEBUG] Przedmiot dodany do ekwipunku`, [searchedItem.toInventoryItem()], `\n        Ilość rzeczy w ekwipunku: ${itemsInIventory.length}`)
                            break
                        case "interactiveElement":
                            console.log(`[DEBUG] Uruchamianie odwołania ${searchedItem.properties.referenceto}`)
                            const _temp = async () => {
                                let func = (await import(`../${searchedItem.properties.referenceto.split(":").at(0)}.js`))[searchedItem.properties.referenceto.split(":").at(1)]
                                console.log(`[DEBUG/interactiveElement] Typ zmiennej:`, typeof func)
                                func?.(...searchedItem.properties.referenceto.split(":").filter((x, i) => i >= 2))
                            }
                            _temp()

                            break
                    }
                }
            })
        )
    }
})

/**
 * @type {Array<InventoryItem>}
 */
let itemsInIventory = []

export const itemsInIventoryHandler = {
    get: (parentLimiter) => (parentLimiter ? itemsInIventory.filter((x) => x.parentID == parentLimiter) : itemsInIventory),
    add: (item) => itemsInIventory.push(item),
    remove: (item) => {
        itemsInIventory = itemsInIventory.filter((e) => e.UID !== item.UID)
    },
}
