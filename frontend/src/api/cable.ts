import { createConsumer } from '@rails/actioncable';

// Connect to the cable endpoint. Ensure backend is running and correct URL.
const cable = createConsumer('ws://localhost:3000/cable');

export default cable;
