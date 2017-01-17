
namespace Persistence
{
    export class UnitOfWork
    {
        public static NEW = 1;
        public static CREATED   = 2;
        public static DELETED   = 3;

        private detached : string[];
        private updated  : string[];
        private deleted  : string[];

        public constructor()
        {

        }
    }
}
