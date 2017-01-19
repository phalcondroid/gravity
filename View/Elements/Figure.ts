///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Figure extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("figure");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
