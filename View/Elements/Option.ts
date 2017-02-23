///<reference path="../ViewElement"/>

namespace View {
    /**
     *
     * @type
     */
    export class Option extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx, a1 : any = "atmpnil", a2 : any = "atmpnil", a3 : any = "atmpnil", a4 : any = "atmpnil", a5 : any = "atmpnil")
        {
            super();
            this.create("option");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + this.getClassName();
            }
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.setArgs(this.getArguments(arguments));
            this.initialize();
        }

        public setValue(val)
        {
            this.attr("value", val);
            return this;
        }

        /**
         *
         */
        public getValue()
        {
            return this.attr("value");
        }

        /**
         *
         */
        public setContent(content)
        {
            this.append(content);
            return this;
        }

        /**
         *
         */
        public getContent()
        {
            return this.getElement().text;
        }
    }
}
