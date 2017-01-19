
namespace Events
{
    export class Manager implements ManagerInterface
    {
        private events : Object = {};

        public attach(controller, event)
        {
            this.events[controller][event];
        }

        public detach(controller, event)
        {
            this.events[controller][event];
        }

        public detachAll()
        {

        }

        public fire(controller, event, callback)
        {
            
        }

        public getListeners()
        {

        }
    }
}
