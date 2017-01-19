///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Meta extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("meta");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
