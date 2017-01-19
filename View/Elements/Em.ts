///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Em extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("em");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
