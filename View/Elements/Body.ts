///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Body extends ViewElement
    {
        public constructor(ctx)
        {
            super();
            this.context = ctx;
            this.element = document.body;
            this.initialize();
            
        }
    }
}
