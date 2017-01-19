///<reference path="../ViewElement"/>

namespace View
{
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Style extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("style");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
