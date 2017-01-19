///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Canvas extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("canvas");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
