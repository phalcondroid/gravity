///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Embed extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("embed");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
