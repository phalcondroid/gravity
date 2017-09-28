namespace Gravity.Events
{
    export interface ManagerInterface
    {
        /**
         * Attach a listener to the events manager
         *
         * @param string eventType
         * @param object|callable handler
         */
        attach(controller, event);

        /**
         * Detach the listener from the events manager
         *
         * @param string eventType
         * @param object handler
         */
        detach(eventType, handler);

        /**
         * Removes all events from the EventsManager
         */
        detachAll(controller);

        /**
         * Fires an event in the events manager causing the active listeners
         */
        fire(controller, event, callback);

        /**
         * Returns all the attached listeners of a certain type
         *
         * @param string type
         * @return array
         */
        getListeners(type);
    }
}
