import { DependencyInjector }     from "../di/DependencyInjector";
import { EntityManagerInterface } from "./interfaces/EntityManagerInterface";

export class EntityManager implements EntityManagerInterface
{

    private di     : DependencyInjector;
    private source : string;
    private model  : Object;
    uow            : Object;

    public constructor()
    {

    }

    public find(model : Object, params : Object)
    {
        return [];
    }

    public findOne()
    {
        return {};
    }

    public update()
    {
        return false;
    }

    public delete()
    {
        return false;
    }

    public save()
    {
        return false;
    }

    public flush()
    {
        return false;
    }

    public reset()
    {
        return false;
    }

    public group()
    {
        return {};
    }

    public distinct()
    {
        return {};
    }

    public count()
    {
        return 0;
    }

    public purge()
    {
        return false;
    }

    public forget()
    {
        return false;
    }

    public setDi(dependencyInjector : DependencyInjector)
    {
        this.di = dependencyInjector;
    }

    public getDi()
    {
        return this.di;
    }
}
