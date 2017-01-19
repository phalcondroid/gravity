///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Footer extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("footer");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
