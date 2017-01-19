///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Tbody extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("tbody");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
