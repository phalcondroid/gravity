
namespace Data
{
    export class RawModel
    {

        state         : number = 1;

        public initialize()
        {
        }

        public beforeInsert()
        {
        }

        public beforeFind()
        {
        }

        public beforeUpdate()
        {
        }

        public beforeDelete()
        {
        }
    }

    export class ModelAjax extends RawModel implements ModelInterface
    {

        source        : string;
        insertUrl     : string = null;
        deleteUrl     : string = null;
        updateUrl     : string = null;
        findUrl       : string = null;
        params        : Object;
        internalId    : string;
        method        : string = "POST";

        public constructor()
        {
            super();
            this.initialize();
        }

        public setSource(data : any)
        {
            this.setInsertUrl(data.find);
            this.setUpdateUrl(data.update);
            this.setInsertUrl(data.insert);
            this.setFindUrl(data.insert);
        }

        public getClassName() {
            let funcNameRegex = /function (.{1,})\(/;
            let results  = (funcNameRegex).exec(this["constructor"].toString());
            return (results && results.length > 1) ? results[1] : "";
        }

        public setInsertUrl(url : string)
        {
            this.insertUrl  = url;
        }

        public setFindUrl(url : string)
        {
            this.findUrl    = url;
        }

        public setDeleteUrl(url : string)
        {
            this.deleteUrl  = url;
        }

        public setUpdateUrl(url : string)
        {
            this.updateUrl  = url;
        }

        public getInsertUrl()
        {
            return this.insertUrl;
        }

        public getFindUrl()
        {
            return this.findUrl;
        }

        public getDeleteUrl()
        {
            return this.deleteUrl;
        }

        public getUpdateUrl()
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

    export class SimpleModel extends RawModel
    {

    }

    export class Deny
    {
        public static getDeny()
        {
            return [
                "state",
                "source",
                "insertUrl",
                "deleteUrl",
                "updateUrl",
                "findUrl",
                "params",
                "internalId",
                "method"
            ];
        }
    }

    export interface ModelInterface
    {
        insertUrl  : string;
        deleteUrl  : string;
        updateUrl  : string;
        findUrl    : string;
        state      : number;
        internalId : string;

        setSource(source : Object) : void;

        setFindUrl(url   : string)   : void;
        setInsertUrl(url : string) : void;
        setUpdateUrl(url : string) : void;
        setDeleteUrl(url : string) : void;

        getFindUrl()   : string;
        getInsertUrl() : string;
        getUpdateUrl() : string;
        getDeleteUrl() : string;
    }
}
