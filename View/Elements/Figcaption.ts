///<reference path="../ViewElement"/>

namespace View
{
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Figcaption extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("figcaption");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.initialize();
        }
    }
}
