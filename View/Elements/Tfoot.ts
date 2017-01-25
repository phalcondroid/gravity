///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Tfoot extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("tfoot");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.initialize();
        }
    }
}
