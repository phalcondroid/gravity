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
            this.setContext(ctx);
            this.setDi(ctx.getDi());
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
        }
    }
}
