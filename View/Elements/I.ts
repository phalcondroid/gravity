///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class I extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("i");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
