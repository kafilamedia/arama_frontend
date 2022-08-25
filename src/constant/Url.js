
const devMode = 
    document.getElementById("rootPath").value == "${contextPath}" || 
    document.getElementById("rootPath").value == "";
const rootValue = devMode ?
     "/" : document.getElementById("rootPath").value+"/";

export const contextPath = function(){
    // const contextPath = devMode? "http://localhost:8080/kafila-app-tahfiz".concat(rootValue):rootValue;
    return "http://localhost:8080/kafila-app-tahfiz/";
}
export const baseImageUrl = () => contextPath()+ "images/"; 
