///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Li extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("li");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
