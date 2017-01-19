///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Ol extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("ol");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
