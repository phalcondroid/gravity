///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Rt extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("rt");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
