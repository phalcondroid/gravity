///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Leyend extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("leyend");
            if (!(ctx instanceof View.Controller)) {
                throw "Context must be instance of View.Controller to " + this.getClassName();
            }
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.initialize();
        }
    }
}
