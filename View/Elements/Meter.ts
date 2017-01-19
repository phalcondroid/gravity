///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Meter extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("meter");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
