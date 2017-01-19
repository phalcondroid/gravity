///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
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
            this.initialize();
        }

        public getValue()
        {
            return this.attr("value");
        }

        public getContent()
        {
            return this.getElement().text;
        }
    }
}
