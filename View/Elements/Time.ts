///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Time extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("time");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
