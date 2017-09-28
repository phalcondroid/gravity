///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>

namespace Gravity.View
{
    /**
     * [Table description]
     * @type {[type]}
     */
    export class Table extends Gravity.View.Tag
    {
        private tblElements;
        private thead;
        private tbody;
        private tfoot;
        private tr;
        private th;
        private td;
        private system;
        private header = false;
        private fnCHeader;
        private fnCContent;

        /**
         *
         */
        public constructor(ctx, a1 : any = "atmpnil", a2 : any = "atmpnil", a3 : any = "atmpnil", a4 : any = "atmpnil", a5 : any = "atmpnil")
        {
            super();
            this.create("table");
            if (!(ctx instanceof Gravity.Mvc.Controller)) {
                throw "context must be instance of View.Controller to " + this.getClassName();
            }
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");

            this.thead  = new Gravity.View.Thead(
                this.getContext()
            );

            this.tbody = new Gravity.View.Tbody(
                this.getContext()
            );

            this.tfoot = new Gravity.View.Tfoot(
                this.getContext()
            );

            this.setArgs(this.getArguments(arguments));
            this.initialize();
        }

        /**
         *
         */
        public getThead()
        {
            return this.thead;
        }

        /**
         *
         */
        public getTbody()
        {
            return this.tbody;
        }

        /**
         *
         */
        public toHead(component)
        {
            this.thead.append(
                component
            );
            this.append(
                this.thead
            );
            return this;
        }

        /**
         *
         */
        public toHeadTr(component)
        {
            let tr = new Gravity.View.Tr(this.getContext());
            tr.append(component);

            this.thead.append(
                tr
            );

            this.append(
                this.thead
            );

            return this;
        }

        /**
         *
         */
        public toBody(component)
        {
            this.tbody.append(
                component
            );

            this.append(
                this.tbody
            );

            return this;
        }

        /**
         *
         */
        public toFoot(component)
        {
            this.tfoot.append(
                component
            );

            this.append(
                this.tfoot
            );

            return this;
        }

        /**
         *
         */
        public toBodyTr(component)
        {
            let tr = new Gravity.View.Tr(this.getContext());
            tr.append(component);

            this.tbody.append(
                tr
            );

            this.append(
                this.tbody
            );

            return this;
        }

        /**
         *
         */
        public toFootTr(component)
        {
            let tr = new Gravity.View.Tr(this.getContext());
            tr.append(component);

            this.tfoot.append(
                tr
            );

            this.append(
                this.tfoot
            );

            return this;
        }

        /**
         *
         *
         */
        public setHeader(columns)
        {
            this.header = true;

            this.tr     = new Gravity.View.Tr(
                this.getContext()
            );

            let i = 0;
            for (let key in columns) {

                let th = new Gravity.View.Th(
                    this.context
                );

                if (typeof columns[key] == "object") {
                    th.append(
                        columns[key]
                    );
                } else {
                    th.append(
                        Helper.StringHelper.capitalize(columns[key])
                    );
                }

                this.tr.append(
                    th.getElement()
                );

                if (typeof this.fnCHeader === "function") {
                    this.fnCHeader(th, i, columns[key], key);
                }

                i++;
            }

            this.thead.append(
                this.tr.getElement()
            );

            this.append(
                this.thead.getElement()
            );

            return this;
        }

        /**
         * [setCustomize description]
         * @param  {Function} fn      [description]
         * @return {[type]}           [description]
         */
        public setHeaderCustomize(fn)
        {
            this.fnCHeader = fn;
            return this;
        }

        /**
         *
         * @param  {[type]} rows
         * @return {[type]}
         */
        public build(content)
        {

            this.system = ["click", "customize"];

            var html = new Gravity.View.Tag();
            var i = 0;

            for (var key in content) {

                var trIdentify = Helper.StringHelper.sanitizeString(key) + this.id;
                var tr = new View.Tr(
                    this.getContext()
                );

                var header = new Array();
                var j = 0;

                for (var row in content[key]) {

                    header[j] = row;
                    var trIdentify2 = Helper.StringHelper.sanitizeString(key) + Helper.StringHelper.sanitizeString(row) + this.id;
                    var td = new View.Td(
                        this.getContext()
                    );

                    if (!this.validateSystemKeys(row)) {

                        var contentRow = content[key][row];
                        var finalContent;

                        if (contentRow instanceof Gravity.View.Tag) {
                            finalContent = contentRow.getElement();
                        } else if(typeof contentRow == "object" && contentRow != null) {

                            if (contentRow.hasOwnProperty("content")) {
                                finalContent = contentRow.content
                            }

                            if (contentRow.hasOwnProperty("class")) {
                                td.attr(
                                    contentRow.class
                                )
                            }

                            if (contentRow.hasOwnProperty("attr")) {
                                td.attr(
                                    contentRow.attr
                                )
                            }

                            if (contentRow.hasOwnProperty("css")) {
                                td.attr(
                                    contentRow.css
                                )
                            }

                            if (contentRow.hasOwnProperty("addTd")) {
                                tr.append([
                                    contentRow.addTd
                                ]);
                            }

                            if (contentRow.hasOwnProperty("event")) {
                                var functionTd = contentRow.event;
                                functionTd(td);
                            }

                        } else {
                            finalContent = contentRow;
                        }

                        td.append([
                            finalContent
                        ]);

                        tr.append(
                            td
                        );
                    }

                    if (typeof this.fnCContent === "function") {
                        this.fnCContent(td, j, content[key][row], row);
                        if (this.header === false) {
                            this.fnCHeader = this.fnCContent;
                        }
                    }

                    j++;
                }

                this.tbody.append(
                    tr
                );

                i++;
            }

            if (this.header === false) {
                this.setHeader(header);
            }

            this.append(
                this.tbody
            );

            return this;
        }

        /**
         * [setCustomize description]
         * @param  {Function} fn      [description]
         * @return {[type]}           [description]
         */
        public setContentCustomize(fn)
        {
            this.fnCContent = fn;
            return this;
        }

        /**
         *
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        private validateSystemKeys(row)
        {
            if (Helper.ArrayHelper.inArray(this.system, row)) {
                return true;
            }
            return false;
        }
    }
}
