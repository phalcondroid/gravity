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

    export class Scope
    {
        public static LOCAL       = 0;
        public static DEV         = 1;
        public static TEST        = 2;
        public static QA          = 3;
        public static STAGING     = 4;
        public static PRODUCTION  = 5;
    }
}
