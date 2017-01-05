
import { InjectionAwareInterface } from "../Service/InjectionAwareInterface";
import { Service } from "../Service/Service";

export namespace Logic
{
    export class Controller implements InjectionAwareInterface
    {

        private di;

        public constructor()
        {
            
        }

        public setDi(di : Service.Locator)
        {
            this.di = di;
        }

        public getDi()
        {
            return this.di;
        }
    }
}
