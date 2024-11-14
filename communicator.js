//@ts-check
/**
 * @type {string}
 */
let gameLocalization = ""

export const localizatorHandler = {
    /**
     * @param {string} element
     * @returns {string}
     */
    set: (element) => (gameLocalization = element),
    /**
     * @returns {string}
     */
    get: () => gameLocalization,
}
