///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Del extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("del");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
