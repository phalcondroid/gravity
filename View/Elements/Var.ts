///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Var extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("var");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
