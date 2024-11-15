//@ts-check

/**
 * @typedef {Object} RubbishFields
 * @property {string} name Nazwa śmiecia
 * @property {"zmieszane" | "papier" | "sztuczne" | "szkło" | "bio" | "elektro"} type Typ kosza, do którego śmieć powinien być wyrzucony
 * @property {string | URL} img Zdjęcie śmiecia
 * @property {Array<string | URL> | undefined} [variantImgs=undefined] Inne warianty zdjęć śmiecia (opcjonalnie)
 */

/**
 * @type {Array<RubbishFields>}
 */
export const rubbishData = [
    {
        name: "Przetłuszczone pudełko po pizzy",
        type: "zmieszane",
        img: "imgs/rubbish/pudlo_pizza.png",
    },
    {
        name: "Puszka po konserwie",
        type: "sztuczne",
        img: "imgs/rubbish/paprykarz_szczeciński.png",
    },
    {
        name: "Porwana ulotka",
        type: "papier",
        img: "imgs/rubbish/ulotka.png",
        variantImgs: ["imgs/rubbish/ulotka_v1.png"],
    },
    {
        name: "Trzy baterie",
        type: "elektro",
        img: "imgs/rubbish/bateria.png",
        variantImgs: ["imgs/rubbish/bateria_v1.png", "imgs/rubbish/bateria_v2.png", "imgs/rubbish/bateria_v3.png"],
    },
    {
        name: "Plastikowa butelka",
        type: "sztuczne",
        img: "imgs/rubbish/mocnygaz.png",
    },
    {
        name: "Rozbita szklana butelka",
        type: "szkło",
        img: "imgs/rubbish/butla_szkło.png",
    },
    {
        name: "Obierki od ziemniaków",
        type: "bio",
        img: "imgs/rubbish/ziemniaki_obierki.png",
    },
    {
        name: "Skórka od banana",
        type: "bio",
        img: "imgs/rubbish/banan_skórka.png",
    },
    {
        name: "Tekturowe pudełko",
        type: "papier",
        img: "imgs/rubbish/pudło.png",
    },
    {
        name: "Puszka",
        type: "sztuczne",
        img: "imgs/rubbish/puszka.png",
        variantImgs: ["imgs/rubbish/puszka_v1.png", "imgs/rubbish/puszka_v2.png", "imgs/rubbish/puszka_v3.png", "imgs/rubbish/puszka_v4.png", "imgs/rubbish/puszka_v5.png"],
    },
    {
        name: "Zjedzone jabłko",
        type: "bio",
        img: "imgs/rubbish/japko.png",
    },
    {
        name: "Karton po mleku",
        type: "sztuczne",
        img: "imgs/rubbish/łaciate.png",
    },
    {
        name: "Wytłaczanka",
        type: "papier",
        img: "imgs/rubbish/wytłaczanka.png",
    },
    {
        name: "Plastikowy kubek",
        type: "sztuczne",
        img: "imgs/rubbish/kubek_plastik.png",
    },
    {
        name: "Wiadro",
        type: "sztuczne",
        img: "imgs/rubbish/wiadro.png",
    },
    {
        name: "Stary but",
        type: "zmieszane",
        img: "imgs/rubbish/shoe.png",
    },
    {
        name: "Szklanka",
        type: "szkło",
        img: "imgs/rubbish/szklanka.png",
    },
    {
        name: "Metalowa łyżka",
        type: "sztuczne",
        img: "imgs/rubbish/łycha.png",
    },
    {
        name: "Rozbita żarówka",
        type: "elektro",
        img: "imgs/rubbish/zarówka.png",
        variantImgs: ["imgs/rubbish/zarówka_v1.png"],
    },
    {
        name: "Butelka po soku",
        type: "sztuczne",
        img: "imgs/rubbish/soczek.png",
    },
    {
        name: "Stara gazeta",
        type: "papier",
        img: "imgs/rubbish/gazeta.png",
    },
    // {
    //     name: "Torebka foliowa",
    //     type: "sztuczne",
    //     img: "",
    // },
    // {
    //     name: "Słoik po dżemie",
    //     type: "szkło",
    //     img: "",
    // },
    // {
    //     name: "Resztki jedzenia",
    //     type: "bio",
    //     img: "",
    // },
    // {
    //     name: "Zepsuty telefon",
    //     type: "elektro",
    //     img: "imgs/rubbish/",
    // },
    // {
    //     name: "Kable",
    //     type: "elektro",
    //     img: "imgs/rubbish/",
    // },
]

export const rubbishCategoryFullname = {
    zmieszane: "Zmieszane",
    papier: "Papier",
    sztuczne: "Tworzywo sztuczne",
    szkło: "Szkło",
    bio: "Bio",
    elektro: "Elektrośmieci",
}
