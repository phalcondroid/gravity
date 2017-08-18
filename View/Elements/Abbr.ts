///<reference path="../Tag.ts"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Abbr extends Gravity.View.Tag
    {
        /**
         *
         */
        public constructor(context = Gravity.View.Tag.NO_CONTEXT)
        {
            super();
            this.create("abbr");
            if (context === Gravity.View.Tag.NO_CONTEXT) {

            }
            if (!(context instanceof Gravity.Mvc.Controller)) {
                throw "context must be instance of View.Controller to " + this.getClassName();
            }
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.setArgs(this.getArguments(arguments));
            this.initialize();
        }
    }
}
