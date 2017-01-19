///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Img extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("img");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }

        public src(src)
        {
            this.attr("src", src);
            return this;
        }
    }
}
