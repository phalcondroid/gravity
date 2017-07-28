/// <reference path="../Persistence/EntityManager.ts" />
/// <reference path="../Persistence/Hydrator.ts" />
/// <reference path="../Network/Ajax.ts" />

namespace Service
{
    export class FactoryDefault extends Service.Container
    {
        public constructor()
        {
            super();
            this.set("ajax",      new Network.Ajax);
            this.set("container", new Service.Container);

            var em = new Persistence.EntityManager;
            em.setDi(this);

            this.set("em", em);
        }
    }
}
