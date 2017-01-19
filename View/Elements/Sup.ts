///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Sup extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("sup");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
