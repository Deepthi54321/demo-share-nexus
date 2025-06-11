
import { sessionApi } from '../services/api';

export const updateSessionsWithAttendees = async () => {
  try {
    // Update the Python session with 25 attendees (out of 53 max)
    await sessionApi.update('0c0f21c4-5202-41b3-9a31-981bd411a1cd', {
      attendees: 25
    });

    // Update the Vue.js session with 6 attendees (out of 8 max)
    await sessionApi.update('76c02371-26bc-4c0d-a5c8-d9504668cffc', {
      attendees: 6
    });

    // Update the JavaScript session with 3 attendees (out of 5 max)
    await sessionApi.update('eaef719b-2689-46bc-b901-bff4f318f778', {
      attendees: 3
    });

    console.log('Successfully updated sessions with attendee data');
  } catch (error) {
    console.error('Error updating sessions:', error);
  }
};
