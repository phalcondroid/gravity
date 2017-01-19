///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Pre extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("pre");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
