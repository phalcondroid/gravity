///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Menuitem extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("menuitem");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
