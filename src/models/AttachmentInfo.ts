export default class AttachmentInfo {
    setUrl(arg0: string) {
        this.url = arg0;
        this.data = arg0.split(",")[1];
    }
    static nameOnly(name: any): AttachmentInfo {
        const info = new AttachmentInfo();
        info.name = name;
        return info;
    }
    static instance(name: any, url:string): AttachmentInfo {
        const info = new AttachmentInfo();
        info.name = name;
        info.url = url;
        return info;
    }
    name: string = "";
    blob: Blob = new Blob();
    url: string = "";
    data: string = "";
}