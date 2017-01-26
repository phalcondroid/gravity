///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Ruby extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("ruby");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + this.getClassName();
            }
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.initialize();
        }
    }
}
