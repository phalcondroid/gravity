///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Leyend extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("leyend");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
