import LayoutEventListener from './Layout/LayoutEventListener';
import LayoutSections from './Layout/LayoutSections';

export default interface LayoutDescriptor {
	sections: LayoutSections;
	listener: LayoutEventListener;
}