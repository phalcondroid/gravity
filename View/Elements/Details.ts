///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Details extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("details");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
