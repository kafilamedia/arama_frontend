import AttachmentInfo from '../models/settings/AttachmentInfo';
 
export function toBase64(file, referer, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file.files[0]);
    reader.onload = () => callback(reader.result, referer);
    reader.onerror = error => {
        alert("Error Loading File");
    }
}
  
export const getAttachmentInfo = (fileInput:HTMLInputElement): Promise<AttachmentInfo> => {
    return new Promise<AttachmentInfo>((resolve, reject) =>{
        if (null == fileInput.files || !fileInput.files[0]) {
            reject(new Error("No file"));
            return;
        }
        try { 
            const file:File = fileInput.files[0]; 
            const reader = new FileReader();
            reader.readAsDataURL(file);
            console.debug("fileInput.files[0]: ", file);
            reader.onload = function () { 
                const info:AttachmentInfo = new AttachmentInfo();
                info.setUrl(new String(reader.result).toString());
                // info.
                info.name = file.name;
                resolve(info);
             }
            reader.onerror = function (error) {
                reject(error);
            }
        } catch (e) {
            reject(e);
        }
    });

}

export const toBase64v2 = (fileInput): Promise<string> => {
    return new Promise<string>((resolve, reject) =>{
        try {
            const reader = new FileReader();
            reader.readAsDataURL(fileInput.files[0]);
            console.debug("fileInput.files[0]: ", fileInput.files[0]);
            reader.onload = function () { resolve(new String(reader.result).toString()); }
            reader.onerror = function (error) {
                reject(error);
            }
        } catch (e) {
            reject(e);
        }
    });

}
 

export function toBase64FromFile(file) {
    return new Promise(function (resolve, reject) {
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () { resolve(reader.result); }
            reader.onerror = function (error) {
                reject(error);
            }
        } catch (e) {
            reject(e);
        }
    });

} 

/**
 * 
 * @param {Number} totalButton 
 * @param {Number} currentPage 
 */
export const createNavButtons = (totalButton, currentPage) => {
    totalButton = Math.ceil(totalButton);
    if (!currentPage) { currentPage = 0 }
    let buttonData = new Array();
    let min = currentPage - 3 < 0 ? 0 : currentPage - 3;
    let max = currentPage + 3 > totalButton ? totalButton : currentPage + 3;

    if (min != 0) {
        buttonData.push({
            text: 1,
            value: 0
        });
    }

    for (let index = min; index < max; index++) {
        buttonData.push({
            text: index + 1,
            value: index
        });
    }

    if (max != totalButton) {
        buttonData.push({
            text: totalButton,
            value: totalButton - 1
        });
    }


    return buttonData;
}

 