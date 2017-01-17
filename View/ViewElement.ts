
namespace View
{
    /**
     *
     * @type {[type]}
     */
    export class ViewElement
    {

        /**
         * Node javascript element
         */
        public element;

        /**
         * Controller
         */
        protected context;

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

        public initialize()
        {

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
}
