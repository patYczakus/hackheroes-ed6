export const NPCsInfo = {
    zygfryd: {
        tick: Math.floor(Math.random() * 4),
        x: -12,
        y: 5,
    },
    anna: {
        tick: Math.floor(Math.random() * 4),
        x: 12,
        y: 20,
    },
    olgierd: {
        tick: Math.floor(Math.random() * 4),
        x: 12,
        y: 10,
    },
}

function tickTheNPCs() {
    Object.keys(NPCsInfo).forEach((x) => {
        NPCsInfo[x].tick = (NPCsInfo[x].tick + 1) % 4
    })
    setTimeout(tickTheNPCs, 250)
}
tickTheNPCs()
