///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Optgroup extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("optgroup");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
