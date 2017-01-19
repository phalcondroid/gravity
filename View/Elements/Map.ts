///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Map extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("map");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
