///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Menu extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("menu");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
