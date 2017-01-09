
namespace UnitOfWork {
    export class UnitOfWork
    {
        static NEW = 1;
        static UPDATED = 2;
        static DELETED = 3;

        private detached : string[];
        private updated  : string[];
        private deleted  : string[];

        public constructor()
        {

        }
    }
}
