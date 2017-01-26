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
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + this.getClassName();
            }
            this.setContext(ctx);
            this.em = this.getDi().get("em");
            this.initialize();
        }
    }
}
