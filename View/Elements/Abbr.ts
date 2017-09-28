///<reference path="../Tag.ts"/>

namespace Gravity.View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Abbr extends Gravity.View.Tag
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("abbr");
            if (!(ctx instanceof Gravity.Mvc.Controller)) {
                throw "context must be instance of View.Controller to " + this.getClassName();
            }
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.setArgs(this.getArguments(arguments));
            this.initialize();
        }
    }
}
