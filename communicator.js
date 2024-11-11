//@ts-check
/**
 * @type {string | null}
 */
let gameLocalization = null

export const localizatorHandler = {
    /**
     * @param {string} element
     * @returns {string}
     */
    set: (element) => (gameLocalization = element),
    /**
     * @returns {string | null}
     */
    get: () => gameLocalization,
}
