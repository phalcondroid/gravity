///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Kbd extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("kbd");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
