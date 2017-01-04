import { HtmlElement } from "./HtmlElement";

/**
 *
 */
export class Img extends HtmlElement
{
    public src(src)
    {
        this.attr("src", src);
        return this;
    }
}
