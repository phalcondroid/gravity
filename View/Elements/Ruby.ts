///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Ruby extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("ruby");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
