///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Progress extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("progress");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
