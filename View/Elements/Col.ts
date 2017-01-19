///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Col extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("col");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
