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
        public constructor(ctx)
        {
            super();
            this.create("option");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
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
