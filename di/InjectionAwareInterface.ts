import { DependencyInjector } from "./DependencyInjector";

export interface InjectionAwareInterface
{
    setDi(di : DependencyInjector);
    getDi()  : DependencyInjector;
}
