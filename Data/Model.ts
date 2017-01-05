import { ModelInterface } from "./Interfaces/ModelInterface";

export namespace Data
{
    export class Model implements ModelInterface
    {

        source        : string;
        insertUrl     : string;
        deleteUrl     : string;
        updateUrl     : string;
        findUrl       : string;
        params        : Object;
        state         : number;
        internalId    : string;
        fnInit        : Function = function () {};
        fnBefInsert   : Function = function () {};
        fnBefUpdate   : Function = function () {};
        fnBefDelete   : Function = function () {};
        fnBefFind     : Function = function () {};
        method        : string = "POST";

        public constructor()
        {
            this.fnInit();
        }

        public initialize(fn : Function)
        {
            this.fnInit = fn.bind(this);
        }

        public beforeInsert(fn : Function)
        {
            this.fnBefInsert = fn.bind(this);
        }

        public beforeFind(fn : Function)
        {
            this.fnBefFind = fn.bind(this);
        }

        public beforeUpdate(fn : Function)
        {
            this.fnBefUpdate = fn.bind(this);
        }

        public beforeDelete(fn : Function)
        {
            this.fnBefDelete = fn.bind(this);
        }

        public setSource(data : any)
        {
            this.setInsert(data.insert);
            this.setUpdate(data.update);
            this.setInsert(data.insert);
            this.setFind(data.insert);
        }

        public setInsert(url : string)
        {
            this.insertUrl    = url;
        }

        public setFind(url : string)
        {
            this.findUrl    = url;
        }

        public setDelete(url : string)
        {
            this.deleteUrl    = url;
        }

        public setUpdate(url : string)
        {
            this.updateUrl    = url;
        }

        public getInsert()
        {
            return this.insertUrl;
        }

        public getFind()
        {
            return this.insertUrl;
        }

        public getDelete()
        {
            return this.deleteUrl;
        }

        public getUpdate()
        {
            return this.updateUrl;
        }

        public setParams(params : Object)
        {
            this.params = params;
        }

        public getParams()
        {
            return this.params;
        }

        public setMethod(method : string)
        {
            this.method = method;
        }

        public getMethod()
        {
            return this.method;
        }
    }
}
