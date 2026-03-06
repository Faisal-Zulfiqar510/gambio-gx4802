'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * File: iframeResizer.js
 * Desc: Force iframes to size to content.
 * Requires: iframeResizer.contentWindow.js to be loaded into the target frame.
 * Doc: https://github.com/davidjbradshaw/iframe-resizer
 * Author: David J. Bradshaw - dave@bradshaw.net
 * Contributor: Jure Mav - jure.mav@gmail.com
 * Contributor: Reed Dadoune - reed@dadoune.com
 */

;(function (window) {
    'use strict';

    var count = 0,
        logEnabled = false,
        hiddenCheckEnabled = false,
        msgHeader = 'message',
        msgHeaderLen = msgHeader.length,
        msgId = '[iFrameSizer]',
        //Must match iframe msg ID
    msgIdLen = msgId.length,
        pagePosition = null,
        requestAnimationFrame = window.requestAnimationFrame,
        resetRequiredMethods = { max: 1, scroll: 1, bodyScroll: 1, documentElementScroll: 1 },
        settings = {},
        timer = null,
        logId = 'Host Page',
        defaults = {
        autoResize: true,
        bodyBackground: null,
        bodyMargin: null,
        bodyMarginV1: 8,
        bodyPadding: null,
        checkOrigin: true,
        inPageLinks: false,
        enablePublicMethods: true,
        heightCalculationMethod: 'bodyOffset',
        id: 'iFrameResizer',
        interval: 32,
        log: false,
        maxHeight: Infinity,
        maxWidth: Infinity,
        minHeight: 0,
        minWidth: 0,
        resizeFrom: 'parent',
        scrolling: false,
        sizeHeight: true,
        sizeWidth: false,
        tolerance: 0,
        widthCalculationMethod: 'scroll',
        closedCallback: function closedCallback() {},
        initCallback: function initCallback() {},
        messageCallback: function messageCallback() {
            warn('MessageCallback function not defined');
        },
        resizedCallback: function resizedCallback() {},
        scrollCallback: function scrollCallback() {
            return true;
        }
    };

    function addEventListener(obj, evt, func) {
        /* istanbul ignore else */ // Not testable in PhantonJS
        if ('addEventListener' in window) {
            obj.addEventListener(evt, func, false);
        } else if ('attachEvent' in window) {
            //IE
            obj.attachEvent('on' + evt, func);
        }
    }

    function removeEventListener(el, evt, func) {
        /* istanbul ignore else */ // Not testable in phantonJS
        if ('removeEventListener' in window) {
            el.removeEventListener(evt, func, false);
        } else if ('detachEvent' in window) {
            //IE
            el.detachEvent('on' + evt, func);
        }
    }

    function setupRequestAnimationFrame() {
        var vendors = ['moz', 'webkit', 'o', 'ms'],
            x;

        // Remove vendor prefixing if prefixed and break early if not
        for (x = 0; x < vendors.length && !requestAnimationFrame; x += 1) {
            requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        }

        if (!requestAnimationFrame) {
            log('setup', 'RequestAnimationFrame not supported');
        }
    }

    function getMyID(iframeId) {
        var retStr = 'Host page: ' + iframeId;

        if (window.top !== window.self) {
            if (window.parentIFrame && window.parentIFrame.getId) {
                retStr = window.parentIFrame.getId() + ': ' + iframeId;
            } else {
                retStr = 'Nested host page: ' + iframeId;
            }
        }

        return retStr;
    }

    function formatLogHeader(iframeId) {
        return msgId + '[' + getMyID(iframeId) + ']';
    }

    function isLogEnabled(iframeId) {
        return settings[iframeId] ? settings[iframeId].log : logEnabled;
    }

    function log(iframeId, msg) {
        output('log', iframeId, msg, isLogEnabled(iframeId));
    }

    function info(iframeId, msg) {
        output('info', iframeId, msg, isLogEnabled(iframeId));
    }

    function warn(iframeId, msg) {
        output('warn', iframeId, msg, true);
    }

    function output(type, iframeId, msg, enabled) {
        if (true === enabled && 'object' === _typeof(window.console)) {
            console[type](formatLogHeader(iframeId), msg);
        }
    }

    function iFrameListener(event) {
        function resizeIFrame() {
            function resize() {
                setSize(messageData);
                setPagePosition(iframeId);
            }

            ensureInRange('Height');
            ensureInRange('Width');

            syncResize(resize, messageData, 'init');
        }

        function processMsg() {
            var data = msg.substr(msgIdLen).split(':');

            return {
                iframe: settings[data[0]].iframe,
                id: data[0],
                height: data[1],
                width: data[2],
                type: data[3]
            };
        }

        function ensureInRange(Dimension) {
            var max = Number(settings[iframeId]['max' + Dimension]),
                min = Number(settings[iframeId]['min' + Dimension]),
                dimension = Dimension.toLowerCase(),
                size = Number(messageData[dimension]);

            log(iframeId, 'Checking ' + dimension + ' is in range ' + min + '-' + max);

            if (size < min) {
                size = min;
                log(iframeId, 'Set ' + dimension + ' to min value');
            }

            if (size > max) {
                size = max;
                log(iframeId, 'Set ' + dimension + ' to max value');
            }

            messageData[dimension] = '' + size;
        }

        function isMessageFromIFrame() {
            function checkAllowedOrigin() {
                function checkList() {
                    var i = 0,
                        retCode = false;

                    log(iframeId, 'Checking connection is from allowed list of origins: ' + checkOrigin);

                    for (; i < checkOrigin.length; i++) {
                        if (checkOrigin[i] === origin) {
                            retCode = true;
                            break;
                        }
                    }
                    return retCode;
                }

                function checkSingle() {
                    var remoteHost = settings[iframeId].remoteHost;
                    log(iframeId, 'Checking connection is from: ' + remoteHost);
                    return origin === remoteHost;
                }

                return checkOrigin.constructor === Array ? checkList() : checkSingle();
            }

            var origin = event.origin,
                checkOrigin = settings[iframeId].checkOrigin;

            if (checkOrigin && '' + origin !== 'null' && !checkAllowedOrigin()) {
                throw new Error('Unexpected message received from: ' + origin + ' for ' + messageData.iframe.id + '. Message was: ' + event.data + '. This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.');
            }

            return true;
        }

        function isMessageForUs() {
            return msgId === ('' + msg).substr(0, msgIdLen) && msg.substr(msgIdLen).split(':')[0] in settings; //''+Protects against non-string msg
        }

        function isMessageFromMetaParent() {
            //Test if this message is from a parent above us. This is an ugly test, however, updating
            //the message format would break backwards compatibity.
            var retCode = messageData.type in { 'true': 1, 'false': 1, 'undefined': 1 };

            if (retCode) {
                log(iframeId, 'Ignoring init message from meta parent page');
            }

            return retCode;
        }

        function getMsgBody(offset) {
            return msg.substr(msg.indexOf(':') + msgHeaderLen + offset);
        }

        function forwardMsgFromIFrame(msgBody) {
            log(iframeId, 'MessageCallback passed: {iframe: ' + messageData.iframe.id + ', message: ' + msgBody + '}');
            callback('messageCallback', {
                iframe: messageData.iframe,
                message: JSON.parse(msgBody)
            });
            log(iframeId, '--');
        }

        function getPageInfo() {
            var bodyPosition = document.body.getBoundingClientRect(),
                iFramePosition = messageData.iframe.getBoundingClientRect();

            return JSON.stringify({
                iframeHeight: iFramePosition.height,
                iframeWidth: iFramePosition.width,
                clientHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
                clientWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                offsetTop: parseInt(iFramePosition.top - bodyPosition.top, 10),
                offsetLeft: parseInt(iFramePosition.left - bodyPosition.left, 10),
                scrollTop: window.pageYOffset,
                scrollLeft: window.pageXOffset
            });
        }

        function sendPageInfoToIframe(iframe, iframeId) {
            function debouncedTrigger() {
                trigger('Send Page Info', 'pageInfo:' + getPageInfo(), iframe, iframeId);
            }

            debouce(debouncedTrigger, 32);
        }

        function startPageInfoMonitor() {
            function setListener(type, func) {
                function sendPageInfo() {
                    if (settings[id]) {
                        sendPageInfoToIframe(settings[id].iframe, id);
                    } else {
                        stop();
                    }
                }

                ['scroll', 'resize'].forEach(function (evt) {
                    log(id, type + evt + ' listener for sendPageInfo');
                    func(window, evt, sendPageInfo);
                });
            }

            function stop() {
                setListener('Remove ', removeEventListener);
            }

            function start() {
                setListener('Add ', addEventListener);
            }

            var id = iframeId; //Create locally scoped copy of iFrame ID

            start();

            settings[id].stopPageInfo = stop;
        }

        function stopPageInfoMonitor() {
            if (settings[iframeId] && settings[iframeId].stopPageInfo) {
                settings[iframeId].stopPageInfo();
                delete settings[iframeId].stopPageInfo;
            }
        }

        function checkIFrameExists() {
            var retBool = true;

            if (null === messageData.iframe) {
                warn(iframeId, 'IFrame (' + messageData.id + ') not found');
                retBool = false;
            }
            return retBool;
        }

        function getElementPosition(target) {
            var iFramePosition = target.getBoundingClientRect();

            getPagePosition(iframeId);

            return {
                x: Math.floor(Number(iFramePosition.left) + Number(pagePosition.x)),
                y: Math.floor(Number(iFramePosition.top) + Number(pagePosition.y))
            };
        }

        function scrollRequestFromChild(addOffset) {
            /* istanbul ignore next */ //Not testable in Karma
            function reposition() {
                pagePosition = newPosition;
                scrollTo();
                log(iframeId, '--');
            }

            function calcOffset() {
                return {
                    x: Number(messageData.width) + offset.x,
                    y: Number(messageData.height) + offset.y
                };
            }

            function scrollParent() {
                if (window.parentIFrame) {
                    window.parentIFrame['scrollTo' + (addOffset ? 'Offset' : '')](newPosition.x, newPosition.y);
                } else {
                    warn(iframeId, 'Unable to scroll to requested position, window.parentIFrame not found');
                }
            }

            var offset = addOffset ? getElementPosition(messageData.iframe) : { x: 0, y: 0 },
                newPosition = calcOffset();

            log(iframeId, 'Reposition requested from iFrame (offset x:' + offset.x + ' y:' + offset.y + ')');

            if (window.top !== window.self) {
                scrollParent();
            } else {
                reposition();
            }
        }

        function scrollTo() {
            if (false !== callback('scrollCallback', pagePosition)) {
                setPagePosition(iframeId);
            } else {
                unsetPagePosition();
            }
        }

        function findTarget(location) {
            function jumpToTarget() {
                var jumpPosition = getElementPosition(target);

                log(iframeId, 'Moving to in page link (#' + hash + ') at x: ' + jumpPosition.x + ' y: ' + jumpPosition.y);
                pagePosition = {
                    x: jumpPosition.x,
                    y: jumpPosition.y
                };

                scrollTo();
                log(iframeId, '--');
            }

            function jumpToParent() {
                if (window.parentIFrame) {
                    window.parentIFrame.moveToAnchor(hash);
                } else {
                    log(iframeId, 'In page link #' + hash + ' not found and window.parentIFrame not found');
                }
            }

            var hash = location.split('#')[1] || '',
                hashData = decodeURIComponent(hash),
                target = document.getElementById(hashData) || document.getElementsByName(hashData)[0];

            if (target) {
                jumpToTarget();
            } else if (window.top !== window.self) {
                jumpToParent();
            } else {
                log(iframeId, 'In page link #' + hash + ' not found');
            }
        }

        function callback(funcName, val) {
            return chkCallback(iframeId, funcName, val);
        }

        function actionMsg() {

            if (settings[iframeId].firstRun) firstRun();

            switch (messageData.type) {
                case 'close':
                    closeIFrame(messageData.iframe);
                    break;
                case 'message':
                    forwardMsgFromIFrame(getMsgBody(6));
                    break;
                case 'scrollTo':
                    scrollRequestFromChild(false);
                    break;
                case 'scrollToOffset':
                    scrollRequestFromChild(true);
                    break;
                case 'pageInfo':
                    sendPageInfoToIframe(settings[iframeId].iframe, iframeId);
                    startPageInfoMonitor();
                    break;
                case 'pageInfoStop':
                    stopPageInfoMonitor();
                    break;
                case 'inPageLink':
                    findTarget(getMsgBody(9));
                    break;
                case 'reset':
                    resetIFrame(messageData);
                    break;
                case 'init':
                    resizeIFrame();
                    callback('initCallback', messageData.iframe);
                    callback('resizedCallback', messageData);
                    break;
                default:
                    resizeIFrame();
                    callback('resizedCallback', messageData);
            }
        }

        function hasSettings(iframeId) {
            var retBool = true;

            if (!settings[iframeId]) {
                retBool = false;
                warn(messageData.type + ' No settings for ' + iframeId + '. Message was: ' + msg);
            }

            return retBool;
        }

        function iFrameReadyMsgReceived() {
            for (var iframeId in settings) {
                trigger('iFrame requested init', createOutgoingMsg(iframeId), document.getElementById(iframeId), iframeId);
            }
        }

        function firstRun() {
            settings[iframeId].firstRun = false;
        }

        var msg = event.data,
            messageData = {},
            iframeId = null;

        if ('[iFrameResizerChild]Ready' === msg) {
            iFrameReadyMsgReceived();
        } else if (isMessageForUs()) {
            messageData = processMsg();
            iframeId = logId = messageData.id;

            if (!isMessageFromMetaParent() && hasSettings(iframeId)) {
                log(iframeId, 'Received: ' + msg);

                if (checkIFrameExists() && isMessageFromIFrame()) {
                    actionMsg();
                }
            }
        } else {
            info(iframeId, 'Ignored: ' + msg);
        }
    }

    function chkCallback(iframeId, funcName, val) {
        var func = null,
            retVal = null;

        if (settings[iframeId]) {
            func = settings[iframeId][funcName];

            if ('function' === typeof func) {
                retVal = func(val);
            } else {
                throw new TypeError(funcName + ' on iFrame[' + iframeId + '] is not a function');
            }
        }

        return retVal;
    }

    function closeIFrame(iframe) {
        var iframeId = iframe.id;

        log(iframeId, 'Removing iFrame: ' + iframeId);
        if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
        }
        chkCallback(iframeId, 'closedCallback', iframeId);
        log(iframeId, '--');
        delete settings[iframeId];
    }

    function getPagePosition(iframeId) {
        if (null === pagePosition) {
            pagePosition = {
                x: window.pageXOffset !== undefined ? window.pageXOffset : document.documentElement.scrollLeft,
                y: window.pageYOffset !== undefined ? window.pageYOffset : document.documentElement.scrollTop
            };
            log(iframeId, 'Get page position: ' + pagePosition.x + ',' + pagePosition.y);
        }
    }

    function setPagePosition(iframeId) {
        if (null !== pagePosition) {
            window.scrollTo(pagePosition.x, pagePosition.y);
            log(iframeId, 'Set page position: ' + pagePosition.x + ',' + pagePosition.y);
            unsetPagePosition();
        }
    }

    function unsetPagePosition() {
        pagePosition = null;
    }

    function resetIFrame(messageData) {
        function reset() {
            setSize(messageData);
            trigger('reset', 'reset', messageData.iframe, messageData.id);
        }

        log(messageData.id, 'Size reset requested by ' + ('init' === messageData.type ? 'host page' : 'iFrame'));
        getPagePosition(messageData.id);
        syncResize(reset, messageData, 'reset');
    }

    function setSize(messageData) {
        function setDimension(dimension) {
            messageData.iframe.style[dimension] = messageData[dimension] + 'px';
            log(messageData.id, 'IFrame (' + iframeId + ') ' + dimension + ' set to ' + messageData[dimension] + 'px');
        }

        function chkZero(dimension) {
            //FireFox sets dimension of hidden iFrames to zero.
            //So if we detect that set up an event to check for
            //when iFrame becomes visible.

            /* istanbul ignore next */ //Not testable in PhantomJS
            if (!hiddenCheckEnabled && '0' === messageData[dimension]) {
                hiddenCheckEnabled = true;
                log(iframeId, 'Hidden iFrame detected, creating visibility listener');
                fixHiddenIFrames();
            }
        }

        function processDimension(dimension) {
            setDimension(dimension);
            chkZero(dimension);
        }

        var iframeId = messageData.iframe.id;

        if (settings[iframeId]) {
            if (settings[iframeId].sizeHeight) {
                processDimension('height');
            }
            if (settings[iframeId].sizeWidth) {
                processDimension('width');
            }
        }
    }

    function syncResize(func, messageData, doNotSync) {
        /* istanbul ignore if */ //Not testable in PhantomJS
        if (doNotSync !== messageData.type && requestAnimationFrame) {
            log(messageData.id, 'Requesting animation frame');
            requestAnimationFrame(func);
        } else {
            func();
        }
    }

    function trigger(calleeMsg, msg, iframe, id) {
        function postMessageToIFrame() {
            var target = settings[id].targetOrigin;
            log(id, '[' + calleeMsg + '] Sending msg to iframe[' + id + '] (' + msg + ') targetOrigin: ' + target);
            iframe.contentWindow.postMessage(msgId + msg, target);
        }

        function iFrameNotFound() {
            warn(id, '[' + calleeMsg + '] IFrame(' + id + ') not found');
        }

        function chkAndSend() {
            if (iframe && 'contentWindow' in iframe && null !== iframe.contentWindow) {
                //Null test for PhantomJS
                postMessageToIFrame();
            } else {
                iFrameNotFound();
            }
        }

        id = id || iframe.id;

        if (settings[id]) {
            chkAndSend();
        }
    }

    function createOutgoingMsg(iframeId) {
        return iframeId + ':' + settings[iframeId].bodyMarginV1 + ':' + settings[iframeId].sizeWidth + ':' + settings[iframeId].log + ':' + settings[iframeId].interval + ':' + settings[iframeId].enablePublicMethods + ':' + settings[iframeId].autoResize + ':' + settings[iframeId].bodyMargin + ':' + settings[iframeId].heightCalculationMethod + ':' + settings[iframeId].bodyBackground + ':' + settings[iframeId].bodyPadding + ':' + settings[iframeId].tolerance + ':' + settings[iframeId].inPageLinks + ':' + settings[iframeId].resizeFrom + ':' + settings[iframeId].widthCalculationMethod;
    }

    function setupIFrame(iframe, options) {
        function setLimits() {
            function addStyle(style) {
                if (Infinity !== settings[iframeId][style] && 0 !== settings[iframeId][style]) {
                    iframe.style[style] = settings[iframeId][style] + 'px';
                    log(iframeId, 'Set ' + style + ' = ' + settings[iframeId][style] + 'px');
                }
            }

            function chkMinMax(dimension) {
                if (settings[iframeId]['min' + dimension] > settings[iframeId]['max' + dimension]) {
                    throw new Error('Value for min' + dimension + ' can not be greater than max' + dimension);
                }
            }

            chkMinMax('Height');
            chkMinMax('Width');

            addStyle('maxHeight');
            addStyle('minHeight');
            addStyle('maxWidth');
            addStyle('minWidth');
        }

        function newId() {
            var id = options && options.id || defaults.id + count++;
            if (null !== document.getElementById(id)) {
                id = id + count++;
            }
            return id;
        }

        function ensureHasId(iframeId) {
            logId = iframeId;
            if ('' === iframeId) {
                iframe.id = iframeId = newId();
                logEnabled = (options || {}).log;
                logId = iframeId;
                log(iframeId, 'Added missing iframe ID: ' + iframeId + ' (' + iframe.src + ')');
            }

            return iframeId;
        }

        function setScrolling() {
            log(iframeId, 'IFrame scrolling ' + (settings[iframeId].scrolling ? 'enabled' : 'disabled') + ' for ' + iframeId);
            iframe.style.overflow = false === settings[iframeId].scrolling ? 'hidden' : 'auto';
            iframe.scrolling = false === settings[iframeId].scrolling ? 'no' : 'yes';
        }

        //The V1 iFrame script expects an int, where as in V2 expects a CSS
        //string value such as '1px 3em', so if we have an int for V2, set V1=V2
        //and then convert V2 to a string PX value.
        function setupBodyMarginValues() {
            if ('number' === typeof settings[iframeId].bodyMargin || '0' === settings[iframeId].bodyMargin) {
                settings[iframeId].bodyMarginV1 = settings[iframeId].bodyMargin;
                settings[iframeId].bodyMargin = '' + settings[iframeId].bodyMargin + 'px';
            }
        }

        function checkReset() {
            // Reduce scope of firstRun to function, because IE8's JS execution
            // context stack is borked and this value gets externally
            // changed midway through running this function!!!
            var firstRun = settings[iframeId].firstRun,
                resetRequertMethod = settings[iframeId].heightCalculationMethod in resetRequiredMethods;

            if (!firstRun && resetRequertMethod) {
                resetIFrame({ iframe: iframe, height: 0, width: 0, type: 'init' });
            }
        }

        function setupIFrameObject() {
            if (Function.prototype.bind) {
                //Ignore unpolyfilled IE8.
                settings[iframeId].iframe.iFrameResizer = {

                    close: closeIFrame.bind(null, settings[iframeId].iframe),

                    resize: trigger.bind(null, 'Window resize', 'resize', settings[iframeId].iframe),

                    moveToAnchor: function moveToAnchor(anchor) {
                        trigger('Move to anchor', 'moveToAnchor:' + anchor, settings[iframeId].iframe, iframeId);
                    },

                    sendMessage: function sendMessage(message) {
                        message = JSON.stringify(message);
                        trigger('Send Message', 'message:' + message, settings[iframeId].iframe, iframeId);
                    }
                };
            }
        }

        //We have to call trigger twice, as we can not be sure if all
        //iframes have completed loading when this code runs. The
        //event listener also catches the page changing in the iFrame.
        function init(msg) {
            function iFrameLoaded() {
                trigger('iFrame.onload', msg, iframe);
                checkReset();
            }

            addEventListener(iframe, 'load', iFrameLoaded);
            trigger('init', msg, iframe);
        }

        function checkOptions(options) {
            if ('object' !== (typeof options === 'undefined' ? 'undefined' : _typeof(options))) {
                throw new TypeError('Options is not an object');
            }
        }

        function copyOptions(options) {
            for (var option in defaults) {
                if (defaults.hasOwnProperty(option)) {
                    settings[iframeId][option] = options.hasOwnProperty(option) ? options[option] : defaults[option];
                }
            }
        }

        function getTargetOrigin(remoteHost) {
            return '' === remoteHost || 'file://' === remoteHost ? '*' : remoteHost;
        }

        function processOptions(options) {
            options = options || {};
            settings[iframeId] = {
                firstRun: true,
                iframe: iframe,
                remoteHost: iframe.src.split('/').slice(0, 3).join('/')
            };

            checkOptions(options);
            copyOptions(options);

            settings[iframeId].targetOrigin = true === settings[iframeId].checkOrigin ? getTargetOrigin(settings[iframeId].remoteHost) : '*';
        }

        function beenHere() {
            return iframeId in settings && 'iFrameResizer' in iframe;
        }

        var iframeId = ensureHasId(iframe.id);

        if (!beenHere()) {
            processOptions(options);
            setScrolling();
            setLimits();
            setupBodyMarginValues();
            init(createOutgoingMsg(iframeId));
            setupIFrameObject();
        } else {
            warn(iframeId, 'Ignored iFrame, already setup.');
        }
    }

    function debouce(fn, time) {
        if (null === timer) {
            timer = setTimeout(function () {
                timer = null;
                fn();
            }, time);
        }
    }

    /* istanbul ignore next */ //Not testable in PhantomJS
    function fixHiddenIFrames() {
        function checkIFrames() {
            function checkIFrame(settingId) {
                function chkDimension(dimension) {
                    return '0px' === settings[settingId].iframe.style[dimension];
                }

                function isVisible(el) {
                    return null !== el.offsetParent;
                }

                if (isVisible(settings[settingId].iframe) && (chkDimension('height') || chkDimension('width'))) {
                    trigger('Visibility change', 'resize', settings[settingId].iframe, settingId);
                }
            }

            for (var settingId in settings) {
                checkIFrame(settingId);
            }
        }

        function mutationObserved(mutations) {
            log('window', 'Mutation observed: ' + mutations[0].target + ' ' + mutations[0].type);
            debouce(checkIFrames, 16);
        }

        function createMutationObserver() {
            var target = document.querySelector('body'),
                config = {
                attributes: true,
                attributeOldValue: false,
                characterData: true,
                characterDataOldValue: false,
                childList: true,
                subtree: true
            },
                observer = new MutationObserver(mutationObserved);

            observer.observe(target, config);
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        if (MutationObserver) createMutationObserver();
    }

    function resizeIFrames(event) {
        function resize() {
            sendTriggerMsg('Window ' + event, 'resize');
        }

        log('window', 'Trigger event: ' + event);
        debouce(resize, 16);
    }

    /* istanbul ignore next */ //Not testable in PhantomJS
    function tabVisible() {
        function resize() {
            sendTriggerMsg('Tab Visable', 'resize');
        }

        if ('hidden' !== document.visibilityState) {
            log('document', 'Trigger event: Visiblity change');
            debouce(resize, 16);
        }
    }

    function sendTriggerMsg(eventName, event) {
        function isIFrameResizeEnabled(iframeId) {
            return 'parent' === settings[iframeId].resizeFrom && settings[iframeId].autoResize && !settings[iframeId].firstRun;
        }

        for (var iframeId in settings) {
            if (isIFrameResizeEnabled(iframeId)) {
                trigger(eventName, event, document.getElementById(iframeId), iframeId);
            }
        }
    }

    function setupEventListeners() {
        addEventListener(window, 'message', iFrameListener);

        addEventListener(window, 'resize', function () {
            resizeIFrames('resize');
        });

        addEventListener(document, 'visibilitychange', tabVisible);
        addEventListener(document, '-webkit-visibilitychange', tabVisible); //Andriod 4.4
        addEventListener(window, 'focusin', function () {
            resizeIFrames('focus');
        }); //IE8-9
        addEventListener(window, 'focus', function () {
            resizeIFrames('focus');
        });
    }

    function factory() {
        function init(options, element) {
            function chkType() {
                if (!element.tagName) {
                    throw new TypeError('Object is not a valid DOM element');
                } else if ('IFRAME' !== element.tagName.toUpperCase()) {
                    throw new TypeError('Expected <IFRAME> tag, found <' + element.tagName + '>');
                }
            }

            if (element) {
                chkType();
                setupIFrame(element, options);
                iFrames.push(element);
            }
        }

        function warnDeprecatedOptions(options) {
            if (options && options.enablePublicMethods) {
                warn('enablePublicMethods option has been removed, public methods are now always available in the iFrame');
            }
        }

        var iFrames;

        setupRequestAnimationFrame();
        setupEventListeners();

        return function iFrameResizeF(options, target) {
            iFrames = []; //Only return iFrames past in on this call

            warnDeprecatedOptions(options);

            switch (typeof target === 'undefined' ? 'undefined' : _typeof(target)) {
                case 'undefined':
                case 'string':
                    Array.prototype.forEach.call(document.querySelectorAll(target || 'iframe'), init.bind(undefined, options));
                    break;
                case 'object':
                    init(options, target);
                    break;
                default:
                    throw new TypeError('Unexpected data type (' + (typeof target === 'undefined' ? 'undefined' : _typeof(target)) + ')');
            }

            return iFrames;
        };
    }

    function createJQueryPublicMethod($) {
        if (!$.fn) {
            info('', 'Unable to bind to jQuery, it is not fully loaded.');
        } else if (!$.fn.iFrameResize) {
            $.fn.iFrameResize = function $iFrameResizeF(options) {
                function init(index, element) {
                    setupIFrame(element, options);
                }

                return this.filter('iframe').each(init).end();
            };
        }
    }

    if (window.jQuery) {
        createJQueryPublicMethod(jQuery);
    }

    window.iFrameResize = window.iFrameResize || factory();
})(window || {});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFkbWluL0phdmFzY3JpcHQvdmVuZG9yL2lmcmFtZV9yZXNpemVyLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsImNvdW50IiwibG9nRW5hYmxlZCIsImhpZGRlbkNoZWNrRW5hYmxlZCIsIm1zZ0hlYWRlciIsIm1zZ0hlYWRlckxlbiIsImxlbmd0aCIsIm1zZ0lkIiwibXNnSWRMZW4iLCJwYWdlUG9zaXRpb24iLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJyZXNldFJlcXVpcmVkTWV0aG9kcyIsIm1heCIsInNjcm9sbCIsImJvZHlTY3JvbGwiLCJkb2N1bWVudEVsZW1lbnRTY3JvbGwiLCJzZXR0aW5ncyIsInRpbWVyIiwibG9nSWQiLCJkZWZhdWx0cyIsImF1dG9SZXNpemUiLCJib2R5QmFja2dyb3VuZCIsImJvZHlNYXJnaW4iLCJib2R5TWFyZ2luVjEiLCJib2R5UGFkZGluZyIsImNoZWNrT3JpZ2luIiwiaW5QYWdlTGlua3MiLCJlbmFibGVQdWJsaWNNZXRob2RzIiwiaGVpZ2h0Q2FsY3VsYXRpb25NZXRob2QiLCJpZCIsImludGVydmFsIiwibG9nIiwibWF4SGVpZ2h0IiwiSW5maW5pdHkiLCJtYXhXaWR0aCIsIm1pbkhlaWdodCIsIm1pbldpZHRoIiwicmVzaXplRnJvbSIsInNjcm9sbGluZyIsInNpemVIZWlnaHQiLCJzaXplV2lkdGgiLCJ0b2xlcmFuY2UiLCJ3aWR0aENhbGN1bGF0aW9uTWV0aG9kIiwiY2xvc2VkQ2FsbGJhY2siLCJpbml0Q2FsbGJhY2siLCJtZXNzYWdlQ2FsbGJhY2siLCJ3YXJuIiwicmVzaXplZENhbGxiYWNrIiwic2Nyb2xsQ2FsbGJhY2siLCJhZGRFdmVudExpc3RlbmVyIiwib2JqIiwiZXZ0IiwiZnVuYyIsImF0dGFjaEV2ZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImVsIiwiZGV0YWNoRXZlbnQiLCJzZXR1cFJlcXVlc3RBbmltYXRpb25GcmFtZSIsInZlbmRvcnMiLCJ4IiwiZ2V0TXlJRCIsImlmcmFtZUlkIiwicmV0U3RyIiwidG9wIiwic2VsZiIsInBhcmVudElGcmFtZSIsImdldElkIiwiZm9ybWF0TG9nSGVhZGVyIiwiaXNMb2dFbmFibGVkIiwibXNnIiwib3V0cHV0IiwiaW5mbyIsInR5cGUiLCJlbmFibGVkIiwiY29uc29sZSIsImlGcmFtZUxpc3RlbmVyIiwiZXZlbnQiLCJyZXNpemVJRnJhbWUiLCJyZXNpemUiLCJzZXRTaXplIiwibWVzc2FnZURhdGEiLCJzZXRQYWdlUG9zaXRpb24iLCJlbnN1cmVJblJhbmdlIiwic3luY1Jlc2l6ZSIsInByb2Nlc3NNc2ciLCJkYXRhIiwic3Vic3RyIiwic3BsaXQiLCJpZnJhbWUiLCJoZWlnaHQiLCJ3aWR0aCIsIkRpbWVuc2lvbiIsIk51bWJlciIsIm1pbiIsImRpbWVuc2lvbiIsInRvTG93ZXJDYXNlIiwic2l6ZSIsImlzTWVzc2FnZUZyb21JRnJhbWUiLCJjaGVja0FsbG93ZWRPcmlnaW4iLCJjaGVja0xpc3QiLCJpIiwicmV0Q29kZSIsIm9yaWdpbiIsImNoZWNrU2luZ2xlIiwicmVtb3RlSG9zdCIsImNvbnN0cnVjdG9yIiwiQXJyYXkiLCJFcnJvciIsImlzTWVzc2FnZUZvclVzIiwiaXNNZXNzYWdlRnJvbU1ldGFQYXJlbnQiLCJnZXRNc2dCb2R5Iiwib2Zmc2V0IiwiaW5kZXhPZiIsImZvcndhcmRNc2dGcm9tSUZyYW1lIiwibXNnQm9keSIsImNhbGxiYWNrIiwibWVzc2FnZSIsIkpTT04iLCJwYXJzZSIsImdldFBhZ2VJbmZvIiwiYm9keVBvc2l0aW9uIiwiZG9jdW1lbnQiLCJib2R5IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiaUZyYW1lUG9zaXRpb24iLCJzdHJpbmdpZnkiLCJpZnJhbWVIZWlnaHQiLCJpZnJhbWVXaWR0aCIsImNsaWVudEhlaWdodCIsIk1hdGgiLCJkb2N1bWVudEVsZW1lbnQiLCJpbm5lckhlaWdodCIsImNsaWVudFdpZHRoIiwiaW5uZXJXaWR0aCIsIm9mZnNldFRvcCIsInBhcnNlSW50Iiwib2Zmc2V0TGVmdCIsImxlZnQiLCJzY3JvbGxUb3AiLCJwYWdlWU9mZnNldCIsInNjcm9sbExlZnQiLCJwYWdlWE9mZnNldCIsInNlbmRQYWdlSW5mb1RvSWZyYW1lIiwiZGVib3VuY2VkVHJpZ2dlciIsInRyaWdnZXIiLCJkZWJvdWNlIiwic3RhcnRQYWdlSW5mb01vbml0b3IiLCJzZXRMaXN0ZW5lciIsInNlbmRQYWdlSW5mbyIsInN0b3AiLCJmb3JFYWNoIiwic3RhcnQiLCJzdG9wUGFnZUluZm8iLCJzdG9wUGFnZUluZm9Nb25pdG9yIiwiY2hlY2tJRnJhbWVFeGlzdHMiLCJyZXRCb29sIiwiZ2V0RWxlbWVudFBvc2l0aW9uIiwidGFyZ2V0IiwiZ2V0UGFnZVBvc2l0aW9uIiwiZmxvb3IiLCJ5Iiwic2Nyb2xsUmVxdWVzdEZyb21DaGlsZCIsImFkZE9mZnNldCIsInJlcG9zaXRpb24iLCJuZXdQb3NpdGlvbiIsInNjcm9sbFRvIiwiY2FsY09mZnNldCIsInNjcm9sbFBhcmVudCIsInVuc2V0UGFnZVBvc2l0aW9uIiwiZmluZFRhcmdldCIsImxvY2F0aW9uIiwianVtcFRvVGFyZ2V0IiwianVtcFBvc2l0aW9uIiwiaGFzaCIsImp1bXBUb1BhcmVudCIsIm1vdmVUb0FuY2hvciIsImhhc2hEYXRhIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRFbGVtZW50c0J5TmFtZSIsImZ1bmNOYW1lIiwidmFsIiwiY2hrQ2FsbGJhY2siLCJhY3Rpb25Nc2ciLCJmaXJzdFJ1biIsImNsb3NlSUZyYW1lIiwicmVzZXRJRnJhbWUiLCJoYXNTZXR0aW5ncyIsImlGcmFtZVJlYWR5TXNnUmVjZWl2ZWQiLCJjcmVhdGVPdXRnb2luZ01zZyIsInJldFZhbCIsIlR5cGVFcnJvciIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsInVuZGVmaW5lZCIsInJlc2V0Iiwic2V0RGltZW5zaW9uIiwic3R5bGUiLCJjaGtaZXJvIiwiZml4SGlkZGVuSUZyYW1lcyIsInByb2Nlc3NEaW1lbnNpb24iLCJkb05vdFN5bmMiLCJjYWxsZWVNc2ciLCJwb3N0TWVzc2FnZVRvSUZyYW1lIiwidGFyZ2V0T3JpZ2luIiwiY29udGVudFdpbmRvdyIsInBvc3RNZXNzYWdlIiwiaUZyYW1lTm90Rm91bmQiLCJjaGtBbmRTZW5kIiwic2V0dXBJRnJhbWUiLCJvcHRpb25zIiwic2V0TGltaXRzIiwiYWRkU3R5bGUiLCJjaGtNaW5NYXgiLCJuZXdJZCIsImVuc3VyZUhhc0lkIiwic3JjIiwic2V0U2Nyb2xsaW5nIiwib3ZlcmZsb3ciLCJzZXR1cEJvZHlNYXJnaW5WYWx1ZXMiLCJjaGVja1Jlc2V0IiwicmVzZXRSZXF1ZXJ0TWV0aG9kIiwic2V0dXBJRnJhbWVPYmplY3QiLCJGdW5jdGlvbiIsInByb3RvdHlwZSIsImJpbmQiLCJpRnJhbWVSZXNpemVyIiwiY2xvc2UiLCJhbmNob3IiLCJzZW5kTWVzc2FnZSIsImluaXQiLCJpRnJhbWVMb2FkZWQiLCJjaGVja09wdGlvbnMiLCJjb3B5T3B0aW9ucyIsIm9wdGlvbiIsImhhc093blByb3BlcnR5IiwiZ2V0VGFyZ2V0T3JpZ2luIiwicHJvY2Vzc09wdGlvbnMiLCJzbGljZSIsImpvaW4iLCJiZWVuSGVyZSIsImZuIiwidGltZSIsInNldFRpbWVvdXQiLCJjaGVja0lGcmFtZXMiLCJjaGVja0lGcmFtZSIsInNldHRpbmdJZCIsImNoa0RpbWVuc2lvbiIsImlzVmlzaWJsZSIsIm9mZnNldFBhcmVudCIsIm11dGF0aW9uT2JzZXJ2ZWQiLCJtdXRhdGlvbnMiLCJjcmVhdGVNdXRhdGlvbk9ic2VydmVyIiwicXVlcnlTZWxlY3RvciIsImNvbmZpZyIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVPbGRWYWx1ZSIsImNoYXJhY3RlckRhdGEiLCJjaGFyYWN0ZXJEYXRhT2xkVmFsdWUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwib2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwib2JzZXJ2ZSIsIldlYktpdE11dGF0aW9uT2JzZXJ2ZXIiLCJyZXNpemVJRnJhbWVzIiwic2VuZFRyaWdnZXJNc2ciLCJ0YWJWaXNpYmxlIiwidmlzaWJpbGl0eVN0YXRlIiwiZXZlbnROYW1lIiwiaXNJRnJhbWVSZXNpemVFbmFibGVkIiwic2V0dXBFdmVudExpc3RlbmVycyIsImZhY3RvcnkiLCJlbGVtZW50IiwiY2hrVHlwZSIsInRhZ05hbWUiLCJ0b1VwcGVyQ2FzZSIsImlGcmFtZXMiLCJwdXNoIiwid2FybkRlcHJlY2F0ZWRPcHRpb25zIiwiaUZyYW1lUmVzaXplRiIsImNhbGwiLCJxdWVyeVNlbGVjdG9yQWxsIiwiY3JlYXRlSlF1ZXJ5UHVibGljTWV0aG9kIiwiJCIsImlGcmFtZVJlc2l6ZSIsIiRpRnJhbWVSZXNpemVGIiwiaW5kZXgiLCJmaWx0ZXIiLCJlYWNoIiwiZW5kIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7Ozs7Ozs7QUFXQSxDQUFDLENBQUMsVUFBVUEsTUFBVixFQUFrQjtBQUNoQjs7QUFFQSxRQUNJQyxRQUFRLENBRFo7QUFBQSxRQUVJQyxhQUFhLEtBRmpCO0FBQUEsUUFHSUMscUJBQXFCLEtBSHpCO0FBQUEsUUFJSUMsWUFBWSxTQUpoQjtBQUFBLFFBS0lDLGVBQWVELFVBQVVFLE1BTDdCO0FBQUEsUUFNSUMsUUFBUSxlQU5aO0FBQUEsUUFNNkI7QUFDekJDLGVBQVdELE1BQU1ELE1BUHJCO0FBQUEsUUFRSUcsZUFBZSxJQVJuQjtBQUFBLFFBU0lDLHdCQUF3QlYsT0FBT1UscUJBVG5DO0FBQUEsUUFVSUMsdUJBQXVCLEVBQUNDLEtBQUssQ0FBTixFQUFTQyxRQUFRLENBQWpCLEVBQW9CQyxZQUFZLENBQWhDLEVBQW1DQyx1QkFBdUIsQ0FBMUQsRUFWM0I7QUFBQSxRQVdJQyxXQUFXLEVBWGY7QUFBQSxRQVlJQyxRQUFRLElBWlo7QUFBQSxRQWFJQyxRQUFRLFdBYlo7QUFBQSxRQWVJQyxXQUFXO0FBQ1BDLG9CQUFZLElBREw7QUFFUEMsd0JBQWdCLElBRlQ7QUFHUEMsb0JBQVksSUFITDtBQUlQQyxzQkFBYyxDQUpQO0FBS1BDLHFCQUFhLElBTE47QUFNUEMscUJBQWEsSUFOTjtBQU9Q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Q0FBTjtBQVpSOztBQWVBLG1CQUFPd0gsT0FBUDtBQUNILFNBckJEO0FBc0JIOztBQUVELGFBQVNNLHdCQUFULENBQWtDQyxDQUFsQyxFQUFxQztBQUNqQyxZQUFJLENBQUNBLEVBQUUzQyxFQUFQLEVBQVc7QUFDUDFLLGlCQUFLLEVBQUwsRUFBUyxtREFBVDtBQUNILFNBRkQsTUFFTyxJQUFJLENBQUNxTixFQUFFM0MsRUFBRixDQUFLNEMsWUFBVixFQUF3QjtBQUMzQkQsY0FBRTNDLEVBQUYsQ0FBSzRDLFlBQUwsR0FBb0IsU0FBU0MsY0FBVCxDQUF3QjVFLE9BQXhCLEVBQWlDO0FBQ2pELHlCQUFTb0IsSUFBVCxDQUFjeUQsS0FBZCxFQUFxQmQsT0FBckIsRUFBOEI7QUFDMUJoRSxnQ0FBWWdFLE9BQVosRUFBcUIvRCxPQUFyQjtBQUNIOztBQUVELHVCQUFPLEtBQUs4RSxNQUFMLENBQVksUUFBWixFQUFzQkMsSUFBdEIsQ0FBMkIzRCxJQUEzQixFQUFpQzRELEdBQWpDLEVBQVA7QUFDSCxhQU5EO0FBT0g7QUFDSjs7QUFFRCxRQUFJbFMsT0FBT21TLE1BQVgsRUFBbUI7QUFDZlIsaUNBQXlCUSxNQUF6QjtBQUNIOztBQUVEblMsV0FBTzZSLFlBQVAsR0FBc0I3UixPQUFPNlIsWUFBUCxJQUF1QmIsU0FBN0M7QUFFSCxDQWwvQkEsRUFrL0JFaFIsVUFBVSxFQWwvQloiLCJmaWxlIjoiQWRtaW4vSmF2YXNjcmlwdC92ZW5kb3IvaWZyYW1lX3Jlc2l6ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogRmlsZTogaWZyYW1lUmVzaXplci5qc1xuICogRGVzYzogRm9yY2UgaWZyYW1lcyB0byBzaXplIHRvIGNvbnRlbnQuXG4gKiBSZXF1aXJlczogaWZyYW1lUmVzaXplci5jb250ZW50V2luZG93LmpzIHRvIGJlIGxvYWRlZCBpbnRvIHRoZSB0YXJnZXQgZnJhbWUuXG4gKiBEb2M6IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGpicmFkc2hhdy9pZnJhbWUtcmVzaXplclxuICogQXV0aG9yOiBEYXZpZCBKLiBCcmFkc2hhdyAtIGRhdmVAYnJhZHNoYXcubmV0XG4gKiBDb250cmlidXRvcjogSnVyZSBNYXYgLSBqdXJlLm1hdkBnbWFpbC5jb21cbiAqIENvbnRyaWJ1dG9yOiBSZWVkIERhZG91bmUgLSByZWVkQGRhZG91bmUuY29tXG4gKi9cblxuXG47KGZ1bmN0aW9uICh3aW5kb3cpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXJcbiAgICAgICAgY291bnQgPSAwLFxuICAgICAgICBsb2dFbmFibGVkID0gZmFsc2UsXG4gICAgICAgIGhpZGRlbkNoZWNrRW5hYmxlZCA9IGZhbHNlLFxuICAgICAgICBtc2dIZWFkZXIgPSAnbWVzc2FnZScsXG4gICAgICAgIG1zZ0hlYWRlckxlbiA9IG1zZ0hlYWRlci5sZW5ndGgsXG4gICAgICAgIG1zZ0lkID0gJ1tpRnJhbWVTaXplcl0nLCAvL011c3QgbWF0Y2ggaWZyYW1lIG1zZyBJRFxuICAgICAgICBtc2dJZExlbiA9IG1zZ0lkLmxlbmd0aCxcbiAgICAgICAgcGFnZVBvc2l0aW9uID0gbnVsbCxcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSxcbiAgICAgICAgcmVzZXRSZXF1aXJlZE1ldGhvZHMgPSB7bWF4OiAxLCBzY3JvbGw6IDEsIGJvZHlTY3JvbGw6IDEsIGRvY3VtZW50RWxlbWVudFNjcm9sbDogMX0sXG4gICAgICAgIHNldHRpbmdzID0ge30sXG4gICAgICAgIHRpbWVyID0gbnVsbCxcbiAgICAgICAgbG9nSWQgPSAnSG9zdCBQYWdlJyxcblxuICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGF1dG9SZXNpemU6IHRydWUsXG4gICAgICAgICAgICBib2R5QmFja2dyb3VuZDogbnVsbCxcbiAgICAgICAgICAgIGJvZHlNYXJnaW46IG51bGwsXG4gICAgICAgICAgICBib2R5TWFyZ2luVjE6IDgsXG4gICAgICAgICAgICBib2R5UGFkZGluZzogbnVsbCxcbiAgICAgICAgICAgIGNoZWNrT3JpZ2luOiB0cnVlLFxuICAgICAgICAgICAgaW5QYWdlTGlua3M6IGZhbHNlLFxuICAgICAgICAgICAgZW5hYmxlUHVibGljTWV0aG9kczogdHJ1ZSxcbiAgICAgICAgICAgIGhlaWdodENhbGN1bGF0aW9uTWV0aG9kOiAnYm9keU9mZnNldCcsXG4gICAgICAgICAgICBpZDogJ2lGcmFtZVJlc2l6ZXInLFxuICAgICAgICAgICAgaW50ZXJ2YWw6IDMyLFxuICAgICAgICAgICAgbG9nOiBmYWxzZSxcbiAgICAgICAgICAgIG1heEhlaWdodDogSW5maW5pdHksXG4gICAgICAgICAgICBtYXhXaWR0aDogSW5maW5pdHksXG4gICAgICAgICAgICBtaW5IZWlnaHQ6IDAsXG4gICAgICAgICAgICBtaW5XaWR0aDogMCxcbiAgICAgICAgICAgIHJlc2l6ZUZyb206ICdwYXJlbnQnLFxuICAgICAgICAgICAgc2Nyb2xsaW5nOiBmYWxzZSxcbiAgICAgICAgICAgIHNpemVIZWlnaHQ6IHRydWUsXG4gICAgICAgICAgICBzaXplV2lkdGg6IGZhbHNlLFxuICAgICAgICAgICAgdG9sZXJhbmNlOiAwLFxuICAgICAgICAgICAgd2lkdGhDYWxjdWxhdGlvbk1ldGhvZDogJ3Njcm9sbCcsXG4gICAgICAgICAgICBjbG9zZWRDYWxsYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluaXRDYWxsYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1lc3NhZ2VDYWxsYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHdhcm4oJ01lc3NhZ2VDYWxsYmFjayBmdW5jdGlvbiBub3QgZGVmaW5lZCcpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc2l6ZWRDYWxsYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNjcm9sbENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyKG9iaiwgZXZ0LCBmdW5jKSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovIC8vIE5vdCB0ZXN0YWJsZSBpbiBQaGFudG9uSlNcbiAgICAgICAgaWYgKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgIG9iai5hZGRFdmVudExpc3RlbmVyKGV2dCwgZnVuYywgZmFsc2UpO1xuICAgICAgICB9IGVsc2UgaWYgKCdhdHRhY2hFdmVudCcgaW4gd2luZG93KSB7Ly9JRVxuICAgICAgICAgICAgb2JqLmF0dGFjaEV2ZW50KCdvbicgKyBldnQsIGZ1bmMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcihlbCwgZXZ0LCBmdW5jKSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovIC8vIE5vdCB0ZXN0YWJsZSBpbiBwaGFudG9uSlNcbiAgICAgICAgaWYgKCdyZW1vdmVFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0LCBmdW5jLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2RldGFjaEV2ZW50JyBpbiB3aW5kb3cpIHsgLy9JRVxuICAgICAgICAgICAgZWwuZGV0YWNoRXZlbnQoJ29uJyArIGV2dCwgZnVuYyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXR1cFJlcXVlc3RBbmltYXRpb25GcmFtZSgpIHtcbiAgICAgICAgdmFyXG4gICAgICAgICAgICB2ZW5kb3JzID0gWydtb3onLCAnd2Via2l0JywgJ28nLCAnbXMnXSxcbiAgICAgICAgICAgIHg7XG5cbiAgICAgICAgLy8gUmVtb3ZlIHZlbmRvciBwcmVmaXhpbmcgaWYgcHJlZml4ZWQgYW5kIGJyZWFrIGVhcmx5IGlmIG5vdFxuICAgICAgICBmb3IgKHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXJlcXVlc3RBbmltYXRpb25GcmFtZTsgeCArPSAxKSB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKHJlcXVlc3RBbmltYXRpb25GcmFtZSkpIHtcbiAgICAgICAgICAgIGxvZygnc2V0dXAnLCAnUmVxdWVzdEFuaW1hdGlvbkZyYW1lIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE15SUQoaWZyYW1lSWQpIHtcbiAgICAgICAgdmFyIHJldFN0ciA9ICdIb3N0IHBhZ2U6ICcgKyBpZnJhbWVJZDtcblxuICAgICAgICBpZiAod2luZG93LnRvcCAhPT0gd2luZG93LnNlbGYpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cucGFyZW50SUZyYW1lICYmIHdpbmRvdy5wYXJlbnRJRnJhbWUuZ2V0SWQpIHtcbiAgICAgICAgICAgICAgICByZXRTdHIgPSB3aW5kb3cucGFyZW50SUZyYW1lLmdldElkKCkgKyAnOiAnICsgaWZyYW1lSWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldFN0ciA9ICdOZXN0ZWQgaG9zdCBwYWdlOiAnICsgaWZyYW1lSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0U3RyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdExvZ0hlYWRlcihpZnJhbWVJZCkge1xuICAgICAgICByZXR1cm4gbXNnSWQgKyAnWycgKyBnZXRNeUlEKGlmcmFtZUlkKSArICddJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0xvZ0VuYWJsZWQoaWZyYW1lSWQpIHtcbiAgICAgICAgcmV0dXJuIHNldHRpbmdzW2lmcmFtZUlkXSA/IHNldHRpbmdzW2lmcmFtZUlkXS5sb2cgOiBsb2dFbmFibGVkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvZyhpZnJhbWVJZCwgbXNnKSB7XG4gICAgICAgIG91dHB1dCgnbG9nJywgaWZyYW1lSWQsIG1zZywgaXNMb2dFbmFibGVkKGlmcmFtZUlkKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5mbyhpZnJhbWVJZCwgbXNnKSB7XG4gICAgICAgIG91dHB1dCgnaW5mbycsIGlmcmFtZUlkLCBtc2csIGlzTG9nRW5hYmxlZChpZnJhbWVJZCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdhcm4oaWZyYW1lSWQsIG1zZykge1xuICAgICAgICBvdXRwdXQoJ3dhcm4nLCBpZnJhbWVJZCwgbXNnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvdXRwdXQodHlwZSwgaWZyYW1lSWQsIG1zZywgZW5hYmxlZCkge1xuICAgICAgICBpZiAodHJ1ZSA9PT0gZW5hYmxlZCAmJiAnb2JqZWN0JyA9PT0gdHlwZW9mIHdpbmRvdy5jb25zb2xlKSB7XG4gICAgICAgICAgICBjb25zb2xlW3R5cGVdKGZvcm1hdExvZ0hlYWRlcihpZnJhbWVJZCksIG1zZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpRnJhbWVMaXN0ZW5lcihldmVudCkge1xuICAgICAgICBmdW5jdGlvbiByZXNpemVJRnJhbWUoKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiByZXNpemUoKSB7XG4gICAgICAgICAgICAgICAgc2V0U2l6ZShtZXNzYWdlRGF0YSk7XG4gICAgICAgICAgICAgICAgc2V0UGFnZVBvc2l0aW9uKGlmcmFtZUlkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZW5zdXJlSW5SYW5nZSgnSGVpZ2h0Jyk7XG4gICAgICAgICAgICBlbnN1cmVJblJhbmdlKCdXaWR0aCcpO1xuXG4gICAgICAgICAgICBzeW5jUmVzaXplKHJlc2l6ZSwgbWVzc2FnZURhdGEsICdpbml0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzTXNnKCkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBtc2cuc3Vic3RyKG1zZ0lkTGVuKS5zcGxpdCgnOicpO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGlmcmFtZTogc2V0dGluZ3NbZGF0YVswXV0uaWZyYW1lLFxuICAgICAgICAgICAgICAgIGlkOiBkYXRhWzBdLFxuICAgICAgICAgICAgICAgIGhlaWdodDogZGF0YVsxXSxcbiAgICAgICAgICAgICAgICB3aWR0aDogZGF0YVsyXSxcbiAgICAgICAgICAgICAgICB0eXBlOiBkYXRhWzNdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZW5zdXJlSW5SYW5nZShEaW1lbnNpb24pIHtcbiAgICAgICAgICAgIHZhclxuICAgICAgICAgICAgICAgIG1heCA9IE51bWJlcihzZXR0aW5nc1tpZnJhbWVJZF1bJ21heCcgKyBEaW1lbnNpb25dKSxcbiAgICAgICAgICAgICAgICBtaW4gPSBOdW1iZXIoc2V0dGluZ3NbaWZyYW1lSWRdWydtaW4nICsgRGltZW5zaW9uXSksXG4gICAgICAgICAgICAgICAgZGltZW5zaW9uID0gRGltZW5zaW9uLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgc2l6ZSA9IE51bWJlcihtZXNzYWdlRGF0YVtkaW1lbnNpb25dKTtcblxuICAgICAgICAgICAgbG9nKGlmcmFtZUlkLCAnQ2hlY2tpbmcgJyArIGRpbWVuc2lvbiArICcgaXMgaW4gcmFuZ2UgJyArIG1pbiArICctJyArIG1heCk7XG5cbiAgICAgICAgICAgIGlmIChzaXplIDwgbWluKSB7XG4gICAgICAgICAgICAgICAgc2l6ZSA9IG1pbjtcbiAgICAgICAgICAgICAgICBsb2coaWZyYW1lSWQsICdTZXQgJyArIGRpbWVuc2lvbiArICcgdG8gbWluIHZhbHVlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzaXplID4gbWF4KSB7XG4gICAgICAgICAgICAgICAgc2l6ZSA9IG1heDtcbiAgICAgICAgICAgICAgICBsb2coaWZyYW1lSWQsICdTZXQgJyArIGRpbWVuc2lvbiArICcgdG8gbWF4IHZhbHVlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1lc3NhZ2VEYXRhW2RpbWVuc2lvbl0gPSAnJyArIHNpemU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIGlzTWVzc2FnZUZyb21JRnJhbWUoKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBjaGVja0FsbG93ZWRPcmlnaW4oKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY2hlY2tMaXN0KCkge1xuICAgICAgICAgICAgICAgICAgICB2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0Q29kZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGxvZyhpZnJhbWVJZCwgJ0NoZWNraW5nIGNvbm5lY3Rpb24gaXMgZnJvbSBhbGxvd2VkIGxpc3Qgb2Ygb3JpZ2luczogJyArIGNoZWNrT3JpZ2luKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKDsgaSA8IGNoZWNrT3JpZ2luLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tPcmlnaW5baV0gPT09IG9yaWdpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldENvZGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXRDb2RlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNoZWNrU2luZ2xlKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVtb3RlSG9zdCA9IHNldHRpbmdzW2lmcmFtZUlkXS5yZW1vdGVIb3N0O1xuICAgICAgICAgICAgICAgICAgICBsb2coaWZyYW1lSWQsICdDaGVja2luZyBjb25uZWN0aW9uIGlzIGZyb206ICcgKyByZW1vdGVIb3N0KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbiA9PT0gcmVtb3RlSG9zdDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2hlY2tPcmlnaW4uY29uc3RydWN0b3IgPT09IEFycmF5ID8gY2hlY2tMaXN0KCkgOiBjaGVja1NpbmdsZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXJcbiAgICAgICAgICAgICAgICBvcmlnaW4gPSBldmVudC5vcmlnaW4sXG4gICAgICAgICAgICAgICAgY2hlY2tPcmlnaW4gPSBzZXR0aW5nc1tpZnJhbWVJZF0uY2hlY2tPcmlnaW47XG5cbiAgICAgICAgICAgIGlmIChjaGVja09yaWdpbiAmJiAoJycgKyBvcmlnaW4gIT09ICdudWxsJykgJiYgIWNoZWNrQWxsb3dlZE9yaWdpbigpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAnVW5leHBlY3RlZCBtZXNzYWdlIHJlY2VpdmVkIGZyb206ICcgKyBvcmlnaW4gK1xuICAgICAgICAgICAgICAgICAgICAnIGZvciAnICsgbWVzc2FnZURhdGEuaWZyYW1lLmlkICtcbiAgICAgICAgICAgICAgICAgICAgJy4gTWVzc2FnZSB3YXM6ICcgKyBldmVudC5kYXRhICtcbiAgICAgICAgICAgICAgICAgICAgJy4gVGhpcyBlcnJvciBjYW4gYmUgZGlzYWJsZWQgYnkgc2V0dGluZyB0aGUgY2hlY2tPcmlnaW46IGZhbHNlIG9wdGlvbiBvciBieSBwcm92aWRpbmcgb2YgYXJyYXkgb2YgdHJ1c3RlZCBkb21haW5zLidcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzTWVzc2FnZUZvclVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIG1zZ0lkID09PSAoKCcnICsgbXNnKS5zdWJzdHIoMCwgbXNnSWRMZW4pKSAmJiAobXNnLnN1YnN0cihtc2dJZExlbikuc3BsaXQoJzonKVswXSBpbiBzZXR0aW5ncyk7IC8vJycrUHJvdGVjdHMgYWdhaW5zdCBub24tc3RyaW5nIG1zZ1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNNZXNzYWdlRnJvbU1ldGFQYXJlbnQoKSB7XG4gICAgICAgICAgICAvL1Rlc3QgaWYgdGhpcyBtZXNzYWdlIGlzIGZyb20gYSBwYXJlbnQgYWJvdmUgdXMuIFRoaXMgaXMgYW4gdWdseSB0ZXN0LCBob3dldmVyLCB1cGRhdGluZ1xuICAgICAgICAgICAgLy90aGUgbWVzc2FnZSBmb3JtYXQgd291bGQgYnJlYWsgYmFja3dhcmRzIGNvbXBhdGliaXR5LlxuICAgICAgICAgICAgdmFyIHJldENvZGUgPSBtZXNzYWdlRGF0YS50eXBlIGluIHsndHJ1ZSc6IDEsICdmYWxzZSc6IDEsICd1bmRlZmluZWQnOiAxfTtcblxuICAgICAgICAgICAgaWYgKHJldENvZGUpIHtcbiAgICAgICAgICAgICAgICBsb2coaWZyYW1lSWQsICdJZ25vcmluZyBpbml0IG1lc3NhZ2UgZnJvbSBtZXRhIHBhcmVudCBwYWdlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXRDb2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TXNnQm9keShvZmZzZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBtc2cuc3Vic3RyKG1zZy5pbmRleE9mKCc6JykgKyBtc2dIZWFkZXJMZW4gKyBvZmZzZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZm9yd2FyZE1zZ0Zyb21JRnJhbWUobXNnQm9keSkge1xuICAgICAgICAgICAgbG9nKGlmcmFtZUlkLCAnTWVzc2FnZUNhbGxiYWNrIHBhc3NlZDoge2lmcmFtZTogJyArIG1lc3NhZ2VEYXRhLmlmcmFtZS5pZCArICcsIG1lc3NhZ2U6ICcgKyBtc2dCb2R5ICsgJ30nKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCdtZXNzYWdlQ2FsbGJhY2snLCB7XG4gICAgICAgICAgICAgICAgaWZyYW1lOiBtZXNzYWdlRGF0YS5pZnJhbWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogSlNPTi5wYXJzZShtc2dCb2R5KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsb2coaWZyYW1lSWQsICctLScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UGFnZUluZm8oKSB7XG4gICAgICAgICAgICB2YXJcbiAgICAgICAgICAgICAgICBib2R5UG9zaXRpb24gPSBkb2N1bWVudC5ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgICAgIGlGcmFtZVBvc2l0aW9uID0gbWVzc2FnZURhdGEuaWZyYW1lLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIGlmcmFtZUhlaWdodDogaUZyYW1lUG9zaXRpb24uaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGlmcmFtZVdpZHRoOiBpRnJhbWVQb3NpdGlvbi53aWR0aCxcbiAgICAgICAgICAgICAgICBjbGllbnRIZWlnaHQ6IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKSxcbiAgICAgICAgICAgICAgICBjbGllbnRXaWR0aDogTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICAgICAgICAgICAgICBvZmZzZXRUb3A6IHBhcnNlSW50KGlGcmFtZVBvc2l0aW9uLnRvcCAtIGJvZHlQb3NpdGlvbi50b3AsIDEwKSxcbiAgICAgICAgICAgICAgICBvZmZzZXRMZWZ0OiBwYXJzZUludChpRnJhbWVQb3NpdGlvbi5sZWZ0IC0gYm9keVBvc2l0aW9uLmxlZnQsIDEwKSxcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHdpbmRvdy5wYWdlWU9mZnNldCxcbiAgICAgICAgICAgICAgICBzY3JvbGxMZWZ0OiB3aW5kb3cucGFnZVhPZmZzZXRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2VuZFBhZ2VJbmZvVG9JZnJhbWUoaWZyYW1lLCBpZnJhbWVJZCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gZGVib3VuY2VkVHJpZ2dlcigpIHtcbiAgICAgICAgICAgICAgICB0cmlnZ2VyKFxuICAgICAgICAgICAgICAgICAgICAnU2VuZCBQYWdlIEluZm8nLFxuICAgICAgICAgICAgICAgICAgICAncGFnZUluZm86JyArIGdldFBhZ2VJbmZvKCksXG4gICAgICAgICAgICAgICAgICAgIGlmcmFtZSxcbiAgICAgICAgICAgICAgICAgICAgaWZyYW1lSWRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWJvdWNlKGRlYm91bmNlZFRyaWdnZXIsIDMyKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZnVuY3Rpb24gc3RhcnRQYWdlSW5mb01vbml0b3IoKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRMaXN0ZW5lcih0eXBlLCBmdW5jKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gc2VuZFBhZ2VJbmZvKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3NbaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kUGFnZUluZm9Ub0lmcmFtZShzZXR0aW5nc1tpZF0uaWZyYW1lLCBpZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBbJ3Njcm9sbCcsICdyZXNpemUnXS5mb3JFYWNoKGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKGlkLCB0eXBlICsgZXZ0ICsgJyBsaXN0ZW5lciBmb3Igc2VuZFBhZ2VJbmZvJyk7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmMod2luZG93LCBldnQsIHNlbmRQYWdlSW5mbyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICAgICAgICAgICAgc2V0TGlzdGVuZXIoJ1JlbW92ZSAnLCByZW1vdmVFdmVudExpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgICAgICAgICAgc2V0TGlzdGVuZXIoJ0FkZCAnLCBhZGRFdmVudExpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGlkID0gaWZyYW1lSWQ7IC8vQ3JlYXRlIGxvY2FsbHkgc2NvcGVkIGNvcHkgb2YgaUZyYW1lIElEXG5cbiAgICAgICAgICAgIHN0YXJ0KCk7XG5cbiAgICAgICAgICAgIHNldHRpbmdzW2lkXS5zdG9wUGFnZUluZm8gPSBzdG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3RvcFBhZ2VJbmZvTW9uaXRvcigpIHtcbiAgICAgICAgICAgIGlmIChzZXR0aW5nc1tpZnJhbWVJZF0gJiYgc2V0dGluZ3NbaWZyYW1lSWRdLnN0b3BQYWdlSW5mbykge1xuICAgICAgICAgICAgICAgIHNldHRpbmdzW2lmcmFtZUlkXS5zdG9wUGFnZUluZm8oKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgc2V0dGluZ3NbaWZyYW1lSWRdLnN0b3BQYWdlSW5mbztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrSUZyYW1lRXhpc3RzKCkge1xuICAgICAgICAgICAgdmFyIHJldEJvb2wgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAobnVsbCA9PT0gbWVzc2FnZURhdGEuaWZyYW1lKSB7XG4gICAgICAgICAgICAgICAgd2FybihpZnJhbWVJZCwgJ0lGcmFtZSAoJyArIG1lc3NhZ2VEYXRhLmlkICsgJykgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICAgICAgcmV0Qm9vbCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldEJvb2w7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRFbGVtZW50UG9zaXRpb24odGFyZ2V0KSB7XG4gICAgICAgICAgICB2YXIgaUZyYW1lUG9zaXRpb24gPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgIGdldFBhZ2VQb3NpdGlvbihpZnJhbWVJZCk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgeDogTWF0aC5mbG9vcihOdW1iZXIoaUZyYW1lUG9zaXRpb24ubGVmdCkgKyBOdW1iZXIocGFnZVBvc2l0aW9uLngpKSxcbiAgICAgICAgICAgICAgICB5OiBNYXRoLmZsb29yKE51bWJlcihpRnJhbWVQb3NpdGlvbi50b3ApICsgTnVtYmVyKHBhZ2VQb3NpdGlvbi55KSlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzY3JvbGxSZXF1ZXN0RnJvbUNoaWxkKGFkZE9mZnNldCkge1xuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gIC8vTm90IHRlc3RhYmxlIGluIEthcm1hXG4gICAgICAgICAgICBmdW5jdGlvbiByZXBvc2l0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBhZ2VQb3NpdGlvbiA9IG5ld1Bvc2l0aW9uO1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvKCk7XG4gICAgICAgICAgICAgICAgbG9nKGlmcmFtZUlkLCAnLS0nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY2FsY09mZnNldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB4OiBOdW1iZXIobWVzc2FnZURhdGEud2lkdGgpICsgb2Zmc2V0LngsXG4gICAgICAgICAgICAgICAgICAgIHk6IE51bWJlcihtZXNzYWdlRGF0YS5oZWlnaHQpICsgb2Zmc2V0LnlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBzY3JvbGxQYXJlbnQoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5wYXJlbnRJRnJhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnBhcmVudElGcmFtZVsnc2Nyb2xsVG8nICsgKGFkZE9mZnNldCA/ICdPZmZzZXQnIDogJycpXShuZXdQb3NpdGlvbi54LCBuZXdQb3NpdGlvbi55KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3YXJuKGlmcmFtZUlkLCAnVW5hYmxlIHRvIHNjcm9sbCB0byByZXF1ZXN0ZWQgcG9zaXRpb24sIHdpbmRvdy5wYXJlbnRJRnJhbWUgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXJcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBhZGRPZmZzZXQgPyBnZXRFbGVtZW50UG9zaXRpb24obWVzc2FnZURhdGEuaWZyYW1lKSA6IHt4OiAwLCB5OiAwfSxcbiAgICAgICAgICAgICAgICBuZXdQb3NpdGlvbiA9IGNhbGNPZmZzZXQoKTtcblxuICAgICAgICAgICAgbG9nKGlmcmFtZUlkLCAnUmVwb3NpdGlvbiByZXF1ZXN0ZWQgZnJvbSBpRnJhbWUgKG9mZnNldCB4OicgKyBvZmZzZXQueCArICcgeTonICsgb2Zmc2V0LnkgKyAnKScpO1xuXG4gICAgICAgICAgICBpZiAod2luZG93LnRvcCAhPT0gd2luZG93LnNlbGYpIHtcbiAgICAgICAgICAgICAgICBzY3JvbGxQYXJlbnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVwb3NpdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2Nyb2xsVG8oKSB7XG4gICAgICAgICAgICBpZiAoZmFsc2UgIT09IGNhbGxiYWNrKCdzY3JvbGxDYWxsYmFjaycsIHBhZ2VQb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICBzZXRQYWdlUG9zaXRpb24oaWZyYW1lSWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1bnNldFBhZ2VQb3NpdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmluZFRhcmdldChsb2NhdGlvbikge1xuICAgICAgICAgICAgZnVuY3Rpb24ganVtcFRvVGFyZ2V0KCkge1xuICAgICAgICAgICAgICAgIHZhciBqdW1wUG9zaXRpb24gPSBnZXRFbGVtZW50UG9zaXRpb24odGFyZ2V0KTtcblxuICAgICAgICAgICAgICAgIGxvZyhpZnJhbWVJZCwgJ01vdmluZyB0byBpbiBwYWdlIGxpbmsgKCMnICsgaGFzaCArICcpIGF0IHg6ICcgKyBqdW1wUG9zaXRpb24ueCArICcgeTogJyArIGp1bXBQb3NpdGlvbi55KTtcbiAgICAgICAgICAgICAgICBwYWdlUG9zaXRpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgIHg6IGp1bXBQb3NpdGlvbi54LFxuICAgICAgICAgICAgICAgICAgICB5OiBqdW1wUG9zaXRpb24ueVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBzY3JvbGxUbygpO1xuICAgICAgICAgICAgICAgIGxvZyhpZnJhbWVJZCwgJy0tJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGp1bXBUb1BhcmVudCgpIHtcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LnBhcmVudElGcmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucGFyZW50SUZyYW1lLm1vdmVUb0FuY2hvcihoYXNoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2coaWZyYW1lSWQsICdJbiBwYWdlIGxpbmsgIycgKyBoYXNoICsgJyBub3QgZm91bmQgYW5kIHdpbmRvdy5wYXJlbnRJRnJhbWUgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXJcbiAgICAgICAgICAgICAgICBoYXNoID0gbG9jYXRpb24uc3BsaXQoJyMnKVsxXSB8fCAnJyxcbiAgICAgICAgICAgICAgICBoYXNoRGF0YSA9IGRlY29kZVVSSUNvbXBvbmVudChoYXNoKSxcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChoYXNoRGF0YSkgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoaGFzaERhdGEpWzBdO1xuXG4gICAgICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAganVtcFRvVGFyZ2V0KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy50b3AgIT09IHdpbmRvdy5zZWxmKSB7XG4gICAgICAgICAgICAgICAganVtcFRvUGFyZW50KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZyhpZnJhbWVJZCwgJ0luIHBhZ2UgbGluayAjJyArIGhhc2ggKyAnIG5vdCBmb3VuZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2FsbGJhY2soZnVuY05hbWUsIHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIGNoa0NhbGxiYWNrKGlmcmFtZUlkLCBmdW5jTmFtZSwgdmFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGlvbk1zZygpIHtcblxuICAgICAgICAgICAgaWYgKHNldHRpbmdzW2lmcmFtZUlkXS5maXJzdFJ1bikgZmlyc3RSdW4oKTtcblxuICAgICAgICAgICAgc3dpdGNoIChtZXNzYWdlRGF0YS50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY2xvc2UnOlxuICAgICAgICAgICAgICAgICAgICBjbG9zZUlGcmFtZShtZXNzYWdlRGF0YS5pZnJhbWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdtZXNzYWdlJzpcbiAgICAgICAgICAgICAgICAgICAgZm9yd2FyZE1zZ0Zyb21JRnJhbWUoZ2V0TXNnQm9keSg2KSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3Njcm9sbFRvJzpcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUmVxdWVzdEZyb21DaGlsZChmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3Njcm9sbFRvT2Zmc2V0JzpcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUmVxdWVzdEZyb21DaGlsZCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncGFnZUluZm8nOlxuICAgICAgICAgICAgICAgICAgICBzZW5kUGFnZUluZm9Ub0lmcmFtZShzZXR0aW5nc1tpZnJhbWVJZF0uaWZyYW1lLCBpZnJhbWVJZCk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UGFnZUluZm9Nb25pdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3BhZ2VJbmZvU3RvcCc6XG4gICAgICAgICAgICAgICAgICAgIHN0b3BQYWdlSW5mb01vbml0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnaW5QYWdlTGluayc6XG4gICAgICAgICAgICAgICAgICAgIGZpbmRUYXJnZXQoZ2V0TXNnQm9keSg5KSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3Jlc2V0JzpcbiAgICAgICAgICAgICAgICAgICAgcmVzZXRJRnJhbWUobWVzc2FnZURhdGEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdpbml0JzpcbiAgICAgICAgICAgICAgICAgICAgcmVzaXplSUZyYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCdpbml0Q2FsbGJhY2snLCBtZXNzYWdlRGF0YS5pZnJhbWUpO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygncmVzaXplZENhbGxiYWNrJywgbWVzc2FnZURhdGEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXNpemVJRnJhbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soJ3Jlc2l6ZWRDYWxsYmFjaycsIG1lc3NhZ2VEYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhc1NldHRpbmdzKGlmcmFtZUlkKSB7XG4gICAgICAgICAgICB2YXIgcmV0Qm9vbCA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICghc2V0dGluZ3NbaWZyYW1lSWRdKSB7XG4gICAgICAgICAgICAgICAgcmV0Qm9vbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHdhcm4obWVzc2FnZURhdGEudHlwZSArICcgTm8gc2V0dGluZ3MgZm9yICcgKyBpZnJhbWVJZCArICcuIE1lc3NhZ2Ugd2FzOiAnICsgbXNnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldEJvb2w7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpRnJhbWVSZWFkeU1zZ1JlY2VpdmVkKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaWZyYW1lSWQgaW4gc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICB0cmlnZ2VyKCdpRnJhbWUgcmVxdWVzdGVkIGluaXQnLCBjcmVhdGVPdXRnb2luZ01zZyhpZnJhbWVJZCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlmcmFtZUlkKSwgaWZyYW1lSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmlyc3RSdW4oKSB7XG4gICAgICAgICAgICBzZXR0aW5nc1tpZnJhbWVJZF0uZmlyc3RSdW4gPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgbXNnID0gZXZlbnQuZGF0YSxcbiAgICAgICAgICAgIG1lc3NhZ2VEYXRhID0ge30sXG4gICAgICAgICAgICBpZnJhbWVJZCA9IG51bGw7XG5cbiAgICAgICAgaWYgKCdbaUZyYW1lUmVzaXplckNoaWxkXVJlYWR5JyA9PT0gbXNnKSB7XG4gICAgICAgICAgICBpRnJhbWVSZWFkeU1zZ1JlY2VpdmVkKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNNZXNzYWdlRm9yVXMoKSkge1xuICAgICAgICAgICAgbWVzc2FnZURhdGEgPSBwcm9jZXNzTXNnKCk7XG4gICAgICAgICAgICBpZnJhbWVJZCA9IGxvZ0lkID0gbWVzc2FnZURhdGEuaWQ7XG5cbiAgICAgICAgICAgIGlmICghaXNNZXNzYWdlRnJvbU1ldGFQYXJlbnQoKSAmJiBoYXNTZXR0aW5ncyhpZnJhbWVJZCkpIHtcbiAgICAgICAgICAgICAgICBsb2coaWZyYW1lSWQsICdSZWNlaXZlZDogJyArIG1zZyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tJRnJhbWVFeGlzdHMoKSAmJiBpc01lc3NhZ2VGcm9tSUZyYW1lKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uTXNnKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5mbyhpZnJhbWVJZCwgJ0lnbm9yZWQ6ICcgKyBtc2cpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGNoa0NhbGxiYWNrKGlmcmFtZUlkLCBmdW5jTmFtZSwgdmFsKSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAgZnVuYyA9IG51bGwsXG4gICAgICAgICAgICByZXRWYWwgPSBudWxsO1xuXG4gICAgICAgIGlmIChzZXR0aW5nc1tpZnJhbWVJZF0pIHtcbiAgICAgICAgICAgIGZ1bmMgPSBzZXR0aW5nc1tpZnJhbWVJZF1bZnVuY05hbWVdO1xuXG4gICAgICAgICAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGZ1bmMpIHtcbiAgICAgICAgICAgICAgICByZXRWYWwgPSBmdW5jKHZhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZnVuY05hbWUgKyAnIG9uIGlGcmFtZVsnICsgaWZyYW1lSWQgKyAnXSBpcyBub3QgYSBmdW5jdGlvbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldFZhbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZUlGcmFtZShpZnJhbWUpIHtcbiAgICAgICAgdmFyIGlmcmFtZUlkID0gaWZyYW1lLmlkO1xuXG4gICAgICAgIGxvZyhpZnJhbWVJZCwgJ1JlbW92aW5nIGlGcmFtZTogJyArIGlmcmFtZUlkKTtcbiAgICAgICAgaWYgKGlmcmFtZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBpZnJhbWUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICAgICAgICB9XG4gICAgICAgIGNoa0NhbGxiYWNrKGlmcmFtZUlkLCAnY2xvc2VkQ2FsbGJhY2snLCBpZnJhbWVJZCk7XG4gICAgICAgIGxvZyhpZnJhbWVJZCwgJy0tJyk7XG4gICAgICAgIGRlbGV0ZSBzZXR0aW5nc1tpZnJhbWVJZF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UGFnZVBvc2l0aW9uKGlmcmFtZUlkKSB7XG4gICAgICAgIGlmIChudWxsID09PSBwYWdlUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHBhZ2VQb3NpdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB4OiAod2luZG93LnBhZ2VYT2Zmc2V0ICE9PSB1bmRlZmluZWQpID8gd2luZG93LnBhZ2VYT2Zmc2V0IDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQsXG4gICAgICAgICAgICAgICAgeTogKHdpbmRvdy5wYWdlWU9mZnNldCAhPT0gdW5kZWZpbmVkKSA/IHdpbmRvdy5wYWdlWU9mZnNldCA6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsb2coaWZyYW1lSWQsICdHZXQgcGFnZSBwb3NpdGlvbjogJyArIHBhZ2VQb3NpdGlvbi54ICsgJywnICsgcGFnZVBvc2l0aW9uLnkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0UGFnZVBvc2l0aW9uKGlmcmFtZUlkKSB7XG4gICAgICAgIGlmIChudWxsICE9PSBwYWdlUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyhwYWdlUG9zaXRpb24ueCwgcGFnZVBvc2l0aW9uLnkpO1xuICAgICAgICAgICAgbG9nKGlmcmFtZUlkLCAnU2V0IHBhZ2UgcG9zaXRpb246ICcgKyBwYWdlUG9zaXRpb24ueCArICcsJyArIHBhZ2VQb3NpdGlvbi55KTtcbiAgICAgICAgICAgIHVuc2V0UGFnZVBvc2l0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bnNldFBhZ2VQb3NpdGlvbigpIHtcbiAgICAgICAgcGFnZVBvc2l0aW9uID0gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNldElGcmFtZShtZXNzYWdlRGF0YSkge1xuICAgICAgICBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgICAgICAgIHNldFNpemUobWVzc2FnZURhdGEpO1xuICAgICAgICAgICAgdHJpZ2dlcigncmVzZXQnLCAncmVzZXQnLCBtZXNzYWdlRGF0YS5pZnJhbWUsIG1lc3NhZ2VEYXRhLmlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvZyhtZXNzYWdlRGF0YS5pZCwgJ1NpemUgcmVzZXQgcmVxdWVzdGVkIGJ5ICcgKyAoJ2luaXQnID09PSBtZXNzYWdlRGF0YS50eXBlID8gJ2hvc3QgcGFnZScgOiAnaUZyYW1lJykpO1xuICAgICAgICBnZXRQYWdlUG9zaXRpb24obWVzc2FnZURhdGEuaWQpO1xuICAgICAgICBzeW5jUmVzaXplKHJlc2V0LCBtZXNzYWdlRGF0YSwgJ3Jlc2V0Jyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0U2l6ZShtZXNzYWdlRGF0YSkge1xuICAgICAgICBmdW5jdGlvbiBzZXREaW1lbnNpb24oZGltZW5zaW9uKSB7XG4gICAgICAgICAgICBtZXNzYWdlRGF0YS5pZnJhbWUuc3R5bGVbZGltZW5zaW9uXSA9IG1lc3NhZ2VEYXRhW2RpbWVuc2lvbl0gKyAncHgnO1xuICAgICAgICAgICAgbG9nKFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VEYXRhLmlkLFxuICAgICAgICAgICAgICAgICdJRnJhbWUgKCcgKyBpZnJhbWVJZCArXG4gICAgICAgICAgICAgICAgJykgJyArIGRpbWVuc2lvbiArXG4gICAgICAgICAgICAgICAgJyBzZXQgdG8gJyArIG1lc3NhZ2VEYXRhW2RpbWVuc2lvbl0gKyAncHgnXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hrWmVybyhkaW1lbnNpb24pIHtcbiAgICAgICAgICAgIC8vRmlyZUZveCBzZXRzIGRpbWVuc2lvbiBvZiBoaWRkZW4gaUZyYW1lcyB0byB6ZXJvLlxuICAgICAgICAgICAgLy9TbyBpZiB3ZSBkZXRlY3QgdGhhdCBzZXQgdXAgYW4gZXZlbnQgdG8gY2hlY2sgZm9yXG4gICAgICAgICAgICAvL3doZW4gaUZyYW1lIGJlY29tZXMgdmlzaWJsZS5cblxuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gIC8vTm90IHRlc3RhYmxlIGluIFBoYW50b21KU1xuICAgICAgICAgICAgaWYgKCFoaWRkZW5DaGVja0VuYWJsZWQgJiYgJzAnID09PSBtZXNzYWdlRGF0YVtkaW1lbnNpb25dKSB7XG4gICAgICAgICAgICAgICAgaGlkZGVuQ2hlY2tFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBsb2coaWZyYW1lSWQsICdIaWRkZW4gaUZyYW1lIGRldGVjdGVkLCBjcmVhdGluZyB2aXNpYmlsaXR5IGxpc3RlbmVyJyk7XG4gICAgICAgICAgICAgICAgZml4SGlkZGVuSUZyYW1lcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc0RpbWVuc2lvbihkaW1lbnNpb24pIHtcbiAgICAgICAgICAgIHNldERpbWVuc2lvbihkaW1lbnNpb24pO1xuICAgICAgICAgICAgY2hrWmVybyhkaW1lbnNpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGlmcmFtZUlkID0gbWVzc2FnZURhdGEuaWZyYW1lLmlkO1xuXG4gICAgICAgIGlmIChzZXR0aW5nc1tpZnJhbWVJZF0pIHtcbiAgICAgICAgICAgIGlmIChzZXR0aW5nc1tpZnJhbWVJZF0uc2l6ZUhlaWdodCkge1xuICAgICAgICAgICAgICAgIHByb2Nlc3NEaW1lbnNpb24oJ2hlaWdodCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNldHRpbmdzW2lmcmFtZUlkXS5zaXplV2lkdGgpIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzRGltZW5zaW9uKCd3aWR0aCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3luY1Jlc2l6ZShmdW5jLCBtZXNzYWdlRGF0YSwgZG9Ob3RTeW5jKSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqLyAgLy9Ob3QgdGVzdGFibGUgaW4gUGhhbnRvbUpTXG4gICAgICAgIGlmIChkb05vdFN5bmMgIT09IG1lc3NhZ2VEYXRhLnR5cGUgJiYgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgICAgICBsb2cobWVzc2FnZURhdGEuaWQsICdSZXF1ZXN0aW5nIGFuaW1hdGlvbiBmcmFtZScpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnVuYygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJpZ2dlcihjYWxsZWVNc2csIG1zZywgaWZyYW1lLCBpZCkge1xuICAgICAgICBmdW5jdGlvbiBwb3N0TWVzc2FnZVRvSUZyYW1lKCkge1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IHNldHRpbmdzW2lkXS50YXJnZXRPcmlnaW47XG4gICAgICAgICAgICBsb2coaWQsICdbJyArIGNhbGxlZU1zZyArICddIFNlbmRpbmcgbXNnIHRvIGlmcmFtZVsnICsgaWQgKyAnXSAoJyArIG1zZyArICcpIHRhcmdldE9yaWdpbjogJyArIHRhcmdldCk7XG4gICAgICAgICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZShtc2dJZCArIG1zZywgdGFyZ2V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlGcmFtZU5vdEZvdW5kKCkge1xuICAgICAgICAgICAgd2FybihpZCwgJ1snICsgY2FsbGVlTXNnICsgJ10gSUZyYW1lKCcgKyBpZCArICcpIG5vdCBmb3VuZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hrQW5kU2VuZCgpIHtcbiAgICAgICAgICAgIGlmIChpZnJhbWUgJiYgJ2NvbnRlbnRXaW5kb3cnIGluIGlmcmFtZSAmJiAobnVsbCAhPT0gaWZyYW1lLmNvbnRlbnRXaW5kb3cpKSB7IC8vTnVsbCB0ZXN0IGZvciBQaGFudG9tSlNcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZVRvSUZyYW1lKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlGcmFtZU5vdEZvdW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZCA9IGlkIHx8IGlmcmFtZS5pZDtcblxuICAgICAgICBpZiAoc2V0dGluZ3NbaWRdKSB7XG4gICAgICAgICAgICBjaGtBbmRTZW5kKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZU91dGdvaW5nTXNnKGlmcmFtZUlkKSB7XG4gICAgICAgIHJldHVybiBpZnJhbWVJZCArXG4gICAgICAgICAgICAnOicgKyBzZXR0aW5nc1tpZnJhbWVJZF0uYm9keU1hcmdpblYxICtcbiAgICAgICAgICAgICc6JyArIHNldHRpbmdzW2lmcmFtZUlkXS5zaXplV2lkdGggK1xuICAgICAgICAgICAgJzonICsgc2V0dGluZ3NbaWZyYW1lSWRdLmxvZyArXG4gICAgICAgICAgICAnOicgKyBzZXR0aW5nc1tpZnJhbWVJZF0uaW50ZXJ2YWwgK1xuICAgICAgICAgICAgJzonICsgc2V0dGluZ3NbaWZyYW1lSWRdLmVuYWJsZVB1YmxpY01ldGhvZHMgK1xuICAgICAgICAgICAgJzonICsgc2V0dGluZ3NbaWZyYW1lSWRdLmF1dG9SZXNpemUgK1xuICAgICAgICAgICAgJzonICsgc2V0dGluZ3NbaWZyYW1lSWRdLmJvZHlNYXJnaW4gK1xuICAgICAgICAgICAgJzonICsgc2V0dGluZ3NbaWZyYW1lSWRdLmhlaWdodENhbGN1bGF0aW9uTWV0aG9kICtcbiAgICAgICAgICAgICc6JyArIHNldHRpbmdzW2lmcmFtZUlkXS5ib2R5QmFja2dyb3VuZCArXG4gICAgICAgICAgICAnOicgKyBzZXR0aW5nc1tpZnJhbWVJZF0uYm9keVBhZGRpbmcgK1xuICAgICAgICAgICAgJzonICsgc2V0dGluZ3NbaWZyYW1lSWRdLnRvbGVyYW5jZSArXG4gICAgICAgICAgICAnOicgKyBzZXR0aW5nc1tpZnJhbWVJZF0uaW5QYWdlTGlua3MgK1xuICAgICAgICAgICAgJzonICsgc2V0dGluZ3NbaWZyYW1lSWRdLnJlc2l6ZUZyb20gK1xuICAgICAgICAgICAgJzonICsgc2V0dGluZ3NbaWZyYW1lSWRdLndpZHRoQ2FsY3VsYXRpb25NZXRob2Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXBJRnJhbWUoaWZyYW1lLCBvcHRpb25zKSB7XG4gICAgICAgIGZ1bmN0aW9uIHNldExpbWl0cygpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGFkZFN0eWxlKHN0eWxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKChJbmZpbml0eSAhPT0gc2V0dGluZ3NbaWZyYW1lSWRdW3N0eWxlXSkgJiYgKDAgIT09IHNldHRpbmdzW2lmcmFtZUlkXVtzdHlsZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmcmFtZS5zdHlsZVtzdHlsZV0gPSBzZXR0aW5nc1tpZnJhbWVJZF1bc3R5bGVdICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgbG9nKGlmcmFtZUlkLCAnU2V0ICcgKyBzdHlsZSArICcgPSAnICsgc2V0dGluZ3NbaWZyYW1lSWRdW3N0eWxlXSArICdweCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY2hrTWluTWF4KGRpbWVuc2lvbikge1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5nc1tpZnJhbWVJZF1bJ21pbicgKyBkaW1lbnNpb25dID4gc2V0dGluZ3NbaWZyYW1lSWRdWydtYXgnICsgZGltZW5zaW9uXSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIGZvciBtaW4nICsgZGltZW5zaW9uICsgJyBjYW4gbm90IGJlIGdyZWF0ZXIgdGhhbiBtYXgnICsgZGltZW5zaW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNoa01pbk1heCgnSGVpZ2h0Jyk7XG4gICAgICAgICAgICBjaGtNaW5NYXgoJ1dpZHRoJyk7XG5cbiAgICAgICAgICAgIGFkZFN0eWxlKCdtYXhIZWlnaHQnKTtcbiAgICAgICAgICAgIGFkZFN0eWxlKCdtaW5IZWlnaHQnKTtcbiAgICAgICAgICAgIGFkZFN0eWxlKCdtYXhXaWR0aCcpO1xuICAgICAgICAgICAgYWRkU3R5bGUoJ21pbldpZHRoJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBuZXdJZCgpIHtcbiAgICAgICAgICAgIHZhciBpZCA9ICgob3B0aW9ucyAmJiBvcHRpb25zLmlkKSB8fCBkZWZhdWx0cy5pZCArIGNvdW50KyspO1xuICAgICAgICAgICAgaWYgKG51bGwgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSkge1xuICAgICAgICAgICAgICAgIGlkID0gaWQgKyBjb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZW5zdXJlSGFzSWQoaWZyYW1lSWQpIHtcbiAgICAgICAgICAgIGxvZ0lkID0gaWZyYW1lSWQ7XG4gICAgICAgICAgICBpZiAoJycgPT09IGlmcmFtZUlkKSB7XG4gICAgICAgICAgICAgICAgaWZyYW1lLmlkID0gaWZyYW1lSWQgPSBuZXdJZCgpO1xuICAgICAgICAgICAgICAgIGxvZ0VuYWJsZWQgPSAob3B0aW9ucyB8fCB7fSkubG9nO1xuICAgICAgICAgICAgICAgIGxvZ0lkID0gaWZyYW1lSWQ7XG4gICAgICAgICAgICAgICAgbG9nKGlmcmFtZUlkLCAnQWRkZWQgbWlzc2luZyBpZnJhbWUgSUQ6ICcgKyBpZnJhbWVJZCArICcgKCcgKyBpZnJhbWUuc3JjICsgJyknKTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICByZXR1cm4gaWZyYW1lSWQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRTY3JvbGxpbmcoKSB7XG4gICAgICAgICAgICBsb2coaWZyYW1lSWQsICdJRnJhbWUgc2Nyb2xsaW5nICcgKyAoc2V0dGluZ3NbaWZyYW1lSWRdLnNjcm9sbGluZyA/ICdlbmFibGVkJyA6ICdkaXNhYmxlZCcpICsgJyBmb3IgJyArIGlmcmFtZUlkKTtcbiAgICAgICAgICAgIGlmcmFtZS5zdHlsZS5vdmVyZmxvdyA9IGZhbHNlID09PSBzZXR0aW5nc1tpZnJhbWVJZF0uc2Nyb2xsaW5nID8gJ2hpZGRlbicgOiAnYXV0byc7XG4gICAgICAgICAgICBpZnJhbWUuc2Nyb2xsaW5nID0gZmFsc2UgPT09IHNldHRpbmdzW2lmcmFtZUlkXS5zY3JvbGxpbmcgPyAnbm8nIDogJ3llcyc7XG4gICAgICAgIH1cblxuICAgICAgICAvL1RoZSBWMSBpRnJhbWUgc2NyaXB0IGV4cGVjdHMgYW4gaW50LCB3aGVyZSBhcyBpbiBWMiBleHBlY3RzIGEgQ1NTXG4gICAgICAgIC8vc3RyaW5nIHZhbHVlIHN1Y2ggYXMgJzFweCAzZW0nLCBzbyBpZiB3ZSBoYXZlIGFuIGludCBmb3IgVjIsIHNldCBWMT1WMlxuICAgICAgICAvL2FuZCB0aGVuIGNvbnZlcnQgVjIgdG8gYSBzdHJpbmcgUFggdmFsdWUuXG4gICAgICAgIGZ1bmN0aW9uIHNldHVwQm9keU1hcmdpblZhbHVlcygpIHtcbiAgICAgICAgICAgIGlmICgoJ251bWJlcicgPT09IHR5cGVvZiAoc2V0dGluZ3NbaWZyYW1lSWRdLmJvZHlNYXJnaW4pKSB8fCAoJzAnID09PSBzZXR0aW5nc1tpZnJhbWVJZF0uYm9keU1hcmdpbikpIHtcbiAgICAgICAgICAgICAgICBzZXR0aW5nc1tpZnJhbWVJZF0uYm9keU1hcmdpblYxID0gc2V0dGluZ3NbaWZyYW1lSWRdLmJvZHlNYXJnaW47XG4gICAgICAgICAgICAgICAgc2V0dGluZ3NbaWZyYW1lSWRdLmJvZHlNYXJnaW4gPSAnJyArIHNldHRpbmdzW2lmcmFtZUlkXS5ib2R5TWFyZ2luICsgJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrUmVzZXQoKSB7XG4gICAgICAgICAgICAvLyBSZWR1Y2Ugc2NvcGUgb2YgZmlyc3RSdW4gdG8gZnVuY3Rpb24sIGJlY2F1c2UgSUU4J3MgSlMgZXhlY3V0aW9uXG4gICAgICAgICAgICAvLyBjb250ZXh0IHN0YWNrIGlzIGJvcmtlZCBhbmQgdGhpcyB2YWx1ZSBnZXRzIGV4dGVybmFsbHlcbiAgICAgICAgICAgIC8vIGNoYW5nZWQgbWlkd2F5IHRocm91Z2ggcnVubmluZyB0aGlzIGZ1bmN0aW9uISEhXG4gICAgICAgICAgICB2YXJcbiAgICAgICAgICAgICAgICBmaXJzdFJ1biA9IHNldHRpbmdzW2lmcmFtZUlkXS5maXJzdFJ1bixcbiAgICAgICAgICAgICAgICByZXNldFJlcXVlcnRNZXRob2QgPSBzZXR0aW5nc1tpZnJhbWVJZF0uaGVpZ2h0Q2FsY3VsYXRpb25NZXRob2QgaW4gcmVzZXRSZXF1aXJlZE1ldGhvZHM7XG5cbiAgICAgICAgICAgIGlmICghZmlyc3RSdW4gJiYgcmVzZXRSZXF1ZXJ0TWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgcmVzZXRJRnJhbWUoe2lmcmFtZTogaWZyYW1lLCBoZWlnaHQ6IDAsIHdpZHRoOiAwLCB0eXBlOiAnaW5pdCd9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldHVwSUZyYW1lT2JqZWN0KCkge1xuICAgICAgICAgICAgaWYgKEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKSB7IC8vSWdub3JlIHVucG9seWZpbGxlZCBJRTguXG4gICAgICAgICAgICAgICAgc2V0dGluZ3NbaWZyYW1lSWRdLmlmcmFtZS5pRnJhbWVSZXNpemVyID0ge1xuXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlOiBjbG9zZUlGcmFtZS5iaW5kKG51bGwsIHNldHRpbmdzW2lmcmFtZUlkXS5pZnJhbWUpLFxuXG4gICAgICAgICAgICAgICAgICAgIHJlc2l6ZTogdHJpZ2dlci5iaW5kKG51bGwsICdXaW5kb3cgcmVzaXplJywgJ3Jlc2l6ZScsIHNldHRpbmdzW2lmcmFtZUlkXS5pZnJhbWUpLFxuXG4gICAgICAgICAgICAgICAgICAgIG1vdmVUb0FuY2hvcjogZnVuY3Rpb24gKGFuY2hvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcignTW92ZSB0byBhbmNob3InLCAnbW92ZVRvQW5jaG9yOicgKyBhbmNob3IsIHNldHRpbmdzW2lmcmFtZUlkXS5pZnJhbWUsIGlmcmFtZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICBzZW5kTWVzc2FnZTogZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeShtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXIoJ1NlbmQgTWVzc2FnZScsICdtZXNzYWdlOicgKyBtZXNzYWdlLCBzZXR0aW5nc1tpZnJhbWVJZF0uaWZyYW1lLCBpZnJhbWVJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9XZSBoYXZlIHRvIGNhbGwgdHJpZ2dlciB0d2ljZSwgYXMgd2UgY2FuIG5vdCBiZSBzdXJlIGlmIGFsbFxuICAgICAgICAvL2lmcmFtZXMgaGF2ZSBjb21wbGV0ZWQgbG9hZGluZyB3aGVuIHRoaXMgY29kZSBydW5zLiBUaGVcbiAgICAgICAgLy9ldmVudCBsaXN0ZW5lciBhbHNvIGNhdGNoZXMgdGhlIHBhZ2UgY2hhbmdpbmcgaW4gdGhlIGlGcmFtZS5cbiAgICAgICAgZnVuY3Rpb24gaW5pdChtc2cpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGlGcmFtZUxvYWRlZCgpIHtcbiAgICAgICAgICAgICAgICB0cmlnZ2VyKCdpRnJhbWUub25sb2FkJywgbXNnLCBpZnJhbWUpO1xuICAgICAgICAgICAgICAgIGNoZWNrUmVzZXQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihpZnJhbWUsICdsb2FkJywgaUZyYW1lTG9hZGVkKTtcbiAgICAgICAgICAgIHRyaWdnZXIoJ2luaXQnLCBtc2csIGlmcmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjaGVja09wdGlvbnMob3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKCdvYmplY3QnICE9PSB0eXBlb2Ygb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09wdGlvbnMgaXMgbm90IGFuIG9iamVjdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY29weU9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICAgICAgZm9yICh2YXIgb3B0aW9uIGluIGRlZmF1bHRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRlZmF1bHRzLmhhc093blByb3BlcnR5KG9wdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3NbaWZyYW1lSWRdW29wdGlvbl0gPSBvcHRpb25zLmhhc093blByb3BlcnR5KG9wdGlvbikgPyBvcHRpb25zW29wdGlvbl0gOiBkZWZhdWx0c1tvcHRpb25dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFRhcmdldE9yaWdpbihyZW1vdGVIb3N0KSB7XG4gICAgICAgICAgICByZXR1cm4gKCcnID09PSByZW1vdGVIb3N0IHx8ICdmaWxlOi8vJyA9PT0gcmVtb3RlSG9zdCkgPyAnKicgOiByZW1vdGVIb3N0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc09wdGlvbnMob3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgICAgICBzZXR0aW5nc1tpZnJhbWVJZF0gPSB7XG4gICAgICAgICAgICAgICAgZmlyc3RSdW46IHRydWUsXG4gICAgICAgICAgICAgICAgaWZyYW1lOiBpZnJhbWUsXG4gICAgICAgICAgICAgICAgcmVtb3RlSG9zdDogaWZyYW1lLnNyYy5zcGxpdCgnLycpLnNsaWNlKDAsIDMpLmpvaW4oJy8nKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY2hlY2tPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICAgICAgY29weU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHNldHRpbmdzW2lmcmFtZUlkXS50YXJnZXRPcmlnaW4gPSB0cnVlID09PSBzZXR0aW5nc1tpZnJhbWVJZF0uY2hlY2tPcmlnaW4gPyBnZXRUYXJnZXRPcmlnaW4oc2V0dGluZ3NbaWZyYW1lSWRdLnJlbW90ZUhvc3QpIDogJyonO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYmVlbkhlcmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gKGlmcmFtZUlkIGluIHNldHRpbmdzICYmICdpRnJhbWVSZXNpemVyJyBpbiBpZnJhbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGlmcmFtZUlkID0gZW5zdXJlSGFzSWQoaWZyYW1lLmlkKTtcblxuICAgICAgICBpZiAoIWJlZW5IZXJlKCkpIHtcbiAgICAgICAgICAgIHByb2Nlc3NPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICAgICAgc2V0U2Nyb2xsaW5nKCk7XG4gICAgICAgICAgICBzZXRMaW1pdHMoKTtcbiAgICAgICAgICAgIHNldHVwQm9keU1hcmdpblZhbHVlcygpO1xuICAgICAgICAgICAgaW5pdChjcmVhdGVPdXRnb2luZ01zZyhpZnJhbWVJZCkpO1xuICAgICAgICAgICAgc2V0dXBJRnJhbWVPYmplY3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdhcm4oaWZyYW1lSWQsICdJZ25vcmVkIGlGcmFtZSwgYWxyZWFkeSBzZXR1cC4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlYm91Y2UoZm4sIHRpbWUpIHtcbiAgICAgICAgaWYgKG51bGwgPT09IHRpbWVyKSB7XG4gICAgICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgfSwgdGltZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyAgLy9Ob3QgdGVzdGFibGUgaW4gUGhhbnRvbUpTXG4gICAgZnVuY3Rpb24gZml4SGlkZGVuSUZyYW1lcygpIHtcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tJRnJhbWVzKCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gY2hlY2tJRnJhbWUoc2V0dGluZ0lkKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY2hrRGltZW5zaW9uKGRpbWVuc2lvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzBweCcgPT09IHNldHRpbmdzW3NldHRpbmdJZF0uaWZyYW1lLnN0eWxlW2RpbWVuc2lvbl07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaXNWaXNpYmxlKGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAobnVsbCAhPT0gZWwub2Zmc2V0UGFyZW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNWaXNpYmxlKHNldHRpbmdzW3NldHRpbmdJZF0uaWZyYW1lKSAmJiAoY2hrRGltZW5zaW9uKCdoZWlnaHQnKSB8fCBjaGtEaW1lbnNpb24oJ3dpZHRoJykpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXIoJ1Zpc2liaWxpdHkgY2hhbmdlJywgJ3Jlc2l6ZScsIHNldHRpbmdzW3NldHRpbmdJZF0uaWZyYW1lLCBzZXR0aW5nSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgc2V0dGluZ0lkIGluIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgY2hlY2tJRnJhbWUoc2V0dGluZ0lkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG11dGF0aW9uT2JzZXJ2ZWQobXV0YXRpb25zKSB7XG4gICAgICAgICAgICBsb2coJ3dpbmRvdycsICdNdXRhdGlvbiBvYnNlcnZlZDogJyArIG11dGF0aW9uc1swXS50YXJnZXQgKyAnICcgKyBtdXRhdGlvbnNbMF0udHlwZSk7XG4gICAgICAgICAgICBkZWJvdWNlKGNoZWNrSUZyYW1lcywgMTYpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgICAgICAgICAgIHZhclxuICAgICAgICAgICAgICAgIHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSxcblxuICAgICAgICAgICAgICAgIGNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlT2xkVmFsdWU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJEYXRhT2xkVmFsdWU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWVcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihtdXRhdGlvbk9ic2VydmVkKTtcblxuICAgICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXQsIGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgTXV0YXRpb25PYnNlcnZlciA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyIHx8IHdpbmRvdy5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXG4gICAgICAgIGlmIChNdXRhdGlvbk9ic2VydmVyKSBjcmVhdGVNdXRhdGlvbk9ic2VydmVyKCk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiByZXNpemVJRnJhbWVzKGV2ZW50KSB7XG4gICAgICAgIGZ1bmN0aW9uIHJlc2l6ZSgpIHtcbiAgICAgICAgICAgIHNlbmRUcmlnZ2VyTXNnKCdXaW5kb3cgJyArIGV2ZW50LCAncmVzaXplJyk7XG4gICAgICAgIH1cblxuICAgICAgICBsb2coJ3dpbmRvdycsICdUcmlnZ2VyIGV2ZW50OiAnICsgZXZlbnQpO1xuICAgICAgICBkZWJvdWNlKHJlc2l6ZSwgMTYpO1xuICAgIH1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovICAvL05vdCB0ZXN0YWJsZSBpbiBQaGFudG9tSlNcbiAgICBmdW5jdGlvbiB0YWJWaXNpYmxlKCkge1xuICAgICAgICBmdW5jdGlvbiByZXNpemUoKSB7XG4gICAgICAgICAgICBzZW5kVHJpZ2dlck1zZygnVGFiIFZpc2FibGUnLCAncmVzaXplJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2hpZGRlbicgIT09IGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSkge1xuICAgICAgICAgICAgbG9nKCdkb2N1bWVudCcsICdUcmlnZ2VyIGV2ZW50OiBWaXNpYmxpdHkgY2hhbmdlJyk7XG4gICAgICAgICAgICBkZWJvdWNlKHJlc2l6ZSwgMTYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2VuZFRyaWdnZXJNc2coZXZlbnROYW1lLCBldmVudCkge1xuICAgICAgICBmdW5jdGlvbiBpc0lGcmFtZVJlc2l6ZUVuYWJsZWQoaWZyYW1lSWQpIHtcbiAgICAgICAgICAgIHJldHVybiAncGFyZW50JyA9PT0gc2V0dGluZ3NbaWZyYW1lSWRdLnJlc2l6ZUZyb20gJiZcbiAgICAgICAgICAgICAgICBzZXR0aW5nc1tpZnJhbWVJZF0uYXV0b1Jlc2l6ZSAmJlxuICAgICAgICAgICAgICAgICFzZXR0aW5nc1tpZnJhbWVJZF0uZmlyc3RSdW47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpZnJhbWVJZCBpbiBzZXR0aW5ncykge1xuICAgICAgICAgICAgaWYgKGlzSUZyYW1lUmVzaXplRW5hYmxlZChpZnJhbWVJZCkpIHtcbiAgICAgICAgICAgICAgICB0cmlnZ2VyKGV2ZW50TmFtZSwgZXZlbnQsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlmcmFtZUlkKSwgaWZyYW1lSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXBFdmVudExpc3RlbmVycygpIHtcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdtZXNzYWdlJywgaUZyYW1lTGlzdGVuZXIpO1xuXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIod2luZG93LCAncmVzaXplJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVzaXplSUZyYW1lcygncmVzaXplJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoZG9jdW1lbnQsICd2aXNpYmlsaXR5Y2hhbmdlJywgdGFiVmlzaWJsZSk7XG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoZG9jdW1lbnQsICctd2Via2l0LXZpc2liaWxpdHljaGFuZ2UnLCB0YWJWaXNpYmxlKTsgLy9BbmRyaW9kIDQuNFxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ2ZvY3VzaW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXNpemVJRnJhbWVzKCdmb2N1cycpO1xuICAgICAgICB9KTsgLy9JRTgtOVxuICAgICAgICBhZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVzaXplSUZyYW1lcygnZm9jdXMnKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBmYWN0b3J5KCkge1xuICAgICAgICBmdW5jdGlvbiBpbml0KG9wdGlvbnMsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNoa1R5cGUoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50LnRhZ05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0IGlzIG5vdCBhIHZhbGlkIERPTSBlbGVtZW50Jyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgnSUZSQU1FJyAhPT0gZWxlbWVudC50YWdOYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgPElGUkFNRT4gdGFnLCBmb3VuZCA8JyArIGVsZW1lbnQudGFnTmFtZSArICc+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGNoa1R5cGUoKTtcbiAgICAgICAgICAgICAgICBzZXR1cElGcmFtZShlbGVtZW50LCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICBpRnJhbWVzLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB3YXJuRGVwcmVjYXRlZE9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lbmFibGVQdWJsaWNNZXRob2RzKSB7XG4gICAgICAgICAgICAgICAgd2FybignZW5hYmxlUHVibGljTWV0aG9kcyBvcHRpb24gaGFzIGJlZW4gcmVtb3ZlZCwgcHVibGljIG1ldGhvZHMgYXJlIG5vdyBhbHdheXMgYXZhaWxhYmxlIGluIHRoZSBpRnJhbWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpRnJhbWVzO1xuXG4gICAgICAgIHNldHVwUmVxdWVzdEFuaW1hdGlvbkZyYW1lKCk7XG4gICAgICAgIHNldHVwRXZlbnRMaXN0ZW5lcnMoKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gaUZyYW1lUmVzaXplRihvcHRpb25zLCB0YXJnZXQpIHtcbiAgICAgICAgICAgIGlGcmFtZXMgPSBbXTsgLy9Pbmx5IHJldHVybiBpRnJhbWVzIHBhc3QgaW4gb24gdGhpcyBjYWxsXG5cbiAgICAgICAgICAgIHdhcm5EZXByZWNhdGVkT3B0aW9ucyhvcHRpb25zKTtcblxuICAgICAgICAgICAgc3dpdGNoICh0eXBlb2YgKHRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRhcmdldCB8fCAnaWZyYW1lJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0LmJpbmQodW5kZWZpbmVkLCBvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgICAgICAgICAgICBpbml0KG9wdGlvbnMsIHRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1VuZXhwZWN0ZWQgZGF0YSB0eXBlICgnICsgdHlwZW9mICh0YXJnZXQpICsgJyknKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGlGcmFtZXM7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlSlF1ZXJ5UHVibGljTWV0aG9kKCQpIHtcbiAgICAgICAgaWYgKCEkLmZuKSB7XG4gICAgICAgICAgICBpbmZvKCcnLCAnVW5hYmxlIHRvIGJpbmQgdG8galF1ZXJ5LCBpdCBpcyBub3QgZnVsbHkgbG9hZGVkLicpO1xuICAgICAgICB9IGVsc2UgaWYgKCEkLmZuLmlGcmFtZVJlc2l6ZSkge1xuICAgICAgICAgICAgJC5mbi5pRnJhbWVSZXNpemUgPSBmdW5jdGlvbiAkaUZyYW1lUmVzaXplRihvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdChpbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBzZXR1cElGcmFtZShlbGVtZW50LCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXIoJ2lmcmFtZScpLmVhY2goaW5pdCkuZW5kKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHdpbmRvdy5qUXVlcnkpIHtcbiAgICAgICAgY3JlYXRlSlF1ZXJ5UHVibGljTWV0aG9kKGpRdWVyeSk7XG4gICAgfVxuXG4gICAgd2luZG93LmlGcmFtZVJlc2l6ZSA9IHdpbmRvdy5pRnJhbWVSZXNpemUgfHwgZmFjdG9yeSgpO1xuXG59KSh3aW5kb3cgfHwge30pO1xuIl19
