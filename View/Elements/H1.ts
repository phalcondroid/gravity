///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class H1 extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("h1");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
