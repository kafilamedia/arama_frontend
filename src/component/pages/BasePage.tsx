
import BaseComponent from './../BaseComponent';
export default class BasePage extends BaseComponent{
    constructor(props, title:string | undefined|null= undefined, authenticated:boolean = false) {
        super(props, authenticated);
        if (title !== undefined && title !== null) {
            document.title = title;
        }
    }

    componentDidMount() {
        this.validateLoginStatus(()=>{
            this.scrollTop();
        })
    }
    componentWillUnmount() {
        document.title = "Asrama KIIS";
    }
}