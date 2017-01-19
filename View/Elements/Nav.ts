///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Nav extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("nav");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
