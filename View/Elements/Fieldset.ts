///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Fieldset extends ViewElement
    {
        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("fieldset");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.initialize();
        }
    }
}
