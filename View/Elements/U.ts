///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class U extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("u");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
