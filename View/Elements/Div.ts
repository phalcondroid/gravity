///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Div extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("div");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
