///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Rp extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("rp");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
