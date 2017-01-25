///<reference path="../ViewElement"/>

namespace View
{
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Area extends View.ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("area");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.initialize();
        }
    }
}
