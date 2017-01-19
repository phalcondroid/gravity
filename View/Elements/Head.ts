///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Head extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("head");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
