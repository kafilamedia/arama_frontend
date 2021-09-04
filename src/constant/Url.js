
const devMode = 
    document.getElementById("rootPath").value == "${contextPath}" || 
    document.getElementById("rootPath").value == "";
const rootValue = devMode ?
     "/" : document.getElementById("rootPath").value+"/";

export const contextPath = function(){
    const contextPath = devMode? "http://localhost:8080".concat(rootValue):rootValue;
    return contextPath;
}
export const baseImageUrl = () => contextPath()+ "images/"; 
