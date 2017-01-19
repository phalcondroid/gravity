///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Blockquote extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("blockquote");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
