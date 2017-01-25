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

        /**
         * [value description]
         * @param  {[type]} value [description]
         * @return {[type]}       [description]
         */
        public val(value: any = null)
        {
            if (value === null) {
                return this.val();
            }
            this.getElement().val(value);
            return this;
        }
    }
}
