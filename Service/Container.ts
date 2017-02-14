
namespace Service
{
    export class Container
    {
        private service    : any[] = [];

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
                serviceName,
                content
            );
        }

        public getPersistent(serviceName)
        {
            return sessionStorage.getItem(
                serviceName
            );
        }

    }
}
