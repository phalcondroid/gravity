///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Db extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("db");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
