
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
            sessionStorage.setItem(
                this.persistent + serviceName,
                content
            );
        }

        public getPersistent(serviceName)
        {
            return sessionStorage.getItem(
                this.persistent + serviceName
            );
        }

    }
}
