namespace ModelData
{
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
