///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class ColGroup extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("colgroup");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
