///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Object extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.context = ctx;
            this.initialize();
        }
    }
}
