
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>

namespace Gravity.View {

    /**
     *
     */
    export class A extends Gravity.View.Tag
    {

        /**
         *
         */
        public constructor(ctx, args : any = "")
        {
            super();
            this.create("a");
            if (!(ctx instanceof Gravity.Mvc.Controller)) {
                throw "context must be instance of View.Controller to " + this.getClassName();
            }
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.href("");
            this.setArgs(this.getArguments(arguments));
            this.initialize();
        }

        /**
         * [favIcon description]
         * @return {[type]} [description]
         */
        public favIcon(favIcon) {
            let icon = new Gravity.View.I(this.getContext())
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
