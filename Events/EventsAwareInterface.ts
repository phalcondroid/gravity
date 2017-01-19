
/// <reference path="./ManagerInterface"/>

namespace Events
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
        getEventsManager() : Events.ManagerInterface;
    }
}
