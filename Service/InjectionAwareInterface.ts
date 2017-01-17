namespace Service
{
    export interface InjectionAwareInterface
    {
        di       : Service.Container;
        setDi(di : Service.Container);
        getDi()  : Service.Container;
    }
}
