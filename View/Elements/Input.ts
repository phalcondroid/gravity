///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>

namespace Gravity.View
{
    /**
     * [Input description]
     * @type {[type]}
     */
    export class Input extends Gravity.View.Tag
    {
        /**
         *
         */
        public constructor(ctx, a1 : any = "atmpnil", a2 : any = "atmpnil", a3 : any = "atmpnil", a4 : any = "atmpnil", a5 : any = "atmpnil")
        {
            super();
            this.create("input");
            if (!(ctx instanceof Gravity.Mvc.Controller)) {
                throw "context must be instance of View.Controller to " + this.getClassName();
            }
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.setArgs(this.getArguments(arguments));
            this.initialize();
        }

        /**
         * 
         */
        public getValue()
        {
            return this.element.value;
        }

        /**
         *
         */
        public setValue(value)
        {
            this.element.value = value;
            return this;
        }

        /**
         * [type description]
         * @param  {[type]} type [description]
         * @return {[type]}      [description]
         */
        public type(type)
        {
            this.attr("type", type);
            return this;
        }
    }
}
