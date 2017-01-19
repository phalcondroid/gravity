///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Iframe extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("iframe");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
