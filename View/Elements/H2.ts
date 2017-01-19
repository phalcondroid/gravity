///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class H2 extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("h2");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
