///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class B extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("b");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
