
import BaseComponent from './../BaseComponent';

export default class BasePage<P, S> extends BaseComponent<P, S> {
  constructor(props,
             protected title: string | undefined | null,
             authenticated: boolean = false) {
    super(props, authenticated);
    if (title !== undefined && title !== null) {
      document.title = title;
    } else {
      document.title = "Asrama KIIS";
    }
  }

  componentDidMount() {
    this.validateLoginStatus(() => {
      this.scrollTop();
      this.componentReady();
    })
  }

  protected componentReady() { }
}