///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Dt extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("dt");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
