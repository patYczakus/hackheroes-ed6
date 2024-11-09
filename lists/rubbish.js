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
    // {
    //     name: "Plastikowa butelka",
    //     type: "sztuczne",
    //     img: "",
    // },
    // {
    //     name: "Szklana butelka",
    //     type: "szkło",
    //     img: "",
    // },
    // {
    //     name: "Obierki od ziemniaków",
    //     type: "bio",
    //     img: "",
    // },
    // {
    //     name: "Skórka od banana",
    //     type: "bio",
    //     img: "",
    // },
    // {
    //     name: "Plastikowy kubek",
    //     type: "sztuczne",
    //     img: "",
    // },
    // {
    //     name: "Tekturowe pudełko",
    //     type: "papier",
    //     img: "",
    // },
    // {
    //     name: "Puszka",
    //     type: "sztuczne",
    //     img: "",
    // },
    // {
    //     name: "Butelka po soku",
    //     type: "sztuczne",
    //     img: "",
    // },
    // {
    //     name: "Torebka foliowa",
    //     type: "sztuczne",
    //     img: "",
    // },
    // {
    //     name: "Zgniłe jabłko",
    //     type: "bio",
    //     img: "",
    // },
    // {
    //     name: "Karton po mleku",
    //     type: "papier",
    //     img: "",
    // },
    // {
    //     name: "Plastikowa torba",
    //     type: "sztuczne",
    //     img: "",
    // },
    // {
    //     name: "Rozbity słoik po dżemie",
    //     type: "szkło",
    //     img: "",
    // },
    // {
    //     name: "Wiadro",
    //     type: "sztuczne",
    //     img: "",
    // },
    // {
    //     name: "Stary but",
    //     type: "zmieszane",
    //     img: "",
    // },
    // {
    //     name: "Stara gazeta",
    //     type: "papier",
    //     img: "",
    // },
    // {
    //     name: "Plastikowy widelec",
    //     type: "sztuczne",
    //     img: "",
    // },
    // {
    //     name: "Resztki jedzenia",
    //     type: "bio",
    //     img: "",
    // },
    // {
    //     name: "Szklanka",
    //     type: "szkło",
    //     img: "",
    // },
    // {
    //     name: "Metalowa łyżka",
    //     type: "sztuczne",
    //     img: "",
    // },
    // {
    //     name: "Kawałek drewna",
    //     type: "bio",
    //     img: "",
    // },
    // {
    //     name: "Karton po jajkach",
    //     type: "papier",
    //     img: "",
    // },
]

export const rubbishCategoryFullname = {
    zmieszane: "Zmieszane",
    papier: "Papier",
    sztuczne: "Tworzywa sztuczne",
    szkło: "Szkło",
    bio: "Bio",
    elektro: "Elektrośmieci",
}
