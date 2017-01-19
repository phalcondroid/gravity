///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Track extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("track");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
