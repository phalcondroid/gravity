///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Wbr extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("wbr");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
