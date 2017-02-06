
/// <reference path="./RawModel"/>

namespace Model
{
    export class AjaxModel extends RawModel implements ModelInterface
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
}
