namespace Gravity
{
    export class EventManager
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