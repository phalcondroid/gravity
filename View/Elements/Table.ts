///<reference path="../ViewElement"/>

namespace View
{
    /**
     * [Table description]
     * @type {[type]}
     */
    export class Table extends ViewElement
    {

        public constructor(ctx)
        {
            super();
            this.create("table");
            this.setContext(ctx);
            this.setDi(ctx.getDi());
            this.em = this.getDi().get("em");

            this.thead  = new View.Thead(
                this.getContext()
            );

            this.tbody = new View.Tbody(
                this.getContext()
            );

            this.initialize();
        }

        private tblElements;
        private thead;
        private tbody;
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
        public toHead(component)
        {
            this.thead.append(
                component
            );
        }

        /**
         *
         */
        public toHeadTr(component)
        {
            let tr = new View.Tr(this.getContext());
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
        public toBodyTr(component)
        {
            let tr = new View.Tr(this.getContext());
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
         *
         */
        public setHeader(columns)
        {
            this.header = true;

            this.tr     = new View.Tr(
                this.getContext()
            );

            let i = 0;
            for (let key in columns) {

                let th = new View.Th(
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

            var html = new View.ViewElement();
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

                        if (contentRow instanceof View.ViewElement) {
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
