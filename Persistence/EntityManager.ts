
/// <reference path="../Reflection/Reflection" />
/// <reference path="../Service/Container" />
/// <reference path="../Model/StaticModel" />
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
        public find(model : any, params : Object = {})
        {
            let objModel = new model();

            this.getContainer()
                .set("transactionModel", model);

            this.getContainer()
                .set("transactionObjModel", objModel);

            this.getContainer()
                .set("transactionParams", params);

            this.getContainer()
                .set(
                "transactionType",
                "find"
            );

            if (objModel instanceof ModelData.RawModel) {

                if (objModel instanceof ModelData.AjaxModel) {

                    this.ajax = new Network.Ajax();
                    this.ajax.setDi(this.getDi());

                    var url = objModel.getFindUrl();
                    if (url == null) {
                        url = this.getDi().get("url").get("baseUrl") +
                        objModel.getClassName() +
                        "Find";
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

                }
            }

            return this;
        }

        /**
         *
         */
        public findOne(model : any, params : Object = {})
        {

            let objModel = new model();

            this.getContainer()
                .set("transactionModel", model);

            this.getContainer()
                .set("transactionObjModel", objModel);

            this.getContainer()
                .set("transactionParams", params);

            this.getContainer().set(
                "transactionType",
                "findOne"
            );

            if (objModel instanceof ModelData.RawModel) {

                if (objModel instanceof ModelData.AjaxModel) {

                    this.ajax = new Network.Ajax();
                    this.ajax.setDi(this.getDi());

                    var url = objModel.getFindUrl();
                    if (url == null) {
                        url = this.getDi().get("url").get("baseUrl") +
                        objModel.getClassName() +
                        "FindOne";
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
                    this.ajax.set(
                        "transactionType",
                        "findOne"
                    );

                } else if (objModel instanceof ModelData.StaticModel) {

                }

            } else {
                throw "Not valid model";
            }
            return this;
        }

        /**
         *
         */
        private getResultSet(response, params, model)
        {
            let resultSet : any = new Array();
            let hydrator = new Hydrator;

            let filters  = new Filter;
            filters.buildCondition(params);

            var data = new Array();
            if ((new model) instanceof ModelData.AjaxModel) {
                data = filters.getMultipleRowValues(
                    response,
                    false
                );
            } else {
                data = filters.getMultipleRowValues(
                    response
                );
            }

            var i = 0;
            for (let key in data) {

                let newModel = hydrator.hydrate(
                    model,
                    data[key]
                );

                if (newModel instanceof ModelData.StaticModel) {
                    newModel.setIndex(i);
                }

                resultSet.push(
                    newModel
                );
                i++;
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
            this.getContainer()
                .set(
                    "transactionModel",
                    model
                );

            this.getContainer()
                .set(
                    "transactionObjectModel",
                    model
                );

            this.getContainer()
                .set(
                    "transactionType",
                    "save"
                );

            if (model instanceof ModelData.AjaxModel) {

                this.ajax = new Network.Ajax();
                this.ajax.setDi(this.getDi());

                var modelName = model.getClassName();

                switch (model.state) {
                    case UnitOfWork.NEW:
                            var url = model.getInsertUrl();
                            if (url == null) {
                                url = this.getDi().get("url").get("baseUrl")+
                                modelName +
                                "Insert";
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
                                "Update";
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

                this.ajax.send();

            } else if (model instanceof ModelData.StaticModel) {
                switch (model.state) {
                    case UnitOfWork.NEW:
                            let tempData = model.getData();
                        break;
                    case UnitOfWork.CREATED:

                        break;
                }
            }

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

            var objModel  = this.getContainer()
                .get("transactionObjModel");

            var type =  this.getContainer()
                .get("transactionType");

            if (type == "find" || type == "findOne") {
                var params = this.getContainer()
                    .get("transactionParams");
            }

            if (objModel instanceof ModelData.AjaxModel) {


                this.ajax.response(function (response) {

                    return fn(this.setResponse(
                        response,
                        type,
                        model,
                        params
                    ));

                }.bind(this));

                this.ajax.send();

            } else {
                if (objModel instanceof ModelData.StaticModel) {
                    fn(this.setResponse(
                        objModel.getData(),
                        type,
                        model,
                        params
                    ));
                }
            }

            return this;
        }

        /**
         *
         */
        private setResponse(data, type, model, params)
        {
            let resultSet : any = new Array();

            switch (type) {
                case "findOne":
                        resultSet = this.getResultSet(
                            data,
                            params,
                            model
                        );
                        if (resultSet != false) {
                            resultSet = resultSet[0];
                        }
                    break;
                case "find":
                        resultSet = this.getResultSet(
                            data,
                            params,
                            model
                        );
                    break;
                case "save":
                        resultSet = data;
                    break;
            }
            return resultSet;
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

        find(conext,      model : ModelData.RawModel, params : Object);
        findOne(context,  model : ModelData.RawModel, params : Object);
        count(context,    model : ModelData.RawModel, params : Object);
        distinct(context, model : ModelData.RawModel, params : Object);
        group(context,    model : ModelData.RawModel, params : Object);
        save(context,     model : ModelData.RawModel);
        delete(context,   model : ModelData.RawModel);
        forget();
        flush();
        purge();
        reset();
    }
}
