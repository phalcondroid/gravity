///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Keygen extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("keygen");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
