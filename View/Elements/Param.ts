///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Param extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("param");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
