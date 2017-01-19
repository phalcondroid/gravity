///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Strong extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("strong");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
