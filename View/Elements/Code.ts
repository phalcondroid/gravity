///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Code extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("code");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
