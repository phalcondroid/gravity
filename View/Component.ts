
namespace Gravity.View 
{
    export class Component implements Service.InjectionAwareInterface
    {
        di;
        public constructor(context)
        {
            
        }

        public setDi(di)
        {
            this.di = di;
        }

        public getDi()
        {
            return this.di;
        }
    }
}