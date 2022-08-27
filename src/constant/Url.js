
const devMode =
    document.getElementById("rootPath").value == "${contextPath}" ||
    document.getElementById("rootPath").value == "";
const rootValue = devMode ?
    "/" : document.getElementById("rootPath").value + "/";

/**
 * 
 * @param {string} path 
 * @returns 
 */
export const contextPath = (path = null) => {
    // const contextPath = devMode? "http://localhost:8080/kafila-app-tahfiz".concat(rootValue):rootValue;
    return `http://localhost:8080/kafila-app-tahfiz/${path ?? ''}`;
}
export const baseImageUrl = () => contextPath() + "images/"; 
