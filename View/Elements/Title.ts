///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Title extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("title");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
