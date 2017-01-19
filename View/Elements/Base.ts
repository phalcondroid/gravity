///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Base extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("base");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
