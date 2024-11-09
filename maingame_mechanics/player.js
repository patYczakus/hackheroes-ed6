export const player = {
    x: 0,
    y: 0,
}

let isPlayerMoving = false

/**
 *
 * @param {"x", "y"} type
 * @param {number} step
 */
window.movePlayer = (type, step) => {
    if (isPlayerMoving) return false
    isPlayerMoving = true
    for (let i = 1; i <= 20 * Math.abs(step); i++) {
        setTimeout(
            (increement, frame) => {
                player[type] += increement
                if (frame === "end") isPlayerMoving = false
            },
            50 * i,
            0.05 * (step / Math.abs(step)),
            i == 1 ? "start" : i == 20 * Math.abs(step) ? "end" : "middle"
        )
    }
    return true
}
