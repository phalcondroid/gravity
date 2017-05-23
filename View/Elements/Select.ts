///<reference path="../ViewElement"/>
///<reference path="../../Model/RawModel"/>

namespace View {

    export class Select extends ViewElement
    {

        private choose = "Choose...";

        /**
         *
         */
        public constructor(ctx, a1 : any = "atmpnil", a2 : any = "atmpnil", a3 : any = "atmpnil", a4 : any = "atmpnil", a5 : any = "atmpnil")
        {
            super("");
            this.create("select");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + this.getClassName();
            }
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.setArgs(this.getArguments(arguments));
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
         * @param fn 
         */
        public iterate(fn) {
            var childs = this.getChilds();
            for (var key in childs) {
                fn(childs[key]);
            }
            return this;
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
