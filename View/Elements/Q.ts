///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Q extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("q");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
