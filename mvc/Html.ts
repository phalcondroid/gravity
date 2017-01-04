import { GravityArray } from "../../core/GravityArray"
import { GravityString } from "../../core/GravityString"
import { Ajax } from "../../core/Ajax"

/**
 * [Html description]
 * @type {[type]}
 */
namespace Html
{

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
        public constructor(name: any = "", newClone = false)
        {
            if (typeof name.nodeName != "undefined") {
                this.id      = name.getAttribute("id");
                this.element = this.init(name.nodeName, this.id);
            } else {
                this.id      = name;
                this.element = this.init(this.getClassName(), name);
            }
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

        public empty()
        {
            this.element.innerHtml = "";
        }
    }

    /**
     *
     */
    export class A extends HtmlElement {

        /**
         * [favIcon description]
         * @return {[type]} [description]
         */
        public favIcon(favIcon) {
            let icon = new Html.I("favIcon" + this.id)
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

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Abbr extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Address extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Area extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Article extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Aside extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Audio extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class B extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Base extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Bdi extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Bdo extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Blockquote extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Body extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Br extends HtmlElement
    {
    }

    /**
     *
     */
    export class Button extends HtmlElement {

        /**
         * [type description]
         * @param  {[type]} type [description]
         * @return {[type]}      [description]
         */
        public type(type) {
            this.getElement().attr("type", type);
            return this;
        }

        /**
         * [favIcon description]
         * @return {[type]} [description]
         */
        public favIcon(favIcon)
        {
            let icon = new Html.I("favIcon" + this.id)
            .class(favIcon);
            this.getElement()
                .append(icon.getElement());
            return this;
        }

        /**
         * [succes description]
         * @return {[type]} [description]
         */
        public success()
        {
            this.element.addClass("btn btn-success");
            return this;
        }

        /**
         * [notice description]
         * @return {[type]} [description]
         */
        public notice()
        {
            this.element.addClass("btn btn-notice");
            return this;
        }

        /**
         * [warning description]
         * @return {[type]} [description]
         */
        public warning()
        {
            this.element.addClass("btn btn-warning");
            return this;
        }

        /**
         * [danger description]
         * @return {[type]} [description]
         */
        public danger()
        {
            this.element.addClass("btn btn-danger");
            return this;
        }
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Canvas extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Caption extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Cite extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Code extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Col extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class ColGroup extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Datalist extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Dd extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Del extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Details extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Dfn extends HtmlElement
    {
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Dialog extends HtmlElement
    {
    }

    /**
     *
     */
    export class Div extends HtmlElement
    {
    }

    /**
     *
     */
    export class Dl extends HtmlElement
    {
    }

    /**
     *
     */
    export class Dt extends HtmlElement
    {
    }

    /**
     *
     */
    export class Em extends HtmlElement
    {
    }

    /**
     *
     */
    export class Embed extends HtmlElement
    {
    }

    /**
     *
     */
    export class Fieldset extends HtmlElement
    {
    }

    /**
     *
     */
    export class Figcaption extends HtmlElement
    {
    }

    /**
     *
     */
    export class Figure extends HtmlElement
    {
    }

    /**
     *
     */
    export class Footer extends HtmlElement
    {
    }

    /**
     *
     */
    export class Form extends HtmlElement
    {
    }

    /**
     *
     */
    export class H1 extends HtmlElement
    {
    }

    /**
     *
     */
    export class H2 extends HtmlElement
    {
    }

    /**
     *
     */
    export class H3 extends HtmlElement
    {
    }

    /**
     *
     */
    export class H4 extends HtmlElement
    {
    }

    /**
     *
     */
    export class H5 extends HtmlElement
    {
    }

    /**
     *
     */
    export class H6 extends HtmlElement
    {
    }

    /**
     *
     */
    export class Head extends HtmlElement
    {
    }

    /**
     *
     */
    export class Header extends HtmlElement
    {
    }

    /**
     *Ttpt
    export class Html extends HtmlElement
    {
    }
    */

    /**
     *
     */
    export class I extends HtmlElement
    {
    }

    /**
     *
     */
    export class Iframe extends HtmlElement
    {
    }

    export class Img extends HtmlElement
    {
        public src(src)
        {
            this.getElement().attr("src", src);
            return this;
        }
    }

    /**
     * [Input description]
     * @type {[type]}
     */
    export class Input extends HtmlElement
    {

        /**
         * [type description]
         * @param  {[type]} type [description]
         * @return {[type]}      [description]
         */
        public type(type)
        {
            this.getElement().attr("type", type);
            return this;
        }

        /**
         * [value description]
         * @param  {[type]} value [description]
         * @return {[type]}       [description]
         */
        public val(value: any = null)
        {
            if (value === null) {
                return this.getElement().val();
            }
            this.getElement().val(value);
            return this;
        }
    }

    /**
     *
     */
    export class Ins extends HtmlElement
    {
    }

    /**
     *
     */
    export class Kbd extends HtmlElement
    {
    }

    /**
     *
     */
    export class Keygen extends HtmlElement
    {
    }

    /**
     *
     */
    export class Label extends HtmlElement
    {
    }

    /**
     *
     */
    export class Leyend extends HtmlElement
    {
    }

    /**
     *
     */
    export class Li extends HtmlElement
    {
    }

    /**
     *
     */
    export class Link extends HtmlElement
    {
    }

    /**
     *
     */
    export class Main extends HtmlElement
    {
    }

    /**
     *
     */
    export class Map extends HtmlElement
    {
    }

    /**
     *
     */
    export class Menu extends HtmlElement
    {
    }

    /**
     *
     */
    export class MenuItem extends HtmlElement
    {
    }

    /**
     *
     */
    export class Meta extends HtmlElement
    {
    }

    /**
     *
     */
    export class Meter extends HtmlElement
    {
    }

    /**
     *
     */
    export class Nav extends HtmlElement
    {
    }

    /**
     *
     */
    export class Noscrip extends HtmlElement
    {
    }

    /**
     *
     */
    export class Object extends HtmlElement
    {
    }

    /**
     *
     */
    export class Ol extends HtmlElement
    {
    }

    /**
     *
     */
    export class Optgroup extends HtmlElement
    {
    }

    /**
     *
     */
    export class Option extends HtmlElement
    {
    }

    /**
     *
     */
    export class Output extends HtmlElement
    {
    }

    /**
     *
     */
    export class P extends HtmlElement
    {
    }

    /**
     *
     */
    export class Param extends HtmlElement
    {
    }

    /**
     *
     */
    export class Pre extends HtmlElement
    {
    }

    /**
     *
     */
    export class Progress extends HtmlElement
    {
    }

    /**
     *
     */
    export class Q extends HtmlElement
    {
    }

    /**
     *
     */
    export class Rp extends HtmlElement
    {
    }

    /**
     *
     */
    export class Rt extends HtmlElement
    {
    }

    /**
     *
     */
    export class Ruby extends HtmlElement
    {
    }

    /**
     *
     */
    export class S extends HtmlElement
    {
    }

    /**
     *
     */
    export class Samp extends HtmlElement
    {
    }

    /**
     *
     */
    export class Script extends HtmlElement
    {
    }

    /**
     *
     */
    export class Section extends HtmlElement
    {
    }

    export class Select extends HtmlElement
    {

        public getSelected()
        {
            var childs = this.getElement().childNodes;
            for (var key in childs) {
                if (childs[key].getAttribute("selected") !== null) {
                    return new Html.HtmlElement(childs[key]);
                }
            }
            return null;
        }

        public select(value)
        {
            var childs = this.getElement().childNodes;
            for (var key in childs) {
                if (childs[key].value === value) {
                    childs[key].setAttribute("selected", "selected");
                }
            }
        }

        /**
         * [build description]
         * @param  {[type]} content [description]
         * @return {[type]}         [description]
         */
        public build(content)
        {
            this.empty();

            for (let key in content) {
                let option = new Html.Option();
                option.attr({
                    "value" : content[key],
                });
                option.getElement().text(content[key]);
                this.append([
                    option
                ]);
            }

            return this;
        }
    }

    /**
     *
     */
    export class Small extends HtmlElement
    {
    }

    /**
     *
     */
    export class Source extends HtmlElement
    {
    }

    /**
     *
     */
    export class Span extends HtmlElement
    {
    }

    /**
     *
     */
    export class Strong extends HtmlElement
    {
    }

    /**
     *
     */
    export class Style extends HtmlElement
    {
    }

    /**
     *
     */
    export class Sub extends HtmlElement
    {
    }

    /**
     *
     */
    export class Summary extends HtmlElement
    {
    }

    /**
     *
     */
    export class Sup extends HtmlElement
    {
    }

    /**
     * [Table description]
     * @type {[type]}
     */
    export class Table extends HtmlElement
    {

        private tblElements;
        private thead;
        private tbody;
        private tr;
        private th;
        private td;
        private system;
        private header = false;
        private fnCHeader;
        private fnCContent;

        /**
         *
         *
         */
        public setHeader(columns)
        {

            this.header = true;
            this.thead  = new Html.Thead("thead" + this.id);
            this.tr     = new Html.Tr("trHeader" + this.id);

            let i = 0;
            for (let key in columns) {

                let th = new Html.Th("TheadTh" + key + this.id);

                if (typeof columns[key] == "object") {
                    th.append(
                        columns[key]
                    );
                } else {
                    th.append(
                        GravityString.capitalize(columns[key])
                    );
                }

                this.tr.getElement().append(
                    th.getElement()
                );

                if (typeof this.fnCHeader === "function") {
                    this.fnCHeader(th, i, columns[key], key);
                }

                i++;
            }

            this.thead.getElement().append(
                this.tr.getElement()
            );

            this.getElement().append(
                this.thead.getElement()
            );

            return this;
        }

        /**
         * [setCustomize description]
         * @param  {Function} fn      [description]
         * @return {[type]}           [description]
         */
        public setHeaderCustomize(fn)
        {
            this.fnCHeader = fn;
            return this;
        }

        /**
         *
         * @param  {[type]} rows
         * @return {[type]}
         */
        public build(content)
        {

            this.system = ["click", "customize"];
            this.tbody = new Html.Tbody("tbody" + this.id);

            var html = new Html.HtmlElement();
            var i = 0;

            for (var key in content) {

                var trIdentify = GravityString.sanitizeString(key) + this.id;
                var tr = new Html.Tr("TbodyTr" + trIdentify);

                var header = new Array();
                var j = 0;

                for (var row in content[key]) {

                    header[j] = row;
                    var trIdentify2 = GravityString.sanitizeString(key) + GravityString.sanitizeString(row) + this.id;
                    var td = new Html.Td("TbodyTd" + trIdentify2);

                    if (this.validateSystemKeys(row)) {

                        var contentRow = content[key][row];
                        var finalContent;

                        if (contentRow instanceof Html.HtmlElement) {
                            finalContent = contentRow.getElement();
                        } else if(typeof contentRow == "object") {

                            if (contentRow.hasOwnProperty("content")) {
                                finalContent = contentRow.content
                            }

                            if (contentRow.hasOwnProperty("class")) {
                                td.attr(
                                    contentRow.class
                                )
                            }

                            if (contentRow.hasOwnProperty("attr")) {
                                td.attr(
                                    contentRow.attr
                                )
                            }

                            if (contentRow.hasOwnProperty("css")) {
                                td.attr(
                                    contentRow.css
                                )
                            }

                            if (contentRow.hasOwnProperty("addTd")) {
                                tr.append([
                                    contentRow.addTd
                                ]);
                            }

                            if (contentRow.hasOwnProperty("event")) {
                                var functionTd = contentRow.event;
                                functionTd(td);
                            }

                        } else {
                            finalContent = contentRow;
                        }

                        td.append([
                            finalContent
                        ]);

                        tr.append([
                            td.getElement()
                        ]);
                    }

                    if (typeof this.fnCContent === "function") {
                        this.fnCContent(td, j, content[key][row], row);
                        if (this.header === false) {
                            this.fnCHeader = this.fnCContent;
                        }
                    }

                    j++;
                }

                this.tbody.append([
                    tr.getElement()
                ]);

                i++;
            }

            if (this.header === false) {
                this.setHeader(header);
            }

            this.append([
                this.tbody.getElement()
            ]);

            return this;
        }

        /**
         * [setCustomize description]
         * @param  {Function} fn      [description]
         * @return {[type]}           [description]
         */
        public setContentCustomize(fn)
        {
            this.fnCContent = fn;
            return this;
        }

        /**
         *
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        private validateSystemKeys(row)
        {
            if (GravityArray.inArray(this.system, row)) {
                return true;
            }
            return false;
        }

        /**
         *
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        private paginate(row: any = 10)
        {
            this.getElement().DataTable({
                searching: false,
                lengthChange: false,
                pageLength: row,
                aoColumns : [
                    null,
                    null
                ]
            });
            return this;
        }
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Thead extends HtmlElement
    {

    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Tbody extends HtmlElement
    {

    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Tr extends HtmlElement
    {

    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Td extends HtmlElement
    {

        /**
         *
         * @param  {[type]} num [description]
         * @return {[type]}     [description]
         */
        public colspan(cols)
        {
            this.attr({
                "colspan" : cols
            });
        }

        /**
         *
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        public rowspan(rows)
        {
            this.attr({
                "rowspan" : rows
            });
        }
    }

    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    export class Th extends HtmlElement
    {
        /*
         *
         * @param  {[type]} num [description]
         * @return {[type]}     [description]
         */
        public colspan(cols) {
            this.attr({
                "colspan" : cols
            });
        }

        /**
         *
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        public rowspan(rows) {
            this.attr({
                "rowspan" : rows
            });
        }
    }

    /**
     *
     */
    export class Tfoot extends HtmlElement
    {

    }

    /**
     *
     */
    export class Time extends HtmlElement
    {

    }

    /**
     *
     */
    export class Textarea extends HtmlElement
    {

    }

    /**
     *
     */
    export class Title extends HtmlElement
    {

    }

    /**
     *
     */
    export class Track extends HtmlElement
    {

    }

    /**
     *
     */
    export class U extends HtmlElement
    {

    }

    /**
     *
     * @type {[type]}
     */
    export class Ul extends HtmlElement
    {

        /**
         *
         * @param
         * @param
         * @return
         */
        public create(config)
        {

            for (var i = 0; i < config.content.length; i++) {

                var li = new Html.Li(config.name + i);
                if (typeof config.content !== "undefined") {

                }

                if (typeof config.clickChild !== "undefined") {
                    li.getElement().addEventListener(
                        config.event,
                        config.clickChild.bind(li)
                    );
                }

                if (typeof config.customize !== "undefined") {
                    config.customize(li, i, config.content[i]);
                }

                this.append(li.getElement());

            }
            return this;
        }
    }

    /**
     *
     */
    export class Var extends HtmlElement
    {

    }

    /**
     *
     */
    export class Video extends HtmlElement
    {

    }

    /**
     *
     */
    export class Wbr extends HtmlElement
    {

    }
}
