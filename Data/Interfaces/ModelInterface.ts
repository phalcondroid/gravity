
export interface ModelInterface
{
    insertUrl  : string;
    deleteUrl  : string;
    updateUrl  : string;
    findUrl    : string;
    state      : number;
    internalId : string;

    setSource(source : Object) : void;

    setFind(url   : string)   : void;
    setInsert(url : string) : void;
    setUpdate(url : string) : void;
    setDelete(url : string) : void;

    getFind()   : string;
    getInsert() : string;
    getUpdate() : string;
    getDelete() : string;
}
