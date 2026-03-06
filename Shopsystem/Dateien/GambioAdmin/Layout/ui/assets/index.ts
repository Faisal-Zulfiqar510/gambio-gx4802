import LayoutDescriptor from './scripts/LayoutDescriptor';
import LayoutSections from './scripts/Layout/LayoutSections';
import LayoutEventListener from './scripts/Layout/LayoutEventListener';
import ToggleMenuListener from './scripts/Layout/EventListener/ToggleMenuListener';
import FooterStateListener from './scripts/Layout/EventListener/FooterStateListener';
import DevelopmentModeListener from './scripts/Layout/EventListener/DevelopmentModeListener';
import FavoritesListener from './scripts/Layout/EventListener/FavoritesListener';
import ContentHeaderScrollListener from './scripts/Layout/EventListener/ContentHeaderScrollListener';

import LayoutBootstrapper from 'layout/scripts/LayoutBootstrapper';
import Window from './scripts/Window';
import Header from './scripts/Header';
import Search from './scripts/Search';
import Menu from './scripts/Menu';
import Footer from './scripts/Footer';
import InfoBox from './scripts/InfoBox';
import finalize from './finalize';

import {safeQuerySelector} from 'core/dom';

import './styles/main.scss';
import SessionKeepAliveListener from "layout/scripts/Layout/EventListener/SessionKeepAliveListener";

async function boot(bootstrapperCollection: Array<LayoutBootstrapper>): Promise<void> {
    const promises: Array<Promise<void>> = [];
    
    bootstrapperCollection.forEach((bootstrapper: LayoutBootstrapper): void => {
        promises.push(bootstrapper.boot());
    });
    
    await Promise.all(promises);
}


const containerElement = safeQuerySelector('.gx-admin');
const headerElement = safeQuerySelector('.gx-admin-header');
const menuElement = safeQuerySelector('.gx-admin-menu');
const contentElement = safeQuerySelector('.gx-admin-content');
const footerElement = safeQuerySelector('.gx-admin-footer');

const sections = new LayoutSections(containerElement, headerElement, menuElement, contentElement, footerElement);

const footerStateListener = new FooterStateListener(sections);
const toggleMenuListener = new ToggleMenuListener(sections);
const developmentModeListener = new DevelopmentModeListener(sections);
const favoritesListener = new FavoritesListener(sections);
const contentHeaderListener = new ContentHeaderScrollListener(sections);
const sessionKeepAlive = new SessionKeepAliveListener();
const listener = new LayoutEventListener(
    footerStateListener,
    toggleMenuListener,
    developmentModeListener,
    favoritesListener,
    contentHeaderListener,
    sessionKeepAlive
);

const layoutDescriptor: LayoutDescriptor = {
    sections,
    listener
};

const window = new Window(layoutDescriptor);
const header = new Header(layoutDescriptor);
const search = new Search(layoutDescriptor);
const menu = new Menu(layoutDescriptor);
const footer = new Footer(layoutDescriptor);
const infoBox = new InfoBox(layoutDescriptor);

boot([
    window,
    header,
    search,
    menu,
    footer,
    infoBox
]).then(() => {
    finalize();
});
