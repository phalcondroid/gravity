///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Dfn extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("dfn");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
