///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Td extends ViewElement
    {
        /**
         *
         * @param  {[type]} num [description]
         * @return {[type]}     [description]
         */
        public colspan(cols)
        {
            this.attr({
                "colspan" : cols
            });
        }

        /**
         *
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        public rowspan(rows)
        {
            this.attr({
                "rowspan" : rows
            });
        }
    }
}
