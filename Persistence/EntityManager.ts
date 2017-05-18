
/// <reference path="../Reflection/Reflection.ts" />
/// <reference path="../Service/Container.ts" />
/// <reference path="../Model/StaticModel.ts" />
/// <reference path="../Model/AjaxModel.ts" />
/// <reference path="../Network/Ajax.ts" />
/// <reference path="./UnitOfWork.ts" />
/// <reference path="./Hydrator.ts" />
/// <reference path="./Filter.ts" />

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

        /**
         * Entity manager is a class
         */
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
         * @param model 
         * @param params 
         */
        public find(model : any, params : Object = {})
        {
            this.setWhenIsModel(
                model,
                params,
                "find"
            );
            return this;
        }

        /**
         * 
         * @param model 
         * @param params 
         */
        public findOne(model : any, params : Object = {})
        {
            this.setWhenIsModel(
                model,
                params,
                "findOne"
            );
            return this;
        }

        /**
         * 
         * @param model 
         * @param params 
         */
        public count(model : any, params : Object = {})
        {
            this.setWhenIsModel(
                model,
                params,
                "count"
            );
            return this;
        }

        /**
         *
         */
        public setWhenIsModel(model, params, type)
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
                type
            );

            if (objModel instanceof ModelData.RawModel) {
                var callAjax = false;
                
                if (objModel instanceof ModelData.AjaxModelPersistent) {
                    if (objModel.getAjaxInit() === null) {
                        this.callAjax(objModel, type, params);
                    }
                } else if (objModel instanceof ModelData.AjaxModel) {
                    this.callAjax(objModel, type, params);
                }
            } else {
                throw "Model must be instance of RawModel";
            }
        }

        private callAjax(objModel : any, type, params)
        {
            this.ajax = new Network.Ajax();
            this.ajax.setDi(this.getDi());

            var url = objModel.getFindUrl();
            if (url == null) {
                url = this.getDi().get("url").get("baseUrl") +
                objModel.getClassName() +
                type;
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

            if (type == "save") {

                this.ajax.response(function (response) {

                    return fn(this.setResponse(
                        response,
                        type,
                        model
                    ));

                }.bind(this));

                this.ajax.send();

            } else {

                if (type == "find" || type == "findOne" || type == "count") {
                    var params = this.getContainer()
                        .get("transactionParams");
                }

                this.checkModel(
                    fn,
                    type,
                    model,
                    objModel,
                    params
                );
            }

            return this;
        }

        /**
         *
         */
        public checkModel(fn, type, model, objModel, params)
        {
            if (objModel instanceof ModelData.AjaxModelPersistent) {
                let data = objModel.getData();
                if (objModel.getAjaxInit() == null) {
                    this.setResponseAjax(
                        fn,
                        type,
                        model,
                        objModel,
                        params
                    );
                } else {
                    this.setResponseStatic(
                        fn,
                        objModel,
                        type,
                        model,
                        params
                    );
                }
            } else {
                if (objModel instanceof ModelData.AjaxModel) {
                    this.setResponseAjax(
                        fn,
                        type,
                        model,
                        objModel,
                        params
                    );
                } else {
                    if (objModel instanceof ModelData.StaticModel) {
                        this.setResponseStatic(
                            fn,
                            objModel,
                            type,
                            model,
                            params
                        );
                    }
                }
            }
        }

        /**
         *
         */
        private setResponseAjax(fn, type, model, objModel, params)
        {
            this.ajax.response(function (response) {
                return fn(this.setResponse(
                    response,
                    objModel,
                    type,
                    model,
                    params
                ));
            }.bind(this));
            this.ajax.send();
        }

        /**
         *
         */
        public setResponseStatic(fn, objModel, type, model, params)
        {
            fn(this.setResponse(
                objModel.getData(),
                objModel,
                type,
                model,
                params
            ));
        }

        /**
         *
         */
        private setResponse(data, objModel, type, model, params)
        {
            let resultSet : any = new Array();

            switch (type) {
                case "count":
                case "findOne":
                        resultSet = this.getResultSet(
                            data,
                            params,
                            model,
                            objModel
                        );
                        if (resultSet != false) {
                            resultSet = resultSet[0];
                        }
                    break;
                case "find":
                        resultSet = this.getResultSet(
                            data,
                            params,
                            model,
                            objModel
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
        private getResultSet(response, params, model, objModel)
        {
            let resultSet : any = new Array();
            let hydrator = new Hydrator;

            let filters  = new Filter;
            filters.buildCondition(params);

            var data = new Array();
            if (objModel instanceof ModelData.AjaxModelPersistent) {
                if (objModel.getAjaxInit() == null) {
                    objModel.setAjaxInit(true);
                    objModel.setData(response);
                }
                data = filters.getMultipleRowValues(
                    response,
                    false
                );
            } else if (objModel instanceof ModelData.AjaxModel) {
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
