///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Dl extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("dl");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
