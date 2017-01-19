///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Textarea extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("textarea");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
