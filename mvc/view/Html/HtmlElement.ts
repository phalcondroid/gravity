import { GravityArray } from "../../../core/GravityArray"
import { Ajax } from "../../../core/Ajax"

/**
 * [Html description]
 * @type {[type]}
 */
export class HtmlElement
{

    /**
     * Jquery element
     */
    public element;

    /**
     *
     */
    public id;

    /**
     *
     */
    private deny = ["Table", "Td", "Div", "Thead", "Tbody", "Tfoot", "Tr", "Td", "Th", "Label", "Span", "I", "A"];

    /**
     * [url description]
     * @type {String}
     */
    private url = "";

    /**
     * [className description]
     * @type {[type]}
     */
    private className;

    /**
     *
     * @param  {string} name [description]
     * @return {[type]}      [description]
     */
    public constructor(name: string = "", newClone = false)
    {
        this.id = name;
        this.element = this.init(this.getClassName(), name);
        return this;
    }

    /**
     *
     */
    public create(tag: string)
    {
        this.element = this.init(tag, this.id);
        return this;
    }

    /**
     * Create html component like jquery object
     *
     * @param  {string} element [description]
     * @param  {string} name    [description]
     * @return HTMLElement
     */
    public init(element: string, name: string)
    {

        this.className = element;
        let docElement = document.createElement(element);

        if (element === "Button") {
            docElement.setAttribute("type", "button");
        }

        if (name !== "") {
            if (GravityArray.inArray(this.deny, element)) {
                docElement.setAttribute("name", name);
            }
            docElement.setAttribute("id", name);
        }
        return docElement;
    }

    /**
     *
     * @return
     */
    public getType() {
        return this.className;
    }

    /**
     *
     * @param  {string} class [description]
     * @return {[type]}       [description]
     */
    public class(attrClass: string)
    {
        this.element.setAttribute("class", attrClass);
        return this;
    }

    /**
     *
     */
    public addClass(attrClass : string)
    {
        var strClass = this.element.getAttribute("class");
        strClass += " " + attrClass;
        this.element.setAttribute("class", strClass);
        return this;
    }

    /**
     *
     */
    public getAttribute(attr)
    {
        return this.element.getAttribute(attr);
    }

    /**
     *
     * @return {[type]} [description]
     */
    public addChild(element) {
        this.element.append(element);
        return this;
    }

    /**
     * [click description]
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     */
    public click(fn) {
        this.element.addEventListener("click", fn);
        return this;
    }

    public doubleClick(fn)
    {
        this.element.addEventListener("dblclick", fn);
        return this;
    }

    /**
     * [change description]
     * @return {[type]} [description]
     */
    public change(fn) {
        this.element.addEventListener("change", fn);
        return this;
    }

    /**
     * [change description]
     * @return {[type]} [description]
     */
    public keypress(fn) {
        this.element.addEventListener("keypress", fn);
        return this;
    }

    /**
     * [change description]
     * @return {[type]} [description]
     */
    public keydown(fn) {
        this.element.addEventListener("keydown", fn);
        return this;
    }

    /**
     * [change description]
     * @return {[type]} [description]
     */
    public keyup(fn) {
        this.element.addEventListener("keyup", fn);
        return this;
    }

    /**
     * [change description]
     * @return {[type]} [description]
     */
    public blur(fn)
    {
        this.element.addEventListener("blur", fn);
        return this;
    }

    /**
     * [change description]
     * @return {[type]} [description]
     */
    public focus(fn)
    {
        this.element.addEventListener("focus", fn);
        return this;
    }

    public destroyEvent(event)
    {
        var nameEvent = "on" + event;
        this.element.removeEventListener("click", this.element.nameEvent);
    }

    /**
     * [get description]
     * @return {[type]} [description]
     */
    public getElement()
    {
        return this.element;
    }

    /**
     * Append elements
     * @param value append
     * @return this
     */
    public append(append)
    {

        if (Array.isArray(append)) {
            for (let key in append) {
                this.element.appendChild(append[key])
            }
        } else {
            if (typeof append != "object") {
                this.element.appendChild(append);
            } else {
                this.element.appendChild(append)
            }
        }

        return this;
    }

    /**
     * [html description]
     * @param  {[type]} html [description]
     * @return {[type]}      [description]
     */
    public html(html: any = null) {
        if (html) {
            this.element.innerHtml = html;
            return this;
        } else {
            return this.element.innerHtml;
        }
    }

    /**
     *
     */
    public getHtml()
    {
        return this.element.innerHtml;
    }

    /**
     *
     * @param attr
     * @return
     */
    public attr(attr, value : any = false)
    {
        if (typeof attr == "object") {
            for (let key in attr) {
                this.element.setAttribute(key, attr[key]);
            }
        } else if (typeof attr == "string" && value != false) {
            this.element.setAttribute(attr, value);
        }
        return this;
    }

    /**
     *
     */
    public getAttr(attr)
    {
        return this.attr(attr);
    }

    /**
     * [css description]
     * @param  {[type]} css [description]
     * @return {[type]}     [description]
     */
    public css(css, value = false) {
        if (typeof css == "object") {
            for (let key in css) {
                this.element.style.key = css[key];
            }
        } else if (typeof css == "string" && value != false) {
            this.element.style.css = value;
        }
        return this;
    }

    /**
     *
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    public unbind(event) {
        this.element.destroyEvent(event);
        return this;
    }

    /**
     * [getClassName description]
     * @return {[type]} [description]
     */
    public getClassName() {
        let funcNameRegex = /function (.{1,})\(/;
        let results  = (funcNameRegex).exec(this["constructor"].toString());
        return (results && results.length > 1) ? results[1] : "";
    }

    /**
     * [validateAndSet description]
     * @param  {[type]} config [description]
     * @return {[type]}        [description]
     */
    public validateAndSet(config) {

        try {
            if (typeof config.name === "undefined") {
                throw "The identify is required";
            } else if (typeof config.element === "undefined") {
                throw "The type element is required";
            } else if (typeof config.event !== "undefined") {

            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * [clone description]
     * @return {[type]} [description]
     */
    public clone(newIdentify = "") {
        let newElement = this.element.clone();
        return new HtmlElement(newIdentify, newElement[0]);
    }

    /**
     * [ajax description]
     * @return {[type]} [description]
     */
    public ajax(config) {
        var ajax = new Ajax();
        ajax.setUrl(config.url);
        ajax.beforeSend(config.beforeSend);
        ajax.setMethod(config.type);
        ajax.setParams(config.data);
        ajax.send(config.success);
        return this;
    }

    /**
     * zzzz
     * @param  {any = null}        val [description]
     * @return {[type]}   [description]
     */
    public val(val: any = null)
    {
        if (val) {
            this.element.value = val;
            return this;
        } else {
            return this.element.value;
        }
    }

    /**
     * zzzz
     * @param  {any = null}        text [description]
     * @return {[type]}   [description]
     */
    public text(text: any = null) {
        if (text) {
            this.element.innerHtml = text;
            return this;
        } else {
            return this.element.value;
        }
    }
}
