
import BaseComponent from './../BaseComponent';
export default class BasePage extends BaseComponent{
    constructor(props, protected title:string | undefined|null= undefined, authenticated:boolean = false) {
        super(props, authenticated);
        if (title !== undefined && title !== null) {
            document.title = title;
        } else {
            document.title = "Asrama KIIS";
        }
    }

    componentDidMount() {
        this.validateLoginStatus(()=>{
            this.scrollTop();
        })
    }
    // componentWillUnmount() {
    //     document.title = "Asrama KIIS";
    // }
}