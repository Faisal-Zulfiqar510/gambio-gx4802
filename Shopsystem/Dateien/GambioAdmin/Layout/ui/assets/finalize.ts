import {LAYOUT_BOOTSTRAPPED} from 'layout/events';

export default () => {
	window.dispatchEvent(new Event(LAYOUT_BOOTSTRAPPED))
};
