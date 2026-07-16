// Placeholder for EventBus
class EventBusClass {
  on() {}
  off() {}
  emit() {}
}
const EventBus = () => new EventBusClass();
export { EventBus };
export default EventBus();
