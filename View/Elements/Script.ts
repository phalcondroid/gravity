///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Script extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("script");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
