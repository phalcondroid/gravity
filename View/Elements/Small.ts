///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Small extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("small");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
