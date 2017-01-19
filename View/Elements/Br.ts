///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Br extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("br");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
