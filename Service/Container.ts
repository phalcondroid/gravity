
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
}
