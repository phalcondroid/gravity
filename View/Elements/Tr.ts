///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Tr extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("tr");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
