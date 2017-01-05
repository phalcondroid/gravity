
import { Data }    from "../Data/Model";
import { Network } from "../Network/Ajax";
import { EntityManagerInterface } from "./interfaces/EntityManagerInterface";

export namespace Persistence
{
    export class EntityManager implements EntityManagerInterface
    {
        private source     : string;
        private model      : Object;
        private fnResponse : Function;
        uow                : Object;

        public constructor()
        {

        }

        getData(model : Data.Model)
        {
            return [];
        }

        public initAjax(model : Data.Model)
        {
            var ajax = new Network.Ajax();
            ajax.setUrl(model.getFind());
            ajax.setParams(model.getFindParams());
            ajax.setMethod(model.getMethod());
            return ajax;
        }

        private findFilter(data, params : Object)
        {
            
        }

        public find(model : Data.Model, params : Object)
        {
            var ajax = this.initAjax(model);
            return this;
        }

        public response(fn : Function)
        {
            this.fnResponse = fn.bind(this);
        }

        public findOne(model : Object, params : Object)
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
    }
}
