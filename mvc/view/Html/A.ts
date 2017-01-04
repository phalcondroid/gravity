import { HtmlElement } from './HtmlElement';
import { I } from './I';

/**
 *
 */
export class A extends HtmlElement {

    /**
     * [favIcon description]
     * @return {[type]} [description]
     */
    public favIcon(favIcon) {
        let icon = new I("favIcon" + this.id)
        .class(favIcon);
        this.getElement()
            .append(icon.getElement());
        return this;
    }

    /**
     * [href description]
     * @param  {[type]} href [description]
     * @return {[type]}      [description]
     */
    public href(href) {
        this.getElement().attr("href", href);
        return this;
    }
}
