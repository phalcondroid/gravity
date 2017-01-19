///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Aside extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("aside");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
