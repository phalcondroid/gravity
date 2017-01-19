///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Ins extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("ins");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
