///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>

namespace Gravity.View {

    /**
     *
     */
    export class Button extends Gravity.View.Tag
    {

        /**
         *
         */
        public constructor(ctx, a1 : any = "atmpnil", a2 : any = "atmpnil", a3 : any = "atmpnil", a4 : any = "atmpnil", a5 : any = "atmpnil")
        {
            super();
            this.create("button");
            this.attr("type", "button");
            if (!(ctx instanceof Gravity.Mvc.Controller)) {
                throw "context must be instance of View.Controller to " + this.getClassName();
            }
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");
            this.setArgs(this.getArguments(arguments));
            this.initialize();
        }

        /**
         *
         * @param
         * @return
         */
        public type(type) {
            this.attr("type", type);
            return this;
        }

        /**
         *
         * @return
         */
        public favIcon(favIcon)
        {
            let icon = new View.I(this.getContext())
            .class(favIcon);
            this.append(icon);
            return this;
        }

        /**
         *
         * @return
         */
        public success()
        {
            this.addClass("btn btn-success");
            return this;
        }

        /**
         *
         * @return
         */
        public notice()
        {
            this.addClass("btn btn-notice");
            return this;
        }

        /**
         *
         * @return
         */
        public default()
        {
            this.addClass("btn btn-default");
            return this;
        }

        /**
         *
         * @return
         */
        public primary()
        {
            this.addClass("btn btn-primary");
            return this;
        }

        /**
         * [warning description]
         * @return {[type]} [description]
         */
        public warning()
        {
            this.addClass("btn btn-warning");
            return this;
        }

        /**
         * [danger description]
         * @return {[type]} [description]
         */
        public danger()
        {
            this.addClass("btn btn-danger");
            return this;
        }
    }
}
