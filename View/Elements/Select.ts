///<reference path="../ViewElement"/>
///<reference path="../../Model/RawModel"/>

namespace View {

    export class Select extends ViewElement
    {

        private choose = "Choose...";

        /**
         *
         */
        public constructor(ctx)
        {
            super("");
            this.create("select");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + this.getClassName();
            }
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.initialize();
        }

        /**
         *
         */
        public getSelected()
        {
            var option = new View.Option(
                this.getContext()
            );
            option.setElement(
                this.getElement().options[
                    this.getElement().selectedIndex
                ]
            );
            return option;
        }

        /**
         *
         */
        public setChoose(choose)
        {
            this.choose = choose;
        }

        /**
         *
         */
        public select(value)
        {
            var childs = this.getElement().childNodes;
            for (var key in childs) {
                if (childs[key].value == value) {
                    childs[key].setAttribute("selected", "selected");
                }
            }
        }

        /**
         *
         * @param  content
         * @return
         */
        public build(content, fields)
        {

            if (content instanceof ModelData.StaticModel) {
                content = JSON.parse(content.getData());
            }

            var i = 0;
            for (let key in content) {

                let option = new View.Option(
                    this.getContext()
                );

                let id = content[key][fields[0]];
                if (id === "") {
                    id = content[key][fields[1]];
                }

                option.attr({
                    "value" : id
                });
                option.append(
                    content[key][fields[1]]
                );

                this.append([
                    option
                ]);

                i++;
            }

            return this;
        }
    }
}
