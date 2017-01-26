///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Th extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("th");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + this.getClassName();
            }
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.initialize();
        }

        /*
         *
         * @param  {[type]} num [description]
         * @return {[type]}     [description]
         */
        public colspan(cols) {
            this.attr({
                "colspan" : cols
            });
            return this;
        }

        /**
         *
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        public rowspan(rows) {
            this.attr({
                "rowspan" : rows
            });
            return this;
        }
    }
}
