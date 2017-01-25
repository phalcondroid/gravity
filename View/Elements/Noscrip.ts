///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Noscrip extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("noscrip");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.initialize();
        }
    }
}
