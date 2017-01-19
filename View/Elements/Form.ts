///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Form extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("form");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
