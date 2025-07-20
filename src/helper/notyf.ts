import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
  duration: 4000, // Duration in milliseconds
  position: { x: 'right', y: 'top' }, // Position of notifications
  ripple: true,
});

const showSuccess = (message: string) => {
  notyf.success(message);
};

const showError = (message: string) => {
  notyf.error(message);
};

export { showError, showSuccess }
