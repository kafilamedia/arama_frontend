const rootValue = `${document.getElementById("${ROOT_PATH}").value}`;

/**
 * 
 * @param {string} path 
 * @returns 
 */
export const contextPath = (path = null) => {
    return `${rootValue}/${path ?? ''}`;
}
export const baseImageUrl = () => contextPath('images/');
