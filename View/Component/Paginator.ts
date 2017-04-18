namespace Views
{
    export class Paginator extends View.Nav
    {
        public ul : View.Ul;
        public params = "";
        public model  = Object;

        public initialize()
        {
            this.ctrlException(this.getArgs()[0]);
            this.ul.class("pagination");
            this.setCountPages();
        }

        private setCountPages()
        {
            var model  = this.getArgs()[0].model;
            var params = {};
            if (this.getArgs()[0].params != undefined) {
                this.getArgs()[0].params;
            }
            this.em.count(
                model,
                params
            ).response(function (count) {
                this.ul = new View.Ul(this.context);
                this.attr({
                    "aria-label" : "Page navigation",
                    "style" : "margin: 0 auto; text-align : center;"
                });
                this.getDi().setPersistent(
                    "countPages",
                    count.getCount()
                );
                var pages = Math.ceil(
                    this.getDi().getPersistent("countPages") / 10
                );
                this.getDi().setPersistent(
                    "numberPages",
                    pages
                );
                this.getDi().setPersistent(
                    "lastPage",
                    this.getDi().getPersistent("actualPage")
                );
                this.createPages();
                this.append(
                    this.ul
                );
            });
        }

        private ctrlException(data)
        {
            for (var key in data) {
                switch (key) {
                    case "model":
                    case "clickPage":
                    case "params":
                        return true;
                    default:
                        throw "Required paginator arguments are missing";
                }
            }
        }

        /**
         *
         */
        public createPages()
        {
            let pages = this.getDi().getPersistent(
                "numberPages"
            );
            this.iteratePages(pages, true);
        }

        /**
         *
         */
        public setPrevious()
        {
            this.ul.append(
                new View.Li(this.context).append(
                    new View.A(this.context)
                    .attr({
                        "aria-label" : "Previous"
                    })
                    .append(
                        "<"
                    )
                )
            );
        }

        /**
         *
         */
        public setNext()
        {
            this.ul.append(
                new View.Li(this.context).append(
                    new View.A(this.context)
                    .attr({
                        "aria-label" : "Next"
                    })
                    .append(
                        ">"
                    )
                )
            );
        }

        /**
         *
         */
        public verifyIndex(large, actualPage, newPage)
        {
            var index   = this.getDi().getPersistent("index") ? parseInt(this.getDi().getPersistent("index")) : 0;
            if (large) {
                if (actualPage > 8) {
                    newPage = parseInt(actualPage) + 1;
                    var partialIndex = newPage - 9;
                    this.getDi().setPersistent("index", index);
                }
                if (newPage <= 9) {
                    partialIndex = 0;
                }
            }
            return [partialIndex, newPage];
        }

        /**
         *
         */
        public iteratePages(total, large = false)
        {
            var actualPage = this.getDi().getPersistent("actualPage");
            this.ul.empty();

            var pages   = total;
            var partial : any = 9;
            var verfy   = this.verifyIndex(large, actualPage, partial);
            var index   = verfy[0];
            partial = verfy[1];

            this.setPrevious();

            var bullets = true;
            if (partial > pages) {
                var result = (partial - pages);
                partial = partial - result - 1;
            } else {
                if (partial == 0) {
                    partial = 1;
                    index   = 0;
                }
            }

            var fn = this.clickPage.bind(this);
            if (pages == 1 || pages == 0) {
                fn = function() {};
            }

            for (var i = index; i < partial; i++) {
                this.ul.append(
                    new View.Li(this.context)
                    .attr("id", "paginator-page-" + (i + 1))
                    .append(
                        new View.A(this.context)
                        .append(
                            i + 1
                        )
                    ).click(
                        fn
                    )
                );
            }

            if (large) {
                if (pages > 8) {
                    this.ul.append(
                        new View.Li(this.context)
                        .append(
                            new View.A(this.context)
                            .append(
                                "..."
                            )
                        ).attr("disabled", "disabled")
                    );
                }

                this.ul.append(
                    new View.Li(this.context)
                    .attr("id", "paginator-page-" + total)
                    .append(
                        new View.A(this.context)
                        .append(
                            pages
                        )
                    ).click(
                        fn
                    )
                );
            }
            this.setNext();

            var actualLi = this.getById("paginator-page-" + parseInt(actualPage));
            if (actualLi) {
                actualLi.class("active");
            }

            this.getDi().setPersistent(
                "lastPage",
                this.getDi().getPersistent("actualPage")
            );
        }

        /**
         *
         */
        public clickPage(element)
        {
            var obj = new View.ViewElement(element);
            obj.attr("class", "active");
            this.getDi().setPersistent(
                "actualPage",
                parseInt(obj.html())
            );

            this.getArgs()[0].clickPage();

            this.createPages();
        }
    }
}
