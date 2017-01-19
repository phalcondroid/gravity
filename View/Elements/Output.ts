///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Output extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("output");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
