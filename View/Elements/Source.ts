///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Source extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("source");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
