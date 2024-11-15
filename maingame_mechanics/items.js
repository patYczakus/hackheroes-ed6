//@ts-check

import { rubbishData } from "../lists/rubbish.js"

/** @typedef {"rubbish" | "sign" | "interactiveElement"} ItemParentOption */
/**
 * @typedef {Object} ItemObject
 * @property {string} name
 * @property {ItemParentOption} parentID
 * @property {object | undefined} [customProperties=undefined]
 */

export class MapItem {
    /**
     * @param {MapItem | InventoryItem | ItemObject} item
     * @param {[number, number]} cords
     */
    constructor(item, cords) {
        let itemObj = item instanceof MapItem || item instanceof InventoryItem ? item.toObject() : item
        this.name = itemObj.name
        /**
         * @readonly
         */
        this.parentID = itemObj.parentID
        Object.freeze(this.parentID)
        /**
         * @readonly
         */
        this.UID = (Date.now() * 100000 + Math.round(Math.random() * 65536)).toString(26).toUpperCase()
        Object.freeze(this.UID)
        this.properties = itemObj.customProperties

        this.cords = cords
    }

    /** @returns {ItemObject} */
    toObject() {
        return {
            name: this.name,
            parentID: this.parentID,
            customProperties: this.properties,
        }
    }

    toInventoryItem() {
        return new InventoryItem(this)
    }
}

export class InventoryItem {
    /**
     * @param {MapItem | InventoryItem | ItemObject} item
     */
    constructor(item) {
        let itemObj = item instanceof MapItem || item instanceof InventoryItem ? item.toObject() : item
        this.name = itemObj.name
        /**
         * @readonly
         */
        this.parentID = itemObj.parentID
        Object.freeze(this.parentID)
        /**
         * @readonly
         */
        this.UID = (Date.now() * 100000 + Math.round(Math.random() * 65536)).toString(26).toUpperCase()
        Object.freeze(this.UID)
        this.properties = itemObj.customProperties
    }

    /** @returns {ItemObject} */
    toObject() {
        return {
            name: this.name,
            parentID: this.parentID,
            customProperties: this.properties,
        }
    }

    /**
     * @param {[number, number]} cords
     */
    toMapItem(cords) {
        return new MapItem(this, cords)
    }
}

var itemsOnMap = [
    new MapItem(
        {
            name: "Tabliczka",
            parentID: "sign",
            customProperties: { display: [{ text: "Dom " }, { text: "najlepszego", color: "#00cc00" }, { text: " gracza :3 | Nowa wieś 1" }] },
        },
        [-1, -2]
    ),
    new MapItem(
        {
            name: "Tabliczka",
            parentID: "sign",
            customProperties: { display: [{ text: "Nowa wieś 2" }] },
        },
        [4, -2]
    ),
    new MapItem(
        {
            name: "Tabliczka",
            parentID: "sign",
            customProperties: { display: [{ text: "Nowa wieś 3" }] },
        },
        [-6, -2]
    ),
    new MapItem(
        {
            name: "Tabliczka",
            parentID: "sign",
            customProperties: {
                display: [
                    { text: "N", color: "#d4af37" },
                    { text: "o", color: "#bf9e32" },
                    { text: "w", color: "#aa8c2c" },
                    { text: "a", color: "#947b27" },
                    { text: " " },
                    { text: "w", color: "#6a581c" },
                    { text: "i", color: "#554616" },
                    { text: "e", color: "#403511" },
                    { text: "ś", color: "#2a230b" },
                    { text: " " },
                    { text: "4", color: "#000000" },
                ],
            },
        },
        [-12, 4]
    ),
    new MapItem(
        {
            name: "Tabliczka",
            parentID: "sign",
            customProperties: {
                display: [{ text: "Nowa wieś 5" }],
            },
        },
        [12, 8]
    ),
    new MapItem(
        {
            name: "Tabliczka",
            parentID: "sign",
            customProperties: {
                display: [{ text: "Nowa wieś 6" }],
            },
        },
        [12, 19]
    ),

    new MapItem(
        {
            name: "Wejście do domu gracza",
            parentID: "interactiveElement",
            customProperties: { referenceto: "maingame_mechanics/createmenu:generateOptions:player" },
        },
        [0, -2]
    ),
    new MapItem(
        {
            name: "Rozmowa z osobą",
            parentID: "interactiveElement",
            customProperties: { referenceto: "maingame_mechanics/dialogs:dialogSystem.start:zf", forceToDirection: "left" },
        },
        [-11, 5]
    ),
    new MapItem(
        {
            name: "Rozmowa z osobą",
            parentID: "interactiveElement",
            customProperties: { referenceto: "maingame_mechanics/dialogs:dialogSystem.start:anna", forceToDirection: "right" },
        },
        [11, 20]
    ),
    new MapItem(
        {
            name: "Rozmowa z osobą",
            parentID: "interactiveElement",
            customProperties: { referenceto: "maingame_mechanics/dialogs:dialogSystem.start:og", forceToDirection: "right" },
        },
        [11, 10]
    ),
]

export function generateSomeRubbishOnMap() {
    for (let i = 0; i < Math.random() * 20 + 10; i++) {
        let noCollision
        do {
            const randomRubbishID = Math.floor(Math.random() * rubbishData.length)
            const randomRubbish = rubbishData[randomRubbishID]
            const imgs = randomRubbish.variantImgs || []
            imgs.push(randomRubbish.img)
            const randomImg = imgs[Math.floor(Math.random() * imgs.length)].toString().split("/").at(-1)?.split(".").at(0)
            const x = Math.round(Math.random() * 22 - 11)
            const y = Math.round(Math.random() * 22 - 1)

            noCollision = !Boolean(itemsOnMap.find((it) => it.cords[0] == x && it.cords[1] == y))

            if (noCollision)
                itemsOnMap.push(
                    new MapItem({ name: randomRubbish.name, parentID: "rubbish", customProperties: { rubbishID: randomRubbishID, displayRubbishImg: randomImg } }, [x, y])
                )
        } while (!noCollision)
    }
}

generateSomeRubbishOnMap()

export const itemsOnMapHandler = {
    get: () => itemsOnMap,
    /**
     * @param {MapItem} item
     * @returns
     */
    add: (item) => itemsOnMap.push(item),
    /**
     * @param {MapItem} item
     */
    remove: (item) => {
        itemsOnMap = itemsOnMap.filter((e) => e.UID !== item.UID)
    },
}
