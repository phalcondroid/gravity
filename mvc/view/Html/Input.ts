import { HtmlElement } from "./HtmlElement";

/**
 *
 */
export class Input extends HtmlElement
{
    /**
     *
     * @param  type
     * @return
     */
    public type(type)
    {
        this.attr("type", type);
        return this;
    }

    /**
     *
     * @param  value
     * @return
     */
    public val(value: any = null)
    {
        if (value === null) {
            return this.val();
        }
        this.val(value);
        return this;
    }
}
