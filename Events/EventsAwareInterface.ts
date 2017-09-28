
/// <reference path="./EventManagerInterface.ts"/>

namespace Gravity.Events
{
    export interface EventsAwareInterface
    {
        /**
    	 * Sets the events manager
    	 */
    	setEventsManager(eventsManager);

    	/**
    	 * Returns the internal event manager
    	 */
        getEventsManager() : Gravity.Events.ManagerInterface;
    }
}
