///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Label extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("label");
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
