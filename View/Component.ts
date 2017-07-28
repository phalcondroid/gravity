
namespace View {
    export class Component implements Service.InjectionAwareInterface
    {
        di;
        public constructor(name)
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