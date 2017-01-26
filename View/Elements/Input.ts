///<reference path="../ViewElement"/>

namespace View
{
    /**
     * [Input description]
     * @type {[type]}
     */
    export class Input extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("input");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + this.getClassName();
            }
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.initialize();
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
