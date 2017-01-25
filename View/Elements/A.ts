
///<reference path="../ViewElement"/>

namespace View {

    /**
     *
     */
    export class A extends ViewElement
    {

        /**
         *
         */
        public constructor(ctx)
        {
            super();
            this.create("a");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.initialize();
        }

        /**
         * [favIcon description]
         * @return {[type]} [description]
         */
        public favIcon(favIcon) {
            let icon = new View.I("favIcon" + this.id)
            .class(favIcon);
            this.append(icon.getElement());
            return this;
        }

        /**
         * [href description]
         * @param  {[type]} href [description]
         * @return {[type]}      [description]
         */
        public href(href) {
            this.attr("href", href);
            return this;
        }
    }
}
