
import { Data } from "../../Data/Model";

export interface EntityManagerInterface
{
    uow : Object;

    getData(mode   : Data.Model) : any[];
    find(model     : Data.Model, params : Object);
    findOne(model  : Data.Model, params : Object);
    count(model    : Data.Model, params : Object);
    distinct(model : Data.Model, params : Object);
    group(model    : Data.Model, params : Object);
    save(model     : Data.Model);
    delete(model   : Data.Model);
    forget();
    flush();
    purge();
    reset();
}
