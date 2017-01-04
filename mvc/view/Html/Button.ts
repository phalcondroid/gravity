import { HtmlElement } from "./HtmlElement";
/**
 *
 */
export class Button extends HtmlElement
{

    public button()
    {
        this.attr("type", "button");
    }

    public submit()
    {
        this.attr("type", "submit");
    }

    /**
     * 
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    public type(type : string = "button")
    {
        this.attr("type", type);
        return this;
    }
}
