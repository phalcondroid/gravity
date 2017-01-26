///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Ul extends ViewElement
    {

        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("ul");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + this.getClassName();
            }
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.initialize();
        }

        /**
         *
         * @param
         * @param
         * @return
         */
        public create(config)
        {

            for (var i = 0; i < config.content.length; i++) {

                var li = new View.Li(config.name + i);
                if (typeof config.content !== "undefined") {

                }

                if (typeof config.clickChild !== "undefined") {
                    li.getElement().addEventListener(
                        config.event,
                        config.clickChild.bind(li)
                    );
                }

                if (typeof config.customize !== "undefined") {
                    config.customize(li, i, config.content[i]);
                }

                this.append(li.getElement());

            }
            return this;
        }
    }
}
