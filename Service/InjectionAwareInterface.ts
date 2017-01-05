import { Service } from "./Service";

export interface InjectionAwareInterface
{
    setDi(di : Service.Locator);
    getDi()  : Service.Locator;
}
