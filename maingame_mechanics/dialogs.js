import { localizatorHandler } from "../communicator.js"
import { rubbishData } from "../lists/rubbish.js"
import { InventoryItem } from "./items.js"
import { itemsInIventoryHandler, player, setPlayerDirection } from "./player.js"

/**
 * @typedef {Object} DialogLineObject
 * @property {string} text
 * @property {{ name: string, color: string }} [speaker=undefined]
 */

class DialogChangerOnCondition {
    /**
     * @param {() => boolean} condition
     * @param {string} dialogdataWhenTrue
     * @param {string} [dialogdataWhenFalse=undefined]
     */
    constructor(condition, dialogdataWhenTrue, dialogdataWhenFalse) {
        this.condition = condition
        this.dialogdataWhenTrue = dialogdataWhenTrue
        this.dialogdataWhenFalse = dialogdataWhenFalse
    }
}

class FunctionLine {
    /**
     * @param {() => string | void} func
     * @param {string} [message=undefined]
     */
    constructor(func, message) {
        this.func = func
        this.message = message
    }
}

const names = {
    null: {
        name: "???",
        color: "purple",
    },
    me: {
        name: "Gracz",
        color: "white",
    },
    zygfryd: {
        name: "Zygfryd",
        color: "gold",
    },
    anna: {
        name: "Anna",
        color: "green",
    },
}

/**
 * @type {{ [id: string]: Array<DialogLineObject | DialogChangerOnCondition | FunctionLine> }}
 */
const dialogdata = {
    talkedNow: [{ text: "Nie możesz z tą osobą rozmawiać. Spróbuj następnego dnia!" }],
    zf: [
        new FunctionLine(() => setPlayerDirection("left")),
        new DialogChangerOnCondition(() => (player.memory.talkedToday || []).includes("zygfryd"), "talkedNow"),
        new DialogChangerOnCondition(() => !(player.memory.talkedTo || []).includes("zygfryd"), "$zf_firsttime", "$zf_talked"),
    ],
    $zf_firsttime: [
        { speaker: names.me, text: `I ty mówisz, że to Twoja "rezydencja"? Szacun.` },
        {
            speaker: names.null,
            text: `A dziękuję. Tak szczerze mówiąc to się dorobiłem majątku po moich trzeh zmarłych żonach. Jedna była szefową znanej firmy, druga miała zamożnych rodziców, a trzecia potrafiła inwestować w cokolwiek i jeszcze na tym zarobić.`,
        },
        { speaker: names.me, text: `<i>Trzy pieczenia na jednym ogniu? Trochę czasem mnie przeraża podejście niektórych ludzi...</i>` },
        { speaker: names.zygfryd, text: `A no właśnie, trochę bez kultury się nie przedstawiać. Zygfryd jestem.` },
        { speaker: names.me, text: `Miło mi.` },
        { speaker: names.zygfryd, text: `Mi również. Zauważyłem, że zbieram śmieci z ziemi. W jakim celu?` },
        { speaker: names.me, text: `Chcę po prostu chronić planetę, aby każdy mógł zyć w zdrowym środowisku.` },
        { speaker: names.zygfryd, text: `A myślałem trochę, że powiesz coś innego.` },
        { speaker: names.me, text: `Czyli..?` },
        { speaker: names.zygfryd, text: `Że porządek robisz dla mnie, bo za bardzo leniwy jestem - to do tego mogę się przyznać.` },
        { speaker: names.me, text: `...` },
        { speaker: names.me, text: `<i>Zwracam jednak ten szacunek...</i>` },
        { speaker: names.me, text: `Ja już nawet nie chcę wnikać. Jak zbierzesz jakiekolwiek śmieci, to zostaw mi - zaopiekuję się nimi, jakkolwiek to brzmi.` },
        { speaker: names.zygfryd, text: `W porządku.` },
        new FunctionLine(() => {
            player.memory.talkedToday = player.memory.talkedToday || []
            player.memory.talkedToday.push("zygfryd")
            player.memory.talkedTo = player.memory.talkedTo || []
            player.memory.talkedTo.push("zygfryd")
        }),
    ],
    $zf_talked: [
        { speaker: names.zygfryd, text: "Witaj, zbawco!" },
        { speaker: names.me, text: "Mogłeś darować, naprawdę..." },
        { speaker: names.zygfryd, text: "Ja tylko prawdę mówiłem, nic poza tym." },
        { speaker: names.me, text: "Nic poza tym- dobra, bo powoli zmierzamy w innym celu. Zebrałeś jakieś śmieci?" },
        new DialogChangerOnCondition(() => Math.round(Math.random()), "$zf_tnorubbish"),
        { speaker: names.zygfryd, text: "A no mam, tym razem" },
        new FunctionLine(() => {
            const max = Math.round(Math.random() * 2) + 1
            for (let i = 0; i < max; i++) {
                const rubbishID = Math.floor(Math.random() * rubbishData.length)
                const imgs = rubbishData[rubbishID].variantImgs || []
                imgs.push(rubbishData[rubbishID].img)
                const randomImg = imgs[Math.floor(Math.random() * imgs.length)].toString().split("/").at(-1)?.split(".").at(0)
                itemsInIventoryHandler.add(
                    new InventoryItem({ name: rubbishData[rubbishID].name, parentID: "rubbish", customProperties: { rubbishID: rubbishID, displayRubbishImg: randomImg } })
                )
            }

            return max.toString()
        }, "Dodano nowe śmieci do ekwipunku! (Ilość: %returned%)"),
        { speaker: names.me, text: "Ehh, niewiele... no ale lepszy rydz niż nic." },
        { speaker: names.zygfryd, text: "Co prawda to prawda. Ale i tak dla mnie wyczyn to było zebrać!" },
        { speaker: names.me, text: "Z Tobą to bardzo możliwe. Trzymaj się!" },
    ],
    $zf_tnorubbish: [],
}

