///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class H6 extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("h6");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
