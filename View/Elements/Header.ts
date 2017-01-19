///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Header extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("header");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
