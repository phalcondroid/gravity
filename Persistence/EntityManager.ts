
/// <reference path="../Reflection/Reflection" />
/// <reference path="../Service/Container" />
/// <reference path="../Model/SimpleModel" />
/// <reference path="../Model/AjaxModel" />
/// <reference path="../Network/Ajax" />
/// <reference path="./UnitOfWork" />
/// <reference path="./Hydrator" />
/// <reference path="./Filter" />

namespace Persistence
{
    export class EntityManager implements EntityManagerInterface
    {
        di                 : Service.Container;
        uow                : UnitOfWork;
        private container  : Service.Container   = null;
        private ajax       : Network.Ajax        = null;
        private hydrator   : Hydrator   = null;
        private source     : string;
        private model      : Object;
        private fnResponse : Function;
        private resultSet  : any;

        public constructor()
        {
            this.uow = new UnitOfWork;
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
        public find(context, model : any, params : Object = {})
        {
            this.ajax = new Network.Ajax();
            this.ajax.setContext(context);
            this.ajax.setDi(this.getDi());

            this.getContainer()
                .set("transactionModel", model);

            this.getContainer()
                .set("transactionParams", params);

            this.ajax.set(
                "transactionType",
                "find"
            );

            let objModel = new model();
            var url = objModel.getFindUrl();
            if (url == null) {
                url = this.getDi().get("url").get("baseUrl") +
                objModel.getClassName() +
                "/find";
            }
            this.ajax.setUrl(
                url
            );

            this.ajax.setParams(
                params
            );

            this.ajax.setMethod(
                objModel.getMethod()
            );

            return this;
        }

        /**
         *
         */
        public findOne(context, model : any, params : Object = {})
        {
            this.ajax = new Network.Ajax();
            this.ajax.setContext(context);
            this.ajax.setDi(this.getDi());

            this.getContainer()
                .set("transactionModel", model);

            this.getContainer()
                .set("transactionParams", params);

            this.ajax.set(
                "transactionType",
                "findOne"
            );

            let objModel = new model();

            var url = objModel.getFindUrl();
            if (url == null) {
                url = this.getDi().get("url").get("baseUrl") +
                objModel.getClassName() +
                "/findOne";
            }
            this.ajax.setUrl(
                url
            );
            this.ajax.setParams(
                params
            );
            this.ajax.setMethod(
                objModel.getMethod()
            );

            return this;
        }

        private getResultSet(response, params, model)
        {
            let resultSet : any = new Array();
            let hydrator = new Hydrator;

            let filters  = new Filter;
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
        public save(context, model : any)
        {
            this.ajax = new Network.Ajax();
            this.ajax.setContext(context);
            this.ajax.setDi(this.getDi());

            this.getContainer()
                .set("transactionModel", model);

            this.getContainer()
                .set("transactionObjectModel", model);

            this.ajax.set(
                "transactionType",
                "save"
            );

            var modelName = model.getClassName();

            switch (model.state) {
                case UnitOfWork.NEW:
                        var url = model.getInsertUrl();
                        if (url == null) {
                            url = this.getDi().get("url").get("baseUrl")+
                            modelName +
                            "/insert";
                        }
                        this.ajax.setUrl(
                            url
                        );
                    break;
                case UnitOfWork.CREATED:
                        var url = model.getUpdateUrl();
                        if (url == null) {
                            url = this.getDi().get("url").get("baseUrl") +
                            modelName +
                            "/update";
                        }
                        this.ajax.setUrl(
                            url
                        );
                    break;
            }

            var reflection = new Reflection.Reflection();
            var attrsAsString = JSON.stringify(
                reflection.getAtttributeAsObjects(model)
            );
            var objParams = {};
            objParams[modelName] = attrsAsString;

            this.ajax.setParams(objParams);

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

            var type = this.ajax.get("transactionType");

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

                    return fn(resultSet);

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

        find(conext,      model : Model.RawModel, params : Object);
        findOne(context,  model : Model.RawModel, params : Object);
        count(context,    model : Model.RawModel, params : Object);
        distinct(context, model : Model.RawModel, params : Object);
        group(context,    model : Model.RawModel, params : Object);
        save(context,     model : Model.RawModel);
        delete(context,   model : Model.RawModel);
        forget();
        flush();
        purge();
        reset();
    }
}
