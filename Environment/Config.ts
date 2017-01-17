namespace Environment
{
    export class Config
    {
        private config : Object = {};

        /**
         *
         */
        public setConfig(config : Object, env : number = Scope.LOCAL)
        {
            this.config[env] = config;
        }

        /**
         *
         */
        public getConfig(env : number = Scope.LOCAL) : Object
        {
            return this.config[env];
        }
    }
}
