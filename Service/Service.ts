
/// <reference path="../Persistence/Criteria" />
/// <reference path="../Persistence/Hydrator" />
/// <reference path="../Network/Network" />
/// <reference path="../Persistence/Em" />
/// <reference path="../Errors/Errors" />

namespace Service
{
    export class Container
    {
        private service    : any[] = [];
        private persistent : string = "Gravity.Persistent.Session" + Helper.MathHelper.getUUID()

        public set(serviceName, content)
        {
            this.service[serviceName] = content;
        }

        public get(serviceName)
        {
            return this.service[serviceName];
        }

        public setPersistent(serviceName, content)
        {
            sessionStorage[this.persistent][serviceName][content];
        }

        public getPersistent(serviceName)
        {
            return sessionStorage[this.persistent][serviceName];
        }

    }

    export class FactoryDefault extends Service.Container
    {
        public constructor()
        {
            super();
            this.set("ajax",      new Network.Ajax);
            this.set("container", new Service.Container);

            var em = new Em.EntityManager;
            em.setDi(this);

            this.set("em", em);
        }
    }

    export interface InjectionAwareInterface
    {
        di       : Service.Container;
        setDi(di : Service.Container);
        getDi()  : Service.Container;
    }
}
