///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Dialog extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("dialog");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
