///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Cite extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("cite");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
