///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Datalist extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("datalist");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
