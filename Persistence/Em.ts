
/// <reference path="./UnitOfWork" />
/// <reference path="../Network/Network" />
/// <reference path="../Data/Data" />
/// <reference path="./Criteria" />
/// <reference path="./Hydrator" />

namespace Em
{
    export class EntityManager implements EntityManagerInterface
    {
        di                 : Service.Container;
        uow                : UnitOfWork.UnitOfWork;
        private container  : Service.Container = null;
        private ajax       : Network.Ajax      = null;
        private hydrator   : Hydrator.Hydrator = null;
        private source     : string;
        private model      : Object;
        private fnResponse : any[] = new Array;
        private resultSet  : any;

        public constructor()
        {
            this.uow = new UnitOfWork.UnitOfWork;
        }

        /**
         *
         */
        private getContainer()
        {
            if (this.container == null) {
                this.container = this.getDi().get("container");
            }
            return this.container;
        }

        /**
         *
         */
        public find(model : any, params : Object = {})
        {
            this.ajax = new Network.Ajax();

            this.getContainer()
                .set("transactionModel", model);

            this.getContainer()
                .set("transactionParams", params);

            this.ajax.setContainer(
                "transactionType",
                "find"
            );

            let objModel = new model();
            this.ajax.setUrl(
                objModel.getFindUrl()
            );
            this.ajax.setParams(
                objModel.getParams()
            );
            this.ajax.setMethod(
                objModel.getMethod()
            );

            return this;
        }

        /**
         *
         */
        public findOne(model : any, params : Object = {})
        {

            this.ajax = new Network.Ajax();

            this.getContainer()
                .set("transactionModel", model);

            this.getContainer()
                .set("transactionParams", params);

            this.ajax.setContainer(
                "transactionType",
                "findOne"
            );

            let objModel = new model();
            this.ajax.setUrl(
                objModel.getFindUrl()
            );
            this.ajax.setParams(
                objModel.getParams()
            );
            this.ajax.setMethod(
                objModel.getMethod()
            );

            return this;
        }

        private getResultSet(response, params, model)
        {
            let resultSet : any = new Array();
            let hydrator = new Hydrator.Hydrator;

            let filters  = new Criteria.Filters;
            filters.buildCondition(params);

            let data = filters.getMultipleRowValues(
                response
            );

            for (let key in data) {
                let newModel = hydrator.hydrate(
                    model,
                    data[key]
                );
                resultSet.push(
                    newModel
                );
            }

            if (resultSet.length == 0) {
                resultSet = false;
            }

            return resultSet;
        }

        /**
         *
         */
        public save(model : any)
        {
            this.ajax = new Network.Ajax();

            this.getContainer()
                .set("transactionModel", model);

            this.getContainer()
                .set("transactionObjectModel", model);

            this.ajax.setContainer(
                "transactionType",
                "save"
            );

            switch (model.state) {
                case UnitOfWork.UnitOfWork.NEW:
                        this.ajax.setUrl(
                            model.getInsertUrl()
                        );
                    break;
                case UnitOfWork.UnitOfWork.CREATED:
                        this.ajax.setUrl(
                            model.getUpdateUrl()
                        );
                    break;
            }

            this.ajax.setParams(
                model.getParams()
            );
            this.ajax.setMethod(
                model.getMethod()
            );

            return this;
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
        public response(fn : Function)
        {

            var model  = this.getContainer()
                .get("transactionModel");

            var type = this.ajax.getContainer("transactionType");

            if (type == "find" || type == "findOne") {
                var params = this.getContainer()
                    .get("transactionParams");
            }

            this.ajax.response(function (response) {

                    let resultSet : any = new Array();

                    switch (type) {
                        case "findOne":
                                resultSet = this.getResultSet(
                                    response,
                                    params,
                                    model
                                );
                                if (resultSet != false) {
                                    resultSet = resultSet[0];
                                }
                            break;
                        case "find":
                                resultSet = this.getResultSet(
                                    response,
                                    params,
                                    model
                                );
                            break;
                        case "save":
                                resultSet = response;
                                
                            break;
                    }

                    fn(resultSet).bind(this);

            }.bind(this));

            this.ajax.send();

            return this;
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

        public checksum(obj)
        {
            var keys = Object.keys(obj).sort();
            var output = [], prop;
            for (var i = 0; i < keys.length; i++) {
                prop = keys[i];
                output.push(prop);
                output.push(obj[prop]);
            }
            return JSON.stringify(output);
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
