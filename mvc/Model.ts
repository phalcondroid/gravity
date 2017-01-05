import { ModelInterface } from "./Interfaces/ModelInterface";

export class Model implements ModelInterface
{

    source     : string;
    insertUrl  : string;
    deleteUrl  : string;
    updateUrl  : string;
    findUrl    : string;
    state      : number;
    internalId : string;

    public constructor()
    {

    }

    public setSource(urls : any)
    {
        this.setInsert(urls.insert);
        this.setUpdate(urls.insert);
        this.setInsert(urls.insert);
        this.setFind(urls.insert);
    }

    public setInsert(url : string)
    {
        this.insertUrl = url;
    }

    public setFind(url : string)
    {
        this.findUrl = url;
    }

    public setDelete(url : string)
    {
        this.deleteUrl = url;
    }

    public setUpdate(url : string)
    {
        this.updateUrl = url;
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
}
