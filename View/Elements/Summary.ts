///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Summary extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("summary");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
