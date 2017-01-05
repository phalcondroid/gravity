import { InjectionAwareInterface } from "../../di/InjectionAwareInterface";

export interface EntityManagerInterface extends InjectionAwareInterface
{
    uow : Object;

    find(model : Object, params : Object) : any[];
    findOne()  : Object;
    count()    : number;
    distinct() : Object;
    group()    : Object;
    save()     : boolean;
    delete()   : boolean;
    purge()    : boolean;
    forget()   : boolean;
    reset()    : boolean;
}
