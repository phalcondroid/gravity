///<reference path="../ViewElement"/>

namespace View {

    export class Select extends ViewElement
    {

        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.context = ctx;
        }

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
                let option = new View.Option(
                    this.context
                );
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
}
