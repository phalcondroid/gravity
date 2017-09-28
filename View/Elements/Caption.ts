///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>

namespace Gravity.View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Caption extends Gravity.View.Tag
    {
        /**
         *
         */
        public constructor(ctx, a1 : any = "atmpnil", a2 : any = "atmpnil", a3 : any = "atmpnil", a4 : any = "atmpnil", a5 : any = "atmpnil")
        {
            super();
            this.create("caption");
            if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
