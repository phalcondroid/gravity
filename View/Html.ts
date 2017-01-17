/// <reference path="../Helper/Helper" />
/// <reference path="../Network/Network" />

/**
 * [Html description]
 * @type {[type]}
 */
namespace View
{
    /**
     * [Html description]
     * @type {[type]}
     */
    export class ViewElement
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

        public setElement(element)
        {
            this.element = element;
            return this;
        }

        /**
         *
         */
        public getById(id : string)
        {
            this.element = document.getElementById(id);
            return this;
        }

        /**
         *
         */
        public getByTag(name : string)
        {
            var elements = document.getElementsByTagName(
                name
            );
            var result = new Array();
            for (let key in elements) {
                result.push(
                    new View.ViewElement().setElement(elements[key])
                );
            }

            if (result.length == 1) {
                return result[0];
            }
            return result;
        }

        /**
         *
         */
        public getByClass(name : string)
        {
            var elements = document.getElementsByClassName(
                name
            );
            var result = new Array();
            for (let key in elements) {
                result.push(
                    new View.ViewElement().setElement(elements[key])
                );
            }

            if (result.length == 1) {
                return result[0];
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
         * @return ViewElement
         */
        public init(element: string, name: string)
        {
            this.className = element;
            let docElement = document.createElement(element);

            if (element === "Button") {
                docElement.setAttribute("type", "button");
            }

            if (name !== "") {
                if (Helper.ArrayHelper.inArray(this.deny, element)) {
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
            if (Array.isArray(append) || (append instanceof HTMLCollection)) {
                for (let key in append) {
                    this.checkAppendValue(
                        append[key]
                    );
                }
            } else {
                this.checkAppendValue(
                    append
                );
            }

            return this;
        }

        /**
         *
         */
        private checkAppendValue(append)
        {
            switch (typeof append) {
                case "string":
                        this.element.appendChild(
                            document.createTextNode(append)
                        );
                    break;
                case "number":
                        this.element.appendChild(
                            document.createTextNode(
                                append.toString()
                            )
                        );
                    break;
                case "object":
                        if (append instanceof View.ViewElement) {
                            this.verifyElement(
                                append.getElement()
                            );
                        } else {
                            this.verifyElement(
                                append
                            );
                        }
                    break;
                default:

                    break;
            }
        }

        /**
         * [html description]
         * @param  {[type]} html [description]
         * @return {[type]}      [description]
         */
        public html(html: any = null) {
            if (html != null) {
                this.removeChildNodes();
                this.append(html);
                return this;
            } else {
                return this.element.innerHTML;
            }
        }

        public verifyElement(append, type : string = "append")
        {
            if (this.element instanceof HTMLCollection) {
                for (var key in this.element) {
                    if (typeof this.element[key].nodeType != "undefined") {
                        if (this.element[key].nodeType == 1) {
                            this.element[key].appendChild(
                                append
                            );
                        }
                    }
                }
            } else {
                this.element.appendChild(
                    append
                );
            }
        }

        private removeChildNodes()
        {
            if (this.element instanceof HTMLCollection) {
                for (let key in this.element) {
                    this.removeChilds(
                        this.element[key],
                        this.element[key].childNodes
                    );
                }
            } else {
                this.removeChilds(
                    this.element,
                    this.element.childNodes
                );
            }
        }

        private removeChilds(element, childs)
        {
            if (childs.length > 0) {
                for (let key in childs) {
                    if (typeof this.element[key].nodeType != "undefined") {
                        if (this.element[key].nodeType == 1) {
                            this.element[key].removeChild(childs[key])
                        }
                    }
                }
            }
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
            return new ViewElement(newIdentify, newElement[0]);
        }

        /**
         * [ajax description]
         * @return {[type]} [description]
         */
        public ajax(config) {
            var ajax = new Network.Ajax();
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
            this.removeChildNodes();
        }
    }

    /**
     *
     */
    export class A extends ViewElement {

        /**
         * [favIcon description]
         * @return {[type]} [description]
         */
        public favIcon(favIcon) {
            let icon = new View.I("favIcon" + this.id)
            .class(favIcon);
            this.append(icon.getElement());
            return this;
        }

        /**
         * [href description]
         * @param  {[type]} href [description]
         * @return {[type]}      [description]
         */
        public href(href) {
            this.attr("href", href);
            return this;
        }
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Abbr extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Address extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Area extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Article extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Aside extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Audio extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class B extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Base extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Bdi extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Bdo extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Blockquote extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Body extends ViewElement
    {
        public constructor()
        {
            super();
            this.element = document.body;
        }
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Br extends ViewElement
    {
    }

    /**
     *
     */
    export class Button extends ViewElement {

        /**
         * [type description]
         * @param  {[type]} type [description]
         * @return {[type]}      [description]
         */
        public type(type) {
            this.attr("type", type);
            return this;
        }

        /**
         * [favIcon description]
         * @return {[type]} [description]
         */
        public favIcon(favIcon)
        {
            let icon = new View.I("favIcon" + this.id)
            .class(favIcon);
            this.append(icon);
            return this;
        }

        /**
         * [succes description]
         * @return {[type]} [description]
         */
        public success()
        {
            this.addClass("btn btn-success");
            return this;
        }

        /**
         * [notice description]
         * @return {[type]} [description]
         */
        public notice()
        {
            this.addClass("btn btn-notice");
            return this;
        }

        /**
         * [notice description]
         * @return {[type]} [description]
         */
        public default()
        {
            this.addClass("btn btn-default");
            return this;
        }

        /**
         * [notice description]
         * @return {[type]} [description]
         */
        public primary()
        {
            this.addClass("btn btn-primary");
            return this;
        }

        /**
         * [warning description]
         * @return {[type]} [description]
         */
        public warning()
        {
            this.addClass("btn btn-warning");
            return this;
        }

        /**
         * [danger description]
         * @return {[type]} [description]
         */
        public danger()
        {
            this.addClass("btn btn-danger");
            return this;
        }
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Canvas extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Caption extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Cite extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Code extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Col extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class ColGroup extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Datalist extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Dd extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Del extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Details extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Dfn extends ViewElement
    {
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Dialog extends ViewElement
    {
    }

    /**
     *
     */
    export class Div extends ViewElement
    {
    }

    /**
     *
     */
    export class Dl extends ViewElement
    {
    }

    /**
     *
     */
    export class Dt extends ViewElement
    {
    }

    /**
     *
     */
    export class Em extends ViewElement
    {
    }

    /**
     *
     */
    export class Embed extends ViewElement
    {
    }

    /**
     *
     */
    export class Fieldset extends ViewElement
    {
    }

    /**
     *
     */
    export class Figcaption extends ViewElement
    {
    }

    /**
     *
     */
    export class Figure extends ViewElement
    {
    }

    /**
     *
     */
    export class Footer extends ViewElement
    {
    }

    /**
     *
     */
    export class Form extends ViewElement
    {
    }

    /**
     *
     */
    export class H1 extends ViewElement
    {
    }

    /**
     *
     */
    export class H2 extends ViewElement
    {
    }

    /**
     *
     */
    export class H3 extends ViewElement
    {
    }

    /**
     *
     */
    export class H4 extends ViewElement
    {
    }

    /**
     *
     */
    export class H5 extends ViewElement
    {
    }

    /**
     *
     */
    export class H6 extends ViewElement
    {
    }

    /**
     *
     */
    export class Head extends ViewElement
    {
    }

    /**
     *
     */
    export class Header extends ViewElement
    {
    }

    /**
     *Ttpt
    export class Html extends ViewElement
    {
    }
    */

    /**
     *
     */
    export class I extends ViewElement
    {
    }

    /**
     *
     */
    export class Iframe extends ViewElement
    {
    }

    export class Img extends ViewElement
    {
        public src(src)
        {
            this.attr("src", src);
            return this;
        }
    }

    /**
     * [Input description]
     * @type {[type]}
     */
    export class Input extends ViewElement
    {

        /**
         * [type description]
         * @param  {[type]} type [description]
         * @return {[type]}      [description]
         */
        public type(type)
        {
            this.attr("type", type);
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
                return this.val();
            }
            this.getElement().val(value);
            return this;
        }
    }

    /**
     *
     */
    export class Ins extends ViewElement
    {
    }

    /**
     *
     */
    export class Kbd extends ViewElement
    {
    }

    /**
     *
     */
    export class Keygen extends ViewElement
    {
    }

    /**
     *
     */
    export class Label extends ViewElement
    {
    }

    /**
     *
     */
    export class Leyend extends ViewElement
    {
    }

    /**
     *
     */
    export class Li extends ViewElement
    {
    }

    /**
     *
     */
    export class Link extends ViewElement
    {
    }

    /**
     *
     */
    export class Main extends ViewElement
    {
    }

    /**
     *
     */
    export class Map extends ViewElement
    {
    }

    /**
     *
     */
    export class Menu extends ViewElement
    {
    }

    /**
     *
     */
    export class MenuItem extends ViewElement
    {
    }

    /**
     *
     */
    export class Meta extends ViewElement
    {
    }

    /**
     *
     */
    export class Meter extends ViewElement
    {
    }

    /**
     *
     */
    export class Nav extends ViewElement
    {
    }

    /**
     *
     */
    export class Noscrip extends ViewElement
    {
    }

    /**
     *
     */
    export class Object extends ViewElement
    {
    }

    /**
     *
     */
    export class Ol extends ViewElement
    {
    }

    /**
     *
     */
    export class Optgroup extends ViewElement
    {
    }

    /**
     *
     */
    export class Option extends ViewElement
    {
    }

    /**
     *
     */
    export class Output extends ViewElement
    {
    }

    /**
     *
     */
    export class P extends ViewElement
    {
    }

    /**
     *
     */
    export class Param extends ViewElement
    {
    }

    /**
     *
     */
    export class Pre extends ViewElement
    {
    }

    /**
     *
     */
    export class Progress extends ViewElement
    {
    }

    /**
     *
     */
    export class Q extends ViewElement
    {
    }

    /**
     *
     */
    export class Rp extends ViewElement
    {
    }

    /**
     *
     */
    export class Rt extends ViewElement
    {
    }

    /**
     *
     */
    export class Ruby extends ViewElement
    {
    }

    /**
     *
     */
    export class S extends ViewElement
    {
    }

    /**
     *
     */
    export class Samp extends ViewElement
    {
    }

    /**
     *
     */
    export class Script extends ViewElement
    {
    }

    /**
     *
     */
    export class Section extends ViewElement
    {
    }

    export class Select extends ViewElement
    {

        public getSelected()
        {
            var childs = this.getElement().childNodes;
            for (var key in childs) {
                if (childs[key].getAttribute("selected") !== null) {
                    return new View.ViewElement(childs[key]);
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
                let option = new View.Option();
                option.attr({
                    "value" : content[key],
                });
                option.text(content[key]);
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
    export class Small extends ViewElement
    {
    }

    /**
     *
     */
    export class Source extends ViewElement
    {
    }

    /**
     *
     */
    export class Span extends ViewElement
    {
    }

    /**
     *
     */
    export class Strong extends ViewElement
    {
    }

    /**
     *
     */
    export class Style extends ViewElement
    {
    }

    /**
     *
     */
    export class Sub extends ViewElement
    {
    }

    /**
     *
     */
    export class Summary extends ViewElement
    {
    }

    /**
     *
     */
    export class Sup extends ViewElement
    {
    }

    /**
     * [Table description]
     * @type {[type]}
     */
    export class Table extends ViewElement
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
            this.thead  = new View.Thead("thead" + this.id);
            this.tr     = new View.Tr("trHeader" + this.id);

            let i = 0;
            for (let key in columns) {

                let th = new View.Th("TheadTh" + key + this.id);

                if (typeof columns[key] == "object") {
                    th.append(
                        columns[key]
                    );
                } else {
                    th.append(
                        Helper.StringHelper.capitalize(columns[key])
                    );
                }

                this.tr.append(
                    th.getElement()
                );

                if (typeof this.fnCHeader === "function") {
                    this.fnCHeader(th, i, columns[key], key);
                }

                i++;
            }

            this.thead.append(
                this.tr.getElement()
            );

            this.append(
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
            this.tbody = new View.Tbody("tbody" + this.id);

            var html = new View.ViewElement();
            var i = 0;

            for (var key in content) {

                var trIdentify = Helper.StringHelper.sanitizeString(key) + this.id;
                var tr = new View.Tr("TbodyTr" + trIdentify);

                var header = new Array();
                var j = 0;

                for (var row in content[key]) {

                    header[j] = row;
                    var trIdentify2 = Helper.StringHelper.sanitizeString(key) + Helper.StringHelper.sanitizeString(row) + this.id;
                    var td = new View.Td("TbodyTd" + trIdentify2);

                    if (!this.validateSystemKeys(row)) {

                        var contentRow = content[key][row];
                        var finalContent;

                        if (contentRow instanceof View.ViewElement) {
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

                        tr.append(
                            td
                        );
                    }

                    if (typeof this.fnCContent === "function") {
                        this.fnCContent(td, j, content[key][row], row);
                        if (this.header === false) {
                            this.fnCHeader = this.fnCContent;
                        }
                    }

                    j++;
                }

                this.tbody.append(
                    tr
                );

                i++;
            }

            if (this.header === false) {
                this.setHeader(header);
            }

            this.append(
                this.tbody
            );

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
            if (Helper.ArrayHelper.inArray(this.system, row)) {
                return true;
            }
            return false;
        }
    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Thead extends ViewElement
    {

    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Tbody extends ViewElement
    {

    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Tr extends ViewElement
    {

    }

    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Td extends ViewElement
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
     * [ViewElement description]
     * @type {[type]}
     */
    export class Th extends ViewElement
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
    export class Tfoot extends ViewElement
    {

    }

    /**
     *
     */
    export class Time extends ViewElement
    {

    }

    /**
     *
     */
    export class Textarea extends ViewElement
    {

    }

    /**
     *
     */
    export class Title extends ViewElement
    {

    }

    /**
     *
     */
    export class Track extends ViewElement
    {

    }

    /**
     *
     */
    export class U extends ViewElement
    {

    }

    /**
     *
     * @type {[type]}
     */
    export class Ul extends ViewElement
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

                var li = new View.Li(config.name + i);
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
    export class Var extends ViewElement
    {

    }

    /**
     *
     */
    export class Video extends ViewElement
    {

    }

    /**
     *
     */
    export class Wbr extends ViewElement
    {

    }
}
