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
     * @param {"/end" | string} dialogdataWhenTrue
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
    olgierd: {
        name: "Olgierd",
        color: "#ca935b",
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
        new FunctionLine(() => {
            player.memory.talkedToday = player.memory.talkedToday || []
            player.memory.talkedToday.push("zygfryd")
        }),
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
    $zf_tnorubbish: [
        { speaker: names.zygfryd, text: "Nie mam żadnych śmieci. Lenistwo mnie pokonało." },
        { speaker: names.me, text: "Ehhh, no dobra" },
    ],
    anna: [
        new FunctionLine(() => setPlayerDirection("right")),
        new DialogChangerOnCondition(() => (player.memory.talkedToday || []).includes("anna"), "talkedNow"),
        new FunctionLine(() => {
            player.memory.talkedToday = player.memory.talkedToday || []
            player.memory.talkedToday.push("anna")
        }),
        new DialogChangerOnCondition(() => !(player.memory.talkedTo || []).includes("anna"), "$anna_firsttime", "$anna_talked"),
    ],
    $anna_firsttime: [
        { speaker: names.null, text: "Ah, jak chciałabym wziąć kogoś ze synów rolników..." },
        { speaker: names.me, text: "...którzy śmiecą gdzie popadnie?" },
        { speaker: names.null, text: "No ale czego się czepiasz? Nie można wziąć chłopaka, który śmieci?" },
        { speaker: names.me, text: "<i>No i się zaczyna...</i>" },
        { speaker: names.me, text: "Ja tylko mówię, Twój interes kogo byś brała, nie mój. Ja tylko wskazuję z czym masz do czynienia. Konkretnie z tym, co Cię otacza wokół." },
        { speaker: names.me, text: "Z resztą, chyba lepiej byłoby nam, gdybyśmy żyli w zdrowszym środowisku, prawda?" },
        { speaker: names.null, text: "I tak czy siak wszyscy umrzemy. Toż każdy wie, że jestem rozpustna i żyję jak królowa." },
        { speaker: names.me, text: "No tak, słyszałem o tym przypadkowo jak tu przybyłem. Więc pewnie jesteś Anna." },
        { speaker: names.anna, text: "Zgadza się, to ja." },
        { speaker: names.me, text: "Następnym razem pomyśl chociaż o tym aby zebrać cokolwiek. Natura Ci się odwdzięczy." },
        new FunctionLine(() => {
            player.memory.talkedTo = player.memory.talkedTo || []
            player.memory.talkedTo.push("anna")
        }),
    ],
    $anna_talked: [
        { speaker: names.anna, text: "Znowu Ty?" },
        { speakter: names.me, text: "No co, jak zwykle sam ratuję planetę. Śmieci ciągle przybywa,  nikt nie jest winny i oczekują że samo zniknie." },
        { speaker: names.anna, text: "A tak nie jest, przepraszam bardzo?" },
        {
            speaker: names.me,
            text: "No tak jest, ale żeby to samo się rozłożyło, potrzeba wieków - by się nie doczekali. Weź nawet nie przecz, bo to jest fakt. Niepodważalny fakt.",
        },
        { speaker: names.me, text: "Chemikiem nie jestem - mi się po prostu nie chce. Nie znaczy to jednak, że nie warto mi zaufać." },
        { speaker: names.anna, text: "Dobra, masz tu trochę śmieci ode mnie, ale nie dlatego że zmieniłam zdanie" },
        new FunctionLine(() => {
            const max = Math.round(Math.random() * 5) + 7
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
    ],
    og: [
        new FunctionLine(() => setPlayerDirection("right")),
        new DialogChangerOnCondition(() => (player.memory.talkedToday || []).includes("olgierd"), "talkedNow"),
        new FunctionLine(() => {
            player.memory.talkedToday = player.memory.talkedToday || []
            player.memory.talkedToday.push("olgierd")
        }),
        new DialogChangerOnCondition(() => !(player.memory.talkedTo || []).includes("olgierd"), "$og_firsttime", "$og_talked"),
    ],
    $og_firsttime: [
        { speaker: names.null, text: "Witaj, młody kawalerze! Co tu porabiasz?" },
        { speaker: names.me, text: `A witam. Jak widać, zbieram śmieci, jako jedyny "młody kawaler".` },
        { speaker: names.null, text: "Zbierasz? To na pewno bozia Ci za to wynagrodzi. A co robisz potem ze zebranymi odpadami?" },
        { speaker: names.me, text: "To chyba logiczne - segreguję." },
        { speaker: names.null, text: `"Logiczne"? Słuchaj, młody kawalerze, za moich czasów to nikt nie segregował, bo nikt nie zwracał na to uwagi.` },
        { speaker: names.me, text: `<i>Za moich czasów to nie lubiłem tej gadaniny - ogólnie czegoś takiego jak narzekanie. Ale cóż, taka rutyna starszych osób...</i>` },
        { speaker: names.me, text: "No kurcze, takie wymagania..." },
        { speaker: names.null, text: "Ja wciąż się kieruję starymi nawykami, i nie segreguję." },
        {
            speaker: names.me,
            text: "Spodziewałem się tej odpowiedzi, jak przy każdej osobie z resztą. Nawet ciężko do kosza wyrzucić niektórym, skoro wszędzie wszystko się wala po ziemi.",
        },
        { speaker: names.null, text: "...nawet stare buty moim pięciu synom. Dostają ode mnie jako karę. By się nauczyli szacunku!" },
        {
            speaker: names.me,
            text: `<i>Pierwsze pytanie - ILU SYNÓW?! Drugie pytanie - TO ILE BUTÓW ON JESZCZE MA?! Mam wrażenie, że coraz dziwniejsze się te miejsce robi... ale nie jestem tu, aby narzekać, tylko segregować.</i>`,
        },
        { speaker: names.null, text: "Dobra, ja powoli będę wracał do swego domu." },
        { speaker: { name: "???", color: "pink" }, text: "Olgierdzie, ty mój misiaczku, mógłbyś wynieść te śmieci do chlewa? Trochę się tego nazbierało. Dziękuję!" },
        { speaker: names.olgierd, text: "Cóż, to jednak zmiana planów..." },
        { speaker: names.me, text: "<i>Głos żeńskiej osoby na taki wiek 30 lat. Już za dużo się dzieje jak na dziś.</i>" },
        { speaker: names.olgierd, text: "No dobra, to ja już idę. Do zobaczenia!" },
        { speaker: names.me, text: "Zaczekaj! A nie mogę po prostu wziąć tych śmieci za Ciebie? Lepiej dla środowiska zrobię, i Twojego starego zdrowia oszczędzę." },
        { speaker: names.olgierd, text: "Jak grom z jasnego nieba! Dziękuję, młody kawalerze!" },
        { speaker: names.olgierd, text: "Oczywiście, że tak! Dziękuję Ci!" },
        { speaker: names.me, text: "Nie ma sprawy!" },
        new FunctionLine(() => {
            const max = Math.round(Math.random() * 25) + 20
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
        { speaker: names.me, text: "<i>Faktycznie dużo tego</i>" },
        new FunctionLine(() => {
            player.memory.talkedTo = player.memory.talkedTo || []
            player.memory.talkedTo.push("olgierd")
        }),
    ],
    $og_talked: [
        { speaker: names.olgierd, text: "O, znowu Ty, młody kawalerze!" },
        { speaker: names.me, text: "No tak, Olgierdzie, to znowu ja." },
        { speaker: names.olgierd, text: "Mam tyle Tobie do opowiadania! Czy wiesz o tym, że mam pięciu sy-" },
        { speaker: names.me, text: "Tak, wiem. Mówiłeś mi to." },
        { speaker: names.olgierd, text: "A... a czy wiesz, że te buty-" },
        { speaker: names.me, text: "Tak, wiem. Opowiadałeś mi o tym." },
        { speaker: names.olgierd, text: "A... a czy wiesz, że mam żonę-" },
        { speaker: names.me, text: "O wiele młodszą od Ciebie? To się sam domyśliłem." },
        { speaker: names.olgierd, text: "Nie o to do końca mi chodziło, młody człowieku, ale to też prawda." },
        { speaker: names.olgierd, text: "A tak w ogóle, to mam piękną żonę." },
        { speaker: names.me, text: "<i>Też bym tak mówił, jakbym w ogóle miał</i>" },
        { speaker: names.me, text: "Gratuluję. Dobra, ja będę uciekał. Żegnaj!" },
        new DialogChangerOnCondition(() => Math.random() < 0.8, "/end"),
        { speaker: names.olgierd, text: "Zaczekaj, mam dla Ciebie jakieś śmieci. Tobie się przydadzą" },
        new FunctionLine(() => {
            const max = Math.round(Math.random() * 6) + 1
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
        { speaker: names.me, text: "Dziękuje bardzo! Trafią w dobrą opiekę!" },
        { speaker: names.olgierd, text: "Proszę, młody kawalerze. A co tam u Ciebie słychać?" },
        { speaker: names.me, text: "Nic specjalnego. Zbieram śmieci, jak zwykle." },
    ],
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
            if (condition) {
                if (acctualline.dialogdataWhenTrue == "/end") dialogSystem.close()
                else dialogSystem.changetoDialog(acctualline.dialogdataWhenTrue)
            } else if (acctualline.dialogdataWhenFalse) dialogSystem.changetoDialog(acctualline.dialogdataWhenFalse)
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