const element = (() => {
    const x = document.createElement("div")
    x.style.boxSizing = "border-box"
    x.style.position = "fixed"
    x.style.bottom = "0"
    x.style.fontSize = "20px"
    x.style.left = "0"
    x.style.height = "300px"
    x.style.width = "100%"
    x.style.textAlign = "center"
    x.style.background = "rgb(20,20,20)"
    x.style.border = "5px solid black"
    x.style.color = "white"
    x.style.padding = "20px"
    x.style.zIndex = "11"
    x.style.padding = "15px 300px"
    return x
})()

function showtext(...args) {
    const line = dialogdata[dialogSystem.current][dialogSystem.index]
    let html = ""
    if (line instanceof FunctionLine) {
        html = `${line.message?.replace("%returned%", args[0])}`
    } else {
        if (line.speaker) html = `<span style="color:${line.speaker.color}; font-size: 40px">${line.speaker.name}</span><br />`
        html += `${line.text}`
    }
    element.innerHTML = html

    const btnNext = document.createElement("button")
    btnNext.innerText = "->"
    btnNext.style.position = "fixed"
    btnNext.style.bottom = "100px"
    btnNext.style.right = "50px"
    btnNext.style.width = "150px"
    btnNext.style.height = "100px"
    btnNext.style.fontSize = "50px"
    btnNext.style.zIndex = "12"
    btnNext.addEventListener("click", dialogSystem.nextline)
    element.appendChild(btnNext)
}

export const dialogSystem = {
    current: null,
    index: 0,
    start: (id) => {
        dialogSystem.current = id
        dialogSystem.index = -1
        console.log(`[DEBUG] Rozpoczęto odtwarzanie dialogu "${dialogSystem.current}"\n        Ilość linijek: ${dialogdata[dialogSystem.current].length}`)
        localizatorHandler.set("maingame_dialog")
        document.body.appendChild(element)
        dialogSystem.nextline()
    },
    nextline: () => {
        dialogSystem.index++
        const acctualline = dialogdata[dialogSystem.current][dialogSystem.index]
        console.log(`[DEBUG] Wyświetlanie (${dialogSystem.index + 1}). linijki dialogu\n        Pozostało: ${dialogdata[dialogSystem.current].length - dialogSystem.index}`)
        if (dialogSystem.index >= dialogdata[dialogSystem.current].length) dialogSystem.close()
        else if (acctualline instanceof DialogChangerOnCondition) {
            console.log(`[DEBUG/nextlinefunction] Wykryto klasę zmiany warunku`)
            const condition = acctualline.condition()
            if (condition) dialogSystem.changetoDialog(acctualline.dialogdataWhenTrue)
            else if (acctualline.dialogdataWhenFalse) dialogSystem.changetoDialog(acctualline.dialogdataWhenFalse)
            else dialogSystem.nextline()
        } else if (acctualline instanceof FunctionLine) {
            console.log(`[DEBUG/nextlinefunction] Wykryto kwestię funkcyjną`)
            const returned = acctualline.func()
            if (typeof acctualline.message === "string") showtext(returned)
            else dialogSystem.nextline()
        } else showtext()
    },
    changetoDialog: (id) => {
        console.log(`[DEBUG] Zamienianie dialogu z "${dialogSystem.current}" na "${id}"`)
        if (!dialogSystem.current) throw console.error(new Error("Cannot change dialogs", { cause: dialogSystem.current }))
        dialogSystem.current = id
        dialogSystem.index = -1
        dialogSystem.nextline()
    },
    close: () => {
        console.log(`[DEBUG] Zamykanie dialogu "${dialogSystem.current}"`)
        document.body.removeChild(element)
        dialogSystem.current = null
        dialogSystem.index = 0
        localizatorHandler.set("maingame")
    },
}
