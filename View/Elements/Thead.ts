///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Thead extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("thead");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
