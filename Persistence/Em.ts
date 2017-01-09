/// <reference path="../Network/Network" />
/// <reference path="../Data/Data" />

namespace Em
{
    export class EntityManager implements EntityManagerInterface
    {
        di                 : Service.Container;
        uow                : Object;
        private container  : Service.Container = null;
        private ajax       : Network.Ajax      = null;
        private hydrator   : Hydrator.Hydrator = null;
        private source     : string;
        private model      : Object;
        private fnResponse : Function;
        private resultSet  : any;

        /**
         *
         */
        private getAjax()
        {
            if (this.ajax == null) {
                this.ajax = this.getDi().get("Network.Ajax");
            }
            return this.ajax;
        }

        /**
         *
         */
        private getContainer()
        {
            if (this.container == null) {
                this.container = this.getDi().get("Service.Container");
            }
            return this.container;
        }

        private getHydrator()
        {
            if (this.hydrator == null) {
                this.hydrator = this.getDi().get("Hydrator.Hydrator");
            }
            return this.hydrator;
        }

        /**
         *
         */
        public initAjax(uninitModel : any)
        {
            var model = new uninitModel();
            this.getAjax().setUrl(
                model.getFindUrl()
            );
            this.getAjax().setParams(
                model.getParams()
            );
            this.getAjax().setMethod(
                model.getMethod()
            );
        }

        /**
         *
         */
        public find(model : Data.ModelAjax, params : Object)
        {
            this.initAjax(model);

            this.getContainer()
                .set("findModel", model);

            this.getContainer()
                .set("modelParams", params);

            return this;
        }

        /**
         *
         */
        public response(fn : Function)
        {
            var params = this.getContainer()
                .get("modelParams");

            this.getAjax()
                .response(function (response) {

                    var filters = this.getDi().get("Criteria.Filters");
                    filters.buildCondition(params);
                    var data = filters.getMultipleRowValues(
                        response
                    );

                    var resultSet : any = new Array();

                    for (let key in data) {
                        resultSet.push(
                            this.getHydrator().hydrate(
                                this.getContainer().get("findModel"),
                                data[key]
                            )
                        );
                    }

                    if (resultSet.length == 0) {
                        resultSet = false;
                    }

                    fn(resultSet);

                }.bind(this));

            this.getAjax()
                .send();

            return this;
        }

        /**
         *
         */
        public findOne(model : Data.ModelAjax, params : Object)
        {
            return {};
        }

        /**
         *
         */
        public update()
        {
            return false;
        }

        /**
         *
         */
        public delete()
        {
            return false;
        }

        /**
         *
         */
        public save()
        {
            return false;
        }

        /**
         *
         */
        public flush()
        {
            return false;
        }

        /**
         *
         */
        public reset()
        {
            return false;
        }

        /**
         *
         */
        public group()
        {
            return {};
        }

        /**
         *
         */
        public distinct()
        {
            return {};
        }

        /**
         *
         */
        public count()
        {
            return 0;
        }

        /**
         *
         */
        public purge()
        {
            return false;
        }

        /**
         *
         */
        public forget()
        {
            return false;
        }

        public setDi(di : Service.Container)
        {
            this.di = di;
        }

        public getDi()
        {
            return this.di;
        }
    }

    export interface EntityManagerInterface extends Service.InjectionAwareInterface
    {
        uow : Object;

        find(model     : Data.ModelAjax, params : Object);
        findOne(model  : Data.ModelAjax, params : Object);
        count(model    : Data.ModelAjax, params : Object);
        distinct(model : Data.ModelAjax, params : Object);
        group(model    : Data.ModelAjax, params : Object);
        save(model     : Data.ModelAjax);
        delete(model   : Data.ModelAjax);
        forget();
        flush();
        purge();
        reset();
    }
}
