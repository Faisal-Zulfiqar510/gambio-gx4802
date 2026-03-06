<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr">
    <head>
        <meta http-equiv="Content-Type" content="text/html" />
        <title>Gambio GmbH</title>
        <link rel="shortcut icon" href="images/logos/favicon.ico" type="image/x-icon" />
        <style>/* compiled by scssphp v0.5.1 on Fri, 20 Sep 2019 10:43:19 +0200 (4.2588s) */

/* Bootstrap Variables
 ==========================================================================
 Use this section to override Bootstrap defaults. Find all possible
 variables in public/theme/styles/bootstrap/bootstrap/_variables.scss
 !!!!!IMPORTANT!!!!!
 Do not use this file to defined calculated variables
 unless that the source variables (variables used on the calculation) are not overwritten by StyleEdit.
 calculated variables for wich the source variables can be overwritten by styleEdit
 must be defined on _bootstrap_variables_calculated.scss
 */
/*!
 *    _bootstrap_variables_calculated.scss 2019-6-3
 *    Gambio GmbH
 *    http://www.gambio.de
 *    Copyright (c) 2016 Gambio GmbH
 *    Released under the GNU General Public License (Version 2)
 *    [http://www.gnu.org/licenses/gpl-2.0.html]
 *    --------------------------------------------------------------------------------------------------
 */
/* Template Variables
 ==========================================================================
 Layout and functionality relevant variables for the template
 */
/* Bootstrap */
/* $gx-topbar-height + $search-height + $gx-categories-height;*/
/* can be 0 to hide */
/*!------------------------------------------------------------------------------
 -    _variable-aliases.scss 2019-09-18
 -    Gambio GmbH
 -    http://www.gambio.de
 -    Copyright (c) 2019 Gambio GmbH
 -    Released under the GNU General Public License (Version 2)
 -    [http://www.gnu.org/licenses/gpl-2.0.html]
 -    ---------------------------------------------------------------------------*/
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  src: local('Roboto Light'), local('Roboto-Light'), url(public/fonts/KFOlCnqEu92Fr1MmSU5fBBc9.ttf) format('truetype'); }

@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: local('Roboto'), local('Roboto-Regular'), url(public/fonts/KFOmCnqEu92Fr1Mu4mxP.ttf) format('truetype'); }

@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: local('Roboto Bold'), local('Roboto-Bold'), url(public/fonts/KFOlCnqEu92Fr1MmWUlfBBc9.ttf) format('truetype'); }

@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 900;
  src: local('Roboto Black'), local('Roboto-Black'), url(public/fonts/KFOlCnqEu92Fr1MmYUtfBBc9.ttf) format('truetype'); }

@font-face {
  font-family: 'Glyphicons Halflings';
  src: url('public/theme/fonts/bootstrap/glyphicons-halflings-regular.eot');
  src: url('public/theme/fonts/bootstrap/glyphicons-halflings-regular.eot?#iefix') format('embedded-opentype'), url('public/theme/fonts/bootstrap/glyphicons-halflings-regular.woff2') format('woff2'), url('public/theme/fonts/bootstrap/glyphicons-halflings-regular.woff') format('woff'), url('public/theme/fonts/bootstrap/glyphicons-halflings-regular.ttf') format('truetype'), url('public/theme/fonts/bootstrap/glyphicons-halflings-regular.svg#glyphicons_halflingsregular') format('svg'); }
/*!
 * Font Awesome Free 5.6.3 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
.fa, .fas, .ui-datepicker .ui-datepicker-header .ui-datepicker-prev:after, .ui-datepicker .ui-datepicker-header .ui-datepicker-next:after, .far, .fal, .fab {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1; }

.ui-datepicker .ui-datepicker-header .ui-datepicker-prev:after, .ui-datepicker .ui-datepicker-header .ui-datepicker-next:after {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  font-weight: normal;
  line-height: 1;
  vertical-align: -0.125em; }

.fa-lg {
  font-size: 1.33333em;
  line-height: 0.75em;
  vertical-align: -0.0667em; }

.fa-xs {
  font-size: 0.75em; }

.fa-sm {
  font-size: 0.875em; }

.fa-1x {
  font-size: 1em; }

.fa-2x {
  font-size: 2em; }

.fa-3x {
  font-size: 3em; }

.fa-4x {
  font-size: 4em; }

.fa-5x {
  font-size: 5em; }

.fa-6x {
  font-size: 6em; }

.fa-7x {
  font-size: 7em; }

.fa-8x {
  font-size: 8em; }

.fa-9x {
  font-size: 9em; }

.fa-10x {
  font-size: 10em; }

.fa-fw {
  text-align: center;
  width: 1.25em; }

.fa-ul {
  list-style-type: none;
  margin-left: 2.5em;
  padding-left: 0; }
  .fa-ul > li {
    position: relative; }

.fa-li {
  left: -2em;
  position: absolute;
  text-align: center;
  width: 2em;
  line-height: inherit; }

.fa-border {
  border: solid 0.08em #eee;
  border-radius: 0.1em;
  padding: 0.2em 0.25em 0.15em; }

.fa-pull-left {
  float: left; }

.fa-pull-right {
  float: right; }

.fa.fa-pull-left, .fas.fa-pull-left, .ui-datepicker .ui-datepicker-header .ui-datepicker-prev:after.fa-pull-left, .ui-datepicker .ui-datepicker-header .ui-datepicker-next:after.fa-pull-left, .far.fa-pull-left, .fal.fa-pull-left, .fab.fa-pull-left {
  margin-right: 0.3em; }
  .fa.fa-pull-right, .fas.fa-pull-right, .ui-datepicker .ui-datepicker-header .ui-datepicker-prev:after.fa-pull-right, .ui-datepicker .ui-datepicker-header .ui-datepicker-next:after.fa-pull-right, .far.fa-pull-right, .fal.fa-pull-right, .fab.fa-pull-right {
    margin-left: 0.3em; }

.fa-spin {
  animation: fa-spin 2s infinite linear; }

.fa-pulse {
  animation: fa-spin 1s infinite steps(8); }

@keyframes fa-spin {
  0% {
    transform: rotate(0deg); }

  100% {
    transform: rotate(360deg); } }

.fa-rotate-90 {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=1)";
  transform: rotate(90deg); }

.fa-rotate-180 {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2)";
  transform: rotate(180deg); }

.fa-rotate-270 {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)";
  transform: rotate(270deg); }

.fa-flip-horizontal {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)";
  transform: scale(-1, 1); }

.fa-flip-vertical {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)";
  transform: scale(1, -1); }

.fa-flip-horizontal.fa-flip-vertical {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)";
  transform: scale(-1, -1); }

:root .fa-rotate-90, :root .fa-rotate-180, :root .fa-rotate-270, :root .fa-flip-horizontal, :root .fa-flip-vertical {
  filter: none; }

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em; }

.fa-stack-1x, .fa-stack-2x {
  left: 0;
  position: absolute;
  text-align: center;
  width: 100%; }

.fa-stack-1x {
  line-height: inherit; }

.fa-stack-2x {
  font-size: 2em; }

.fa-inverse {
  color: #fff; }
/* Font Awesome uses the Unicode Private Use Area (PUA) to ensure screen
 readers do not read off random characters that represent icons */
.fa-500px:before {
  content: "\f26e"; }

.fa-accessible-icon:before {
  content: "\f368"; }

.fa-accusoft:before {
  content: "\f369"; }

.fa-acquisitions-incorporated:before {
  content: "\f6af"; }

.fa-ad:before {
  content: "\f641"; }

.fa-address-book:before {
  content: "\f2b9"; }

.fa-address-card:before {
  content: "\f2bb"; }

.fa-adjust:before {
  content: "\f042"; }

.fa-adn:before {
  content: "\f170"; }

.fa-adobe:before {
  content: "\f778"; }

.fa-adversal:before {
  content: "\f36a"; }

.fa-affiliatetheme:before {
  content: "\f36b"; }

.fa-air-freshener:before {
  content: "\f5d0"; }

.fa-algolia:before {
  content: "\f36c"; }

.fa-align-center:before {
  content: "\f037"; }

.fa-align-justify:before {
  content: "\f039"; }

.fa-align-left:before {
  content: "\f036"; }

.fa-align-right:before {
  content: "\f038"; }

.fa-alipay:before {
  content: "\f642"; }

.fa-allergies:before {
  content: "\f461"; }

.fa-amazon:before {
  content: "\f270"; }

.fa-amazon-pay:before {
  content: "\f42c"; }

.fa-ambulance:before {
  content: "\f0f9"; }

.fa-american-sign-language-interpreting:before {
  content: "\f2a3"; }

.fa-amilia:before {
  content: "\f36d"; }

.fa-anchor:before {
  content: "\f13d"; }

.fa-android:before {
  content: "\f17b"; }

.fa-angellist:before {
  content: "\f209"; }

.fa-angle-double-down:before {
  content: "\f103"; }

.fa-angle-double-left:before {
  content: "\f100"; }

.fa-angle-double-right:before {
  content: "\f101"; }

.fa-angle-double-up:before {
  content: "\f102"; }

.fa-angle-down:before {
  content: "\f107"; }

.fa-angle-left:before {
  content: "\f104"; }

.fa-angle-right:before {
  content: "\f105"; }

.fa-angle-up:before {
  content: "\f106"; }

.fa-angry:before {
  content: "\f556"; }

.fa-angrycreative:before {
  content: "\f36e"; }

.fa-angular:before {
  content: "\f420"; }

.fa-ankh:before {
  content: "\f644"; }

.fa-app-store:before {
  content: "\f36f"; }

.fa-app-store-ios:before {
  content: "\f370"; }

.fa-apper:before {
  content: "\f371"; }

.fa-apple:before {
  content: "\f179"; }

.fa-apple-alt:before {
  content: "\f5d1"; }

.fa-apple-pay:before {
  content: "\f415"; }

.fa-archive:before {
  content: "\f187"; }

.fa-archway:before {
  content: "\f557"; }

.fa-arrow-alt-circle-down:before {
  content: "\f358"; }

.fa-arrow-alt-circle-left:before {
  content: "\f359"; }

.fa-arrow-alt-circle-right:before {
  content: "\f35a"; }

.fa-arrow-alt-circle-up:before {
  content: "\f35b"; }

.fa-arrow-circle-down:before {
  content: "\f0ab"; }

.fa-arrow-circle-left:before {
  content: "\f0a8"; }

.fa-arrow-circle-right:before {
  content: "\f0a9"; }

.fa-arrow-circle-up:before {
  content: "\f0aa"; }

.fa-arrow-down:before {
  content: "\f063"; }

.fa-arrow-left:before {
  content: "\f060"; }

.fa-arrow-right:before {
  content: "\f061"; }

.fa-arrow-up:before {
  content: "\f062"; }

.fa-arrows-alt:before {
  content: "\f0b2"; }

.fa-arrows-alt-h:before {
  content: "\f337"; }

.fa-arrows-alt-v:before {
  content: "\f338"; }

.fa-artstation:before {
  content: "\f77a"; }

.fa-assistive-listening-systems:before {
  content: "\f2a2"; }

.fa-asterisk:before {
  content: "\f069"; }

.fa-asymmetrik:before {
  content: "\f372"; }

.fa-at:before {
  content: "\f1fa"; }

.fa-atlas:before {
  content: "\f558"; }

.fa-atlassian:before {
  content: "\f77b"; }

.fa-atom:before {
  content: "\f5d2"; }

.fa-audible:before {
  content: "\f373"; }

.fa-audio-description:before {
  content: "\f29e"; }

.fa-autoprefixer:before {
  content: "\f41c"; }

.fa-avianex:before {
  content: "\f374"; }

.fa-aviato:before {
  content: "\f421"; }

.fa-award:before {
  content: "\f559"; }

.fa-aws:before {
  content: "\f375"; }

.fa-baby:before {
  content: "\f77c"; }

.fa-baby-carriage:before {
  content: "\f77d"; }

.fa-backspace:before {
  content: "\f55a"; }

.fa-backward:before {
  content: "\f04a"; }

.fa-balance-scale:before {
  content: "\f24e"; }

.fa-ban:before {
  content: "\f05e"; }

.fa-band-aid:before {
  content: "\f462"; }

.fa-bandcamp:before {
  content: "\f2d5"; }

.fa-barcode:before {
  content: "\f02a"; }

.fa-bars:before {
  content: "\f0c9"; }

.fa-baseball-ball:before {
  content: "\f433"; }

.fa-basketball-ball:before {
  content: "\f434"; }

.fa-bath:before {
  content: "\f2cd"; }

.fa-battery-empty:before {
  content: "\f244"; }

.fa-battery-full:before {
  content: "\f240"; }

.fa-battery-half:before {
  content: "\f242"; }

.fa-battery-quarter:before {
  content: "\f243"; }

.fa-battery-three-quarters:before {
  content: "\f241"; }

.fa-bed:before {
  content: "\f236"; }

.fa-beer:before {
  content: "\f0fc"; }

.fa-behance:before {
  content: "\f1b4"; }

.fa-behance-square:before {
  content: "\f1b5"; }

.fa-bell:before {
  content: "\f0f3"; }

.fa-bell-slash:before {
  content: "\f1f6"; }

.fa-bezier-curve:before {
  content: "\f55b"; }

.fa-bible:before {
  content: "\f647"; }

.fa-bicycle:before {
  content: "\f206"; }

.fa-bimobject:before {
  content: "\f378"; }

.fa-binoculars:before {
  content: "\f1e5"; }

.fa-biohazard:before {
  content: "\f780"; }

.fa-birthday-cake:before {
  content: "\f1fd"; }

.fa-bitbucket:before {
  content: "\f171"; }

.fa-bitcoin:before {
  content: "\f379"; }

.fa-bity:before {
  content: "\f37a"; }

.fa-black-tie:before {
  content: "\f27e"; }

.fa-blackberry:before {
  content: "\f37b"; }

.fa-blender:before {
  content: "\f517"; }

.fa-blender-phone:before {
  content: "\f6b6"; }

.fa-blind:before {
  content: "\f29d"; }

.fa-blog:before {
  content: "\f781"; }

.fa-blogger:before {
  content: "\f37c"; }

.fa-blogger-b:before {
  content: "\f37d"; }

.fa-bluetooth:before {
  content: "\f293"; }

.fa-bluetooth-b:before {
  content: "\f294"; }

.fa-bold:before {
  content: "\f032"; }

.fa-bolt:before {
  content: "\f0e7"; }

.fa-bomb:before {
  content: "\f1e2"; }

.fa-bone:before {
  content: "\f5d7"; }

.fa-bong:before {
  content: "\f55c"; }

.fa-book:before {
  content: "\f02d"; }

.fa-book-dead:before {
  content: "\f6b7"; }

.fa-book-open:before {
  content: "\f518"; }

.fa-book-reader:before {
  content: "\f5da"; }

.fa-bookmark:before {
  content: "\f02e"; }

.fa-bowling-ball:before {
  content: "\f436"; }

.fa-box:before {
  content: "\f466"; }

.fa-box-open:before {
  content: "\f49e"; }

.fa-boxes:before {
  content: "\f468"; }

.fa-braille:before {
  content: "\f2a1"; }

.fa-brain:before {
  content: "\f5dc"; }

.fa-briefcase:before {
  content: "\f0b1"; }

.fa-briefcase-medical:before {
  content: "\f469"; }

.fa-broadcast-tower:before {
  content: "\f519"; }

.fa-broom:before {
  content: "\f51a"; }

.fa-brush:before {
  content: "\f55d"; }

.fa-btc:before {
  content: "\f15a"; }

.fa-bug:before {
  content: "\f188"; }

.fa-building:before {
  content: "\f1ad"; }

.fa-bullhorn:before {
  content: "\f0a1"; }

.fa-bullseye:before {
  content: "\f140"; }

.fa-burn:before {
  content: "\f46a"; }

.fa-buromobelexperte:before {
  content: "\f37f"; }

.fa-bus:before {
  content: "\f207"; }

.fa-bus-alt:before {
  content: "\f55e"; }

.fa-business-time:before {
  content: "\f64a"; }

.fa-buysellads:before {
  content: "\f20d"; }

.fa-calculator:before {
  content: "\f1ec"; }

.fa-calendar:before {
  content: "\f133"; }

.fa-calendar-alt:before {
  content: "\f073"; }

.fa-calendar-check:before {
  content: "\f274"; }

.fa-calendar-day:before {
  content: "\f783"; }

.fa-calendar-minus:before {
  content: "\f272"; }

.fa-calendar-plus:before {
  content: "\f271"; }

.fa-calendar-times:before {
  content: "\f273"; }

.fa-calendar-week:before {
  content: "\f784"; }

.fa-camera:before {
  content: "\f030"; }

.fa-camera-retro:before {
  content: "\f083"; }

.fa-campground:before {
  content: "\f6bb"; }

.fa-canadian-maple-leaf:before {
  content: "\f785"; }

.fa-candy-cane:before {
  content: "\f786"; }

.fa-cannabis:before {
  content: "\f55f"; }

.fa-capsules:before {
  content: "\f46b"; }

.fa-car:before {
  content: "\f1b9"; }

.fa-car-alt:before {
  content: "\f5de"; }

.fa-car-battery:before {
  content: "\f5df"; }

.fa-car-crash:before {
  content: "\f5e1"; }

.fa-car-side:before {
  content: "\f5e4"; }

.fa-caret-down:before {
  content: "\f0d7"; }

.fa-caret-left:before {
  content: "\f0d9"; }

.fa-caret-right:before {
  content: "\f0da"; }

.fa-caret-square-down:before {
  content: "\f150"; }

.fa-caret-square-left:before {
  content: "\f191"; }

.fa-caret-square-right:before {
  content: "\f152"; }

.fa-caret-square-up:before {
  content: "\f151"; }

.fa-caret-up:before {
  content: "\f0d8"; }

.fa-carrot:before {
  content: "\f787"; }

.fa-cart-arrow-down:before {
  content: "\f218"; }

.fa-cart-plus:before {
  content: "\f217"; }

.fa-cash-register:before {
  content: "\f788"; }

.fa-cat:before {
  content: "\f6be"; }

.fa-cc-amazon-pay:before {
  content: "\f42d"; }

.fa-cc-amex:before {
  content: "\f1f3"; }

.fa-cc-apple-pay:before {
  content: "\f416"; }

.fa-cc-diners-club:before {
  content: "\f24c"; }

.fa-cc-discover:before {
  content: "\f1f2"; }

.fa-cc-jcb:before {
  content: "\f24b"; }

.fa-cc-mastercard:before {
  content: "\f1f1"; }

.fa-cc-paypal:before {
  content: "\f1f4"; }

.fa-cc-stripe:before {
  content: "\f1f5"; }

.fa-cc-visa:before {
  content: "\f1f0"; }

.fa-centercode:before {
  content: "\f380"; }

.fa-centos:before {
  content: "\f789"; }

.fa-certificate:before {
  content: "\f0a3"; }

.fa-chair:before {
  content: "\f6c0"; }

.fa-chalkboard:before {
  content: "\f51b"; }

.fa-chalkboard-teacher:before {
  content: "\f51c"; }

.fa-charging-station:before {
  content: "\f5e7"; }

.fa-chart-area:before {
  content: "\f1fe"; }

.fa-chart-bar:before {
  content: "\f080"; }

.fa-chart-line:before {
  content: "\f201"; }

.fa-chart-pie:before {
  content: "\f200"; }

.fa-check:before {
  content: "\f00c"; }

.fa-check-circle:before {
  content: "\f058"; }

.fa-check-double:before {
  content: "\f560"; }

.fa-check-square:before {
  content: "\f14a"; }

.fa-chess:before {
  content: "\f439"; }

.fa-chess-bishop:before {
  content: "\f43a"; }

.fa-chess-board:before {
  content: "\f43c"; }

.fa-chess-king:before {
  content: "\f43f"; }

.fa-chess-knight:before {
  content: "\f441"; }

.fa-chess-pawn:before {
  content: "\f443"; }

.fa-chess-queen:before {
  content: "\f445"; }

.fa-chess-rook:before {
  content: "\f447"; }

.fa-chevron-circle-down:before {
  content: "\f13a"; }

.fa-chevron-circle-left:before {
  content: "\f137"; }

.fa-chevron-circle-right:before {
  content: "\f138"; }

.fa-chevron-circle-up:before {
  content: "\f139"; }

.fa-chevron-down:before {
  content: "\f078"; }

.fa-chevron-left:before {
  content: "\f053"; }

.fa-chevron-right:before {
  content: "\f054"; }

.fa-chevron-up:before {
  content: "\f077"; }

.fa-child:before {
  content: "\f1ae"; }

.fa-chrome:before {
  content: "\f268"; }

.fa-church:before {
  content: "\f51d"; }

.fa-circle:before {
  content: "\f111"; }

.fa-circle-notch:before {
  content: "\f1ce"; }

.fa-city:before {
  content: "\f64f"; }

.fa-clipboard:before {
  content: "\f328"; }

.fa-clipboard-check:before {
  content: "\f46c"; }

.fa-clipboard-list:before {
  content: "\f46d"; }

.fa-clock:before {
  content: "\f017"; }

.fa-clone:before {
  content: "\f24d"; }

.fa-closed-captioning:before {
  content: "\f20a"; }

.fa-cloud:before {
  content: "\f0c2"; }

.fa-cloud-download-alt:before {
  content: "\f381"; }

.fa-cloud-meatball:before {
  content: "\f73b"; }

.fa-cloud-moon:before {
  content: "\f6c3"; }

.fa-cloud-moon-rain:before {
  content: "\f73c"; }

.fa-cloud-rain:before {
  content: "\f73d"; }

.fa-cloud-showers-heavy:before {
  content: "\f740"; }

.fa-cloud-sun:before {
  content: "\f6c4"; }

.fa-cloud-sun-rain:before {
  content: "\f743"; }

.fa-cloud-upload-alt:before {
  content: "\f382"; }

.fa-cloudscale:before {
  content: "\f383"; }

.fa-cloudsmith:before {
  content: "\f384"; }

.fa-cloudversify:before {
  content: "\f385"; }

.fa-cocktail:before {
  content: "\f561"; }

.fa-code:before {
  content: "\f121"; }

.fa-code-branch:before {
  content: "\f126"; }

.fa-codepen:before {
  content: "\f1cb"; }

.fa-codiepie:before {
  content: "\f284"; }

.fa-coffee:before {
  content: "\f0f4"; }

.fa-cog:before {
  content: "\f013"; }

.fa-cogs:before {
  content: "\f085"; }

.fa-coins:before {
  content: "\f51e"; }

.fa-columns:before {
  content: "\f0db"; }

.fa-comment:before {
  content: "\f075"; }

.fa-comment-alt:before {
  content: "\f27a"; }

.fa-comment-dollar:before {
  content: "\f651"; }

.fa-comment-dots:before {
  content: "\f4ad"; }

.fa-comment-slash:before {
  content: "\f4b3"; }

.fa-comments:before {
  content: "\f086"; }

.fa-comments-dollar:before {
  content: "\f653"; }

.fa-compact-disc:before {
  content: "\f51f"; }

.fa-compass:before {
  content: "\f14e"; }

.fa-compress:before {
  content: "\f066"; }

.fa-compress-arrows-alt:before {
  content: "\f78c"; }

.fa-concierge-bell:before {
  content: "\f562"; }

.fa-confluence:before {
  content: "\f78d"; }

.fa-connectdevelop:before {
  content: "\f20e"; }

.fa-contao:before {
  content: "\f26d"; }

.fa-cookie:before {
  content: "\f563"; }

.fa-cookie-bite:before {
  content: "\f564"; }

.fa-copy:before {
  content: "\f0c5"; }

.fa-copyright:before {
  content: "\f1f9"; }

.fa-couch:before {
  content: "\f4b8"; }

.fa-cpanel:before {
  content: "\f388"; }

.fa-creative-commons:before {
  content: "\f25e"; }

.fa-creative-commons-by:before {
  content: "\f4e7"; }

.fa-creative-commons-nc:before {
  content: "\f4e8"; }

.fa-creative-commons-nc-eu:before {
  content: "\f4e9"; }

.fa-creative-commons-nc-jp:before {
  content: "\f4ea"; }

.fa-creative-commons-nd:before {
  content: "\f4eb"; }

.fa-creative-commons-pd:before {
  content: "\f4ec"; }

.fa-creative-commons-pd-alt:before {
  content: "\f4ed"; }

.fa-creative-commons-remix:before {
  content: "\f4ee"; }

.fa-creative-commons-sa:before {
  content: "\f4ef"; }

.fa-creative-commons-sampling:before {
  content: "\f4f0"; }

.fa-creative-commons-sampling-plus:before {
  content: "\f4f1"; }

.fa-creative-commons-share:before {
  content: "\f4f2"; }

.fa-creative-commons-zero:before {
  content: "\f4f3"; }

.fa-credit-card:before {
  content: "\f09d"; }

.fa-critical-role:before {
  content: "\f6c9"; }

.fa-crop:before {
  content: "\f125"; }

.fa-crop-alt:before {
  content: "\f565"; }

.fa-cross:before {
  content: "\f654"; }

.fa-crosshairs:before {
  content: "\f05b"; }

.fa-crow:before {
  content: "\f520"; }

.fa-crown:before {
  content: "\f521"; }

.fa-css3:before {
  content: "\f13c"; }

.fa-css3-alt:before {
  content: "\f38b"; }

.fa-cube:before {
  content: "\f1b2"; }

.fa-cubes:before {
  content: "\f1b3"; }

.fa-cut:before {
  content: "\f0c4"; }

.fa-cuttlefish:before {
  content: "\f38c"; }

.fa-d-and-d:before {
  content: "\f38d"; }

.fa-d-and-d-beyond:before {
  content: "\f6ca"; }

.fa-dashcube:before {
  content: "\f210"; }

.fa-database:before {
  content: "\f1c0"; }

.fa-deaf:before {
  content: "\f2a4"; }

.fa-delicious:before {
  content: "\f1a5"; }

.fa-democrat:before {
  content: "\f747"; }

.fa-deploydog:before {
  content: "\f38e"; }

.fa-deskpro:before {
  content: "\f38f"; }

.fa-desktop:before {
  content: "\f108"; }

.fa-dev:before {
  content: "\f6cc"; }

.fa-deviantart:before {
  content: "\f1bd"; }

.fa-dharmachakra:before {
  content: "\f655"; }

.fa-dhl:before {
  content: "\f790"; }

.fa-diagnoses:before {
  content: "\f470"; }

.fa-diaspora:before {
  content: "\f791"; }

.fa-dice:before {
  content: "\f522"; }

.fa-dice-d20:before {
  content: "\f6cf"; }

.fa-dice-d6:before {
  content: "\f6d1"; }

.fa-dice-five:before {
  content: "\f523"; }

.fa-dice-four:before {
  content: "\f524"; }

.fa-dice-one:before {
  content: "\f525"; }

.fa-dice-six:before {
  content: "\f526"; }

.fa-dice-three:before {
  content: "\f527"; }

.fa-dice-two:before {
  content: "\f528"; }

.fa-digg:before {
  content: "\f1a6"; }

.fa-digital-ocean:before {
  content: "\f391"; }

.fa-digital-tachograph:before {
  content: "\f566"; }

.fa-directions:before {
  content: "\f5eb"; }

.fa-discord:before {
  content: "\f392"; }

.fa-discourse:before {
  content: "\f393"; }

.fa-divide:before {
  content: "\f529"; }

.fa-dizzy:before {
  content: "\f567"; }

.fa-dna:before {
  content: "\f471"; }

.fa-dochub:before {
  content: "\f394"; }

.fa-docker:before {
  content: "\f395"; }

.fa-dog:before {
  content: "\f6d3"; }

.fa-dollar-sign:before {
  content: "\f155"; }

.fa-dolly:before {
  content: "\f472"; }

.fa-dolly-flatbed:before {
  content: "\f474"; }

.fa-donate:before {
  content: "\f4b9"; }

.fa-door-closed:before {
  content: "\f52a"; }

.fa-door-open:before {
  content: "\f52b"; }

.fa-dot-circle:before {
  content: "\f192"; }

.fa-dove:before {
  content: "\f4ba"; }

.fa-download:before {
  content: "\f019"; }

.fa-draft2digital:before {
  content: "\f396"; }

.fa-drafting-compass:before {
  content: "\f568"; }

.fa-dragon:before {
  content: "\f6d5"; }

.fa-draw-polygon:before {
  content: "\f5ee"; }

.fa-dribbble:before {
  content: "\f17d"; }

.fa-dribbble-square:before {
  content: "\f397"; }

.fa-dropbox:before {
  content: "\f16b"; }

.fa-drum:before {
  content: "\f569"; }

.fa-drum-steelpan:before {
  content: "\f56a"; }

.fa-drumstick-bite:before {
  content: "\f6d7"; }

.fa-drupal:before {
  content: "\f1a9"; }

.fa-dumbbell:before {
  content: "\f44b"; }

.fa-dumpster:before {
  content: "\f793"; }

.fa-dumpster-fire:before {
  content: "\f794"; }

.fa-dungeon:before {
  content: "\f6d9"; }

.fa-dyalog:before {
  content: "\f399"; }

.fa-earlybirds:before {
  content: "\f39a"; }

.fa-ebay:before {
  content: "\f4f4"; }

.fa-edge:before {
  content: "\f282"; }

.fa-edit:before {
  content: "\f044"; }

.fa-eject:before {
  content: "\f052"; }

.fa-elementor:before {
  content: "\f430"; }

.fa-ellipsis-h:before {
  content: "\f141"; }

.fa-ellipsis-v:before {
  content: "\f142"; }

.fa-ello:before {
  content: "\f5f1"; }

.fa-ember:before {
  content: "\f423"; }

.fa-empire:before {
  content: "\f1d1"; }

.fa-envelope:before {
  content: "\f0e0"; }

.fa-envelope-open:before {
  content: "\f2b6"; }

.fa-envelope-open-text:before {
  content: "\f658"; }

.fa-envelope-square:before {
  content: "\f199"; }

.fa-envira:before {
  content: "\f299"; }

.fa-equals:before {
  content: "\f52c"; }

.fa-eraser:before {
  content: "\f12d"; }

.fa-erlang:before {
  content: "\f39d"; }

.fa-ethereum:before {
  content: "\f42e"; }

.fa-ethernet:before {
  content: "\f796"; }

.fa-etsy:before {
  content: "\f2d7"; }

.fa-euro-sign:before {
  content: "\f153"; }

.fa-exchange-alt:before {
  content: "\f362"; }

.fa-exclamation:before {
  content: "\f12a"; }

.fa-exclamation-circle:before {
  content: "\f06a"; }

.fa-exclamation-triangle:before {
  content: "\f071"; }

.fa-expand:before {
  content: "\f065"; }

.fa-expand-arrows-alt:before {
  content: "\f31e"; }

.fa-expeditedssl:before {
  content: "\f23e"; }

.fa-external-link-alt:before {
  content: "\f35d"; }

.fa-external-link-square-alt:before {
  content: "\f360"; }

.fa-eye:before {
  content: "\f06e"; }

.fa-eye-dropper:before {
  content: "\f1fb"; }

.fa-eye-slash:before {
  content: "\f070"; }

.fa-facebook:before {
  content: "\f09a"; }

.fa-facebook-f:before {
  content: "\f39e"; }

.fa-facebook-messenger:before {
  content: "\f39f"; }

.fa-facebook-square:before {
  content: "\f082"; }

.fa-fantasy-flight-games:before {
  content: "\f6dc"; }

.fa-fast-backward:before {
  content: "\f049"; }

.fa-fast-forward:before {
  content: "\f050"; }

.fa-fax:before {
  content: "\f1ac"; }

.fa-feather:before {
  content: "\f52d"; }

.fa-feather-alt:before {
  content: "\f56b"; }

.fa-fedex:before {
  content: "\f797"; }

.fa-fedora:before {
  content: "\f798"; }

.fa-female:before {
  content: "\f182"; }

.fa-fighter-jet:before {
  content: "\f0fb"; }

.fa-figma:before {
  content: "\f799"; }

.fa-file:before {
  content: "\f15b"; }

.fa-file-alt:before {
  content: "\f15c"; }

.fa-file-archive:before {
  content: "\f1c6"; }

.fa-file-audio:before {
  content: "\f1c7"; }

.fa-file-code:before {
  content: "\f1c9"; }

.fa-file-contract:before {
  content: "\f56c"; }

.fa-file-csv:before {
  content: "\f6dd"; }

.fa-file-download:before {
  content: "\f56d"; }

.fa-file-excel:before {
  content: "\f1c3"; }

.fa-file-export:before {
  content: "\f56e"; }

.fa-file-image:before {
  content: "\f1c5"; }

.fa-file-import:before {
  content: "\f56f"; }

.fa-file-invoice:before {
  content: "\f570"; }

.fa-file-invoice-dollar:before {
  content: "\f571"; }

.fa-file-medical:before {
  content: "\f477"; }

.fa-file-medical-alt:before {
  content: "\f478"; }

.fa-file-pdf:before {
  content: "\f1c1"; }

.fa-file-powerpoint:before {
  content: "\f1c4"; }

.fa-file-prescription:before {
  content: "\f572"; }

.fa-file-signature:before {
  content: "\f573"; }

.fa-file-upload:before {
  content: "\f574"; }

.fa-file-video:before {
  content: "\f1c8"; }

.fa-file-word:before {
  content: "\f1c2"; }

.fa-fill:before {
  content: "\f575"; }

.fa-fill-drip:before {
  content: "\f576"; }

.fa-film:before {
  content: "\f008"; }

.fa-filter:before {
  content: "\f0b0"; }

.fa-fingerprint:before {
  content: "\f577"; }

.fa-fire:before {
  content: "\f06d"; }

.fa-fire-alt:before {
  content: "\f7e4"; }

.fa-fire-extinguisher:before {
  content: "\f134"; }

.fa-firefox:before {
  content: "\f269"; }

.fa-first-aid:before {
  content: "\f479"; }

.fa-first-order:before {
  content: "\f2b0"; }

.fa-first-order-alt:before {
  content: "\f50a"; }

.fa-firstdraft:before {
  content: "\f3a1"; }

.fa-fish:before {
  content: "\f578"; }

.fa-fist-raised:before {
  content: "\f6de"; }

.fa-flag:before {
  content: "\f024"; }

.fa-flag-checkered:before {
  content: "\f11e"; }

.fa-flag-usa:before {
  content: "\f74d"; }

.fa-flask:before {
  content: "\f0c3"; }

.fa-flickr:before {
  content: "\f16e"; }

.fa-flipboard:before {
  content: "\f44d"; }

.fa-flushed:before {
  content: "\f579"; }

.fa-fly:before {
  content: "\f417"; }

.fa-folder:before {
  content: "\f07b"; }

.fa-folder-minus:before {
  content: "\f65d"; }

.fa-folder-open:before {
  content: "\f07c"; }

.fa-folder-plus:before {
  content: "\f65e"; }

.fa-font:before {
  content: "\f031"; }

.fa-font-awesome:before {
  content: "\f2b4"; }

.fa-font-awesome-alt:before {
  content: "\f35c"; }

.fa-font-awesome-flag:before {
  content: "\f425"; }

.fa-font-awesome-logo-full:before {
  content: "\f4e6"; }

.fa-fonticons:before {
  content: "\f280"; }

.fa-fonticons-fi:before {
  content: "\f3a2"; }

.fa-football-ball:before {
  content: "\f44e"; }

.fa-fort-awesome:before {
  content: "\f286"; }

.fa-fort-awesome-alt:before {
  content: "\f3a3"; }

.fa-forumbee:before {
  content: "\f211"; }

.fa-forward:before {
  content: "\f04e"; }

.fa-foursquare:before {
  content: "\f180"; }

.fa-free-code-camp:before {
  content: "\f2c5"; }

.fa-freebsd:before {
  content: "\f3a4"; }

.fa-frog:before {
  content: "\f52e"; }

.fa-frown:before {
  content: "\f119"; }

.fa-frown-open:before {
  content: "\f57a"; }

.fa-fulcrum:before {
  content: "\f50b"; }

.fa-funnel-dollar:before {
  content: "\f662"; }

.fa-futbol:before {
  content: "\f1e3"; }

.fa-galactic-republic:before {
  content: "\f50c"; }

.fa-galactic-senate:before {
  content: "\f50d"; }

.fa-gamepad:before {
  content: "\f11b"; }

.fa-gas-pump:before {
  content: "\f52f"; }

.fa-gavel:before {
  content: "\f0e3"; }

.fa-gem:before {
  content: "\f3a5"; }

.fa-genderless:before {
  content: "\f22d"; }

.fa-get-pocket:before {
  content: "\f265"; }

.fa-gg:before {
  content: "\f260"; }

.fa-gg-circle:before {
  content: "\f261"; }

.fa-ghost:before {
  content: "\f6e2"; }

.fa-gift:before {
  content: "\f06b"; }

.fa-gifts:before {
  content: "\f79c"; }

.fa-git:before {
  content: "\f1d3"; }

.fa-git-square:before {
  content: "\f1d2"; }

.fa-github:before {
  content: "\f09b"; }

.fa-github-alt:before {
  content: "\f113"; }

.fa-github-square:before {
  content: "\f092"; }

.fa-gitkraken:before {
  content: "\f3a6"; }

.fa-gitlab:before {
  content: "\f296"; }

.fa-gitter:before {
  content: "\f426"; }

.fa-glass-cheers:before {
  content: "\f79f"; }

.fa-glass-martini:before {
  content: "\f000"; }

.fa-glass-martini-alt:before {
  content: "\f57b"; }

.fa-glass-whiskey:before {
  content: "\f7a0"; }

.fa-glasses:before {
  content: "\f530"; }

.fa-glide:before {
  content: "\f2a5"; }

.fa-glide-g:before {
  content: "\f2a6"; }

.fa-globe:before {
  content: "\f0ac"; }

.fa-globe-africa:before {
  content: "\f57c"; }

.fa-globe-americas:before {
  content: "\f57d"; }

.fa-globe-asia:before {
  content: "\f57e"; }

.fa-globe-europe:before {
  content: "\f7a2"; }

.fa-gofore:before {
  content: "\f3a7"; }

.fa-golf-ball:before {
  content: "\f450"; }

.fa-goodreads:before {
  content: "\f3a8"; }

.fa-goodreads-g:before {
  content: "\f3a9"; }

.fa-google:before {
  content: "\f1a0"; }

.fa-google-drive:before {
  content: "\f3aa"; }

.fa-google-play:before {
  content: "\f3ab"; }

.fa-google-plus:before {
  content: "\f2b3"; }

.fa-google-plus-g:before {
  content: "\f0d5"; }

.fa-google-plus-square:before {
  content: "\f0d4"; }

.fa-google-wallet:before {
  content: "\f1ee"; }

.fa-gopuram:before {
  content: "\f664"; }

.fa-graduation-cap:before {
  content: "\f19d"; }

.fa-gratipay:before {
  content: "\f184"; }

.fa-grav:before {
  content: "\f2d6"; }

.fa-greater-than:before {
  content: "\f531"; }

.fa-greater-than-equal:before {
  content: "\f532"; }

.fa-grimace:before {
  content: "\f57f"; }

.fa-grin:before {
  content: "\f580"; }

.fa-grin-alt:before {
  content: "\f581"; }

.fa-grin-beam:before {
  content: "\f582"; }

.fa-grin-beam-sweat:before {
  content: "\f583"; }

.fa-grin-hearts:before {
  content: "\f584"; }

.fa-grin-squint:before {
  content: "\f585"; }

.fa-grin-squint-tears:before {
  content: "\f586"; }

.fa-grin-stars:before {
  content: "\f587"; }

.fa-grin-tears:before {
  content: "\f588"; }

.fa-grin-tongue:before {
  content: "\f589"; }

.fa-grin-tongue-squint:before {
  content: "\f58a"; }

.fa-grin-tongue-wink:before {
  content: "\f58b"; }

.fa-grin-wink:before {
  content: "\f58c"; }

.fa-grip-horizontal:before {
  content: "\f58d"; }

.fa-grip-lines:before {
  content: "\f7a4"; }

.fa-grip-lines-vertical:before {
  content: "\f7a5"; }

.fa-grip-vertical:before {
  content: "\f58e"; }

.fa-gripfire:before {
  content: "\f3ac"; }

.fa-grunt:before {
  content: "\f3ad"; }

.fa-guitar:before {
  content: "\f7a6"; }

.fa-gulp:before {
  content: "\f3ae"; }

.fa-h-square:before {
  content: "\f0fd"; }

.fa-hacker-news:before {
  content: "\f1d4"; }

.fa-hacker-news-square:before {
  content: "\f3af"; }

.fa-hackerrank:before {
  content: "\f5f7"; }

.fa-hammer:before {
  content: "\f6e3"; }

.fa-hamsa:before {
  content: "\f665"; }

.fa-hand-holding:before {
  content: "\f4bd"; }

.fa-hand-holding-heart:before {
  content: "\f4be"; }

.fa-hand-holding-usd:before {
  content: "\f4c0"; }

.fa-hand-lizard:before {
  content: "\f258"; }

.fa-hand-paper:before {
  content: "\f256"; }

.fa-hand-peace:before {
  content: "\f25b"; }

.fa-hand-point-down:before {
  content: "\f0a7"; }

.fa-hand-point-left:before {
  content: "\f0a5"; }

.fa-hand-point-right:before {
  content: "\f0a4"; }

.fa-hand-point-up:before {
  content: "\f0a6"; }

.fa-hand-pointer:before {
  content: "\f25a"; }

.fa-hand-rock:before {
  content: "\f255"; }

.fa-hand-scissors:before {
  content: "\f257"; }

.fa-hand-spock:before {
  content: "\f259"; }

.fa-hands:before {
  content: "\f4c2"; }

.fa-hands-helping:before {
  content: "\f4c4"; }

.fa-handshake:before {
  content: "\f2b5"; }

.fa-hanukiah:before {
  content: "\f6e6"; }

.fa-hashtag:before {
  content: "\f292"; }

.fa-hat-wizard:before {
  content: "\f6e8"; }

.fa-haykal:before {
  content: "\f666"; }

.fa-hdd:before {
  content: "\f0a0"; }

.fa-heading:before {
  content: "\f1dc"; }

.fa-headphones:before {
  content: "\f025"; }

.fa-headphones-alt:before {
  content: "\f58f"; }

.fa-headset:before {
  content: "\f590"; }

.fa-heart:before {
  content: "\f004"; }

.fa-heart-broken:before {
  content: "\f7a9"; }

.fa-heartbeat:before {
  content: "\f21e"; }

.fa-helicopter:before {
  content: "\f533"; }

.fa-highlighter:before {
  content: "\f591"; }

.fa-hiking:before {
  content: "\f6ec"; }

.fa-hippo:before {
  content: "\f6ed"; }

.fa-hips:before {
  content: "\f452"; }

.fa-hire-a-helper:before {
  content: "\f3b0"; }

.fa-history:before {
  content: "\f1da"; }

.fa-hockey-puck:before {
  content: "\f453"; }

.fa-holly-berry:before {
  content: "\f7aa"; }

.fa-home:before {
  content: "\f015"; }

.fa-hooli:before {
  content: "\f427"; }

.fa-hornbill:before {
  content: "\f592"; }

.fa-horse:before {
  content: "\f6f0"; }

.fa-horse-head:before {
  content: "\f7ab"; }

.fa-hospital:before {
  content: "\f0f8"; }

.fa-hospital-alt:before {
  content: "\f47d"; }

.fa-hospital-symbol:before {
  content: "\f47e"; }

.fa-hot-tub:before {
  content: "\f593"; }

.fa-hotel:before {
  content: "\f594"; }

.fa-hotjar:before {
  content: "\f3b1"; }

.fa-hourglass:before {
  content: "\f254"; }

.fa-hourglass-end:before {
  content: "\f253"; }

.fa-hourglass-half:before {
  content: "\f252"; }

.fa-hourglass-start:before {
  content: "\f251"; }

.fa-house-damage:before {
  content: "\f6f1"; }

.fa-houzz:before {
  content: "\f27c"; }

.fa-hryvnia:before {
  content: "\f6f2"; }

.fa-html5:before {
  content: "\f13b"; }

.fa-hubspot:before {
  content: "\f3b2"; }

.fa-i-cursor:before {
  content: "\f246"; }

.fa-icicles:before {
  content: "\f7ad"; }

.fa-id-badge:before {
  content: "\f2c1"; }

.fa-id-card:before {
  content: "\f2c2"; }

.fa-id-card-alt:before {
  content: "\f47f"; }

.fa-igloo:before {
  content: "\f7ae"; }

.fa-image:before {
  content: "\f03e"; }

.fa-images:before {
  content: "\f302"; }

.fa-imdb:before {
  content: "\f2d8"; }

.fa-inbox:before {
  content: "\f01c"; }

.fa-indent:before {
  content: "\f03c"; }

.fa-industry:before {
  content: "\f275"; }

.fa-infinity:before {
  content: "\f534"; }

.fa-info:before {
  content: "\f129"; }

.fa-info-circle:before {
  content: "\f05a"; }

.fa-instagram:before {
  content: "\f16d"; }

.fa-intercom:before {
  content: "\f7af"; }

.fa-internet-explorer:before {
  content: "\f26b"; }

.fa-invision:before {
  content: "\f7b0"; }

.fa-ioxhost:before {
  content: "\f208"; }

.fa-italic:before {
  content: "\f033"; }

.fa-itunes:before {
  content: "\f3b4"; }

.fa-itunes-note:before {
  content: "\f3b5"; }

.fa-java:before {
  content: "\f4e4"; }

.fa-jedi:before {
  content: "\f669"; }

.fa-jedi-order:before {
  content: "\f50e"; }

.fa-jenkins:before {
  content: "\f3b6"; }

.fa-jira:before {
  content: "\f7b1"; }

.fa-joget:before {
  content: "\f3b7"; }

.fa-joint:before {
  content: "\f595"; }

.fa-joomla:before {
  content: "\f1aa"; }

.fa-journal-whills:before {
  content: "\f66a"; }

.fa-js:before {
  content: "\f3b8"; }

.fa-js-square:before {
  content: "\f3b9"; }

.fa-jsfiddle:before {
  content: "\f1cc"; }

.fa-kaaba:before {
  content: "\f66b"; }

.fa-kaggle:before {
  content: "\f5fa"; }

.fa-key:before {
  content: "\f084"; }

.fa-keybase:before {
  content: "\f4f5"; }

.fa-keyboard:before {
  content: "\f11c"; }

.fa-keycdn:before {
  content: "\f3ba"; }

.fa-khanda:before {
  content: "\f66d"; }

.fa-kickstarter:before {
  content: "\f3bb"; }

.fa-kickstarter-k:before {
  content: "\f3bc"; }

.fa-kiss:before {
  content: "\f596"; }

.fa-kiss-beam:before {
  content: "\f597"; }

.fa-kiss-wink-heart:before {
  content: "\f598"; }

.fa-kiwi-bird:before {
  content: "\f535"; }

.fa-korvue:before {
  content: "\f42f"; }

.fa-landmark:before {
  content: "\f66f"; }

.fa-language:before {
  content: "\f1ab"; }

.fa-laptop:before {
  content: "\f109"; }

.fa-laptop-code:before {
  content: "\f5fc"; }

.fa-laravel:before {
  content: "\f3bd"; }

.fa-lastfm:before {
  content: "\f202"; }

.fa-lastfm-square:before {
  content: "\f203"; }

.fa-laugh:before {
  content: "\f599"; }

.fa-laugh-beam:before {
  content: "\f59a"; }

.fa-laugh-squint:before {
  content: "\f59b"; }

.fa-laugh-wink:before {
  content: "\f59c"; }

.fa-layer-group:before {
  content: "\f5fd"; }

.fa-leaf:before {
  content: "\f06c"; }

.fa-leanpub:before {
  content: "\f212"; }

.fa-lemon:before {
  content: "\f094"; }

.fa-less:before {
  content: "\f41d"; }

.fa-less-than:before {
  content: "\f536"; }

.fa-less-than-equal:before {
  content: "\f537"; }

.fa-level-down-alt:before {
  content: "\f3be"; }

.fa-level-up-alt:before {
  content: "\f3bf"; }

.fa-life-ring:before {
  content: "\f1cd"; }

.fa-lightbulb:before {
  content: "\f0eb"; }

.fa-line:before {
  content: "\f3c0"; }

.fa-link:before {
  content: "\f0c1"; }

.fa-linkedin:before {
  content: "\f08c"; }

.fa-linkedin-in:before {
  content: "\f0e1"; }

.fa-linode:before {
  content: "\f2b8"; }

.fa-linux:before {
  content: "\f17c"; }

.fa-lira-sign:before {
  content: "\f195"; }

.fa-list:before {
  content: "\f03a"; }

.fa-list-alt:before {
  content: "\f022"; }

.fa-list-ol:before {
  content: "\f0cb"; }

.fa-list-ul:before {
  content: "\f0ca"; }

.fa-location-arrow:before {
  content: "\f124"; }

.fa-lock:before {
  content: "\f023"; }

.fa-lock-open:before {
  content: "\f3c1"; }

.fa-long-arrow-alt-down:before {
  content: "\f309"; }

.fa-long-arrow-alt-left:before {
  content: "\f30a"; }

.fa-long-arrow-alt-right:before {
  content: "\f30b"; }

.fa-long-arrow-alt-up:before {
  content: "\f30c"; }

.fa-low-vision:before {
  content: "\f2a8"; }

.fa-luggage-cart:before {
  content: "\f59d"; }

.fa-lyft:before {
  content: "\f3c3"; }

.fa-magento:before {
  content: "\f3c4"; }

.fa-magic:before {
  content: "\f0d0"; }

.fa-magnet:before {
  content: "\f076"; }

.fa-mail-bulk:before {
  content: "\f674"; }

.fa-mailchimp:before {
  content: "\f59e"; }

.fa-male:before {
  content: "\f183"; }

.fa-mandalorian:before {
  content: "\f50f"; }

.fa-map:before {
  content: "\f279"; }

.fa-map-marked:before {
  content: "\f59f"; }

.fa-map-marked-alt:before {
  content: "\f5a0"; }

.fa-map-marker:before {
  content: "\f041"; }

.fa-map-marker-alt:before {
  content: "\f3c5"; }

.fa-map-pin:before {
  content: "\f276"; }

.fa-map-signs:before {
  content: "\f277"; }

.fa-markdown:before {
  content: "\f60f"; }

.fa-marker:before {
  content: "\f5a1"; }

.fa-mars:before {
  content: "\f222"; }

.fa-mars-double:before {
  content: "\f227"; }

.fa-mars-stroke:before {
  content: "\f229"; }

.fa-mars-stroke-h:before {
  content: "\f22b"; }

.fa-mars-stroke-v:before {
  content: "\f22a"; }

.fa-mask:before {
  content: "\f6fa"; }

.fa-mastodon:before {
  content: "\f4f6"; }

.fa-maxcdn:before {
  content: "\f136"; }

.fa-medal:before {
  content: "\f5a2"; }

.fa-medapps:before {
  content: "\f3c6"; }

.fa-medium:before {
  content: "\f23a"; }

.fa-medium-m:before {
  content: "\f3c7"; }

.fa-medkit:before {
  content: "\f0fa"; }

.fa-medrt:before {
  content: "\f3c8"; }

.fa-meetup:before {
  content: "\f2e0"; }

.fa-megaport:before {
  content: "\f5a3"; }

.fa-meh:before {
  content: "\f11a"; }

.fa-meh-blank:before {
  content: "\f5a4"; }

.fa-meh-rolling-eyes:before {
  content: "\f5a5"; }

.fa-memory:before {
  content: "\f538"; }

.fa-mendeley:before {
  content: "\f7b3"; }

.fa-menorah:before {
  content: "\f676"; }

.fa-mercury:before {
  content: "\f223"; }

.fa-meteor:before {
  content: "\f753"; }

.fa-microchip:before {
  content: "\f2db"; }

.fa-microphone:before {
  content: "\f130"; }

.fa-microphone-alt:before {
  content: "\f3c9"; }

.fa-microphone-alt-slash:before {
  content: "\f539"; }

.fa-microphone-slash:before {
  content: "\f131"; }

.fa-microscope:before {
  content: "\f610"; }

.fa-microsoft:before {
  content: "\f3ca"; }

.fa-minus:before {
  content: "\f068"; }

.fa-minus-circle:before {
  content: "\f056"; }

.fa-minus-square:before {
  content: "\f146"; }

.fa-mitten:before {
  content: "\f7b5"; }

.fa-mix:before {
  content: "\f3cb"; }

.fa-mixcloud:before {
  content: "\f289"; }

.fa-mizuni:before {
  content: "\f3cc"; }

.fa-mobile:before {
  content: "\f10b"; }

.fa-mobile-alt:before {
  content: "\f3cd"; }

.fa-modx:before {
  content: "\f285"; }

.fa-monero:before {
  content: "\f3d0"; }

.fa-money-bill:before {
  content: "\f0d6"; }

.fa-money-bill-alt:before {
  content: "\f3d1"; }

.fa-money-bill-wave:before {
  content: "\f53a"; }

.fa-money-bill-wave-alt:before {
  content: "\f53b"; }

.fa-money-check:before {
  content: "\f53c"; }

.fa-money-check-alt:before {
  content: "\f53d"; }

.fa-monument:before {
  content: "\f5a6"; }

.fa-moon:before {
  content: "\f186"; }

.fa-mortar-pestle:before {
  content: "\f5a7"; }

.fa-mosque:before {
  content: "\f678"; }

.fa-motorcycle:before {
  content: "\f21c"; }

.fa-mountain:before {
  content: "\f6fc"; }

.fa-mouse-pointer:before {
  content: "\f245"; }

.fa-mug-hot:before {
  content: "\f7b6"; }

.fa-music:before {
  content: "\f001"; }

.fa-napster:before {
  content: "\f3d2"; }

.fa-neos:before {
  content: "\f612"; }

.fa-network-wired:before {
  content: "\f6ff"; }

.fa-neuter:before {
  content: "\f22c"; }

.fa-newspaper:before {
  content: "\f1ea"; }

.fa-nimblr:before {
  content: "\f5a8"; }

.fa-nintendo-switch:before {
  content: "\f418"; }

.fa-node:before {
  content: "\f419"; }

.fa-node-js:before {
  content: "\f3d3"; }

.fa-not-equal:before {
  content: "\f53e"; }

.fa-notes-medical:before {
  content: "\f481"; }

.fa-npm:before {
  content: "\f3d4"; }

.fa-ns8:before {
  content: "\f3d5"; }

.fa-nutritionix:before {
  content: "\f3d6"; }

.fa-object-group:before {
  content: "\f247"; }

.fa-object-ungroup:before {
  content: "\f248"; }

.fa-odnoklassniki:before {
  content: "\f263"; }

.fa-odnoklassniki-square:before {
  content: "\f264"; }

.fa-oil-can:before {
  content: "\f613"; }

.fa-old-republic:before {
  content: "\f510"; }

.fa-om:before {
  content: "\f679"; }

.fa-opencart:before {
  content: "\f23d"; }

.fa-openid:before {
  content: "\f19b"; }

.fa-opera:before {
  content: "\f26a"; }

.fa-optin-monster:before {
  content: "\f23c"; }

.fa-osi:before {
  content: "\f41a"; }

.fa-otter:before {
  content: "\f700"; }

.fa-outdent:before {
  content: "\f03b"; }

.fa-page4:before {
  content: "\f3d7"; }

.fa-pagelines:before {
  content: "\f18c"; }

.fa-paint-brush:before {
  content: "\f1fc"; }

.fa-paint-roller:before {
  content: "\f5aa"; }

.fa-palette:before {
  content: "\f53f"; }

.fa-palfed:before {
  content: "\f3d8"; }

.fa-pallet:before {
  content: "\f482"; }

.fa-paper-plane:before {
  content: "\f1d8"; }

.fa-paperclip:before {
  content: "\f0c6"; }

.fa-parachute-box:before {
  content: "\f4cd"; }

.fa-paragraph:before {
  content: "\f1dd"; }

.fa-parking:before {
  content: "\f540"; }

.fa-passport:before {
  content: "\f5ab"; }

.fa-pastafarianism:before {
  content: "\f67b"; }

.fa-paste:before {
  content: "\f0ea"; }

.fa-patreon:before {
  content: "\f3d9"; }

.fa-pause:before {
  content: "\f04c"; }

.fa-pause-circle:before {
  content: "\f28b"; }

.fa-paw:before {
  content: "\f1b0"; }

.fa-paypal:before {
  content: "\f1ed"; }

.fa-peace:before {
  content: "\f67c"; }

.fa-pen:before {
  content: "\f304"; }

.fa-pen-alt:before {
  content: "\f305"; }

.fa-pen-fancy:before {
  content: "\f5ac"; }

.fa-pen-nib:before {
  content: "\f5ad"; }

.fa-pen-square:before {
  content: "\f14b"; }

.fa-pencil-alt:before {
  content: "\f303"; }

.fa-pencil-ruler:before {
  content: "\f5ae"; }

.fa-penny-arcade:before {
  content: "\f704"; }

.fa-people-carry:before {
  content: "\f4ce"; }

.fa-percent:before {
  content: "\f295"; }

.fa-percentage:before {
  content: "\f541"; }

.fa-periscope:before {
  content: "\f3da"; }

.fa-person-booth:before {
  content: "\f756"; }

.fa-phabricator:before {
  content: "\f3db"; }

.fa-phoenix-framework:before {
  content: "\f3dc"; }

.fa-phoenix-squadron:before {
  content: "\f511"; }

.fa-phone:before {
  content: "\f095"; }

.fa-phone-slash:before {
  content: "\f3dd"; }

.fa-phone-square:before {
  content: "\f098"; }

.fa-phone-volume:before {
  content: "\f2a0"; }

.fa-php:before {
  content: "\f457"; }

.fa-pied-piper:before {
  content: "\f2ae"; }

.fa-pied-piper-alt:before {
  content: "\f1a8"; }

.fa-pied-piper-hat:before {
  content: "\f4e5"; }

.fa-pied-piper-pp:before {
  content: "\f1a7"; }

.fa-piggy-bank:before {
  content: "\f4d3"; }

.fa-pills:before {
  content: "\f484"; }

.fa-pinterest:before {
  content: "\f0d2"; }

.fa-pinterest-p:before {
  content: "\f231"; }

.fa-pinterest-square:before {
  content: "\f0d3"; }

.fa-place-of-worship:before {
  content: "\f67f"; }

.fa-plane:before {
  content: "\f072"; }

.fa-plane-arrival:before {
  content: "\f5af"; }

.fa-plane-departure:before {
  content: "\f5b0"; }

.fa-play:before {
  content: "\f04b"; }

.fa-play-circle:before {
  content: "\f144"; }

.fa-playstation:before {
  content: "\f3df"; }

.fa-plug:before {
  content: "\f1e6"; }

.fa-plus:before {
  content: "\f067"; }

.fa-plus-circle:before {
  content: "\f055"; }

.fa-plus-square:before {
  content: "\f0fe"; }

.fa-podcast:before {
  content: "\f2ce"; }

.fa-poll:before {
  content: "\f681"; }

.fa-poll-h:before {
  content: "\f682"; }

.fa-poo:before {
  content: "\f2fe"; }

.fa-poo-storm:before {
  content: "\f75a"; }

.fa-poop:before {
  content: "\f619"; }

.fa-portrait:before {
  content: "\f3e0"; }

.fa-pound-sign:before {
  content: "\f154"; }

.fa-power-off:before {
  content: "\f011"; }

.fa-pray:before {
  content: "\f683"; }

.fa-praying-hands:before {
  content: "\f684"; }

.fa-prescription:before {
  content: "\f5b1"; }

.fa-prescription-bottle:before {
  content: "\f485"; }

.fa-prescription-bottle-alt:before {
  content: "\f486"; }

.fa-print:before {
  content: "\f02f"; }

.fa-procedures:before {
  content: "\f487"; }

.fa-product-hunt:before {
  content: "\f288"; }

.fa-project-diagram:before {
  content: "\f542"; }

.fa-pushed:before {
  content: "\f3e1"; }

.fa-puzzle-piece:before {
  content: "\f12e"; }

.fa-python:before {
  content: "\f3e2"; }

.fa-qq:before {
  content: "\f1d6"; }

.fa-qrcode:before {
  content: "\f029"; }

.fa-question:before {
  content: "\f128"; }

.fa-question-circle:before {
  content: "\f059"; }

.fa-quidditch:before {
  content: "\f458"; }

.fa-quinscape:before {
  content: "\f459"; }

.fa-quora:before {
  content: "\f2c4"; }

.fa-quote-left:before {
  content: "\f10d"; }

.fa-quote-right:before {
  content: "\f10e"; }

.fa-quran:before {
  content: "\f687"; }

.fa-r-project:before {
  content: "\f4f7"; }

.fa-radiation:before {
  content: "\f7b9"; }

.fa-radiation-alt:before {
  content: "\f7ba"; }

.fa-rainbow:before {
  content: "\f75b"; }

.fa-random:before {
  content: "\f074"; }

.fa-raspberry-pi:before {
  content: "\f7bb"; }

.fa-ravelry:before {
  content: "\f2d9"; }

.fa-react:before {
  content: "\f41b"; }

.fa-reacteurope:before {
  content: "\f75d"; }

.fa-readme:before {
  content: "\f4d5"; }

.fa-rebel:before {
  content: "\f1d0"; }

.fa-receipt:before {
  content: "\f543"; }

.fa-recycle:before {
  content: "\f1b8"; }

.fa-red-river:before {
  content: "\f3e3"; }

.fa-reddit:before {
  content: "\f1a1"; }

.fa-reddit-alien:before {
  content: "\f281"; }

.fa-reddit-square:before {
  content: "\f1a2"; }

.fa-redhat:before {
  content: "\f7bc"; }

.fa-redo:before {
  content: "\f01e"; }

.fa-redo-alt:before {
  content: "\f2f9"; }

.fa-registered:before {
  content: "\f25d"; }

.fa-renren:before {
  content: "\f18b"; }

.fa-reply:before {
  content: "\f3e5"; }

.fa-reply-all:before {
  content: "\f122"; }

.fa-replyd:before {
  content: "\f3e6"; }

.fa-republican:before {
  content: "\f75e"; }

.fa-researchgate:before {
  content: "\f4f8"; }

.fa-resolving:before {
  content: "\f3e7"; }

.fa-restroom:before {
  content: "\f7bd"; }

.fa-retweet:before {
  content: "\f079"; }

.fa-rev:before {
  content: "\f5b2"; }

.fa-ribbon:before {
  content: "\f4d6"; }

.fa-ring:before {
  content: "\f70b"; }

.fa-road:before {
  content: "\f018"; }

.fa-robot:before {
  content: "\f544"; }

.fa-rocket:before {
  content: "\f135"; }

.fa-rocketchat:before {
  content: "\f3e8"; }

.fa-rockrms:before {
  content: "\f3e9"; }

.fa-route:before {
  content: "\f4d7"; }

.fa-rss:before {
  content: "\f09e"; }

.fa-rss-square:before {
  content: "\f143"; }

.fa-ruble-sign:before {
  content: "\f158"; }

.fa-ruler:before {
  content: "\f545"; }

.fa-ruler-combined:before {
  content: "\f546"; }

.fa-ruler-horizontal:before {
  content: "\f547"; }

.fa-ruler-vertical:before {
  content: "\f548"; }

.fa-running:before {
  content: "\f70c"; }

.fa-rupee-sign:before {
  content: "\f156"; }

.fa-sad-cry:before {
  content: "\f5b3"; }

.fa-sad-tear:before {
  content: "\f5b4"; }

.fa-safari:before {
  content: "\f267"; }

.fa-sass:before {
  content: "\f41e"; }

.fa-satellite:before {
  content: "\f7bf"; }

.fa-satellite-dish:before {
  content: "\f7c0"; }

.fa-save:before {
  content: "\f0c7"; }

.fa-schlix:before {
  content: "\f3ea"; }

.fa-school:before {
  content: "\f549"; }

.fa-screwdriver:before {
  content: "\f54a"; }

.fa-scribd:before {
  content: "\f28a"; }

.fa-scroll:before {
  content: "\f70e"; }

.fa-sd-card:before {
  content: "\f7c2"; }

.fa-search:before {
  content: "\f002"; }

.fa-search-dollar:before {
  content: "\f688"; }

.fa-search-location:before {
  content: "\f689"; }

.fa-search-minus:before {
  content: "\f010"; }

.fa-search-plus:before {
  content: "\f00e"; }

.fa-searchengin:before {
  content: "\f3eb"; }

.fa-seedling:before {
  content: "\f4d8"; }

.fa-sellcast:before {
  content: "\f2da"; }

.fa-sellsy:before {
  content: "\f213"; }

.fa-server:before {
  content: "\f233"; }

.fa-servicestack:before {
  content: "\f3ec"; }

.fa-shapes:before {
  content: "\f61f"; }

.fa-share:before {
  content: "\f064"; }

.fa-share-alt:before {
  content: "\f1e0"; }

.fa-share-alt-square:before {
  content: "\f1e1"; }

.fa-share-square:before {
  content: "\f14d"; }

.fa-shekel-sign:before {
  content: "\f20b"; }

.fa-shield-alt:before {
  content: "\f3ed"; }

.fa-ship:before {
  content: "\f21a"; }

.fa-shipping-fast:before {
  content: "\f48b"; }

.fa-shirtsinbulk:before {
  content: "\f214"; }

.fa-shoe-prints:before {
  content: "\f54b"; }

.fa-shopping-bag:before {
  content: "\f290"; }

.fa-shopping-basket:before {
  content: "\f291"; }

.fa-shopping-cart:before {
  content: "\f07a"; }

.fa-shopware:before {
  content: "\f5b5"; }

.fa-shower:before {
  content: "\f2cc"; }

.fa-shuttle-van:before {
  content: "\f5b6"; }

.fa-sign:before {
  content: "\f4d9"; }

.fa-sign-in-alt:before {
  content: "\f2f6"; }

.fa-sign-language:before {
  content: "\f2a7"; }

.fa-sign-out-alt:before {
  content: "\f2f5"; }

.fa-signal:before {
  content: "\f012"; }

.fa-signature:before {
  content: "\f5b7"; }

.fa-sim-card:before {
  content: "\f7c4"; }

.fa-simplybuilt:before {
  content: "\f215"; }

.fa-sistrix:before {
  content: "\f3ee"; }

.fa-sitemap:before {
  content: "\f0e8"; }

.fa-sith:before {
  content: "\f512"; }

.fa-skating:before {
  content: "\f7c5"; }

.fa-sketch:before {
  content: "\f7c6"; }

.fa-skiing:before {
  content: "\f7c9"; }

.fa-skiing-nordic:before {
  content: "\f7ca"; }

.fa-skull:before {
  content: "\f54c"; }

.fa-skull-crossbones:before {
  content: "\f714"; }

.fa-skyatlas:before {
  content: "\f216"; }

.fa-skype:before {
  content: "\f17e"; }

.fa-slack:before {
  content: "\f198"; }

.fa-slack-hash:before {
  content: "\f3ef"; }

.fa-slash:before {
  content: "\f715"; }

.fa-sleigh:before {
  content: "\f7cc"; }

.fa-sliders-h:before {
  content: "\f1de"; }

.fa-slideshare:before {
  content: "\f1e7"; }

.fa-smile:before {
  content: "\f118"; }

.fa-smile-beam:before {
  content: "\f5b8"; }

.fa-smile-wink:before {
  content: "\f4da"; }

.fa-smog:before {
  content: "\f75f"; }

.fa-smoking:before {
  content: "\f48d"; }

.fa-smoking-ban:before {
  content: "\f54d"; }

.fa-sms:before {
  content: "\f7cd"; }

.fa-snapchat:before {
  content: "\f2ab"; }

.fa-snapchat-ghost:before {
  content: "\f2ac"; }

.fa-snapchat-square:before {
  content: "\f2ad"; }

.fa-snowboarding:before {
  content: "\f7ce"; }

.fa-snowflake:before {
  content: "\f2dc"; }

.fa-snowman:before {
  content: "\f7d0"; }

.fa-snowplow:before {
  content: "\f7d2"; }

.fa-socks:before {
  content: "\f696"; }

.fa-solar-panel:before {
  content: "\f5ba"; }

.fa-sort:before {
  content: "\f0dc"; }

.fa-sort-alpha-down:before {
  content: "\f15d"; }

.fa-sort-alpha-up:before {
  content: "\f15e"; }

.fa-sort-amount-down:before {
  content: "\f160"; }

.fa-sort-amount-up:before {
  content: "\f161"; }

.fa-sort-down:before {
  content: "\f0dd"; }

.fa-sort-numeric-down:before {
  content: "\f162"; }

.fa-sort-numeric-up:before {
  content: "\f163"; }

.fa-sort-up:before {
  content: "\f0de"; }

.fa-soundcloud:before {
  content: "\f1be"; }

.fa-sourcetree:before {
  content: "\f7d3"; }

.fa-spa:before {
  content: "\f5bb"; }

.fa-space-shuttle:before {
  content: "\f197"; }

.fa-speakap:before {
  content: "\f3f3"; }

.fa-spider:before {
  content: "\f717"; }

.fa-spinner:before {
  content: "\f110"; }

.fa-splotch:before {
  content: "\f5bc"; }

.fa-spotify:before {
  content: "\f1bc"; }

.fa-spray-can:before {
  content: "\f5bd"; }

.fa-square:before {
  content: "\f0c8"; }

.fa-square-full:before {
  content: "\f45c"; }

.fa-square-root-alt:before {
  content: "\f698"; }

.fa-squarespace:before {
  content: "\f5be"; }

.fa-stack-exchange:before {
  content: "\f18d"; }

.fa-stack-overflow:before {
  content: "\f16c"; }

.fa-stamp:before {
  content: "\f5bf"; }

.fa-star:before {
  content: "\f005"; }

.fa-star-and-crescent:before {
  content: "\f699"; }

.fa-star-half:before {
  content: "\f089"; }

.fa-star-half-alt:before {
  content: "\f5c0"; }

.fa-star-of-david:before {
  content: "\f69a"; }

.fa-star-of-life:before {
  content: "\f621"; }

.fa-staylinked:before {
  content: "\f3f5"; }

.fa-steam:before {
  content: "\f1b6"; }

.fa-steam-square:before {
  content: "\f1b7"; }

.fa-steam-symbol:before {
  content: "\f3f6"; }

.fa-step-backward:before {
  content: "\f048"; }

.fa-step-forward:before {
  content: "\f051"; }

.fa-stethoscope:before {
  content: "\f0f1"; }

.fa-sticker-mule:before {
  content: "\f3f7"; }

.fa-sticky-note:before {
  content: "\f249"; }

.fa-stop:before {
  content: "\f04d"; }

.fa-stop-circle:before {
  content: "\f28d"; }

.fa-stopwatch:before {
  content: "\f2f2"; }

.fa-store:before {
  content: "\f54e"; }

.fa-store-alt:before {
  content: "\f54f"; }

.fa-strava:before {
  content: "\f428"; }

.fa-stream:before {
  content: "\f550"; }

.fa-street-view:before {
  content: "\f21d"; }

.fa-strikethrough:before {
  content: "\f0cc"; }

.fa-stripe:before {
  content: "\f429"; }

.fa-stripe-s:before {
  content: "\f42a"; }

.fa-stroopwafel:before {
  content: "\f551"; }

.fa-studiovinari:before {
  content: "\f3f8"; }

.fa-stumbleupon:before {
  content: "\f1a4"; }

.fa-stumbleupon-circle:before {
  content: "\f1a3"; }

.fa-subscript:before {
  content: "\f12c"; }

.fa-subway:before {
  content: "\f239"; }

.fa-suitcase:before {
  content: "\f0f2"; }

.fa-suitcase-rolling:before {
  content: "\f5c1"; }

.fa-sun:before {
  content: "\f185"; }

.fa-superpowers:before {
  content: "\f2dd"; }

.fa-superscript:before {
  content: "\f12b"; }

.fa-supple:before {
  content: "\f3f9"; }

.fa-surprise:before {
  content: "\f5c2"; }

.fa-suse:before {
  content: "\f7d6"; }

.fa-swatchbook:before {
  content: "\f5c3"; }

.fa-swimmer:before {
  content: "\f5c4"; }

.fa-swimming-pool:before {
  content: "\f5c5"; }

.fa-synagogue:before {
  content: "\f69b"; }

.fa-sync:before {
  content: "\f021"; }

.fa-sync-alt:before {
  content: "\f2f1"; }

.fa-syringe:before {
  content: "\f48e"; }

.fa-table:before {
  content: "\f0ce"; }

.fa-table-tennis:before {
  content: "\f45d"; }

.fa-tablet:before {
  content: "\f10a"; }

.fa-tablet-alt:before {
  content: "\f3fa"; }

.fa-tablets:before {
  content: "\f490"; }

.fa-tachometer-alt:before {
  content: "\f3fd"; }

.fa-tag:before {
  content: "\f02b"; }

.fa-tags:before {
  content: "\f02c"; }

.fa-tape:before {
  content: "\f4db"; }

.fa-tasks:before {
  content: "\f0ae"; }

.fa-taxi:before {
  content: "\f1ba"; }

.fa-teamspeak:before {
  content: "\f4f9"; }

.fa-teeth:before {
  content: "\f62e"; }

.fa-teeth-open:before {
  content: "\f62f"; }

.fa-telegram:before {
  content: "\f2c6"; }

.fa-telegram-plane:before {
  content: "\f3fe"; }

.fa-temperature-high:before {
  content: "\f769"; }

.fa-temperature-low:before {
  content: "\f76b"; }

.fa-tencent-weibo:before {
  content: "\f1d5"; }

.fa-tenge:before {
  content: "\f7d7"; }

.fa-terminal:before {
  content: "\f120"; }

.fa-text-height:before {
  content: "\f034"; }

.fa-text-width:before {
  content: "\f035"; }

.fa-th:before {
  content: "\f00a"; }

.fa-th-large:before {
  content: "\f009"; }

.fa-th-list:before {
  content: "\f00b"; }

.fa-the-red-yeti:before {
  content: "\f69d"; }

.fa-theater-masks:before {
  content: "\f630"; }

.fa-themeco:before {
  content: "\f5c6"; }

.fa-themeisle:before {
  content: "\f2b2"; }

.fa-thermometer:before {
  content: "\f491"; }

.fa-thermometer-empty:before {
  content: "\f2cb"; }

.fa-thermometer-full:before {
  content: "\f2c7"; }

.fa-thermometer-half:before {
  content: "\f2c9"; }

.fa-thermometer-quarter:before {
  content: "\f2ca"; }

.fa-thermometer-three-quarters:before {
  content: "\f2c8"; }

.fa-think-peaks:before {
  content: "\f731"; }

.fa-thumbs-down:before {
  content: "\f165"; }

.fa-thumbs-up:before {
  content: "\f164"; }

.fa-thumbtack:before {
  content: "\f08d"; }

.fa-ticket-alt:before {
  content: "\f3ff"; }

.fa-times:before {
  content: "\f00d"; }

.fa-times-circle:before {
  content: "\f057"; }

.fa-tint:before {
  content: "\f043"; }

.fa-tint-slash:before {
  content: "\f5c7"; }

.fa-tired:before {
  content: "\f5c8"; }

.fa-toggle-off:before {
  content: "\f204"; }

.fa-toggle-on:before {
  content: "\f205"; }

.fa-toilet:before {
  content: "\f7d8"; }

.fa-toilet-paper:before {
  content: "\f71e"; }

.fa-toolbox:before {
  content: "\f552"; }

.fa-tools:before {
  content: "\f7d9"; }

.fa-tooth:before {
  content: "\f5c9"; }

.fa-torah:before {
  content: "\f6a0"; }

.fa-torii-gate:before {
  content: "\f6a1"; }

.fa-tractor:before {
  content: "\f722"; }

.fa-trade-federation:before {
  content: "\f513"; }

.fa-trademark:before {
  content: "\f25c"; }

.fa-traffic-light:before {
  content: "\f637"; }

.fa-train:before {
  content: "\f238"; }

.fa-tram:before {
  content: "\f7da"; }

.fa-transgender:before {
  content: "\f224"; }

.fa-transgender-alt:before {
  content: "\f225"; }

.fa-trash:before {
  content: "\f1f8"; }

.fa-trash-alt:before {
  content: "\f2ed"; }

.fa-tree:before {
  content: "\f1bb"; }

.fa-trello:before {
  content: "\f181"; }

.fa-tripadvisor:before {
  content: "\f262"; }

.fa-trophy:before {
  content: "\f091"; }

.fa-truck:before {
  content: "\f0d1"; }

.fa-truck-loading:before {
  content: "\f4de"; }

.fa-truck-monster:before {
  content: "\f63b"; }

.fa-truck-moving:before {
  content: "\f4df"; }

.fa-truck-pickup:before {
  content: "\f63c"; }

.fa-tshirt:before {
  content: "\f553"; }

.fa-tty:before {
  content: "\f1e4"; }

.fa-tumblr:before {
  content: "\f173"; }

.fa-tumblr-square:before {
  content: "\f174"; }

.fa-tv:before {
  content: "\f26c"; }

.fa-twitch:before {
  content: "\f1e8"; }

.fa-twitter:before {
  content: "\f099"; }

.fa-twitter-square:before {
  content: "\f081"; }

.fa-typo3:before {
  content: "\f42b"; }

.fa-uber:before {
  content: "\f402"; }

.fa-ubuntu:before {
  content: "\f7df"; }

.fa-uikit:before {
  content: "\f403"; }

.fa-umbrella:before {
  content: "\f0e9"; }

.fa-umbrella-beach:before {
  content: "\f5ca"; }

.fa-underline:before {
  content: "\f0cd"; }

.fa-undo:before {
  content: "\f0e2"; }

.fa-undo-alt:before {
  content: "\f2ea"; }

.fa-uniregistry:before {
  content: "\f404"; }

.fa-universal-access:before {
  content: "\f29a"; }

.fa-university:before {
  content: "\f19c"; }

.fa-unlink:before {
  content: "\f127"; }

.fa-unlock:before {
  content: "\f09c"; }

.fa-unlock-alt:before {
  content: "\f13e"; }

.fa-untappd:before {
  content: "\f405"; }

.fa-upload:before {
  content: "\f093"; }

.fa-ups:before {
  content: "\f7e0"; }

.fa-usb:before {
  content: "\f287"; }

.fa-user:before {
  content: "\f007"; }

.fa-user-alt:before {
  content: "\f406"; }

.fa-user-alt-slash:before {
  content: "\f4fa"; }

.fa-user-astronaut:before {
  content: "\f4fb"; }

.fa-user-check:before {
  content: "\f4fc"; }

.fa-user-circle:before {
  content: "\f2bd"; }

.fa-user-clock:before {
  content: "\f4fd"; }

.fa-user-cog:before {
  content: "\f4fe"; }

.fa-user-edit:before {
  content: "\f4ff"; }

.fa-user-friends:before {
  content: "\f500"; }

.fa-user-graduate:before {
  content: "\f501"; }

.fa-user-injured:before {
  content: "\f728"; }

.fa-user-lock:before {
  content: "\f502"; }

.fa-user-md:before {
  content: "\f0f0"; }

.fa-user-minus:before {
  content: "\f503"; }

.fa-user-ninja:before {
  content: "\f504"; }

.fa-user-plus:before {
  content: "\f234"; }

.fa-user-secret:before {
  content: "\f21b"; }

.fa-user-shield:before {
  content: "\f505"; }

.fa-user-slash:before {
  content: "\f506"; }

.fa-user-tag:before {
  content: "\f507"; }

.fa-user-tie:before {
  content: "\f508"; }

.fa-user-times:before {
  content: "\f235"; }

.fa-users:before {
  content: "\f0c0"; }

.fa-users-cog:before {
  content: "\f509"; }

.fa-usps:before {
  content: "\f7e1"; }

.fa-ussunnah:before {
  content: "\f407"; }

.fa-utensil-spoon:before {
  content: "\f2e5"; }

.fa-utensils:before {
  content: "\f2e7"; }

.fa-vaadin:before {
  content: "\f408"; }

.fa-vector-square:before {
  content: "\f5cb"; }

.fa-venus:before {
  content: "\f221"; }

.fa-venus-double:before {
  content: "\f226"; }

.fa-venus-mars:before {
  content: "\f228"; }

.fa-viacoin:before {
  content: "\f237"; }

.fa-viadeo:before {
  content: "\f2a9"; }

.fa-viadeo-square:before {
  content: "\f2aa"; }

.fa-vial:before {
  content: "\f492"; }

.fa-vials:before {
  content: "\f493"; }

.fa-viber:before {
  content: "\f409"; }

.fa-video:before {
  content: "\f03d"; }

.fa-video-slash:before {
  content: "\f4e2"; }

.fa-vihara:before {
  content: "\f6a7"; }

.fa-vimeo:before {
  content: "\f40a"; }

.fa-vimeo-square:before {
  content: "\f194"; }

.fa-vimeo-v:before {
  content: "\f27d"; }

.fa-vine:before {
  content: "\f1ca"; }

.fa-vk:before {
  content: "\f189"; }

.fa-vnv:before {
  content: "\f40b"; }

.fa-volleyball-ball:before {
  content: "\f45f"; }

.fa-volume-down:before {
  content: "\f027"; }

.fa-volume-mute:before {
  content: "\f6a9"; }

.fa-volume-off:before {
  content: "\f026"; }

.fa-volume-up:before {
  content: "\f028"; }

.fa-vote-yea:before {
  content: "\f772"; }

.fa-vr-cardboard:before {
  content: "\f729"; }

.fa-vuejs:before {
  content: "\f41f"; }

.fa-walking:before {
  content: "\f554"; }

.fa-wallet:before {
  content: "\f555"; }

.fa-warehouse:before {
  content: "\f494"; }

.fa-water:before {
  content: "\f773"; }

.fa-weebly:before {
  content: "\f5cc"; }

.fa-weibo:before {
  content: "\f18a"; }

.fa-weight:before {
  content: "\f496"; }

.fa-weight-hanging:before {
  content: "\f5cd"; }

.fa-weixin:before {
  content: "\f1d7"; }

.fa-whatsapp:before {
  content: "\f232"; }

.fa-whatsapp-square:before {
  content: "\f40c"; }

.fa-wheelchair:before {
  content: "\f193"; }

.fa-whmcs:before {
  content: "\f40d"; }

.fa-wifi:before {
  content: "\f1eb"; }

.fa-wikipedia-w:before {
  content: "\f266"; }

.fa-wind:before {
  content: "\f72e"; }

.fa-window-close:before {
  content: "\f410"; }

.fa-window-maximize:before {
  content: "\f2d0"; }

.fa-window-minimize:before {
  content: "\f2d1"; }

.fa-window-restore:before {
  content: "\f2d2"; }

.fa-windows:before {
  content: "\f17a"; }

.fa-wine-bottle:before {
  content: "\f72f"; }

.fa-wine-glass:before {
  content: "\f4e3"; }

.fa-wine-glass-alt:before {
  content: "\f5ce"; }

.fa-wix:before {
  content: "\f5cf"; }

.fa-wizards-of-the-coast:before {
  content: "\f730"; }

.fa-wolf-pack-battalion:before {
  content: "\f514"; }

.fa-won-sign:before {
  content: "\f159"; }

.fa-wordpress:before {
  content: "\f19a"; }

.fa-wordpress-simple:before {
  content: "\f411"; }

.fa-wpbeginner:before {
  content: "\f297"; }

.fa-wpexplorer:before {
  content: "\f2de"; }

.fa-wpforms:before {
  content: "\f298"; }

.fa-wpressr:before {
  content: "\f3e4"; }

.fa-wrench:before {
  content: "\f0ad"; }

.fa-x-ray:before {
  content: "\f497"; }

.fa-xbox:before {
  content: "\f412"; }

.fa-xing:before {
  content: "\f168"; }

.fa-xing-square:before {
  content: "\f169"; }

.fa-y-combinator:before {
  content: "\f23b"; }

.fa-yahoo:before {
  content: "\f19e"; }

.fa-yandex:before {
  content: "\f413"; }

.fa-yandex-international:before {
  content: "\f414"; }

.fa-yarn:before {
  content: "\f7e3"; }

.fa-yelp:before {
  content: "\f1e9"; }

.fa-yen-sign:before {
  content: "\f157"; }

.fa-yin-yang:before {
  content: "\f6ad"; }

.fa-yoast:before {
  content: "\f2b1"; }

.fa-youtube:before {
  content: "\f167"; }

.fa-youtube-square:before {
  content: "\f431"; }

.fa-zhihu:before {
  content: "\f63f"; }

.sr-only {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px; }

.sr-only-focusable:active, .sr-only-focusable:focus {
  clip: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  position: static;
  width: auto; }
/*!
 * Font Awesome Free 5.6.3 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
@font-face {
  font-family: 'Font Awesome 5 Free';
  font-style: normal;
  font-weight: 900;
  src: url('public/theme//fonts/fontawesome-free/fa-solid-900.eot');
  src: url('public/theme//fonts/fontawesome-free/fa-solid-900.eot?#iefix') format('embedded-opentype'), url('public/theme//fonts/fontawesome-free/fa-solid-900.woff2') format('woff2'), url('public/theme//fonts/fontawesome-free/fa-solid-900.woff') format('woff'), url('public/theme//fonts/fontawesome-free/fa-solid-900.ttf') format('truetype'), url('public/theme//fonts/fontawesome-free/fa-solid-900.svg#fontawesome') format('svg'); }

.fa, .fas, .ui-datepicker .ui-datepicker-header .ui-datepicker-prev:after, .ui-datepicker .ui-datepicker-header .ui-datepicker-next:after {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900; }
/*!
 * Font Awesome Free 5.6.3 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
@font-face {
  font-family: 'Font Awesome 5 Free';
  font-style: normal;
  font-weight: 400;
  src: url('public/theme//fonts/fontawesome-free/fa-regular-400.eot');
  src: url('public/theme//fonts/fontawesome-free/fa-regular-400.eot?#iefix') format('embedded-opentype'), url('public/theme//fonts/fontawesome-free/fa-regular-400.woff2') format('woff2'), url('public/theme//fonts/fontawesome-free/fa-regular-400.woff') format('woff'), url('public/theme//fonts/fontawesome-free/fa-regular-400.ttf') format('truetype'), url('public/theme//fonts/fontawesome-free/fa-regular-400.svg#fontawesome') format('svg'); }

.far {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }
/*!
 * Font Awesome Free 5.6.3 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
@font-face {
  font-family: 'Font Awesome 5 Brands';
  font-style: normal;
  font-weight: normal;
  src: url('public/theme//fonts/fontawesome-free/fa-brands-400.eot');
  src: url('public/theme//fonts/fontawesome-free/fa-brands-400.eot?#iefix') format('embedded-opentype'), url('public/theme//fonts/fontawesome-free/fa-brands-400.woff2') format('woff2'), url('public/theme//fonts/fontawesome-free/fa-brands-400.woff') format('woff'), url('public/theme//fonts/fontawesome-free/fa-brands-400.ttf') format('truetype'), url('public/theme//fonts/fontawesome-free/fa-brands-400.svg#fontawesome') format('svg'); }

.fab {
  font-family: 'Font Awesome 5 Brands'; }
/*!
 * Font Awesome Free 5.6.3 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
.fa.fa-glass:before {
  content: "\f000"; }

.fa.fa-meetup {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-star-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-star-o:before {
  content: "\f005"; }

.fa.fa-remove:before {
  content: "\f00d"; }

.fa.fa-close:before {
  content: "\f00d"; }

.fa.fa-gear:before {
  content: "\f013"; }

.fa.fa-trash-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-trash-o:before {
  content: "\f2ed"; }

.fa.fa-file-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-o:before {
  content: "\f15b"; }

.fa.fa-clock-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-clock-o:before {
  content: "\f017"; }

.fa.fa-arrow-circle-o-down {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-arrow-circle-o-down:before {
  content: "\f358"; }

.fa.fa-arrow-circle-o-up {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-arrow-circle-o-up:before {
  content: "\f35b"; }

.fa.fa-play-circle-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-play-circle-o:before {
  content: "\f144"; }

.fa.fa-repeat:before {
  content: "\f01e"; }

.fa.fa-rotate-right:before {
  content: "\f01e"; }

.fa.fa-refresh:before {
  content: "\f021"; }

.fa.fa-list-alt {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-dedent:before {
  content: "\f03b"; }

.fa.fa-video-camera:before {
  content: "\f03d"; }

.fa.fa-picture-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-picture-o:before {
  content: "\f03e"; }

.fa.fa-photo {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-photo:before {
  content: "\f03e"; }

.fa.fa-image {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-image:before {
  content: "\f03e"; }

.fa.fa-pencil:before {
  content: "\f303"; }

.fa.fa-map-marker:before {
  content: "\f3c5"; }

.fa.fa-pencil-square-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-pencil-square-o:before {
  content: "\f044"; }

.fa.fa-share-square-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-share-square-o:before {
  content: "\f14d"; }

.fa.fa-check-square-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-check-square-o:before {
  content: "\f14a"; }

.fa.fa-arrows:before {
  content: "\f0b2"; }

.fa.fa-times-circle-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-times-circle-o:before {
  content: "\f057"; }

.fa.fa-check-circle-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-check-circle-o:before {
  content: "\f058"; }

.fa.fa-mail-forward:before {
  content: "\f064"; }

.fa.fa-eye {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-eye-slash {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-warning:before {
  content: "\f071"; }

.fa.fa-calendar:before {
  content: "\f073"; }

.fa.fa-arrows-v:before {
  content: "\f338"; }

.fa.fa-arrows-h:before {
  content: "\f337"; }

.fa.fa-bar-chart {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-bar-chart:before {
  content: "\f080"; }

.fa.fa-bar-chart-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-bar-chart-o:before {
  content: "\f080"; }

.fa.fa-twitter-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-facebook-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-gears:before {
  content: "\f085"; }

.fa.fa-thumbs-o-up {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-thumbs-o-up:before {
  content: "\f164"; }

.fa.fa-thumbs-o-down {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-thumbs-o-down:before {
  content: "\f165"; }

.fa.fa-heart-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-heart-o:before {
  content: "\f004"; }

.fa.fa-sign-out:before {
  content: "\f2f5"; }

.fa.fa-linkedin-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-linkedin-square:before {
  content: "\f08c"; }

.fa.fa-thumb-tack:before {
  content: "\f08d"; }

.fa.fa-external-link:before {
  content: "\f35d"; }

.fa.fa-sign-in:before {
  content: "\f2f6"; }

.fa.fa-github-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-lemon-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-lemon-o:before {
  content: "\f094"; }

.fa.fa-square-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-square-o:before {
  content: "\f0c8"; }

.fa.fa-bookmark-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-bookmark-o:before {
  content: "\f02e"; }

.fa.fa-twitter {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-facebook {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-facebook:before {
  content: "\f39e"; }

.fa.fa-facebook-f {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-facebook-f:before {
  content: "\f39e"; }

.fa.fa-github {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-credit-card {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-feed:before {
  content: "\f09e"; }

.fa.fa-hdd-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hdd-o:before {
  content: "\f0a0"; }

.fa.fa-hand-o-right {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hand-o-right:before {
  content: "\f0a4"; }

.fa.fa-hand-o-left {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hand-o-left:before {
  content: "\f0a5"; }

.fa.fa-hand-o-up {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hand-o-up:before {
  content: "\f0a6"; }

.fa.fa-hand-o-down {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hand-o-down:before {
  content: "\f0a7"; }

.fa.fa-arrows-alt:before {
  content: "\f31e"; }

.fa.fa-group:before {
  content: "\f0c0"; }

.fa.fa-chain:before {
  content: "\f0c1"; }

.fa.fa-scissors:before {
  content: "\f0c4"; }

.fa.fa-files-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-files-o:before {
  content: "\f0c5"; }

.fa.fa-floppy-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-floppy-o:before {
  content: "\f0c7"; }

.fa.fa-navicon:before {
  content: "\f0c9"; }

.fa.fa-reorder:before {
  content: "\f0c9"; }

.fa.fa-pinterest {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-pinterest-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-google-plus-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-google-plus {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-google-plus:before {
  content: "\f0d5"; }

.fa.fa-money {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-money:before {
  content: "\f3d1"; }

.fa.fa-unsorted:before {
  content: "\f0dc"; }

.fa.fa-sort-desc:before {
  content: "\f0dd"; }

.fa.fa-sort-asc:before {
  content: "\f0de"; }

.fa.fa-linkedin {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-linkedin:before {
  content: "\f0e1"; }

.fa.fa-rotate-left:before {
  content: "\f0e2"; }

.fa.fa-legal:before {
  content: "\f0e3"; }

.fa.fa-tachometer:before {
  content: "\f3fd"; }

.fa.fa-dashboard:before {
  content: "\f3fd"; }

.fa.fa-comment-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-comment-o:before {
  content: "\f075"; }

.fa.fa-comments-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-comments-o:before {
  content: "\f086"; }

.fa.fa-flash:before {
  content: "\f0e7"; }

.fa.fa-clipboard {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-paste {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-paste:before {
  content: "\f328"; }

.fa.fa-lightbulb-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-lightbulb-o:before {
  content: "\f0eb"; }

.fa.fa-exchange:before {
  content: "\f362"; }

.fa.fa-cloud-download:before {
  content: "\f381"; }

.fa.fa-cloud-upload:before {
  content: "\f382"; }

.fa.fa-bell-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-bell-o:before {
  content: "\f0f3"; }

.fa.fa-cutlery:before {
  content: "\f2e7"; }

.fa.fa-file-text-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-text-o:before {
  content: "\f15c"; }

.fa.fa-building-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-building-o:before {
  content: "\f1ad"; }

.fa.fa-hospital-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hospital-o:before {
  content: "\f0f8"; }

.fa.fa-tablet:before {
  content: "\f3fa"; }

.fa.fa-mobile:before {
  content: "\f3cd"; }

.fa.fa-mobile-phone:before {
  content: "\f3cd"; }

.fa.fa-circle-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-circle-o:before {
  content: "\f111"; }

.fa.fa-mail-reply:before {
  content: "\f3e5"; }

.fa.fa-github-alt {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-folder-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-folder-o:before {
  content: "\f07b"; }

.fa.fa-folder-open-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-folder-open-o:before {
  content: "\f07c"; }

.fa.fa-smile-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-smile-o:before {
  content: "\f118"; }

.fa.fa-frown-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-frown-o:before {
  content: "\f119"; }

.fa.fa-meh-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-meh-o:before {
  content: "\f11a"; }

.fa.fa-keyboard-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-keyboard-o:before {
  content: "\f11c"; }

.fa.fa-flag-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-flag-o:before {
  content: "\f024"; }

.fa.fa-mail-reply-all:before {
  content: "\f122"; }

.fa.fa-star-half-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-star-half-o:before {
  content: "\f089"; }

.fa.fa-star-half-empty {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-star-half-empty:before {
  content: "\f089"; }

.fa.fa-star-half-full {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-star-half-full:before {
  content: "\f089"; }

.fa.fa-code-fork:before {
  content: "\f126"; }

.fa.fa-chain-broken:before {
  content: "\f127"; }

.fa.fa-shield:before {
  content: "\f3ed"; }

.fa.fa-calendar-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-calendar-o:before {
  content: "\f133"; }

.fa.fa-maxcdn {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-html5 {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-css3 {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-ticket:before {
  content: "\f3ff"; }

.fa.fa-minus-square-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-minus-square-o:before {
  content: "\f146"; }

.fa.fa-level-up:before {
  content: "\f3bf"; }

.fa.fa-level-down:before {
  content: "\f3be"; }

.fa.fa-pencil-square:before {
  content: "\f14b"; }

.fa.fa-external-link-square:before {
  content: "\f360"; }

.fa.fa-compass {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-caret-square-o-down {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-caret-square-o-down:before {
  content: "\f150"; }

.fa.fa-toggle-down {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-toggle-down:before {
  content: "\f150"; }

.fa.fa-caret-square-o-up {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-caret-square-o-up:before {
  content: "\f151"; }

.fa.fa-toggle-up {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-toggle-up:before {
  content: "\f151"; }

.fa.fa-caret-square-o-right {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-caret-square-o-right:before {
  content: "\f152"; }

.fa.fa-toggle-right {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-toggle-right:before {
  content: "\f152"; }

.fa.fa-eur:before {
  content: "\f153"; }

.fa.fa-euro:before {
  content: "\f153"; }

.fa.fa-gbp:before {
  content: "\f154"; }

.fa.fa-usd:before {
  content: "\f155"; }

.fa.fa-dollar:before {
  content: "\f155"; }

.fa.fa-inr:before {
  content: "\f156"; }

.fa.fa-rupee:before {
  content: "\f156"; }

.fa.fa-jpy:before {
  content: "\f157"; }

.fa.fa-cny:before {
  content: "\f157"; }

.fa.fa-rmb:before {
  content: "\f157"; }

.fa.fa-yen:before {
  content: "\f157"; }

.fa.fa-rub:before {
  content: "\f158"; }

.fa.fa-ruble:before {
  content: "\f158"; }

.fa.fa-rouble:before {
  content: "\f158"; }

.fa.fa-krw:before {
  content: "\f159"; }

.fa.fa-won:before {
  content: "\f159"; }

.fa.fa-btc {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-bitcoin {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-bitcoin:before {
  content: "\f15a"; }

.fa.fa-file-text:before {
  content: "\f15c"; }

.fa.fa-sort-alpha-asc:before {
  content: "\f15d"; }

.fa.fa-sort-alpha-desc:before {
  content: "\f15e"; }

.fa.fa-sort-amount-asc:before {
  content: "\f160"; }

.fa.fa-sort-amount-desc:before {
  content: "\f161"; }

.fa.fa-sort-numeric-asc:before {
  content: "\f162"; }

.fa.fa-sort-numeric-desc:before {
  content: "\f163"; }

.fa.fa-youtube-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-youtube {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-xing {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-xing-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-youtube-play {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-youtube-play:before {
  content: "\f167"; }

.fa.fa-dropbox {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-stack-overflow {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-instagram {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-flickr {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-adn {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-bitbucket {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-bitbucket-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-bitbucket-square:before {
  content: "\f171"; }

.fa.fa-tumblr {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-tumblr-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-long-arrow-down:before {
  content: "\f309"; }

.fa.fa-long-arrow-up:before {
  content: "\f30c"; }

.fa.fa-long-arrow-left:before {
  content: "\f30a"; }

.fa.fa-long-arrow-right:before {
  content: "\f30b"; }

.fa.fa-apple {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-windows {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-android {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-linux {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-dribbble {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-skype {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-foursquare {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-trello {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-gratipay {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-gittip {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-gittip:before {
  content: "\f184"; }

.fa.fa-sun-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-sun-o:before {
  content: "\f185"; }

.fa.fa-moon-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-moon-o:before {
  content: "\f186"; }

.fa.fa-vk {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-weibo {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-renren {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-pagelines {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-stack-exchange {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-arrow-circle-o-right {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-arrow-circle-o-right:before {
  content: "\f35a"; }

.fa.fa-arrow-circle-o-left {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-arrow-circle-o-left:before {
  content: "\f359"; }

.fa.fa-caret-square-o-left {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-caret-square-o-left:before {
  content: "\f191"; }

.fa.fa-toggle-left {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-toggle-left:before {
  content: "\f191"; }

.fa.fa-dot-circle-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-dot-circle-o:before {
  content: "\f192"; }

.fa.fa-vimeo-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-try:before {
  content: "\f195"; }

.fa.fa-turkish-lira:before {
  content: "\f195"; }

.fa.fa-plus-square-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-plus-square-o:before {
  content: "\f0fe"; }

.fa.fa-slack {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-wordpress {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-openid {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-institution:before {
  content: "\f19c"; }

.fa.fa-bank:before {
  content: "\f19c"; }

.fa.fa-mortar-board:before {
  content: "\f19d"; }

.fa.fa-yahoo {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-google {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-reddit {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-reddit-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-stumbleupon-circle {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-stumbleupon {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-delicious {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-digg {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-pied-piper-pp {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-pied-piper-alt {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-drupal {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-joomla {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-spoon:before {
  content: "\f2e5"; }

.fa.fa-behance {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-behance-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-steam {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-steam-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-automobile:before {
  content: "\f1b9"; }

.fa.fa-cab:before {
  content: "\f1ba"; }

.fa.fa-envelope-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-envelope-o:before {
  content: "\f0e0"; }

.fa.fa-deviantart {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-soundcloud {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-file-pdf-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-pdf-o:before {
  content: "\f1c1"; }

.fa.fa-file-word-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-word-o:before {
  content: "\f1c2"; }

.fa.fa-file-excel-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-excel-o:before {
  content: "\f1c3"; }

.fa.fa-file-powerpoint-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-powerpoint-o:before {
  content: "\f1c4"; }

.fa.fa-file-image-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-image-o:before {
  content: "\f1c5"; }

.fa.fa-file-photo-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-photo-o:before {
  content: "\f1c5"; }

.fa.fa-file-picture-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-picture-o:before {
  content: "\f1c5"; }

.fa.fa-file-archive-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-archive-o:before {
  content: "\f1c6"; }

.fa.fa-file-zip-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-zip-o:before {
  content: "\f1c6"; }

.fa.fa-file-audio-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-audio-o:before {
  content: "\f1c7"; }

.fa.fa-file-sound-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-sound-o:before {
  content: "\f1c7"; }

.fa.fa-file-video-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-video-o:before {
  content: "\f1c8"; }

.fa.fa-file-movie-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-movie-o:before {
  content: "\f1c8"; }

.fa.fa-file-code-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-file-code-o:before {
  content: "\f1c9"; }

.fa.fa-vine {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-codepen {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-jsfiddle {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-life-ring {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-life-bouy {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-life-bouy:before {
  content: "\f1cd"; }

.fa.fa-life-buoy {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-life-buoy:before {
  content: "\f1cd"; }

.fa.fa-life-saver {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-life-saver:before {
  content: "\f1cd"; }

.fa.fa-support {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-support:before {
  content: "\f1cd"; }

.fa.fa-circle-o-notch:before {
  content: "\f1ce"; }

.fa.fa-rebel {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-ra {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-ra:before {
  content: "\f1d0"; }

.fa.fa-resistance {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-resistance:before {
  content: "\f1d0"; }

.fa.fa-empire {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-ge {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-ge:before {
  content: "\f1d1"; }

.fa.fa-git-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-git {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-hacker-news {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-y-combinator-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-y-combinator-square:before {
  content: "\f1d4"; }

.fa.fa-yc-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-yc-square:before {
  content: "\f1d4"; }

.fa.fa-tencent-weibo {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-qq {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-weixin {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-wechat {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-wechat:before {
  content: "\f1d7"; }

.fa.fa-send:before {
  content: "\f1d8"; }

.fa.fa-paper-plane-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-paper-plane-o:before {
  content: "\f1d8"; }

.fa.fa-send-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-send-o:before {
  content: "\f1d8"; }

.fa.fa-circle-thin {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-circle-thin:before {
  content: "\f111"; }

.fa.fa-header:before {
  content: "\f1dc"; }

.fa.fa-sliders:before {
  content: "\f1de"; }

.fa.fa-futbol-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-futbol-o:before {
  content: "\f1e3"; }

.fa.fa-soccer-ball-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-soccer-ball-o:before {
  content: "\f1e3"; }

.fa.fa-slideshare {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-twitch {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-yelp {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-newspaper-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-newspaper-o:before {
  content: "\f1ea"; }

.fa.fa-paypal {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-google-wallet {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-cc-visa {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-cc-mastercard {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-cc-discover {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-cc-amex {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-cc-paypal {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-cc-stripe {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-bell-slash-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-bell-slash-o:before {
  content: "\f1f6"; }

.fa.fa-trash:before {
  content: "\f2ed"; }

.fa.fa-copyright {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-eyedropper:before {
  content: "\f1fb"; }

.fa.fa-area-chart:before {
  content: "\f1fe"; }

.fa.fa-pie-chart:before {
  content: "\f200"; }

.fa.fa-line-chart:before {
  content: "\f201"; }

.fa.fa-lastfm {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-lastfm-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-ioxhost {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-angellist {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-cc {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-cc:before {
  content: "\f20a"; }

.fa.fa-ils:before {
  content: "\f20b"; }

.fa.fa-shekel:before {
  content: "\f20b"; }

.fa.fa-sheqel:before {
  content: "\f20b"; }

.fa.fa-meanpath {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-meanpath:before {
  content: "\f2b4"; }

.fa.fa-buysellads {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-connectdevelop {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-dashcube {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-forumbee {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-leanpub {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-sellsy {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-shirtsinbulk {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-simplybuilt {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-skyatlas {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-diamond {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-diamond:before {
  content: "\f3a5"; }

.fa.fa-intersex:before {
  content: "\f224"; }

.fa.fa-facebook-official {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-facebook-official:before {
  content: "\f09a"; }

.fa.fa-pinterest-p {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-whatsapp {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-hotel:before {
  content: "\f236"; }

.fa.fa-viacoin {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-medium {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-y-combinator {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-yc {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-yc:before {
  content: "\f23b"; }

.fa.fa-optin-monster {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-opencart {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-expeditedssl {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-battery-4:before {
  content: "\f240"; }

.fa.fa-battery:before {
  content: "\f240"; }

.fa.fa-battery-3:before {
  content: "\f241"; }

.fa.fa-battery-2:before {
  content: "\f242"; }

.fa.fa-battery-1:before {
  content: "\f243"; }

.fa.fa-battery-0:before {
  content: "\f244"; }

.fa.fa-object-group {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-object-ungroup {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-sticky-note-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-sticky-note-o:before {
  content: "\f249"; }

.fa.fa-cc-jcb {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-cc-diners-club {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-clone {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hourglass-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hourglass-o:before {
  content: "\f254"; }

.fa.fa-hourglass-1:before {
  content: "\f251"; }

.fa.fa-hourglass-2:before {
  content: "\f252"; }

.fa.fa-hourglass-3:before {
  content: "\f253"; }

.fa.fa-hand-rock-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hand-rock-o:before {
  content: "\f255"; }

.fa.fa-hand-grab-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hand-grab-o:before {
  content: "\f255"; }

.fa.fa-hand-paper-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hand-paper-o:before {
  content: "\f256"; }

.fa.fa-hand-stop-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hand-stop-o:before {
  content: "\f256"; }

.fa.fa-hand-scissors-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hand-scissors-o:before {
  content: "\f257"; }

.fa.fa-hand-lizard-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hand-lizard-o:before {
  content: "\f258"; }

.fa.fa-hand-spock-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hand-spock-o:before {
  content: "\f259"; }

.fa.fa-hand-pointer-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hand-pointer-o:before {
  content: "\f25a"; }

.fa.fa-hand-peace-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-hand-peace-o:before {
  content: "\f25b"; }

.fa.fa-registered {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-creative-commons {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-gg {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-gg-circle {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-tripadvisor {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-odnoklassniki {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-odnoklassniki-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-get-pocket {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-wikipedia-w {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-safari {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-chrome {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-firefox {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-opera {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-internet-explorer {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-television:before {
  content: "\f26c"; }

.fa.fa-contao {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-500px {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-amazon {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-calendar-plus-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-calendar-plus-o:before {
  content: "\f271"; }

.fa.fa-calendar-minus-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-calendar-minus-o:before {
  content: "\f272"; }

.fa.fa-calendar-times-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-calendar-times-o:before {
  content: "\f273"; }

.fa.fa-calendar-check-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-calendar-check-o:before {
  content: "\f274"; }

.fa.fa-map-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-map-o:before {
  content: "\f279"; }

.fa.fa-commenting:before {
  content: "\f4ad"; }

.fa.fa-commenting-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-commenting-o:before {
  content: "\f4ad"; }

.fa.fa-houzz {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-vimeo {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-vimeo:before {
  content: "\f27d"; }

.fa.fa-black-tie {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-fonticons {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-reddit-alien {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-edge {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-credit-card-alt:before {
  content: "\f09d"; }

.fa.fa-codiepie {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-modx {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-fort-awesome {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-usb {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-product-hunt {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-mixcloud {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-scribd {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-pause-circle-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-pause-circle-o:before {
  content: "\f28b"; }

.fa.fa-stop-circle-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-stop-circle-o:before {
  content: "\f28d"; }

.fa.fa-bluetooth {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-bluetooth-b {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-gitlab {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-wpbeginner {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-wpforms {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-envira {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-wheelchair-alt {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-wheelchair-alt:before {
  content: "\f368"; }

.fa.fa-question-circle-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-question-circle-o:before {
  content: "\f059"; }

.fa.fa-volume-control-phone:before {
  content: "\f2a0"; }

.fa.fa-asl-interpreting:before {
  content: "\f2a3"; }

.fa.fa-deafness:before {
  content: "\f2a4"; }

.fa.fa-hard-of-hearing:before {
  content: "\f2a4"; }

.fa.fa-glide {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-glide-g {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-signing:before {
  content: "\f2a7"; }

.fa.fa-viadeo {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-viadeo-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-snapchat {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-snapchat-ghost {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-snapchat-square {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-pied-piper {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-first-order {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-yoast {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-themeisle {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-google-plus-official {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-google-plus-official:before {
  content: "\f2b3"; }

.fa.fa-google-plus-circle {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-google-plus-circle:before {
  content: "\f2b3"; }

.fa.fa-font-awesome {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-fa {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-fa:before {
  content: "\f2b4"; }

.fa.fa-handshake-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-handshake-o:before {
  content: "\f2b5"; }

.fa.fa-envelope-open-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-envelope-open-o:before {
  content: "\f2b6"; }

.fa.fa-linode {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-address-book-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-address-book-o:before {
  content: "\f2b9"; }

.fa.fa-vcard:before {
  content: "\f2bb"; }

.fa.fa-address-card-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-address-card-o:before {
  content: "\f2bb"; }

.fa.fa-vcard-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-vcard-o:before {
  content: "\f2bb"; }

.fa.fa-user-circle-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-user-circle-o:before {
  content: "\f2bd"; }

.fa.fa-user-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-user-o:before {
  content: "\f007"; }

.fa.fa-id-badge {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-drivers-license:before {
  content: "\f2c2"; }

.fa.fa-id-card-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-id-card-o:before {
  content: "\f2c2"; }

.fa.fa-drivers-license-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-drivers-license-o:before {
  content: "\f2c2"; }

.fa.fa-quora {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-free-code-camp {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-telegram {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-thermometer-4:before {
  content: "\f2c7"; }

.fa.fa-thermometer:before {
  content: "\f2c7"; }

.fa.fa-thermometer-3:before {
  content: "\f2c8"; }

.fa.fa-thermometer-2:before {
  content: "\f2c9"; }

.fa.fa-thermometer-1:before {
  content: "\f2ca"; }

.fa.fa-thermometer-0:before {
  content: "\f2cb"; }

.fa.fa-bathtub:before {
  content: "\f2cd"; }

.fa.fa-s15:before {
  content: "\f2cd"; }

.fa.fa-window-maximize {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-window-restore {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-times-rectangle:before {
  content: "\f410"; }

.fa.fa-window-close-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-window-close-o:before {
  content: "\f410"; }

.fa.fa-times-rectangle-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-times-rectangle-o:before {
  content: "\f410"; }

.fa.fa-bandcamp {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-grav {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-etsy {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-imdb {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-ravelry {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-eercast {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-eercast:before {
  content: "\f2da"; }

.fa.fa-snowflake-o {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400; }

.fa.fa-snowflake-o:before {
  content: "\f2dc"; }

.fa.fa-superpowers {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-wpexplorer {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

.fa.fa-spotify {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400; }

@font-face {
  font-family: 'gm';
  src: url("public/theme/styles/system/fontello/font/gm.eot?51482360");
  src: url("public/theme/styles/system/fontello/font/gm.eot?51482360#iefix") format('embedded-opentype'), url("public/theme/styles/system/fontello/font/gm.woff?51482360") format('woff'), url("public/theme/styles/system/fontello/font/gm.ttf?51482360") format('truetype'), url("public/theme/styles/system/fontello/font/gm.svg?51482360#gm") format('svg');
  font-weight: normal;
  font-style: normal; }
/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */
html {
  font-family: sans-serif;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%; }

body {
  margin: 0; }

article, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section, summary {
  display: block; }

audio, canvas, progress, video {
  display: inline-block;
  vertical-align: baseline; }

audio:not([controls]) {
  display: none;
  height: 0; }

[hidden], template {
  display: none; }

a {
  background-color: transparent; }

a:active, a:hover {
  outline: 0; }

abbr[title] {
  border-bottom: 1px dotted; }

b, strong {
  font-weight: bold; }

dfn {
  font-style: italic; }

h1 {
  font-size: 2em;
  margin: 0.67em 0; }

mark {
  background: #ff0;
  color: #000; }

small {
  font-size: 80%; }

sub, sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline; }

sup {
  top: -0.5em; }

sub {
  bottom: -0.25em; }

img {
  border: 0; }

svg:not(:root) {
  overflow: hidden; }

figure {
  margin: 1em 40px; }

hr {
  box-sizing: content-box;
  height: 0; }

pre {
  overflow: auto; }

code, kbd, pre, samp {
  font-family: monospace, monospace;
  font-size: 1em; }

button, input, optgroup, select, textarea {
  color: inherit;
  font: inherit;
  margin: 0; }

button {
  overflow: visible; }

button, select {
  text-transform: none; }

button, html input[type="button"], input[type="reset"], input[type="submit"] {
  -webkit-appearance: button;
  cursor: pointer; }

button[disabled], html input[disabled] {
  cursor: default; }

button::-moz-focus-inner, input::-moz-focus-inner {
  border: 0;
  padding: 0; }

input {
  line-height: normal; }

input[type="checkbox"], input[type="radio"] {
  box-sizing: border-box;
  padding: 0; }

input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button {
  height: auto; }

input[type="search"] {
  -webkit-appearance: textfield;
  box-sizing: content-box; }

input[type="search"]::-webkit-search-cancel-button, input[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none; }

fieldset {
  border: 1px solid #c0c0c0;
  margin: 0 2px;
  padding: 0.35em 0.625em 0.75em; }

legend {
  border: 0;
  padding: 0; }

textarea {
  overflow: auto; }

optgroup {
  font-weight: bold; }

table {
  border-collapse: collapse;
  border-spacing: 0; }

td, th {
  padding: 0; }

* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box; }

*:before, *:after {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box; }

html {
  font-size: 10px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0); }

body {
  font-family: Roboto, Arial, sans-serif;
  font-size: 13px;
  line-height: 1.42857;
  color: #333;
  background-color: #fff; }

input, button, select, textarea {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit; }

a {
  color: #337ab7;
  text-decoration: none; }
  a:hover, a:focus {
    color: #22527b;
    text-decoration: underline; }
  a:focus {
    outline: 5px auto -webkit-focus-ring-color;
    outline-offset: -2px; }

figure {
  margin: 0; }

img {
  vertical-align: middle; }

.img-responsive, #header .custom-container .inside p img, .product-container .gallery > li img, #shop-top-banner img {
  display: block;
  max-width: 100%;
  height: auto; }

.img-rounded {
  border-radius: 6px; }

.img-thumbnail, .product-info-thumbnails .swiper-slide, .product-info-thumbnails-mobile .swiper-slide, .product-info-layer-thumbnails .swiper-slide, .product-container .gallery > li img {
  padding: 4px;
  line-height: 1.42857;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 2px;
  -webkit-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  display: inline-block;
  max-width: 100%;
  height: auto; }

.img-circle {
  border-radius: 50%; }

hr {
  margin-top: 18px;
  margin-bottom: 18px;
  border: 0;
  border-top: 1px solid #eee; }

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0; }

.sr-only-focusable:active, .sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  clip: auto; }

[role="button"] {
  cursor: pointer; }

h1, h2, .nav-tabs > li > a, .tab-content > .tab-pane > .tab-heading > a, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
  font-family: inherit;
  font-weight: 400;
  line-height: 1.1;
  color: #333; }
  h1 small, h2 small, .nav-tabs > li > a small, .tab-content > .tab-pane > .tab-heading > a small, h3 small, h4 small, h5 small, h6 small, .h1 small, .h2 small, .h3 small, .h4 small, .h5 small, .h6 small, h1 .small, h2 .small, .nav-tabs > li > a .small, .tab-content > .tab-pane > .tab-heading > a .small, h3 .small, h4 .small, h5 .small, h6 .small, .h1 .small, .h2 .small, .h3 .small, .h4 .small, .h5 .small, .h6 .small {
    font-weight: normal;
    line-height: 1;
    color: #777; }

h1, .h1, h2, .nav-tabs > li > a, .tab-content > .tab-pane > .tab-heading > a, .h2, h3, .h3 {
  margin-top: 18px;
  margin-bottom: 9px; }
  h1 small, .h1 small, h2 small, .nav-tabs > li > a small, .tab-content > .tab-pane > .tab-heading > a small, .h2 small, h3 small, .h3 small, h1 .small, .h1 .small, h2 .small, .nav-tabs > li > a .small, .tab-content > .tab-pane > .tab-heading > a .small, .h2 .small, h3 .small, .h3 .small {
    font-size: 65%; }

h4, .h4, h5, .h5, h6, .h6 {
  margin-top: 9px;
  margin-bottom: 9px; }
  h4 small, .h4 small, h5 small, .h5 small, h6 small, .h6 small, h4 .small, .h4 .small, h5 .small, .h5 .small, h6 .small, .h6 .small {
    font-size: 75%; }

h1, .h1 {
  font-size: 18px; }

h2, .nav-tabs > li > a, .tab-content > .tab-pane > .tab-heading > a, .h2 {
  font-size: 18px; }

h3, .h3 {
  font-size: 18px; }

h4, .h4 {
  font-size: 16px; }

h5, .h5 {
  font-size: 13px; }

h6, .h6 {
  font-size: 13px; }

p {
  margin: 0 0 9px; }

.lead {
  margin-bottom: 18px;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.4; }
  @media (min-width: 768px) {
  .lead {
    font-size: 19.5px; } }

small, .small {
  font-size: 92%; }

mark, .mark {
  background-color: #fcf8e3;
  padding: 0.2em; }

.text-left {
  text-align: left; }

.text-right {
  text-align: right; }

.text-center {
  text-align: center; }

.text-justify {
  text-align: justify; }

.text-nowrap {
  white-space: nowrap; }

.text-lowercase {
  text-transform: lowercase; }

.text-uppercase, .initialism {
  text-transform: uppercase; }

.text-capitalize {
  text-transform: capitalize; }

.text-muted {
  color: #777; }

.text-primary {
  color: #337ab7; }

a.text-primary:hover, a.text-primary:focus {
  color: #285f8f; }

.text-success {
  color: #3c763d; }

a.text-success:hover, a.text-success:focus {
  color: #2b542c; }

.text-info {
  color: #31708f; }

a.text-info:hover, a.text-info:focus {
  color: #245269; }

.text-warning {
  color: #8a6d3b; }

a.text-warning:hover, a.text-warning:focus {
  color: #66512c; }

.text-danger {
  color: #a94442; }

a.text-danger:hover, a.text-danger:focus {
  color: #843534; }

.bg-primary {
  color: #fff; }

.bg-primary {
  background-color: #337ab7; }

a.bg-primary:hover, a.bg-primary:focus {
  background-color: #285f8f; }

.bg-success {
  background-color: #dff0d8; }

a.bg-success:hover, a.bg-success:focus {
  background-color: #c1e2b3; }

.bg-info {
  background-color: #d9edf7; }

a.bg-info:hover, a.bg-info:focus {
  background-color: #afd9ee; }

.bg-warning {
  background-color: #fcf8e3; }

a.bg-warning:hover, a.bg-warning:focus {
  background-color: #f7ecb5; }

.bg-danger {
  background-color: #f2dede; }

a.bg-danger:hover, a.bg-danger:focus {
  background-color: #e4b9b9; }

.page-header {
  padding-bottom: 8px;
  margin: 36px 0 18px;
  border-bottom: 1px solid #eee; }

ul, ol {
  margin-top: 0;
  margin-bottom: 9px; }
  ul ul, ol ul, ul ol, ol ol {
    margin-bottom: 0; }

.list-unstyled {
  padding-left: 0;
  list-style: none; }

.list-inline {
  padding-left: 0;
  list-style: none;
  margin-left: -5px; }
  .list-inline > li {
    display: inline-block;
    padding-left: 5px;
    padding-right: 5px; }

dl {
  margin-top: 0;
  margin-bottom: 18px; }

dt, dd {
  line-height: 1.42857; }

dt {
  font-weight: bold; }

dd {
  margin-left: 0; }

.dl-horizontal dd:before, .product-info .product-info-details dl dd:before, .dl-horizontal dd:after, .product-info .product-info-details dl dd:after {
  content: " ";
  display: table; }
  .dl-horizontal dd:after, .product-info .product-info-details dl dd:after {
    clear: both; }
  @media (min-width: 768px) {
  .dl-horizontal dt, .product-info .product-info-details dl dt {
    float: left;
    width: 160px;
    clear: left;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; }
  .dl-horizontal dd, .product-info .product-info-details dl dd {
    margin-left: 180px; } }

abbr[title], abbr[data-original-title] {
  cursor: help;
  border-bottom: 1px dotted #777; }

.initialism {
  font-size: 90%; }

blockquote {
  padding: 9px 18px;
  margin: 0 0 18px;
  font-size: 16.25px;
  border-left: 5px solid #eee; }
  blockquote p:last-child, blockquote ul:last-child, blockquote ol:last-child {
    margin-bottom: 0; }
  blockquote footer, blockquote small, blockquote .small {
    display: block;
    font-size: 80%;
    line-height: 1.42857;
    color: #777; }
  blockquote footer:before, blockquote small:before, blockquote .small:before {
    content: '\2014 \00A0'; }

.blockquote-reverse, blockquote.pull-right {
  padding-right: 15px;
  padding-left: 0;
  border-right: 5px solid #eee;
  border-left: 0;
  text-align: right; }
  .blockquote-reverse footer:before, blockquote.pull-right footer:before, .blockquote-reverse small:before, blockquote.pull-right small:before, .blockquote-reverse .small:before, blockquote.pull-right .small:before {
    content: ''; }
  .blockquote-reverse footer:after, blockquote.pull-right footer:after, .blockquote-reverse small:after, blockquote.pull-right small:after, .blockquote-reverse .small:after, blockquote.pull-right .small:after {
    content: '\00A0 \2014'; }

address {
  margin-bottom: 18px;
  font-style: normal;
  line-height: 1.42857; }

.container, table.box-error, table.box-warning, body #wrapper, #footer .inside, #header .inside, #topbar-container .navbar-topbar, .navbar-collapse .navbar-categories {
  margin-right: auto;
  margin-left: auto;
  padding-left: 15px;
  padding-right: 15px; }
  .container:before, table.box-error:before, table.box-warning:before, body #wrapper:before, #footer .inside:before, #header .inside:before, #topbar-container .navbar-topbar:before, .navbar-collapse .navbar-categories:before, .container:after, table.box-error:after, table.box-warning:after, body #wrapper:after, #footer .inside:after, #header .inside:after, #topbar-container .navbar-topbar:after, .navbar-collapse .navbar-categories:after {
    content: " ";
    display: table; }
  .container:after, table.box-error:after, table.box-warning:after, body #wrapper:after, #footer .inside:after, #header .inside:after, #topbar-container .navbar-topbar:after, .navbar-collapse .navbar-categories:after {
    clear: both; }
  @media (min-width: 768px) {
  .container, table.box-error, table.box-warning, body #wrapper, #footer .inside, #header .inside, #topbar-container .navbar-topbar, .navbar-collapse .navbar-categories {
    width: 750px; } }
  @media (min-width: 992px) {
  .container, table.box-error, table.box-warning, body #wrapper, #footer .inside, #header .inside, #topbar-container .navbar-topbar, .navbar-collapse .navbar-categories {
    width: 970px; } }
  @media (min-width: 1200px) {
  .container, table.box-error, table.box-warning, body #wrapper, #footer .inside, #header .inside, #topbar-container .navbar-topbar, .navbar-collapse .navbar-categories {
    width: 1170px; } }

.container-fluid {
  margin-right: auto;
  margin-left: auto;
  padding-left: 15px;
  padding-right: 15px; }
  .container-fluid:before, .container-fluid:after {
    content: " ";
    display: table; }
  .container-fluid:after {
    clear: both; }

.row, .total-box table tr.total {
  margin-left: -15px;
  margin-right: -15px; }
  .row:before, .total-box table tr.total:before, .row:after, .total-box table tr.total:after {
    content: " ";
    display: table; }
  .row:after, .total-box table tr.total:after {
    clear: both; }

.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {
  position: relative;
  min-height: 1px;
  padding-left: 15px;
  padding-right: 15px; }

.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {
  float: left; }

.col-xs-1 {
  width: 8.33333%; }

.col-xs-2 {
  width: 16.66667%; }

.col-xs-3 {
  width: 25%; }

.col-xs-4 {
  width: 33.33333%; }

.col-xs-5 {
  width: 41.66667%; }

.col-xs-6 {
  width: 50%; }

.col-xs-7 {
  width: 58.33333%; }

.col-xs-8 {
  width: 66.66667%; }

.col-xs-9 {
  width: 75%; }

.col-xs-10 {
  width: 83.33333%; }

.col-xs-11 {
  width: 91.66667%; }

.col-xs-12 {
  width: 100%; }

.col-xs-pull-0 {
  right: auto; }

.col-xs-pull-1 {
  right: 8.33333%; }

.col-xs-pull-2 {
  right: 16.66667%; }

.col-xs-pull-3 {
  right: 25%; }

.col-xs-pull-4 {
  right: 33.33333%; }

.col-xs-pull-5 {
  right: 41.66667%; }

.col-xs-pull-6 {
  right: 50%; }

.col-xs-pull-7 {
  right: 58.33333%; }

.col-xs-pull-8 {
  right: 66.66667%; }

.col-xs-pull-9 {
  right: 75%; }

.col-xs-pull-10 {
  right: 83.33333%; }

.col-xs-pull-11 {
  right: 91.66667%; }

.col-xs-pull-12 {
  right: 100%; }

.col-xs-push-0 {
  left: auto; }

.col-xs-push-1 {
  left: 8.33333%; }

.col-xs-push-2 {
  left: 16.66667%; }

.col-xs-push-3 {
  left: 25%; }

.col-xs-push-4 {
  left: 33.33333%; }

.col-xs-push-5 {
  left: 41.66667%; }

.col-xs-push-6 {
  left: 50%; }

.col-xs-push-7 {
  left: 58.33333%; }

.col-xs-push-8 {
  left: 66.66667%; }

.col-xs-push-9 {
  left: 75%; }

.col-xs-push-10 {
  left: 83.33333%; }

.col-xs-push-11 {
  left: 91.66667%; }

.col-xs-push-12 {
  left: 100%; }

.col-xs-offset-0 {
  margin-left: 0%; }

.col-xs-offset-1 {
  margin-left: 8.33333%; }

.col-xs-offset-2 {
  margin-left: 16.66667%; }

.col-xs-offset-3 {
  margin-left: 25%; }

.col-xs-offset-4 {
  margin-left: 33.33333%; }

.col-xs-offset-5 {
  margin-left: 41.66667%; }

.col-xs-offset-6 {
  margin-left: 50%; }

.col-xs-offset-7 {
  margin-left: 58.33333%; }

.col-xs-offset-8 {
  margin-left: 66.66667%; }

.col-xs-offset-9 {
  margin-left: 75%; }

.col-xs-offset-10 {
  margin-left: 83.33333%; }

.col-xs-offset-11 {
  margin-left: 91.66667%; }

.col-xs-offset-12 {
  margin-left: 100%; }

@media (min-width: 768px) {
  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {
    float: left; }
    .col-sm-1 {
      width: 8.33333%; }
    .col-sm-2 {
      width: 16.66667%; }
    .col-sm-3 {
      width: 25%; }
    .col-sm-4 {
      width: 33.33333%; }
    .col-sm-5 {
      width: 41.66667%; }
    .col-sm-6 {
      width: 50%; }
    .col-sm-7 {
      width: 58.33333%; }
    .col-sm-8 {
      width: 66.66667%; }
    .col-sm-9 {
      width: 75%; }
    .col-sm-10 {
      width: 83.33333%; }
    .col-sm-11 {
      width: 91.66667%; }
    .col-sm-12 {
      width: 100%; }
    .col-sm-pull-0 {
      right: auto; }
    .col-sm-pull-1 {
      right: 8.33333%; }
    .col-sm-pull-2 {
      right: 16.66667%; }
    .col-sm-pull-3 {
      right: 25%; }
    .col-sm-pull-4 {
      right: 33.33333%; }
    .col-sm-pull-5 {
      right: 41.66667%; }
    .col-sm-pull-6 {
      right: 50%; }
    .col-sm-pull-7 {
      right: 58.33333%; }
    .col-sm-pull-8 {
      right: 66.66667%; }
    .col-sm-pull-9 {
      right: 75%; }
    .col-sm-pull-10 {
      right: 83.33333%; }
    .col-sm-pull-11 {
      right: 91.66667%; }
    .col-sm-pull-12 {
      right: 100%; }
    .col-sm-push-0 {
      left: auto; }
    .col-sm-push-1 {
      left: 8.33333%; }
    .col-sm-push-2 {
      left: 16.66667%; }
    .col-sm-push-3 {
      left: 25%; }
    .col-sm-push-4 {
      left: 33.33333%; }
    .col-sm-push-5 {
      left: 41.66667%; }
    .col-sm-push-6 {
      left: 50%; }
    .col-sm-push-7 {
      left: 58.33333%; }
    .col-sm-push-8 {
      left: 66.66667%; }
    .col-sm-push-9 {
      left: 75%; }
    .col-sm-push-10 {
      left: 83.33333%; }
    .col-sm-push-11 {
      left: 91.66667%; }
    .col-sm-push-12 {
      left: 100%; }
    .col-sm-offset-0 {
      margin-left: 0%; }
    .col-sm-offset-1 {
      margin-left: 8.33333%; }
    .col-sm-offset-2 {
      margin-left: 16.66667%; }
    .col-sm-offset-3 {
      margin-left: 25%; }
    .col-sm-offset-4 {
      margin-left: 33.33333%; }
    .col-sm-offset-5 {
      margin-left: 41.66667%; }
    .col-sm-offset-6 {
      margin-left: 50%; }
    .col-sm-offset-7 {
      margin-left: 58.33333%; }
    .col-sm-offset-8 {
      margin-left: 66.66667%; }
    .col-sm-offset-9 {
      margin-left: 75%; }
    .col-sm-offset-10 {
      margin-left: 83.33333%; }
    .col-sm-offset-11 {
      margin-left: 91.66667%; }
    .col-sm-offset-12 {
      margin-left: 100%; } }

@media (min-width: 992px) {
  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {
    float: left; }
    .col-md-1 {
      width: 8.33333%; }
    .col-md-2 {
      width: 16.66667%; }
    .col-md-3 {
      width: 25%; }
    .col-md-4 {
      width: 33.33333%; }
    .col-md-5 {
      width: 41.66667%; }
    .col-md-6 {
      width: 50%; }
    .col-md-7 {
      width: 58.33333%; }
    .col-md-8 {
      width: 66.66667%; }
    .col-md-9 {
      width: 75%; }
    .col-md-10 {
      width: 83.33333%; }
    .col-md-11 {
      width: 91.66667%; }
    .col-md-12 {
      width: 100%; }
    .col-md-pull-0 {
      right: auto; }
    .col-md-pull-1 {
      right: 8.33333%; }
    .col-md-pull-2 {
      right: 16.66667%; }
    .col-md-pull-3 {
      right: 25%; }
    .col-md-pull-4 {
      right: 33.33333%; }
    .col-md-pull-5 {
      right: 41.66667%; }
    .col-md-pull-6 {
      right: 50%; }
    .col-md-pull-7 {
      right: 58.33333%; }
    .col-md-pull-8 {
      right: 66.66667%; }
    .col-md-pull-9 {
      right: 75%; }
    .col-md-pull-10 {
      right: 83.33333%; }
    .col-md-pull-11 {
      right: 91.66667%; }
    .col-md-pull-12 {
      right: 100%; }
    .col-md-push-0 {
      left: auto; }
    .col-md-push-1 {
      left: 8.33333%; }
    .col-md-push-2 {
      left: 16.66667%; }
    .col-md-push-3 {
      left: 25%; }
    .col-md-push-4 {
      left: 33.33333%; }
    .col-md-push-5 {
      left: 41.66667%; }
    .col-md-push-6 {
      left: 50%; }
    .col-md-push-7 {
      left: 58.33333%; }
    .col-md-push-8 {
      left: 66.66667%; }
    .col-md-push-9 {
      left: 75%; }
    .col-md-push-10 {
      left: 83.33333%; }
    .col-md-push-11 {
      left: 91.66667%; }
    .col-md-push-12 {
      left: 100%; }
    .col-md-offset-0 {
      margin-left: 0%; }
    .col-md-offset-1 {
      margin-left: 8.33333%; }
    .col-md-offset-2 {
      margin-left: 16.66667%; }
    .col-md-offset-3 {
      margin-left: 25%; }
    .col-md-offset-4 {
      margin-left: 33.33333%; }
    .col-md-offset-5 {
      margin-left: 41.66667%; }
    .col-md-offset-6 {
      margin-left: 50%; }
    .col-md-offset-7 {
      margin-left: 58.33333%; }
    .col-md-offset-8 {
      margin-left: 66.66667%; }
    .col-md-offset-9 {
      margin-left: 75%; }
    .col-md-offset-10 {
      margin-left: 83.33333%; }
    .col-md-offset-11 {
      margin-left: 91.66667%; }
    .col-md-offset-12 {
      margin-left: 100%; } }

@media (min-width: 1200px) {
  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {
    float: left; }
    .col-lg-1 {
      width: 8.33333%; }
    .col-lg-2 {
      width: 16.66667%; }
    .col-lg-3 {
      width: 25%; }
    .col-lg-4 {
      width: 33.33333%; }
    .col-lg-5 {
      width: 41.66667%; }
    .col-lg-6 {
      width: 50%; }
    .col-lg-7 {
      width: 58.33333%; }
    .col-lg-8 {
      width: 66.66667%; }
    .col-lg-9 {
      width: 75%; }
    .col-lg-10 {
      width: 83.33333%; }
    .col-lg-11 {
      width: 91.66667%; }
    .col-lg-12 {
      width: 100%; }
    .col-lg-pull-0 {
      right: auto; }
    .col-lg-pull-1 {
      right: 8.33333%; }
    .col-lg-pull-2 {
      right: 16.66667%; }
    .col-lg-pull-3 {
      right: 25%; }
    .col-lg-pull-4 {
      right: 33.33333%; }
    .col-lg-pull-5 {
      right: 41.66667%; }
    .col-lg-pull-6 {
      right: 50%; }
    .col-lg-pull-7 {
      right: 58.33333%; }
    .col-lg-pull-8 {
      right: 66.66667%; }
    .col-lg-pull-9 {
      right: 75%; }
    .col-lg-pull-10 {
      right: 83.33333%; }
    .col-lg-pull-11 {
      right: 91.66667%; }
    .col-lg-pull-12 {
      right: 100%; }
    .col-lg-push-0 {
      left: auto; }
    .col-lg-push-1 {
      left: 8.33333%; }
    .col-lg-push-2 {
      left: 16.66667%; }
    .col-lg-push-3 {
      left: 25%; }
    .col-lg-push-4 {
      left: 33.33333%; }
    .col-lg-push-5 {
      left: 41.66667%; }
    .col-lg-push-6 {
      left: 50%; }
    .col-lg-push-7 {
      left: 58.33333%; }
    .col-lg-push-8 {
      left: 66.66667%; }
    .col-lg-push-9 {
      left: 75%; }
    .col-lg-push-10 {
      left: 83.33333%; }
    .col-lg-push-11 {
      left: 91.66667%; }
    .col-lg-push-12 {
      left: 100%; }
    .col-lg-offset-0 {
      margin-left: 0%; }
    .col-lg-offset-1 {
      margin-left: 8.33333%; }
    .col-lg-offset-2 {
      margin-left: 16.66667%; }
    .col-lg-offset-3 {
      margin-left: 25%; }
    .col-lg-offset-4 {
      margin-left: 33.33333%; }
    .col-lg-offset-5 {
      margin-left: 41.66667%; }
    .col-lg-offset-6 {
      margin-left: 50%; }
    .col-lg-offset-7 {
      margin-left: 58.33333%; }
    .col-lg-offset-8 {
      margin-left: 66.66667%; }
    .col-lg-offset-9 {
      margin-left: 75%; }
    .col-lg-offset-10 {
      margin-left: 83.33333%; }
    .col-lg-offset-11 {
      margin-left: 91.66667%; }
    .col-lg-offset-12 {
      margin-left: 100%; } }

table {
  background-color: transparent; }

caption {
  padding-top: 8px;
  padding-bottom: 8px;
  color: #777;
  text-align: left; }

th {
  text-align: left; }

.table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 18px; }
  .table > thead > tr > th, .table > tbody > tr > th, .table > tfoot > tr > th, .table > thead > tr > td, .table > tbody > tr > td, .table > tfoot > tr > td {
    padding: 8px;
    line-height: 1.42857;
    vertical-align: top;
    border-top: 1px solid #ddd; }
  .table > thead > tr > th {
    vertical-align: bottom;
    border-bottom: 2px solid #ddd; }
  .table > caption + thead > tr:first-child > th, .table > colgroup + thead > tr:first-child > th, .table > thead:first-child > tr:first-child > th, .table > caption + thead > tr:first-child > td, .table > colgroup + thead > tr:first-child > td, .table > thead:first-child > tr:first-child > td {
    border-top: 0; }
  .table > tbody + tbody {
    border-top: 2px solid #ddd; }
  .table .table {
    background-color: #fff; }

.table-condensed > thead > tr > th, .table-condensed > tbody > tr > th, .table-condensed > tfoot > tr > th, .table-condensed > thead > tr > td, .table-condensed > tbody > tr > td, .table-condensed > tfoot > tr > td {
  padding: 5px; }

.table-bordered {
  border: 1px solid #ddd; }
  .table-bordered > thead > tr > th, .table-bordered > tbody > tr > th, .table-bordered > tfoot > tr > th, .table-bordered > thead > tr > td, .table-bordered > tbody > tr > td, .table-bordered > tfoot > tr > td {
    border: 1px solid #ddd; }
  .table-bordered > thead > tr > th, .table-bordered > thead > tr > td {
    border-bottom-width: 2px; }

.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: #f9f9f9; }

.table-hover > tbody > tr:hover {
  background-color: #f5f5f5; }

table col[class*="col-"] {
  position: static;
  float: none;
  display: table-column; }

table td[class*="col-"], table th[class*="col-"] {
  position: static;
  float: none;
  display: table-cell; }

.table > thead > tr > td.active, .table > tbody > tr > td.active, .table > tfoot > tr > td.active, .table > thead > tr > th.active, .table > tbody > tr > th.active, .table > tfoot > tr > th.active, .table > thead > tr.active > td, .table > tbody > tr.active > td, .table > tfoot > tr.active > td, .table > thead > tr.active > th, .table > tbody > tr.active > th, .table > tfoot > tr.active > th {
  background-color: #f5f5f5; }

.table-hover > tbody > tr > td.active:hover, .table-hover > tbody > tr > th.active:hover, .table-hover > tbody > tr.active:hover > td, .table-hover > tbody > tr:hover > .active, .table-hover > tbody > tr.active:hover > th {
  background-color: #e8e8e8; }

.table > thead > tr > td.success, .table > tbody > tr > td.success, .table > tfoot > tr > td.success, .table > thead > tr > th.success, .table > tbody > tr > th.success, .table > tfoot > tr > th.success, .table > thead > tr.success > td, .table > tbody > tr.success > td, .table > tfoot > tr.success > td, .table > thead > tr.success > th, .table > tbody > tr.success > th, .table > tfoot > tr.success > th {
  background-color: #dff0d8; }

.table-hover > tbody > tr > td.success:hover, .table-hover > tbody > tr > th.success:hover, .table-hover > tbody > tr.success:hover > td, .table-hover > tbody > tr:hover > .success, .table-hover > tbody > tr.success:hover > th {
  background-color: #d0e9c6; }

.table > thead > tr > td.info, .table > tbody > tr > td.info, .table > tfoot > tr > td.info, .table > thead > tr > th.info, .table > tbody > tr > th.info, .table > tfoot > tr > th.info, .table > thead > tr.info > td, .table > tbody > tr.info > td, .table > tfoot > tr.info > td, .table > thead > tr.info > th, .table > tbody > tr.info > th, .table > tfoot > tr.info > th {
  background-color: #d9edf7; }

.table-hover > tbody > tr > td.info:hover, .table-hover > tbody > tr > th.info:hover, .table-hover > tbody > tr.info:hover > td, .table-hover > tbody > tr:hover > .info, .table-hover > tbody > tr.info:hover > th {
  background-color: #c4e3f3; }

.table > thead > tr > td.warning, .table > tbody > tr > td.warning, .table > tfoot > tr > td.warning, .table > thead > tr > th.warning, .table > tbody > tr > th.warning, .table > tfoot > tr > th.warning, .table > thead > tr.warning > td, .table > tbody > tr.warning > td, .table > tfoot > tr.warning > td, .table > thead > tr.warning > th, .table > tbody > tr.warning > th, .table > tfoot > tr.warning > th {
  background-color: #fcf8e3; }

.table-hover > tbody > tr > td.warning:hover, .table-hover > tbody > tr > th.warning:hover, .table-hover > tbody > tr.warning:hover > td, .table-hover > tbody > tr:hover > .warning, .table-hover > tbody > tr.warning:hover > th {
  background-color: #faf2cc; }

.table > thead > tr > td.danger, .table > tbody > tr > td.danger, .table > tfoot > tr > td.danger, .table > thead > tr > th.danger, .table > tbody > tr > th.danger, .table > tfoot > tr > th.danger, .table > thead > tr.danger > td, .table > tbody > tr.danger > td, .table > tfoot > tr.danger > td, .table > thead > tr.danger > th, .table > tbody > tr.danger > th, .table > tfoot > tr.danger > th {
  background-color: #f2dede; }

.table-hover > tbody > tr > td.danger:hover, .table-hover > tbody > tr > th.danger:hover, .table-hover > tbody > tr.danger:hover > td, .table-hover > tbody > tr:hover > .danger, .table-hover > tbody > tr.danger:hover > th {
  background-color: #ebcccc; }

.table-responsive {
  overflow-x: auto;
  min-height: 0.01%; }
  @media screen and (max-width: 767px) {
  .table-responsive {
    width: 100%;
    margin-bottom: 13.5px;
    overflow-y: hidden;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    border: 1px solid #ddd; }
    .table-responsive > .table {
      margin-bottom: 0; }
      .table-responsive > .table > thead > tr > th, .table-responsive > .table > tbody > tr > th, .table-responsive > .table > tfoot > tr > th, .table-responsive > .table > thead > tr > td, .table-responsive > .table > tbody > tr > td, .table-responsive > .table > tfoot > tr > td {
        white-space: nowrap; }

    .table-responsive > .table-bordered {
      border: 0; }
      .table-responsive > .table-bordered > thead > tr > th:first-child, .table-responsive > .table-bordered > tbody > tr > th:first-child, .table-responsive > .table-bordered > tfoot > tr > th:first-child, .table-responsive > .table-bordered > thead > tr > td:first-child, .table-responsive > .table-bordered > tbody > tr > td:first-child, .table-responsive > .table-bordered > tfoot > tr > td:first-child {
        border-left: 0; }
        .table-responsive > .table-bordered > thead > tr > th:last-child, .table-responsive > .table-bordered > tbody > tr > th:last-child, .table-responsive > .table-bordered > tfoot > tr > th:last-child, .table-responsive > .table-bordered > thead > tr > td:last-child, .table-responsive > .table-bordered > tbody > tr > td:last-child, .table-responsive > .table-bordered > tfoot > tr > td:last-child {
          border-right: 0; }
      .table-responsive > .table-bordered > tbody > tr:last-child > th, .table-responsive > .table-bordered > tfoot > tr:last-child > th, .table-responsive > .table-bordered > tbody > tr:last-child > td, .table-responsive > .table-bordered > tfoot > tr:last-child > td {
        border-bottom: 0; } }

fieldset {
  padding: 0;
  margin: 0;
  border: 0;
  min-width: 0; }

legend {
  display: block;
  width: 100%;
  padding: 0;
  margin-bottom: 18px;
  font-size: 19.5px;
  line-height: inherit;
  color: #333;
  border: 0;
  border-bottom: 1px solid #e5e5e5; }

label {
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
  font-weight: bold; }

input[type="search"] {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box; }

input[type="radio"], input[type="checkbox"] {
  margin: 4px 0 0;
  margin-top: 1px \9;
  line-height: normal; }

input[type="file"] {
  display: block; }

input[type="range"] {
  display: block;
  width: 100%; }

select[multiple], select[size] {
  height: auto; }

input[type="file"]:focus, input[type="radio"]:focus, input[type="checkbox"]:focus {
  outline: 5px auto -webkit-focus-ring-color;
  outline-offset: -2px; }

output {
  display: block;
  padding-top: 10px;
  font-size: 13px;
  line-height: 1.42857;
  color: #555; }

.form-control, .input-text {
  display: block;
  width: 100%;
  height: 38px;
  padding: 9px 12px;
  font-size: 13px;
  line-height: 1.42857;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 2px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
  -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; }
  .form-control:focus, .input-text:focus {
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6); }
  .form-control::-moz-placeholder, .input-text::-moz-placeholder {
    color: #999;
    opacity: 1; }
  .form-control:-ms-input-placeholder, .input-text:-ms-input-placeholder {
    color: #999; }
  .form-control::-webkit-input-placeholder, .input-text::-webkit-input-placeholder {
    color: #999; }
  .form-control::-ms-expand, .input-text::-ms-expand {
    border: 0;
    background-color: transparent; }
  .form-control[disabled], .input-text[disabled], .form-control[readonly], .input-text[readonly], fieldset[disabled] .form-control, fieldset[disabled] .input-text {
    background-color: #eee;
    opacity: 1; }
  .form-control[disabled], .input-text[disabled], fieldset[disabled] .form-control, fieldset[disabled] .input-text {
    cursor: not-allowed; }

textarea.form-control, textarea.input-text {
  height: auto; }

input[type="search"] {
  -webkit-appearance: none; }

@media screen and (-webkit-min-device-pixel-ratio: 0) {
  input[type="date"].form-control, input.input-text[type="date"], input[type="time"].form-control, input.input-text[type="time"], input[type="datetime-local"].form-control, input.input-text[type="datetime-local"], input[type="month"].form-control, input.input-text[type="month"] {
    line-height: 38px; }
    input[type="date"].input-sm, .input-group-sm > input.form-control[type="date"], .input-group-sm > input.input-text[type="date"], .input-group-sm > input.input-group-addon[type="date"], .input-group-sm > .input-group-btn > input.btn[type="date"], .input-group-sm > .input-number .btn-plus > input.btn[type="date"], .input-group-sm > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="date"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-plus > input[type="date"], .input-number .input-group-sm > .btn-plus > input.btn[type="date"], .input-group-sm > .input-number .btn-minus > input.btn[type="date"], .input-group-sm > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="date"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-minus > input[type="date"], .input-number .input-group-sm > .btn-minus > input.btn[type="date"], .input-group-sm > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="date"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-group-btn > input[type="date"], input[type="time"].input-sm, .input-group-sm > input.form-control[type="time"], .input-group-sm > input.input-text[type="time"], .input-group-sm > input.input-group-addon[type="time"], .input-group-sm > .input-group-btn > input.btn[type="time"], .input-group-sm > .input-number .btn-plus > input.btn[type="time"], .input-group-sm > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="time"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-plus > input[type="time"], .input-number .input-group-sm > .btn-plus > input.btn[type="time"], .input-group-sm > .input-number .btn-minus > input.btn[type="time"], .input-group-sm > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="time"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-minus > input[type="time"], .input-number .input-group-sm > .btn-minus > input.btn[type="time"], .input-group-sm > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="time"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-group-btn > input[type="time"], input[type="datetime-local"].input-sm, .input-group-sm > input.form-control[type="datetime-local"], .input-group-sm > input.input-text[type="datetime-local"], .input-group-sm > input.input-group-addon[type="datetime-local"], .input-group-sm > .input-group-btn > input.btn[type="datetime-local"], .input-group-sm > .input-number .btn-plus > input.btn[type="datetime-local"], .input-group-sm > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="datetime-local"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-plus > input[type="datetime-local"], .input-number .input-group-sm > .btn-plus > input.btn[type="datetime-local"], .input-group-sm > .input-number .btn-minus > input.btn[type="datetime-local"], .input-group-sm > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="datetime-local"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-minus > input[type="datetime-local"], .input-number .input-group-sm > .btn-minus > input.btn[type="datetime-local"], .input-group-sm > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="datetime-local"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-group-btn > input[type="datetime-local"], input[type="month"].input-sm, .input-group-sm > input.form-control[type="month"], .input-group-sm > input.input-text[type="month"], .input-group-sm > input.input-group-addon[type="month"], .input-group-sm > .input-group-btn > input.btn[type="month"], .input-group-sm > .input-number .btn-plus > input.btn[type="month"], .input-group-sm > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="month"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-plus > input[type="month"], .input-number .input-group-sm > .btn-plus > input.btn[type="month"], .input-group-sm > .input-number .btn-minus > input.btn[type="month"], .input-group-sm > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="month"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-minus > input[type="month"], .input-number .input-group-sm > .btn-minus > input.btn[type="month"], .input-group-sm > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="month"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-group-btn > input[type="month"], .input-group-sm input[type="date"], .input-group-sm input[type="time"], .input-group-sm input[type="datetime-local"], .input-group-sm input[type="month"] {
      line-height: 30px; }
    input[type="date"].input-lg, .input-group-lg > input.form-control[type="date"], .input-group-lg > input.input-text[type="date"], .input-group-lg > input.input-group-addon[type="date"], .input-group-lg > .input-group-btn > input.btn[type="date"], .input-group-lg > .input-number .btn-plus > input.btn[type="date"], .input-group-lg > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="date"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-plus > input[type="date"], .input-number .input-group-lg > .btn-plus > input.btn[type="date"], .input-group-lg > .input-number .btn-minus > input.btn[type="date"], .input-group-lg > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="date"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-minus > input[type="date"], .input-number .input-group-lg > .btn-minus > input.btn[type="date"], .input-group-lg > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="date"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-group-btn > input[type="date"], input[type="time"].input-lg, .input-group-lg > input.form-control[type="time"], .input-group-lg > input.input-text[type="time"], .input-group-lg > input.input-group-addon[type="time"], .input-group-lg > .input-group-btn > input.btn[type="time"], .input-group-lg > .input-number .btn-plus > input.btn[type="time"], .input-group-lg > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="time"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-plus > input[type="time"], .input-number .input-group-lg > .btn-plus > input.btn[type="time"], .input-group-lg > .input-number .btn-minus > input.btn[type="time"], .input-group-lg > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="time"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-minus > input[type="time"], .input-number .input-group-lg > .btn-minus > input.btn[type="time"], .input-group-lg > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="time"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-group-btn > input[type="time"], input[type="datetime-local"].input-lg, .input-group-lg > input.form-control[type="datetime-local"], .input-group-lg > input.input-text[type="datetime-local"], .input-group-lg > input.input-group-addon[type="datetime-local"], .input-group-lg > .input-group-btn > input.btn[type="datetime-local"], .input-group-lg > .input-number .btn-plus > input.btn[type="datetime-local"], .input-group-lg > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="datetime-local"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-plus > input[type="datetime-local"], .input-number .input-group-lg > .btn-plus > input.btn[type="datetime-local"], .input-group-lg > .input-number .btn-minus > input.btn[type="datetime-local"], .input-group-lg > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="datetime-local"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-minus > input[type="datetime-local"], .input-number .input-group-lg > .btn-minus > input.btn[type="datetime-local"], .input-group-lg > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="datetime-local"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-group-btn > input[type="datetime-local"], input[type="month"].input-lg, .input-group-lg > input.form-control[type="month"], .input-group-lg > input.input-text[type="month"], .input-group-lg > input.input-group-addon[type="month"], .input-group-lg > .input-group-btn > input.btn[type="month"], .input-group-lg > .input-number .btn-plus > input.btn[type="month"], .input-group-lg > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="month"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-plus > input[type="month"], .input-number .input-group-lg > .btn-plus > input.btn[type="month"], .input-group-lg > .input-number .btn-minus > input.btn[type="month"], .input-group-lg > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="month"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-minus > input[type="month"], .input-number .input-group-lg > .btn-minus > input.btn[type="month"], .input-group-lg > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="month"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-group-btn > input[type="month"], .input-group-lg input[type="date"], .input-group-lg input[type="time"], .input-group-lg input[type="datetime-local"], .input-group-lg input[type="month"] {
      line-height: 45px; } }

.form-group {
  margin-bottom: 15px; }

.radio, .checkbox {
  position: relative;
  display: block;
  margin-top: 10px;
  margin-bottom: 10px; }
  .radio label, .checkbox label {
    min-height: 18px;
    padding-left: 20px;
    margin-bottom: 0;
    font-weight: normal;
    cursor: pointer; }

.radio input[type="radio"], .radio-inline input[type="radio"], .checkbox input[type="checkbox"], .checkbox-inline input[type="checkbox"] {
  position: absolute;
  margin-left: -20px;
  margin-top: 4px \9; }

.radio + .radio, .checkbox + .checkbox {
  margin-top: -5px; }

.radio-inline, .checkbox-inline {
  position: relative;
  display: inline-block;
  padding-left: 20px;
  margin-bottom: 0;
  vertical-align: middle;
  font-weight: normal;
  cursor: pointer; }

.radio-inline + .radio-inline, .checkbox-inline + .checkbox-inline {
  margin-top: 0;
  margin-left: 10px; }

input[type="radio"][disabled], input[type="checkbox"][disabled], input[type="radio"].disabled, input[type="checkbox"].disabled, fieldset[disabled] input[type="radio"], fieldset[disabled] input[type="checkbox"] {
  cursor: not-allowed; }

.radio-inline.disabled, .checkbox-inline.disabled, fieldset[disabled] .radio-inline, fieldset[disabled] .checkbox-inline {
  cursor: not-allowed; }

.radio.disabled label, .checkbox.disabled label, fieldset[disabled] .radio label, fieldset[disabled] .checkbox label {
  cursor: not-allowed; }

.form-control-static {
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 0;
  min-height: 31px; }
  .form-control-static.input-lg, .input-group-lg > .form-control.form-control-static, .input-group-lg > .input-text.form-control-static, .input-group-lg > .input-group-addon.form-control-static, .input-group-lg > .input-group-btn > .btn.form-control-static, .input-group-lg > .input-number .btn-plus > .btn.form-control-static, .input-group-lg > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.form-control-static, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-plus > button.form-control-static, .input-number .input-group-lg > .btn-plus > .btn.form-control-static, .input-group-lg > .input-number .btn-minus > .btn.form-control-static, .input-group-lg > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.form-control-static, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-minus > button.form-control-static, .input-number .input-group-lg > .btn-minus > .btn.form-control-static, .input-group-lg > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.form-control-static, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-group-btn > button.form-control-static, .form-control-static.input-sm, .input-group-sm > .form-control.form-control-static, .input-group-sm > .input-text.form-control-static, .input-group-sm > .input-group-addon.form-control-static, .input-group-sm > .input-group-btn > .btn.form-control-static, .input-group-sm > .input-number .btn-plus > .btn.form-control-static, .input-group-sm > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.form-control-static, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-plus > button.form-control-static, .input-number .input-group-sm > .btn-plus > .btn.form-control-static, .input-group-sm > .input-number .btn-minus > .btn.form-control-static, .input-group-sm > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.form-control-static, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-minus > button.form-control-static, .input-number .input-group-sm > .btn-minus > .btn.form-control-static, .input-group-sm > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.form-control-static, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-group-btn > button.form-control-static {
    padding-left: 0;
    padding-right: 0; }

.input-sm, .input-group-sm > .form-control, .input-group-sm > .input-text, .input-group-sm > .input-group-addon, .input-group-sm > .input-group-btn > .btn, .input-group-sm > .input-number .btn-plus > .btn, .input-group-sm > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-plus > button, .input-number .input-group-sm > .btn-plus > .btn, .input-group-sm > .input-number .btn-minus > .btn, .input-group-sm > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-minus > button, .input-number .input-group-sm > .btn-minus > .btn, .input-group-sm > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-group-btn > button {
  height: 30px;
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 0; }

select.input-sm, .input-group-sm > select.form-control, .input-group-sm > select.input-text, .input-group-sm > select.input-group-addon, .input-group-sm > .input-group-btn > select.btn, .input-group-sm > .input-number .btn-plus > select.btn, .input-group-sm > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel select, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-plus > select, .input-number .input-group-sm > .btn-plus > select.btn, .input-group-sm > .input-number .btn-minus > select.btn, .input-group-sm > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel select, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-minus > select, .input-number .input-group-sm > .btn-minus > select.btn, .input-group-sm > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel select, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-group-btn > select {
  height: 30px;
  line-height: 30px; }

textarea.input-sm, .input-group-sm > textarea.form-control, .input-group-sm > textarea.input-text, .input-group-sm > textarea.input-group-addon, .input-group-sm > .input-group-btn > textarea.btn, .input-group-sm > .input-number .btn-plus > textarea.btn, .input-group-sm > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel textarea, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-plus > textarea, .input-number .input-group-sm > .btn-plus > textarea.btn, .input-group-sm > .input-number .btn-minus > textarea.btn, .input-group-sm > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel textarea, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-minus > textarea, .input-number .input-group-sm > .btn-minus > textarea.btn, .input-group-sm > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel textarea, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-group-btn > textarea, select[multiple].input-sm, .input-group-sm > select.form-control[multiple], .input-group-sm > select.input-text[multiple], .input-group-sm > select.input-group-addon[multiple], .input-group-sm > .input-group-btn > select.btn[multiple], .input-group-sm > .input-number .btn-plus > select.btn[multiple], .input-group-sm > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel select[multiple], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-plus > select[multiple], .input-number .input-group-sm > .btn-plus > select.btn[multiple], .input-group-sm > .input-number .btn-minus > select.btn[multiple], .input-group-sm > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel select[multiple], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-minus > select[multiple], .input-number .input-group-sm > .btn-minus > select.btn[multiple], .input-group-sm > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel select[multiple], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-group-btn > select[multiple] {
  height: auto; }

.form-group-sm .form-control, .form-group-sm .input-text {
  height: 30px;
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 0; }
  .form-group-sm select.form-control, .form-group-sm select.input-text {
    height: 30px;
    line-height: 30px; }
  .form-group-sm textarea.form-control, .form-group-sm textarea.input-text, .form-group-sm select[multiple].form-control, .form-group-sm select.input-text[multiple] {
    height: auto; }
  .form-group-sm .form-control-static {
    height: 30px;
    min-height: 30px;
    padding: 6px 10px;
    font-size: 12px;
    line-height: 1.5; }

.input-lg, .input-group-lg > .form-control, .input-group-lg > .input-text, .input-group-lg > .input-group-addon, .input-group-lg > .input-group-btn > .btn, .input-group-lg > .input-number .btn-plus > .btn, .input-group-lg > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-plus > button, .input-number .input-group-lg > .btn-plus > .btn, .input-group-lg > .input-number .btn-minus > .btn, .input-group-lg > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-minus > button, .input-number .input-group-lg > .btn-minus > .btn, .input-group-lg > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-group-btn > button {
  height: 45px;
  padding: 10px 16px;
  font-size: 17px;
  line-height: 1.33333;
  border-radius: 6px; }

select.input-lg, .input-group-lg > select.form-control, .input-group-lg > select.input-text, .input-group-lg > select.input-group-addon, .input-group-lg > .input-group-btn > select.btn, .input-group-lg > .input-number .btn-plus > select.btn, .input-group-lg > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel select, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-plus > select, .input-number .input-group-lg > .btn-plus > select.btn, .input-group-lg > .input-number .btn-minus > select.btn, .input-group-lg > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel select, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-minus > select, .input-number .input-group-lg > .btn-minus > select.btn, .input-group-lg > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel select, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-group-btn > select {
  height: 45px;
  line-height: 45px; }

textarea.input-lg, .input-group-lg > textarea.form-control, .input-group-lg > textarea.input-text, .input-group-lg > textarea.input-group-addon, .input-group-lg > .input-group-btn > textarea.btn, .input-group-lg > .input-number .btn-plus > textarea.btn, .input-group-lg > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel textarea, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-plus > textarea, .input-number .input-group-lg > .btn-plus > textarea.btn, .input-group-lg > .input-number .btn-minus > textarea.btn, .input-group-lg > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel textarea, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-minus > textarea, .input-number .input-group-lg > .btn-minus > textarea.btn, .input-group-lg > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel textarea, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-group-btn > textarea, select[multiple].input-lg, .input-group-lg > select.form-control[multiple], .input-group-lg > select.input-text[multiple], .input-group-lg > select.input-group-addon[multiple], .input-group-lg > .input-group-btn > select.btn[multiple], .input-group-lg > .input-number .btn-plus > select.btn[multiple], .input-group-lg > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel select[multiple], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-plus > select[multiple], .input-number .input-group-lg > .btn-plus > select.btn[multiple], .input-group-lg > .input-number .btn-minus > select.btn[multiple], .input-group-lg > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel select[multiple], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-minus > select[multiple], .input-number .input-group-lg > .btn-minus > select.btn[multiple], .input-group-lg > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel select[multiple], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-group-btn > select[multiple] {
  height: auto; }

.form-group-lg .form-control, .form-group-lg .input-text {
  height: 45px;
  padding: 10px 16px;
  font-size: 17px;
  line-height: 1.33333;
  border-radius: 6px; }
  .form-group-lg select.form-control, .form-group-lg select.input-text {
    height: 45px;
    line-height: 45px; }
  .form-group-lg textarea.form-control, .form-group-lg textarea.input-text, .form-group-lg select[multiple].form-control, .form-group-lg select.input-text[multiple] {
    height: auto; }
  .form-group-lg .form-control-static {
    height: 45px;
    min-height: 35px;
    padding: 11px 16px;
    font-size: 17px;
    line-height: 1.33333; }

.has-feedback {
  position: relative; }
  .has-feedback .form-control, .has-feedback .input-text {
    padding-right: 47.5px; }

.form-control-feedback {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  display: block;
  width: 38px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  pointer-events: none; }

.input-lg + .form-control-feedback, .input-group-lg > .form-control + .form-control-feedback, .input-group-lg > .input-text + .form-control-feedback, .input-group-lg > .input-group-addon + .form-control-feedback, .input-group-lg > .input-group-btn > .btn + .form-control-feedback, .input-group-lg > .input-number .btn-plus > .btn + .form-control-feedback, .input-group-lg > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .form-control-feedback, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-plus > button + .form-control-feedback, .input-number .input-group-lg > .btn-plus > .btn + .form-control-feedback, .input-group-lg > .input-number .btn-minus > .btn + .form-control-feedback, .input-group-lg > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .form-control-feedback, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-minus > button + .form-control-feedback, .input-number .input-group-lg > .btn-minus > .btn + .form-control-feedback, .input-group-lg > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .form-control-feedback, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-group-btn > button + .form-control-feedback, .input-group-lg + .form-control-feedback, .form-group-lg .form-control + .form-control-feedback, .form-group-lg .input-text + .form-control-feedback {
  width: 45px;
  height: 45px;
  line-height: 45px; }

.input-sm + .form-control-feedback, .input-group-sm > .form-control + .form-control-feedback, .input-group-sm > .input-text + .form-control-feedback, .input-group-sm > .input-group-addon + .form-control-feedback, .input-group-sm > .input-group-btn > .btn + .form-control-feedback, .input-group-sm > .input-number .btn-plus > .btn + .form-control-feedback, .input-group-sm > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .form-control-feedback, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-plus > button + .form-control-feedback, .input-number .input-group-sm > .btn-plus > .btn + .form-control-feedback, .input-group-sm > .input-number .btn-minus > .btn + .form-control-feedback, .input-group-sm > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .form-control-feedback, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-minus > button + .form-control-feedback, .input-number .input-group-sm > .btn-minus > .btn + .form-control-feedback, .input-group-sm > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .form-control-feedback, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-group-btn > button + .form-control-feedback, .input-group-sm + .form-control-feedback, .form-group-sm .form-control + .form-control-feedback, .form-group-sm .input-text + .form-control-feedback {
  width: 30px;
  height: 30px;
  line-height: 30px; }

.has-success .help-block, .has-success .control-label, .has-success .radio, .has-success .checkbox, .has-success .radio-inline, .has-success .checkbox-inline, .has-success.radio label, .has-success.checkbox label, .has-success.radio-inline label, .has-success.checkbox-inline label {
  color: #3c763d; }
  .has-success .form-control, .has-success .input-text {
    border-color: #3c763d;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075); }
  .has-success .form-control:focus, .has-success .input-text:focus {
    border-color: #2b542c;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #67b168;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #67b168; }
  .has-success .input-group-addon {
    color: #3c763d;
    border-color: #3c763d;
    background-color: #dff0d8; }
  .has-success .form-control-feedback {
    color: #3c763d; }

.has-warning .help-block, .has-warning .control-label, .has-warning .radio, .has-warning .checkbox, .has-warning .radio-inline, .has-warning .checkbox-inline, .has-warning.radio label, .has-warning.checkbox label, .has-warning.radio-inline label, .has-warning.checkbox-inline label {
  color: #8a6d3b; }
  .has-warning .form-control, .has-warning .input-text {
    border-color: #8a6d3b;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075); }
  .has-warning .form-control:focus, .has-warning .input-text:focus {
    border-color: #66512c;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #c0a16b;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #c0a16b; }
  .has-warning .input-group-addon {
    color: #8a6d3b;
    border-color: #8a6d3b;
    background-color: #fcf8e3; }
  .has-warning .form-control-feedback {
    color: #8a6d3b; }

.has-error .help-block, .has-error .control-label, .has-error .radio, .has-error .checkbox, .has-error .radio-inline, .has-error .checkbox-inline, .has-error.radio label, .has-error.checkbox label, .has-error.radio-inline label, .has-error.checkbox-inline label {
  color: #a94442; }
  .has-error .form-control, .has-error .input-text {
    border-color: #a94442;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075); }
  .has-error .form-control:focus, .has-error .input-text:focus {
    border-color: #843534;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #ce8483;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #ce8483; }
  .has-error .input-group-addon {
    color: #a94442;
    border-color: #a94442;
    background-color: #f2dede; }
  .has-error .form-control-feedback {
    color: #a94442; }

.has-feedback label ~ .form-control-feedback {
  top: 23px; }
  .has-feedback label.sr-only ~ .form-control-feedback {
    top: 0; }

.help-block {
  display: block;
  margin-top: 5px;
  margin-bottom: 10px;
  color: #737373; }

@media (min-width: 768px) {
    .form-inline .form-group {
      display: inline-block;
      margin-bottom: 0;
      vertical-align: middle; }
    .form-inline .form-control, .form-inline .input-text {
      display: inline-block;
      width: auto;
      vertical-align: middle; }
    .form-inline .form-control-static {
      display: inline-block; }
    .form-inline .input-group, .form-inline .input-number {
      display: inline-table;
      vertical-align: middle; }
      .form-inline .input-group .input-group-addon, .form-inline .input-number .input-group-addon, .form-inline .input-group .input-group-btn, .form-inline .input-number .input-group-btn, .form-inline .input-number .input-number .btn-plus, .input-number .form-inline .input-number .btn-plus, .form-inline .input-number .input-number .btn-minus, .input-number .form-inline .input-number .btn-minus, .form-inline .input-group .input-number .btn-plus, .input-number .form-inline .input-group .btn-plus, .form-inline .input-group .input-number .btn-minus, .input-number .form-inline .input-group .btn-minus, .form-inline .input-group .form-control, .form-inline .input-number .form-control, .form-inline .input-number .input-text, .form-inline .input-group .input-text {
        width: auto; }
    .form-inline .input-group > .form-control, .form-inline .input-number > .form-control, .form-inline .input-number > .input-text, .form-inline .input-group > .input-text {
      width: 100%; }
    .form-inline .control-label {
      margin-bottom: 0;
      vertical-align: middle; }
    .form-inline .radio, .form-inline .checkbox {
      display: inline-block;
      margin-top: 0;
      margin-bottom: 0;
      vertical-align: middle; }
      .form-inline .radio label, .form-inline .checkbox label {
        padding-left: 0; }
    .form-inline .radio input[type="radio"], .form-inline .checkbox input[type="checkbox"] {
      position: relative;
      margin-left: 0; }
    .form-inline .has-feedback .form-control-feedback {
      top: 0; } }

.form-horizontal .radio, .form-horizontal .checkbox, .form-horizontal .radio-inline, .form-horizontal .checkbox-inline {
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 10px; }
  .form-horizontal .radio, .form-horizontal .checkbox {
    min-height: 28px; }
  .form-horizontal .form-group {
    margin-left: -15px;
    margin-right: -15px; }
  .form-horizontal .form-group:before, .form-horizontal .form-group:after {
    content: " ";
    display: table; }
  .form-horizontal .form-group:after {
    clear: both; }
  @media (min-width: 768px) {
  .form-horizontal .control-label {
    text-align: right;
    margin-bottom: 0;
    padding-top: 10px; } }
  .form-horizontal .has-feedback .form-control-feedback {
    right: 15px; }
  @media (min-width: 768px) {
    .form-horizontal .form-group-lg .control-label {
      padding-top: 11px;
      font-size: 17px; } }
  @media (min-width: 768px) {
    .form-horizontal .form-group-sm .control-label {
      padding-top: 6px;
      font-size: 12px; } }

.btn, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button {
  display: inline-block;
  margin-bottom: 0;
  font-weight: normal;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  padding: 9px 12px;
  font-size: 13px;
  line-height: 1.42857;
  border-radius: 2px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none; }
  .btn:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:focus, .btn:active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:active:focus, .btn.active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.active:focus, .btn.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.focus, .btn:active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:active.focus, .btn.active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.active.focus {
    outline: 5px auto -webkit-focus-ring-color;
    outline-offset: -2px; }
  .btn:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:hover, .btn:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:focus, .btn.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.focus {
    color: #666;
    text-decoration: none; }
  .btn:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:active, .btn.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.active {
    outline: 0;
    background-image: none;
    -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125); }
  .btn.disabled, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.disabled, .btn[disabled], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button[disabled], fieldset[disabled] .btn, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button {
    cursor: not-allowed;
    opacity: 0.65;
    filter: alpha(opacity=65);
    -webkit-box-shadow: none;
    box-shadow: none; }

a.btn.disabled, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel a.disabled, fieldset[disabled] a.btn, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel a, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] a {
  pointer-events: none; }

.btn-default, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary {
  color: #666;
  background-color: #f3f3f3;
  border-color: #ccc; }
  .btn-default:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:focus, .btn-default.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.focus {
    color: #666;
    background-color: #dadada;
    border-color: #8c8c8c; }
  .btn-default:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:hover {
    color: #666;
    background-color: #dadada;
    border-color: #adadad; }
  .btn-default:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:active, .btn-default.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.active, .open > .btn-default.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-secondary.dropdown-toggle {
    color: #666;
    background-color: #dadada;
    border-color: #adadad; }
  .btn-default:active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:active:hover, .btn-default.active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.active:hover, .open > .btn-default.dropdown-toggle:hover, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.dropdown-toggle:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-secondary.dropdown-toggle:hover, .btn-default:active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:active:focus, .btn-default.active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.active:focus, .open > .btn-default.dropdown-toggle:focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.dropdown-toggle:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-secondary.dropdown-toggle:focus, .btn-default:active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:active.focus, .btn-default.active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.active.focus, .open > .btn-default.dropdown-toggle.focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.dropdown-toggle.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-secondary.dropdown-toggle.focus {
    color: #666;
    background-color: #c8c8c8;
    border-color: #8c8c8c; }
  .btn-default:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:active, .btn-default.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.active, .open > .btn-default.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-secondary.dropdown-toggle {
    background-image: none; }
  .btn-default.disabled:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.disabled:hover, .btn-default[disabled]:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary[disabled]:hover, fieldset[disabled] .btn-default:hover, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.ui-priority-secondary:hover, .btn-default.disabled:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.disabled:focus, .btn-default[disabled]:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary[disabled]:focus, fieldset[disabled] .btn-default:focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.ui-priority-secondary:focus, .btn-default.disabled.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.disabled.focus, .btn-default[disabled].focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary[disabled].focus, fieldset[disabled] .btn-default.focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.ui-priority-secondary.focus {
    background-color: #f3f3f3;
    border-color: #ccc; }
  .btn-default .badge, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary .badge {
    color: #f3f3f3;
    background-color: #666; }

.btn-primary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary {
  color: #fff;
  background-color: #337ab7;
  border-color: #2d6da3; }
  .btn-primary:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:focus, .btn-primary.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.focus {
    color: #fff;
    background-color: #285f8f;
    border-color: #122a3f; }
  .btn-primary:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:hover {
    color: #fff;
    background-color: #285f8f;
    border-color: #204d73; }
  .btn-primary:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:active, .btn-primary.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.active, .open > .btn-primary.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-primary.dropdown-toggle {
    color: #fff;
    background-color: #285f8f;
    border-color: #204d73; }
  .btn-primary:active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:active:hover, .btn-primary.active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.active:hover, .open > .btn-primary.dropdown-toggle:hover, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-primary.dropdown-toggle:hover, .btn-primary:active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:active:focus, .btn-primary.active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.active:focus, .open > .btn-primary.dropdown-toggle:focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-primary.dropdown-toggle:focus, .btn-primary:active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:active.focus, .btn-primary.active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.active.focus, .open > .btn-primary.dropdown-toggle.focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-primary.dropdown-toggle.focus {
    color: #fff;
    background-color: #204d73;
    border-color: #122a3f; }
  .btn-primary:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:active, .btn-primary.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.active, .open > .btn-primary.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-primary.dropdown-toggle {
    background-image: none; }
  .btn-primary.disabled:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.disabled:hover, .btn-primary[disabled]:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary[disabled]:hover, fieldset[disabled] .btn-primary:hover, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.ui-priority-primary:hover, .btn-primary.disabled:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.disabled:focus, .btn-primary[disabled]:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary[disabled]:focus, fieldset[disabled] .btn-primary:focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.ui-priority-primary:focus, .btn-primary.disabled.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.disabled.focus, .btn-primary[disabled].focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary[disabled].focus, fieldset[disabled] .btn-primary.focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.ui-priority-primary.focus {
    background-color: #337ab7;
    border-color: #2d6da3; }
  .btn-primary .badge, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary .badge {
    color: #337ab7;
    background-color: #fff; }

.btn-success {
  color: #fff;
  background-color: #5cb85c;
  border-color: #4cae4c; }
  .btn-success:focus, .btn-success.focus {
    color: #fff;
    background-color: #449d44;
    border-color: #255625; }
  .btn-success:hover {
    color: #fff;
    background-color: #449d44;
    border-color: #398439; }
  .btn-success:active, .btn-success.active, .open > .btn-success.dropdown-toggle {
    color: #fff;
    background-color: #449d44;
    border-color: #398439; }
  .btn-success:active:hover, .btn-success.active:hover, .open > .btn-success.dropdown-toggle:hover, .btn-success:active:focus, .btn-success.active:focus, .open > .btn-success.dropdown-toggle:focus, .btn-success:active.focus, .btn-success.active.focus, .open > .btn-success.dropdown-toggle.focus {
    color: #fff;
    background-color: #398439;
    border-color: #255625; }
  .btn-success:active, .btn-success.active, .open > .btn-success.dropdown-toggle {
    background-image: none; }
  .btn-success.disabled:hover, .btn-success[disabled]:hover, fieldset[disabled] .btn-success:hover, .btn-success.disabled:focus, .btn-success[disabled]:focus, fieldset[disabled] .btn-success:focus, .btn-success.disabled.focus, .btn-success[disabled].focus, fieldset[disabled] .btn-success.focus {
    background-color: #5cb85c;
    border-color: #4cae4c; }
  .btn-success .badge {
    color: #5cb85c;
    background-color: #fff; }

.btn-info {
  color: #fff;
  background-color: #5bc0de;
  border-color: #46b8da; }
  .btn-info:focus, .btn-info.focus {
    color: #fff;
    background-color: #31b0d5;
    border-color: #1b6d85; }
  .btn-info:hover {
    color: #fff;
    background-color: #31b0d5;
    border-color: #269abc; }
  .btn-info:active, .btn-info.active, .open > .btn-info.dropdown-toggle {
    color: #fff;
    background-color: #31b0d5;
    border-color: #269abc; }
  .btn-info:active:hover, .btn-info.active:hover, .open > .btn-info.dropdown-toggle:hover, .btn-info:active:focus, .btn-info.active:focus, .open > .btn-info.dropdown-toggle:focus, .btn-info:active.focus, .btn-info.active.focus, .open > .btn-info.dropdown-toggle.focus {
    color: #fff;
    background-color: #269abc;
    border-color: #1b6d85; }
  .btn-info:active, .btn-info.active, .open > .btn-info.dropdown-toggle {
    background-image: none; }
  .btn-info.disabled:hover, .btn-info[disabled]:hover, fieldset[disabled] .btn-info:hover, .btn-info.disabled:focus, .btn-info[disabled]:focus, fieldset[disabled] .btn-info:focus, .btn-info.disabled.focus, .btn-info[disabled].focus, fieldset[disabled] .btn-info.focus {
    background-color: #5bc0de;
    border-color: #46b8da; }
  .btn-info .badge {
    color: #5bc0de;
    background-color: #fff; }

.btn-warning {
  color: #fff;
  background-color: #f0ad4e;
  border-color: #eea236; }
  .btn-warning:focus, .btn-warning.focus {
    color: #fff;
    background-color: #ec971f;
    border-color: #985f0d; }
  .btn-warning:hover {
    color: #fff;
    background-color: #ec971f;
    border-color: #d58512; }
  .btn-warning:active, .btn-warning.active, .open > .btn-warning.dropdown-toggle {
    color: #fff;
    background-color: #ec971f;
    border-color: #d58512; }
  .btn-warning:active:hover, .btn-warning.active:hover, .open > .btn-warning.dropdown-toggle:hover, .btn-warning:active:focus, .btn-warning.active:focus, .open > .btn-warning.dropdown-toggle:focus, .btn-warning:active.focus, .btn-warning.active.focus, .open > .btn-warning.dropdown-toggle.focus {
    color: #fff;
    background-color: #d58512;
    border-color: #985f0d; }
  .btn-warning:active, .btn-warning.active, .open > .btn-warning.dropdown-toggle {
    background-image: none; }
  .btn-warning.disabled:hover, .btn-warning[disabled]:hover, fieldset[disabled] .btn-warning:hover, .btn-warning.disabled:focus, .btn-warning[disabled]:focus, fieldset[disabled] .btn-warning:focus, .btn-warning.disabled.focus, .btn-warning[disabled].focus, fieldset[disabled] .btn-warning.focus {
    background-color: #f0ad4e;
    border-color: #eea236; }
  .btn-warning .badge {
    color: #f0ad4e;
    background-color: #fff; }

.btn-danger {
  color: #fff;
  background-color: #d9534f;
  border-color: #d43f3a; }
  .btn-danger:focus, .btn-danger.focus {
    color: #fff;
    background-color: #c9302c;
    border-color: #761c19; }
  .btn-danger:hover {
    color: #fff;
    background-color: #c9302c;
    border-color: #ac2925; }
  .btn-danger:active, .btn-danger.active, .open > .btn-danger.dropdown-toggle {
    color: #fff;
    background-color: #c9302c;
    border-color: #ac2925; }
  .btn-danger:active:hover, .btn-danger.active:hover, .open > .btn-danger.dropdown-toggle:hover, .btn-danger:active:focus, .btn-danger.active:focus, .open > .btn-danger.dropdown-toggle:focus, .btn-danger:active.focus, .btn-danger.active.focus, .open > .btn-danger.dropdown-toggle.focus {
    color: #fff;
    background-color: #ac2925;
    border-color: #761c19; }
  .btn-danger:active, .btn-danger.active, .open > .btn-danger.dropdown-toggle {
    background-image: none; }
  .btn-danger.disabled:hover, .btn-danger[disabled]:hover, fieldset[disabled] .btn-danger:hover, .btn-danger.disabled:focus, .btn-danger[disabled]:focus, fieldset[disabled] .btn-danger:focus, .btn-danger.disabled.focus, .btn-danger[disabled].focus, fieldset[disabled] .btn-danger.focus {
    background-color: #d9534f;
    border-color: #d43f3a; }
  .btn-danger .badge {
    color: #d9534f;
    background-color: #fff; }

.btn-link {
  color: #337ab7;
  font-weight: normal;
  border-radius: 0; }
  .btn-link, .btn-link:active, .btn-link.active, .btn-link[disabled], fieldset[disabled] .btn-link {
    background-color: transparent;
    -webkit-box-shadow: none;
    box-shadow: none; }
  .btn-link, .btn-link:hover, .btn-link:focus, .btn-link:active {
    border-color: transparent; }
  .btn-link:hover, .btn-link:focus {
    color: #22527b;
    text-decoration: underline;
    background-color: transparent; }
  .btn-link[disabled]:hover, fieldset[disabled] .btn-link:hover, .btn-link[disabled]:focus, fieldset[disabled] .btn-link:focus {
    color: #777;
    text-decoration: none; }

.btn-lg, .btn-group-lg > .btn, .btn-group-lg > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-lg > button {
  padding: 10px 16px;
  font-size: 17px;
  line-height: 1.33333;
  border-radius: 6px; }

.btn-sm, .btn-group-sm > .btn, .btn-group-sm > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-sm > button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button {
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 0; }

.btn-xs, .btn-group-xs > .btn, .btn-group-xs > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-xs > button {
  padding: 1px 5px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 0; }

.btn-block, .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-group .btn-minus .dropdown-toggle {
  display: block;
  width: 100%; }

.btn-block + .btn-block, .navbar-search .input-group .input-group-btn .dropdown-toggle + .btn-block, .navbar-search .input-number .input-group-btn .dropdown-toggle + .btn-block, .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .btn-block, .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .dropdown-toggle, .input-number .navbar-search .input-number .btn-plus .dropdown-toggle + .btn-block, .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .btn-block, .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .dropdown-toggle, .input-number .navbar-search .input-number .btn-minus .dropdown-toggle + .btn-block, .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .navbar-search .input-number .input-group-btn .dropdown-toggle + .dropdown-toggle, .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .btn-block, .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .dropdown-toggle, .input-number .navbar-search .input-group .btn-plus .dropdown-toggle + .btn-block, .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .btn-block, .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .dropdown-toggle, .input-number .navbar-search .input-group .btn-minus .dropdown-toggle + .btn-block, .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .navbar-search .input-group .input-group-btn .dropdown-toggle + .dropdown-toggle, .btn-block + .navbar-search .input-group .input-group-btn .dropdown-toggle, .btn-block + .navbar-search .input-number .input-group-btn .dropdown-toggle, .btn-block + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .btn-block + .navbar-search .input-number .btn-plus .dropdown-toggle, .btn-block + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .btn-block + .navbar-search .input-number .btn-minus .dropdown-toggle, .btn-block + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .btn-block + .navbar-search .input-group .btn-plus .dropdown-toggle, .btn-block + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .btn-block + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .btn-block + .dropdown-toggle {
  margin-top: 5px; }

input[type="submit"].btn-block, .navbar-search .input-group .input-group-btn input.dropdown-toggle[type="submit"], .navbar-search .input-number .input-group-btn input.dropdown-toggle[type="submit"], .navbar-search .input-number .input-number .btn-plus input.dropdown-toggle[type="submit"], .input-number .navbar-search .input-number .btn-plus input.dropdown-toggle[type="submit"], .navbar-search .input-number .input-number .btn-minus input.dropdown-toggle[type="submit"], .input-number .navbar-search .input-number .btn-minus input.dropdown-toggle[type="submit"], .navbar-search .input-group .input-number .btn-plus input.dropdown-toggle[type="submit"], .input-number .navbar-search .input-group .btn-plus input.dropdown-toggle[type="submit"], .navbar-search .input-group .input-number .btn-minus input.dropdown-toggle[type="submit"], .input-number .navbar-search .input-group .btn-minus input.dropdown-toggle[type="submit"], input[type="reset"].btn-block, .navbar-search .input-group .input-group-btn input.dropdown-toggle[type="reset"], .navbar-search .input-number .input-group-btn input.dropdown-toggle[type="reset"], .navbar-search .input-number .input-number .btn-plus input.dropdown-toggle[type="reset"], .input-number .navbar-search .input-number .btn-plus input.dropdown-toggle[type="reset"], .navbar-search .input-number .input-number .btn-minus input.dropdown-toggle[type="reset"], .input-number .navbar-search .input-number .btn-minus input.dropdown-toggle[type="reset"], .navbar-search .input-group .input-number .btn-plus input.dropdown-toggle[type="reset"], .input-number .navbar-search .input-group .btn-plus input.dropdown-toggle[type="reset"], .navbar-search .input-group .input-number .btn-minus input.dropdown-toggle[type="reset"], .input-number .navbar-search .input-group .btn-minus input.dropdown-toggle[type="reset"], input[type="button"].btn-block, .navbar-search .input-group .input-group-btn input.dropdown-toggle[type="button"], .navbar-search .input-number .input-group-btn input.dropdown-toggle[type="button"], .navbar-search .input-number .input-number .btn-plus input.dropdown-toggle[type="button"], .input-number .navbar-search .input-number .btn-plus input.dropdown-toggle[type="button"], .navbar-search .input-number .input-number .btn-minus input.dropdown-toggle[type="button"], .input-number .navbar-search .input-number .btn-minus input.dropdown-toggle[type="button"], .navbar-search .input-group .input-number .btn-plus input.dropdown-toggle[type="button"], .input-number .navbar-search .input-group .btn-plus input.dropdown-toggle[type="button"], .navbar-search .input-group .input-number .btn-minus input.dropdown-toggle[type="button"], .input-number .navbar-search .input-group .btn-minus input.dropdown-toggle[type="button"] {
  width: 100%; }

.caret {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 2px;
  vertical-align: middle;
  border-top: 4px dashed;
  border-top: 4px solid \9;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent; }

.dropup, .dropdown {
  position: relative; }

.dropdown-toggle:focus {
  outline: 0; }

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  float: left;
  min-width: 160px;
  padding: 5px 0;
  margin: 2px 0 0;
  list-style: none;
  font-size: 13px;
  text-align: left;
  background-color: #fff;
  border: 1px solid #ccc;
  border: 1px solid rgba(0, 0, 0, .15);
  border-radius: 2px;
  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
  box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
  background-clip: padding-box; }
  .dropdown-menu.pull-right {
    right: 0;
    left: auto; }
  .dropdown-menu .divider {
    height: 1px;
    margin: 8px 0;
    overflow: hidden;
    background-color: #e5e5e5; }
  .dropdown-menu > li > a {
    display: block;
    padding: 3px 20px;
    clear: both;
    font-weight: normal;
    line-height: 1.42857;
    color: #333;
    white-space: nowrap; }

.dropdown-menu > li > a:hover, .dropdown-menu > li > a:focus {
  text-decoration: none;
  color: #262626;
  background-color: #f5f5f5; }

.dropdown-menu > .active > a, .dropdown-menu > .active > a:hover, .dropdown-menu > .active > a:focus {
  color: #fff;
  text-decoration: none;
  outline: 0;
  background-color: #337ab7; }

.dropdown-menu > .disabled > a, .dropdown-menu > .disabled > a:hover, .dropdown-menu > .disabled > a:focus {
  color: #777; }
  .dropdown-menu > .disabled > a:hover, .dropdown-menu > .disabled > a:focus {
    text-decoration: none;
    background-color: transparent;
    background-image: none;
    filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);
    cursor: not-allowed; }

.open > .dropdown-menu {
  display: block; }
  .open > a {
    outline: 0; }

.dropdown-menu-right {
  left: auto;
  right: 0; }

.dropdown-menu-left {
  left: 0;
  right: auto; }

.dropdown-header {
  display: block;
  padding: 3px 20px;
  font-size: 12px;
  line-height: 1.42857;
  color: #777;
  white-space: nowrap; }

.dropdown-backdrop {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 990; }

.pull-right > .dropdown-menu {
  right: 0;
  left: auto; }

.dropup .caret, .navbar-fixed-bottom .dropdown .caret {
  border-top: 0;
  border-bottom: 4px dashed;
  border-bottom: 4px solid \9;
  content: ""; }
  .dropup .dropdown-menu, .navbar-fixed-bottom .dropdown .dropdown-menu {
    top: auto;
    bottom: 100%;
    margin-bottom: 2px; }

@media (min-width: 768px) {
  .navbar-right .dropdown-menu {
    right: 0;
    left: auto; }
    .navbar-right .dropdown-menu-left {
      left: 0;
      right: auto; } }

.btn-group, .btn-group-vertical {
  position: relative;
  display: inline-block;
  vertical-align: middle; }
  .btn-group > .btn, .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group > button, .btn-group-vertical > .btn, .btn-group-vertical > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > button {
    position: relative;
    float: left; }
  .btn-group > .btn:hover, .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group > button:hover, .btn-group-vertical > .btn:hover, .btn-group-vertical > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > button:hover, .btn-group > .btn:focus, .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group > button:focus, .btn-group-vertical > .btn:focus, .btn-group-vertical > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > button:focus, .btn-group > .btn:active, .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group > button:active, .btn-group-vertical > .btn:active, .btn-group-vertical > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > button:active, .btn-group > .btn.active, .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group > button.active, .btn-group-vertical > .btn.active, .btn-group-vertical > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > button.active {
    z-index: 2; }

.btn-group .btn + .btn, .btn-group .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .btn, .btn-group .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group button + .btn, .btn-group .btn + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group .btn + button, .btn-group .btn + .btn-group, .btn-group .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .btn-group, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group button + .btn-group, .btn-group .btn-group + .btn, .btn-group .btn-group + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group .btn-group + button, .btn-group .btn-group + .btn-group {
  margin-left: -1px; }

.btn-toolbar {
  margin-left: -5px; }
  .btn-toolbar:before, .btn-toolbar:after {
    content: " ";
    display: table; }
  .btn-toolbar:after {
    clear: both; }
  .btn-toolbar .btn, .btn-toolbar .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-toolbar button, .btn-toolbar .btn-group, .btn-toolbar .input-group, .btn-toolbar .input-number {
    float: left; }
  .btn-toolbar > .btn, .btn-toolbar > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-toolbar > button, .btn-toolbar > .btn-group, .btn-toolbar > .input-group, .btn-toolbar > .input-number {
    margin-left: 5px; }

.btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle), .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:not(:first-child):not(:last-child):not(.dropdown-toggle), .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group > button:not(:first-child):not(:last-child):not(.dropdown-toggle) {
  border-radius: 0; }

.btn-group > .btn:first-child, .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:first-child, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group > button:first-child {
  margin-left: 0; }
  .btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle), .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:first-child:not(:last-child):not(.dropdown-toggle), .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group > button:first-child:not(:last-child):not(.dropdown-toggle) {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0; }

.btn-group > .btn:last-child:not(:first-child), .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:last-child:not(:first-child), .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group > button:last-child:not(:first-child), .btn-group > .dropdown-toggle:not(:first-child) {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0; }

.btn-group > .btn-group {
  float: left; }

.btn-group > .btn-group:not(:first-child):not(:last-child) > .btn, .btn-group > .btn-group:not(:first-child):not(:last-child) > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group > .btn-group:not(:first-child):not(:last-child) > button {
  border-radius: 0; }

.btn-group > .btn-group:first-child:not(:last-child) > .btn:last-child, .btn-group > .btn-group:first-child:not(:last-child) > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:last-child, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group > .btn-group:first-child:not(:last-child) > button:last-child, .btn-group > .btn-group:first-child:not(:last-child) > .dropdown-toggle {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0; }

.btn-group > .btn-group:last-child:not(:first-child) > .btn:first-child, .btn-group > .btn-group:last-child:not(:first-child) > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:first-child, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group > .btn-group:last-child:not(:first-child) > button:first-child {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0; }

.btn-group .dropdown-toggle:active, .btn-group.open .dropdown-toggle {
  outline: 0; }

.btn-group > .btn + .dropdown-toggle, .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group > button + .dropdown-toggle {
  padding-left: 8px;
  padding-right: 8px; }

.btn-group > .btn-lg + .dropdown-toggle, .btn-group > .btn-group-lg > .btn + .dropdown-toggle, .btn-group > .btn-group-lg > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group > .btn-group-lg > button + .dropdown-toggle, .btn-group-lg > .btn-group > .btn + .dropdown-toggle {
  padding-left: 12px;
  padding-right: 12px; }

.btn-group.open .dropdown-toggle {
  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125); }
  .btn-group.open .dropdown-toggle.btn-link {
    -webkit-box-shadow: none;
    box-shadow: none; }

.btn .caret, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button .caret {
  margin-left: 0; }

.btn-lg .caret, .btn-group-lg > .btn .caret, .btn-group-lg > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button .caret, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-lg > button .caret {
  border-width: 5px 5px 0;
  border-bottom-width: 0; }

.dropup .btn-lg .caret, .dropup .btn-group-lg > .btn .caret, .dropup .btn-group-lg > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button .caret, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .dropup .btn-group-lg > button .caret, .btn-group-lg > .dropup .btn .caret {
  border-width: 0 5px 5px; }

.btn-group-vertical > .btn, .btn-group-vertical > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > button, .btn-group-vertical > .btn-group, .btn-group-vertical > .btn-group > .btn, .btn-group-vertical > .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > .btn-group > button {
  display: block;
  float: none;
  width: 100%;
  max-width: 100%; }
  .btn-group-vertical > .btn-group:before, .btn-group-vertical > .btn-group:after {
    content: " ";
    display: table; }
  .btn-group-vertical > .btn-group:after {
    clear: both; }
  .btn-group-vertical > .btn-group > .btn, .btn-group-vertical > .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > .btn-group > button {
    float: none; }
  .btn-group-vertical > .btn + .btn, .btn-group-vertical > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .btn, .btn-group-vertical > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > button + .btn, .btn-group-vertical > .btn + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > .btn + button, .btn-group-vertical > .btn + .btn-group, .btn-group-vertical > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .btn-group, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > button + .btn-group, .btn-group-vertical > .btn-group + .btn, .btn-group-vertical > .btn-group + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > .btn-group + button, .btn-group-vertical > .btn-group + .btn-group {
    margin-top: -1px;
    margin-left: 0; }

.btn-group-vertical > .btn:not(:first-child):not(:last-child), .btn-group-vertical > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:not(:first-child):not(:last-child), .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > button:not(:first-child):not(:last-child) {
  border-radius: 0; }
  .btn-group-vertical > .btn:first-child:not(:last-child), .btn-group-vertical > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:first-child:not(:last-child), .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > button:first-child:not(:last-child) {
    border-top-right-radius: 2px;
    border-top-left-radius: 2px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0; }
  .btn-group-vertical > .btn:last-child:not(:first-child), .btn-group-vertical > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:last-child:not(:first-child), .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > button:last-child:not(:first-child) {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-bottom-right-radius: 2px;
    border-bottom-left-radius: 2px; }

.btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn, .btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > button {
  border-radius: 0; }

.btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child, .btn-group-vertical > .btn-group:first-child:not(:last-child) > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:last-child, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > .btn-group:first-child:not(:last-child) > button:last-child, .btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0; }

.btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child, .btn-group-vertical > .btn-group:last-child:not(:first-child) > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:first-child, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-vertical > .btn-group:last-child:not(:first-child) > button:first-child {
  border-top-right-radius: 0;
  border-top-left-radius: 0; }

.btn-group-justified {
  display: table;
  width: 100%;
  table-layout: fixed;
  border-collapse: separate; }
  .btn-group-justified > .btn, .btn-group-justified > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-justified > button, .btn-group-justified > .btn-group {
    float: none;
    display: table-cell;
    width: 1%; }
  .btn-group-justified > .btn-group .btn, .btn-group-justified > .btn-group .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-justified > .btn-group button {
    width: 100%; }
  .btn-group-justified > .btn-group .dropdown-menu {
    left: auto; }

[data-toggle="buttons"] > .btn input[type="radio"], [data-toggle="buttons"] > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button input[type="radio"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel [data-toggle="buttons"] > button input[type="radio"], [data-toggle="buttons"] > .btn-group > .btn input[type="radio"], [data-toggle="buttons"] > .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button input[type="radio"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel [data-toggle="buttons"] > .btn-group > button input[type="radio"], [data-toggle="buttons"] > .btn input[type="checkbox"], [data-toggle="buttons"] > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button input[type="checkbox"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel [data-toggle="buttons"] > button input[type="checkbox"], [data-toggle="buttons"] > .btn-group > .btn input[type="checkbox"], [data-toggle="buttons"] > .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button input[type="checkbox"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel [data-toggle="buttons"] > .btn-group > button input[type="checkbox"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none; }

.input-group, .input-number {
  position: relative;
  display: table;
  border-collapse: separate; }
  .input-group[class*="col-"], .input-number[class*="col-"] {
    float: none;
    padding-left: 0;
    padding-right: 0; }
  .input-group .form-control, .input-number .form-control, .input-number .input-text, .input-group .input-text {
    position: relative;
    z-index: 2;
    float: left;
    width: 100%;
    margin-bottom: 0; }
  .input-group .form-control:focus, .input-number .form-control:focus, .input-number .input-text:focus, .input-group .input-text:focus {
    z-index: 3; }

.input-group-addon, .input-group-btn, .input-number .btn-plus, .input-number .btn-minus, .input-group .form-control, .input-number .form-control, .input-number .input-text, .input-group .input-text {
  display: table-cell; }
  .input-group-addon:not(:first-child):not(:last-child), .input-group-btn:not(:first-child):not(:last-child), .input-number .btn-plus:not(:first-child):not(:last-child), .input-number .btn-minus:not(:first-child):not(:last-child), .input-group .form-control:not(:first-child):not(:last-child), .input-number .form-control:not(:first-child):not(:last-child), .input-number .input-text:not(:first-child):not(:last-child), .input-group .input-text:not(:first-child):not(:last-child) {
    border-radius: 0; }

.input-group-addon, .input-group-btn, .input-number .btn-plus, .input-number .btn-minus {
  width: 1%;
  white-space: nowrap;
  vertical-align: middle; }

.input-group-addon {
  padding: 9px 12px;
  font-size: 13px;
  font-weight: normal;
  line-height: 1;
  color: #555;
  text-align: center;
  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 2px; }
  .input-group-addon.input-sm, .input-group-sm > .form-control.input-group-addon, .input-group-sm > .input-text.input-group-addon, .input-group-sm > .input-group-addon.input-group-addon, .input-group-sm > .input-group-btn > .btn.input-group-addon, .input-group-sm > .input-number .btn-plus > .btn.input-group-addon, .input-group-sm > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.input-group-addon, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-plus > button.input-group-addon, .input-number .input-group-sm > .btn-plus > .btn.input-group-addon, .input-group-sm > .input-number .btn-minus > .btn.input-group-addon, .input-group-sm > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.input-group-addon, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-number .btn-minus > button.input-group-addon, .input-number .input-group-sm > .btn-minus > .btn.input-group-addon, .input-group-sm > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.input-group-addon, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-sm > .input-group-btn > button.input-group-addon {
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 0; }
  .input-group-addon.input-lg, .input-group-lg > .form-control.input-group-addon, .input-group-lg > .input-text.input-group-addon, .input-group-lg > .input-group-addon.input-group-addon, .input-group-lg > .input-group-btn > .btn.input-group-addon, .input-group-lg > .input-number .btn-plus > .btn.input-group-addon, .input-group-lg > .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.input-group-addon, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-plus > button.input-group-addon, .input-number .input-group-lg > .btn-plus > .btn.input-group-addon, .input-group-lg > .input-number .btn-minus > .btn.input-group-addon, .input-group-lg > .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.input-group-addon, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-number .btn-minus > button.input-group-addon, .input-number .input-group-lg > .btn-minus > .btn.input-group-addon, .input-group-lg > .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.input-group-addon, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-lg > .input-group-btn > button.input-group-addon {
    padding: 10px 16px;
    font-size: 17px;
    border-radius: 6px; }
  .input-group-addon input[type="radio"], .input-group-addon input[type="checkbox"] {
    margin-top: 0; }

.input-group .form-control:first-child, .input-number .form-control:first-child, .input-number .input-text:first-child, .input-group .input-text:first-child, .input-group-addon:first-child, .input-group-btn:first-child > .btn, .input-number .btn-plus:first-child > .btn, .input-number .btn-plus:first-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus:first-child > button, .input-number .btn-minus:first-child > .btn, .input-number .btn-minus:first-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus:first-child > button, .input-group-btn:first-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn:first-child > button, .input-group-btn:first-child > .btn-group > .btn, .input-number .btn-plus:first-child > .btn-group > .btn, .input-number .btn-plus:first-child > .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus:first-child > .btn-group > button, .input-number .btn-minus:first-child > .btn-group > .btn, .input-number .btn-minus:first-child > .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus:first-child > .btn-group > button, .input-group-btn:first-child > .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn:first-child > .btn-group > button, .input-group-btn:first-child > .dropdown-toggle, .input-number .btn-plus:first-child > .dropdown-toggle, .input-number .btn-minus:first-child > .dropdown-toggle, .input-group-btn:last-child > .btn:not(:last-child):not(.dropdown-toggle), .input-number .btn-plus:last-child > .btn:not(:last-child):not(.dropdown-toggle), .input-number .btn-plus:last-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:not(:last-child):not(.dropdown-toggle), .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus:last-child > button:not(:last-child):not(.dropdown-toggle), .input-number .btn-minus:last-child > .btn:not(:last-child):not(.dropdown-toggle), .input-number .btn-minus:last-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:not(:last-child):not(.dropdown-toggle), .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus:last-child > button:not(:last-child):not(.dropdown-toggle), .input-group-btn:last-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:not(:last-child):not(.dropdown-toggle), .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn:last-child > button:not(:last-child):not(.dropdown-toggle), .input-group-btn:last-child > .btn-group:not(:last-child) > .btn, .input-number .btn-plus:last-child > .btn-group:not(:last-child) > .btn, .input-number .btn-plus:last-child > .btn-group:not(:last-child) > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus:last-child > .btn-group:not(:last-child) > button, .input-number .btn-minus:last-child > .btn-group:not(:last-child) > .btn, .input-number .btn-minus:last-child > .btn-group:not(:last-child) > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus:last-child > .btn-group:not(:last-child) > button, .input-group-btn:last-child > .btn-group:not(:last-child) > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn:last-child > .btn-group:not(:last-child) > button {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0; }

.input-group-addon:first-child {
  border-right: 0; }

.input-group .form-control:last-child, .input-number .form-control:last-child, .input-number .input-text:last-child, .input-group .input-text:last-child, .input-group-addon:last-child, .input-group-btn:last-child > .btn, .input-number .btn-plus:last-child > .btn, .input-number .btn-plus:last-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus:last-child > button, .input-number .btn-minus:last-child > .btn, .input-number .btn-minus:last-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus:last-child > button, .input-group-btn:last-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn:last-child > button, .input-group-btn:last-child > .btn-group > .btn, .input-number .btn-plus:last-child > .btn-group > .btn, .input-number .btn-plus:last-child > .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus:last-child > .btn-group > button, .input-number .btn-minus:last-child > .btn-group > .btn, .input-number .btn-minus:last-child > .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus:last-child > .btn-group > button, .input-group-btn:last-child > .btn-group > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn:last-child > .btn-group > button, .input-group-btn:last-child > .dropdown-toggle, .input-number .btn-plus:last-child > .dropdown-toggle, .input-number .btn-minus:last-child > .dropdown-toggle, .input-group-btn:first-child > .btn:not(:first-child), .input-number .btn-plus:first-child > .btn:not(:first-child), .input-number .btn-plus:first-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:not(:first-child), .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus:first-child > button:not(:first-child), .input-number .btn-minus:first-child > .btn:not(:first-child), .input-number .btn-minus:first-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:not(:first-child), .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus:first-child > button:not(:first-child), .input-group-btn:first-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:not(:first-child), .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn:first-child > button:not(:first-child), .input-group-btn:first-child > .btn-group:not(:first-child) > .btn, .input-number .btn-plus:first-child > .btn-group:not(:first-child) > .btn, .input-number .btn-plus:first-child > .btn-group:not(:first-child) > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus:first-child > .btn-group:not(:first-child) > button, .input-number .btn-minus:first-child > .btn-group:not(:first-child) > .btn, .input-number .btn-minus:first-child > .btn-group:not(:first-child) > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus:first-child > .btn-group:not(:first-child) > button, .input-group-btn:first-child > .btn-group:not(:first-child) > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn:first-child > .btn-group:not(:first-child) > button {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0; }

.input-group-addon:last-child {
  border-left: 0; }

.input-group-btn, .input-number .btn-plus, .input-number .btn-minus {
  position: relative;
  font-size: 0;
  white-space: nowrap; }
  .input-group-btn > .btn, .input-number .btn-plus > .btn, .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus > button, .input-number .btn-minus > .btn, .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus > button, .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn > button {
    position: relative; }
  .input-group-btn > .btn + .btn, .input-number .btn-plus > .btn + .btn, .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .btn, .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus > button + .btn, .input-number .btn-plus > .btn + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus > .btn + button, .input-number .btn-minus > .btn + .btn, .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .btn, .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus > button + .btn, .input-number .btn-minus > .btn + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus > .btn + button, .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .btn, .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn > button + .btn, .input-group-btn > .btn + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn > .btn + button {
    margin-left: -1px; }
  .input-group-btn > .btn:hover, .input-number .btn-plus > .btn:hover, .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus > button:hover, .input-number .btn-minus > .btn:hover, .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus > button:hover, .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn > button:hover, .input-group-btn > .btn:focus, .input-number .btn-plus > .btn:focus, .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus > button:focus, .input-number .btn-minus > .btn:focus, .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus > button:focus, .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn > button:focus, .input-group-btn > .btn:active, .input-number .btn-plus > .btn:active, .input-number .btn-plus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus > button:active, .input-number .btn-minus > .btn:active, .input-number .btn-minus > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus > button:active, .input-group-btn > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn > button:active {
    z-index: 2; }
  .input-group-btn:first-child > .btn, .input-number .btn-plus:first-child > .btn, .input-number .btn-plus:first-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus:first-child > button, .input-number .btn-minus:first-child > .btn, .input-number .btn-minus:first-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus:first-child > button, .input-group-btn:first-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn:first-child > button, .input-group-btn:first-child > .btn-group, .input-number .btn-plus:first-child > .btn-group, .input-number .btn-minus:first-child > .btn-group {
    margin-right: -1px; }
  .input-group-btn:last-child > .btn, .input-number .btn-plus:last-child > .btn, .input-number .btn-plus:last-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-plus:last-child > button, .input-number .btn-minus:last-child > .btn, .input-number .btn-minus:last-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-number .btn-minus:last-child > button, .input-group-btn:last-child > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .input-group-btn:last-child > button, .input-group-btn:last-child > .btn-group, .input-number .btn-plus:last-child > .btn-group, .input-number .btn-minus:last-child > .btn-group {
    z-index: 2;
    margin-left: -1px; }

.nav {
  margin-bottom: 0;
  padding-left: 0;
  list-style: none; }
  .nav:before, .nav:after {
    content: " ";
    display: table; }
  .nav:after {
    clear: both; }
  .nav > li {
    position: relative;
    display: block; }
  .nav > li > a {
    position: relative;
    display: block;
    padding: 10px 15px; }
    .nav > li > a:hover, .nav > li > a:focus {
      text-decoration: none;
      background-color: #eee; }
  .nav > li.disabled > a {
    color: #777; }
    .nav > li.disabled > a:hover, .nav > li.disabled > a:focus {
      color: #777;
      text-decoration: none;
      background-color: transparent;
      cursor: not-allowed; }
  .nav .open > a, .nav .open > a:hover, .nav .open > a:focus {
    background-color: #eee;
    border-color: #337ab7; }
  .nav .nav-divider {
    height: 1px;
    margin: 8px 0;
    overflow: hidden;
    background-color: #e5e5e5; }
  .nav > li > a > img {
    max-width: none; }

.nav-tabs {
  border-bottom: 1px solid #ddd; }
  .nav-tabs > li {
    float: left;
    margin-bottom: -1px; }
  .nav-tabs > li > a {
    margin-right: 2px;
    line-height: 1.42857;
    border: 1px solid transparent;
    border-radius: 2px 2px 0 0; }
    .nav-tabs > li > a:hover {
      border-color: #eee #eee #ddd; }
  .nav-tabs > li.active > a, .nav-tabs > li.active > a:hover, .nav-tabs > li.active > a:focus {
    color: #555;
    background-color: #fff;
    border: 1px solid #ddd;
    border-bottom-color: transparent;
    cursor: default; }
  .nav-pills > li {
    float: left; }
  .nav-pills > li > a {
    border-radius: 2px; }
  .nav-pills > li + li {
    margin-left: 2px; }
  .nav-pills > li.active > a, .nav-pills > li.active > a:hover, .nav-pills > li.active > a:focus {
    color: #fff;
    background-color: #337ab7; }

.nav-stacked > li {
  float: none; }
  .nav-stacked > li + li {
    margin-top: 2px;
    margin-left: 0; }

.nav-justified, .nav-tabs.nav-justified {
  width: 100%; }
  .nav-justified > li, .nav-tabs.nav-justified > li {
    float: none; }
  .nav-justified > li > a, .nav-tabs.nav-justified > li > a {
    text-align: center;
    margin-bottom: 5px; }
  .nav-justified > .dropdown .dropdown-menu, .nav-tabs.nav-justified > .dropdown .dropdown-menu {
    top: auto;
    left: auto; }
  @media (min-width: 768px) {
  .nav-justified > li, .nav-tabs.nav-justified > li {
    display: table-cell;
    width: 1%; }
    .nav-justified > li > a, .nav-tabs.nav-justified > li > a {
      margin-bottom: 0; } }

.nav-tabs-justified, .nav-tabs.nav-justified {
  border-bottom: 0; }
  .nav-tabs-justified > li > a, .nav-tabs.nav-justified > li > a {
    margin-right: 0;
    border-radius: 2px; }
  .nav-tabs-justified > .active > a, .nav-tabs.nav-justified > .active > a, .nav-tabs-justified > .active > a:hover, .nav-tabs.nav-justified > .active > a:hover, .nav-tabs-justified > .active > a:focus, .nav-tabs.nav-justified > .active > a:focus {
    border: 1px solid #ddd; }
  @media (min-width: 768px) {
  .nav-tabs-justified > li > a, .nav-tabs.nav-justified > li > a {
    border-bottom: 1px solid #ddd;
    border-radius: 2px 2px 0 0; }
  .nav-tabs-justified > .active > a, .nav-tabs.nav-justified > .active > a, .nav-tabs-justified > .active > a:hover, .nav-tabs.nav-justified > .active > a:hover, .nav-tabs-justified > .active > a:focus, .nav-tabs.nav-justified > .active > a:focus {
    border-bottom-color: #fff; } }

.tab-content > .tab-pane {
  display: none; }
  .tab-content > .active {
    display: block; }

.nav-tabs .dropdown-menu {
  margin-top: -1px;
  border-top-right-radius: 0;
  border-top-left-radius: 0; }

.navbar {
  position: relative;
  min-height: 40px;
  margin-bottom: 18px;
  border: 1px solid transparent; }
  .navbar:before, .navbar:after {
    content: " ";
    display: table; }
  .navbar:after {
    clear: both; }
  @media (min-width: 768px) {
  .navbar {
    border-radius: 2px; } }

.navbar-header:before, .navbar-header:after {
  content: " ";
  display: table; }
  .navbar-header:after {
    clear: both; }
  @media (min-width: 768px) {
  .navbar-header {
    float: left; } }

.navbar-collapse {
  overflow-x: visible;
  padding-right: 15px;
  padding-left: 15px;
  border-top: 1px solid transparent;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1);
  -webkit-overflow-scrolling: touch; }
  .navbar-collapse:before, .navbar-collapse:after {
    content: " ";
    display: table; }
  .navbar-collapse:after {
    clear: both; }
  .navbar-collapse.in {
    overflow-y: auto; }
  @media (min-width: 768px) {
  .navbar-collapse {
    width: auto;
    border-top: 0;
    box-shadow: none; }
    .navbar-collapse.collapse {
      display: block !important;
      height: auto !important;
      padding-bottom: 0;
      overflow: visible !important; }

    .navbar-collapse.in {
      overflow-y: visible; }

    .navbar-fixed-top .navbar-collapse, #header .navbar-collapse, body.categories-open #header .navbar-collapse, .navbar-static-top .navbar-collapse, .navbar-fixed-bottom .navbar-collapse {
      padding-left: 0;
      padding-right: 0; } }

.navbar-fixed-top .navbar-collapse, #header .navbar-collapse, body.categories-open #header .navbar-collapse, .navbar-fixed-bottom .navbar-collapse {
  max-height: 340px; }
  @media (max-device-width: 480px) and (orientation: landscape) {
    .navbar-fixed-top .navbar-collapse, #header .navbar-collapse, body.categories-open #header .navbar-collapse, .navbar-fixed-bottom .navbar-collapse {
      max-height: 200px; } }

.container > .navbar-header, table.box-error > .navbar-header, table.box-warning > .navbar-header, body #wrapper > .navbar-header, #footer .inside > .navbar-header, #header .inside > .navbar-header, #topbar-container .navbar-topbar > .navbar-header, .navbar-collapse .navbar-categories > .navbar-header, .container-fluid > .navbar-header, .container > .navbar-collapse, table.box-error > .navbar-collapse, table.box-warning > .navbar-collapse, body #wrapper > .navbar-collapse, #footer .inside > .navbar-collapse, #header .inside > .navbar-collapse, #topbar-container .navbar-topbar > .navbar-collapse, .navbar-collapse .navbar-categories > .navbar-collapse, .container-fluid > .navbar-collapse {
  margin-right: -15px;
  margin-left: -15px; }
  @media (min-width: 768px) {
    .container > .navbar-header, table.box-error > .navbar-header, table.box-warning > .navbar-header, body #wrapper > .navbar-header, #footer .inside > .navbar-header, #header .inside > .navbar-header, #topbar-container .navbar-topbar > .navbar-header, .navbar-collapse .navbar-categories > .navbar-header, .container-fluid > .navbar-header, .container > .navbar-collapse, table.box-error > .navbar-collapse, table.box-warning > .navbar-collapse, body #wrapper > .navbar-collapse, #footer .inside > .navbar-collapse, #header .inside > .navbar-collapse, #topbar-container .navbar-topbar > .navbar-collapse, .navbar-collapse .navbar-categories > .navbar-collapse, .container-fluid > .navbar-collapse {
      margin-right: 0;
      margin-left: 0; } }

.navbar-static-top {
  z-index: 1000;
  border-width: 0 0 1px; }
  @media (min-width: 768px) {
  .navbar-static-top {
    border-radius: 0; } }

.navbar-fixed-top, #header, body.categories-open #header, .navbar-fixed-bottom {
  position: fixed;
  right: 0;
  left: 0;
  z-index: 1030; }
  @media (min-width: 768px) {
  .navbar-fixed-top, #header, body.categories-open #header, .navbar-fixed-bottom {
    border-radius: 0; } }

.navbar-fixed-top, #header, body.categories-open #header {
  top: 0;
  border-width: 0 0 1px; }

.navbar-fixed-bottom {
  bottom: 0;
  margin-bottom: 0;
  border-width: 1px 0 0; }

.navbar-brand {
  float: left;
  padding: 12px 15px;
  font-size: 17px;
  line-height: 18px;
  height: 40px; }
  .navbar-brand:hover, .navbar-brand:focus {
    text-decoration: none; }
  .navbar-brand > img {
    display: block; }
  @media (min-width: 768px) {
  .navbar > .container .navbar-brand, .navbar > table.box-error .navbar-brand, .navbar > table.box-warning .navbar-brand, .navbar > body #wrapper .navbar-brand, body .navbar > #wrapper .navbar-brand, .navbar > #footer .inside .navbar-brand, #footer .navbar > .inside .navbar-brand, .navbar > #header .inside .navbar-brand, #header .navbar > .inside .navbar-brand, .navbar > #topbar-container .navbar-topbar .navbar-brand, #topbar-container .navbar > .navbar-topbar .navbar-brand, .navbar > .navbar-collapse .navbar-categories .navbar-brand, .navbar-collapse .navbar > .navbar-categories .navbar-brand, .navbar > .container-fluid .navbar-brand {
    margin-left: -15px; } }

.navbar-toggle {
  position: relative;
  float: right;
  margin-right: 15px;
  padding: 9px 10px;
  margin-top: 3px;
  margin-bottom: 3px;
  background-color: transparent;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 2px; }
  .navbar-toggle:focus {
    outline: 0; }
  .navbar-toggle .icon-bar {
    display: block;
    width: 22px;
    height: 2px;
    border-radius: 1px; }
  .navbar-toggle .icon-bar + .icon-bar {
    margin-top: 4px; }
  @media (min-width: 768px) {
  .navbar-toggle {
    display: none; } }

.navbar-nav {
  margin: 6px -15px; }
  .navbar-nav > li > a {
    padding-top: 10px;
    padding-bottom: 10px;
    line-height: 18px; }
  @media (max-width: 767px) {
  .navbar-nav .open .dropdown-menu {
    position: static;
    float: none;
    width: auto;
    margin-top: 0;
    background-color: transparent;
    border: 0;
    box-shadow: none; }
    .navbar-nav .open .dropdown-menu > li > a, .navbar-nav .open .dropdown-menu .dropdown-header {
      padding: 5px 15px 5px 25px; }

    .navbar-nav .open .dropdown-menu > li > a {
      line-height: 18px; }
      .navbar-nav .open .dropdown-menu > li > a:hover, .navbar-nav .open .dropdown-menu > li > a:focus {
        background-image: none; } }
  @media (min-width: 768px) {
  .navbar-nav {
    float: left;
    margin: 0; }
    .navbar-nav > li {
      float: left; }
      .navbar-nav > li > a {
        padding-top: 12px;
        padding-bottom: 12px; } }

.navbar-form {
  margin-left: -15px;
  margin-right: -15px;
  padding: 10px 15px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1), 0 1px 0 rgba(255, 255, 255, .1);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1), 0 1px 0 rgba(255, 255, 255, .1);
  margin-top: 1px;
  margin-bottom: 1px; }
  @media (min-width: 768px) {
  .navbar-form .form-group {
    display: inline-block;
    margin-bottom: 0;
    vertical-align: middle; }
  .navbar-form .form-control, .navbar-form .input-text {
    display: inline-block;
    width: auto;
    vertical-align: middle; }
  .navbar-form .form-control-static {
    display: inline-block; }
  .navbar-form .input-group, .navbar-form .input-number {
    display: inline-table;
    vertical-align: middle; }
    .navbar-form .input-group .input-group-addon, .navbar-form .input-number .input-group-addon, .navbar-form .input-group .input-group-btn, .navbar-form .input-number .input-group-btn, .navbar-form .input-number .input-number .btn-plus, .input-number .navbar-form .input-number .btn-plus, .navbar-form .input-number .input-number .btn-minus, .input-number .navbar-form .input-number .btn-minus, .navbar-form .input-group .input-number .btn-plus, .input-number .navbar-form .input-group .btn-plus, .navbar-form .input-group .input-number .btn-minus, .input-number .navbar-form .input-group .btn-minus, .navbar-form .input-group .form-control, .navbar-form .input-number .form-control, .navbar-form .input-number .input-text, .navbar-form .input-group .input-text {
      width: auto; }
  .navbar-form .input-group > .form-control, .navbar-form .input-number > .form-control, .navbar-form .input-number > .input-text, .navbar-form .input-group > .input-text {
    width: 100%; }
  .navbar-form .control-label {
    margin-bottom: 0;
    vertical-align: middle; }
  .navbar-form .radio, .navbar-form .checkbox {
    display: inline-block;
    margin-top: 0;
    margin-bottom: 0;
    vertical-align: middle; }
    .navbar-form .radio label, .navbar-form .checkbox label {
      padding-left: 0; }
  .navbar-form .radio input[type="radio"], .navbar-form .checkbox input[type="checkbox"] {
    position: relative;
    margin-left: 0; }
  .navbar-form .has-feedback .form-control-feedback {
    top: 0; } }
  @media (max-width: 767px) {
    .navbar-form .form-group {
      margin-bottom: 5px; }
      .navbar-form .form-group:last-child {
        margin-bottom: 0; } }
  @media (min-width: 768px) {
  .navbar-form {
    width: auto;
    border: 0;
    margin-left: 0;
    margin-right: 0;
    padding-top: 0;
    padding-bottom: 0;
    -webkit-box-shadow: none;
    box-shadow: none; } }

.navbar-nav > li > .dropdown-menu {
  margin-top: 0;
  border-top-right-radius: 0;
  border-top-left-radius: 0; }

.navbar-fixed-bottom .navbar-nav > li > .dropdown-menu {
  margin-bottom: 0;
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0; }

.navbar-btn {
  margin-top: 1px;
  margin-bottom: 1px; }
  .navbar-btn.btn-sm, .btn-group-sm > .btn.navbar-btn, .btn-group-sm > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.navbar-btn, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-sm > button.navbar-btn, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.navbar-btn {
    margin-top: 5px;
    margin-bottom: 5px; }
  .navbar-btn.btn-xs, .btn-group-xs > .btn.navbar-btn, .btn-group-xs > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.navbar-btn, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .btn-group-xs > button.navbar-btn {
    margin-top: 9px;
    margin-bottom: 9px; }

.navbar-text {
  margin-top: 11px;
  margin-bottom: 11px; }
  @media (min-width: 768px) {
  .navbar-text {
    float: left;
    margin-left: 15px;
    margin-right: 15px; } }

@media (min-width: 768px) {
  .navbar-left {
    float: left !important; }

  .navbar-right {
    float: right !important;
    margin-right: -15px; }
    .navbar-right ~ .navbar-right {
      margin-right: 0; } }

.navbar-default {
  background-color: #393939;
  border-color: #282828; }
  .navbar-default .navbar-brand {
    color: #fff; }
  .navbar-default .navbar-brand:hover, .navbar-default .navbar-brand:focus {
    color: #e6e6e6;
    background-color: transparent; }
  .navbar-default .navbar-text {
    color: #fff; }
  .navbar-default .navbar-nav > li > a {
    color: #fff; }
    .navbar-default .navbar-nav > li > a:hover, .navbar-default .navbar-nav > li > a:focus {
      color: #fff;
      background-color: #282828; }
  .navbar-default .navbar-nav > .active > a, .navbar-default .navbar-nav > .active > a:hover, .navbar-default .navbar-nav > .active > a:focus {
    color: #fff;
    background-color: #282828; }
  .navbar-default .navbar-nav > .disabled > a, .navbar-default .navbar-nav > .disabled > a:hover, .navbar-default .navbar-nav > .disabled > a:focus {
    color: #ccc;
    background-color: transparent; }
  .navbar-default .navbar-toggle {
    border-color: #ddd; }
  .navbar-default .navbar-toggle:hover, .navbar-default .navbar-toggle:focus {
    background-color: #ddd; }
  .navbar-default .navbar-toggle .icon-bar {
    background-color: #888; }
  .navbar-default .navbar-collapse, .navbar-default .navbar-form {
    border-color: #282828; }
  .navbar-default .navbar-nav > .open > a, .navbar-default .navbar-nav > .open > a:hover, .navbar-default .navbar-nav > .open > a:focus {
    background-color: #282828;
    color: #fff; }
  @media (max-width: 767px) {
    .navbar-default .navbar-nav .open .dropdown-menu > li > a {
      color: #fff; }
      .navbar-default .navbar-nav .open .dropdown-menu > li > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > li > a:focus {
        color: #fff;
        background-color: #282828; }
      .navbar-default .navbar-nav .open .dropdown-menu > .active > a, .navbar-default .navbar-nav .open .dropdown-menu > .active > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > .active > a:focus {
        color: #fff;
        background-color: #282828; }
      .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a, .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:focus {
        color: #ccc;
        background-color: transparent; } }
  .navbar-default .navbar-link {
    color: #fff; }
  .navbar-default .navbar-link:hover {
    color: #fff; }
  .navbar-default .btn-link {
    color: #fff; }
  .navbar-default .btn-link:hover, .navbar-default .btn-link:focus {
    color: #fff; }
  .navbar-default .btn-link[disabled]:hover, fieldset[disabled] .navbar-default .btn-link:hover, .navbar-default .btn-link[disabled]:focus, fieldset[disabled] .navbar-default .btn-link:focus {
    color: #ccc; }

.navbar-inverse {
  background-color: #222;
  border-color: #090909; }
  .navbar-inverse .navbar-brand {
    color: #9d9d9d; }
  .navbar-inverse .navbar-brand:hover, .navbar-inverse .navbar-brand:focus {
    color: #fff;
    background-color: transparent; }
  .navbar-inverse .navbar-text {
    color: #9d9d9d; }
  .navbar-inverse .navbar-nav > li > a {
    color: #9d9d9d; }
    .navbar-inverse .navbar-nav > li > a:hover, .navbar-inverse .navbar-nav > li > a:focus {
      color: #fff;
      background-color: transparent; }
  .navbar-inverse .navbar-nav > .active > a, .navbar-inverse .navbar-nav > .active > a:hover, .navbar-inverse .navbar-nav > .active > a:focus {
    color: #fff;
    background-color: #090909; }
  .navbar-inverse .navbar-nav > .disabled > a, .navbar-inverse .navbar-nav > .disabled > a:hover, .navbar-inverse .navbar-nav > .disabled > a:focus {
    color: #444;
    background-color: transparent; }
  .navbar-inverse .navbar-toggle {
    border-color: #333; }
  .navbar-inverse .navbar-toggle:hover, .navbar-inverse .navbar-toggle:focus {
    background-color: #333; }
  .navbar-inverse .navbar-toggle .icon-bar {
    background-color: #fff; }
  .navbar-inverse .navbar-collapse, .navbar-inverse .navbar-form {
    border-color: #101010; }
  .navbar-inverse .navbar-nav > .open > a, .navbar-inverse .navbar-nav > .open > a:hover, .navbar-inverse .navbar-nav > .open > a:focus {
    background-color: #090909;
    color: #fff; }
  @media (max-width: 767px) {
    .navbar-inverse .navbar-nav .open .dropdown-menu > .dropdown-header {
      border-color: #090909; }
      .navbar-inverse .navbar-nav .open .dropdown-menu .divider {
        background-color: #090909; }
      .navbar-inverse .navbar-nav .open .dropdown-menu > li > a {
        color: #9d9d9d; }
        .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:focus {
          color: #fff;
          background-color: transparent; }
      .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a, .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:focus {
        color: #fff;
        background-color: #090909; }
      .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a, .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:focus {
        color: #444;
        background-color: transparent; } }
  .navbar-inverse .navbar-link {
    color: #9d9d9d; }
  .navbar-inverse .navbar-link:hover {
    color: #fff; }
  .navbar-inverse .btn-link {
    color: #9d9d9d; }
  .navbar-inverse .btn-link:hover, .navbar-inverse .btn-link:focus {
    color: #fff; }
  .navbar-inverse .btn-link[disabled]:hover, fieldset[disabled] .navbar-inverse .btn-link:hover, .navbar-inverse .btn-link[disabled]:focus, fieldset[disabled] .navbar-inverse .btn-link:focus {
    color: #444; }

.breadcrumb {
  padding: 8px 15px;
  margin-bottom: 18px;
  list-style: none;
  background-color: #f5f5f5;
  border-radius: 2px; }
  .breadcrumb > li {
    display: inline-block; }
  .breadcrumb > li + li:before {
    content: "/\00a0";
    padding: 0 5px;
    color: #ccc; }
  .breadcrumb > .active {
    color: #777; }

.pagination {
  display: inline-block;
  padding-left: 0;
  margin: 18px 0;
  border-radius: 2px; }
  .pagination > li {
    display: inline; }
  .pagination > li > a, .pagination > li > span {
    position: relative;
    float: left;
    padding: 9px 12px;
    line-height: 1.42857;
    text-decoration: none;
    color: #337ab7;
    background-color: #fff;
    border: 1px solid #ddd;
    margin-left: -1px; }
  .pagination > li:first-child > a, .pagination > li:first-child > span {
    margin-left: 0;
    border-bottom-left-radius: 2px;
    border-top-left-radius: 2px; }
  .pagination > li:last-child > a, .pagination > li:last-child > span {
    border-bottom-right-radius: 2px;
    border-top-right-radius: 2px; }
  .pagination > li > a:hover, .pagination > li > span:hover, .pagination > li > a:focus, .pagination > li > span:focus {
    z-index: 2;
    color: #22527b;
    background-color: #eee;
    border-color: #ddd; }
  .pagination > .active > a, .pagination > .active > span, .pagination > .active > a:hover, .pagination > .active > span:hover, .pagination > .active > a:focus, .pagination > .active > span:focus {
    z-index: 3;
    color: #fff;
    background-color: #337ab7;
    border-color: #337ab7;
    cursor: default; }
  .pagination > .disabled > span, .pagination > .disabled > span:hover, .pagination > .disabled > span:focus, .pagination > .disabled > a, .pagination > .disabled > a:hover, .pagination > .disabled > a:focus {
    color: #777;
    background-color: #fff;
    border-color: #ddd;
    cursor: not-allowed; }

.pagination-lg > li > a, .pagination-lg > li > span {
  padding: 10px 16px;
  font-size: 17px;
  line-height: 1.33333; }
  .pagination-lg > li:first-child > a, .pagination-lg > li:first-child > span {
    border-bottom-left-radius: 6px;
    border-top-left-radius: 6px; }
  .pagination-lg > li:last-child > a, .pagination-lg > li:last-child > span {
    border-bottom-right-radius: 6px;
    border-top-right-radius: 6px; }

.pagination-sm > li > a, .pagination-sm > li > span {
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.5; }
  .pagination-sm > li:first-child > a, .pagination-sm > li:first-child > span {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0; }
  .pagination-sm > li:last-child > a, .pagination-sm > li:last-child > span {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0; }

.label {
  display: inline;
  padding: 0.2em 0.6em 0.3em;
  font-size: 75%;
  font-weight: bold;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25em; }
  .label:empty {
    display: none; }
  .btn .label, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button .label {
    position: relative;
    top: -1px; }

a.label:hover, a.label:focus {
  color: #fff;
  text-decoration: none;
  cursor: pointer; }

.label-default {
  background-color: #777; }
  .label-default[href]:hover, .label-default[href]:focus {
    background-color: #5e5e5e; }

.label-primary {
  background-color: #337ab7; }
  .label-primary[href]:hover, .label-primary[href]:focus {
    background-color: #285f8f; }

.label-success {
  background-color: #5cb85c; }
  .label-success[href]:hover, .label-success[href]:focus {
    background-color: #449d44; }

.label-info {
  background-color: #5bc0de; }
  .label-info[href]:hover, .label-info[href]:focus {
    background-color: #31b0d5; }

.label-warning {
  background-color: #f0ad4e; }
  .label-warning[href]:hover, .label-warning[href]:focus {
    background-color: #ec971f; }

.label-danger {
  background-color: #d9534f; }
  .label-danger[href]:hover, .label-danger[href]:focus {
    background-color: #c9302c; }

.thumbnail {
  display: block;
  padding: 4px;
  margin-bottom: 18px;
  line-height: 1.42857;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 2px;
  -webkit-transition: border 0.2s ease-in-out;
  -o-transition: border 0.2s ease-in-out;
  transition: border 0.2s ease-in-out; }
  .thumbnail > img, .thumbnail a > img {
    display: block;
    max-width: 100%;
    height: auto;
    margin-left: auto;
    margin-right: auto; }
  .thumbnail .caption {
    padding: 9px;
    color: #333; }

a.thumbnail:hover, a.thumbnail:focus, a.thumbnail.active {
  border-color: #337ab7; }

.alert {
  padding: 15px;
  margin-bottom: 18px;
  border: 1px solid transparent;
  border-radius: 2px; }
  .alert h4 {
    margin-top: 0;
    color: inherit; }
  .alert .alert-link {
    font-weight: bold; }
  .alert > p, .alert > ul {
    margin-bottom: 0; }
  .alert > p + p {
    margin-top: 5px; }

.alert-dismissable, .alert-dismissible {
  padding-right: 35px; }
  .alert-dismissable .close, .alert-dismissible .close {
    position: relative;
    top: -2px;
    right: -21px;
    color: inherit; }

.alert-success {
  background-color: #00990b;
  border-color: #008009;
  color: #fff; }
  .alert-success hr {
    border-top-color: #006607; }
  .alert-success .alert-link {
    color: #e6e6e6; }

.alert-info {
  background-color: #337ab7;
  border-color: #2d6da3;
  color: #fff; }
  .alert-info hr {
    border-top-color: #285f8f; }
  .alert-info .alert-link {
    color: #e6e6e6; }

.alert-warning {
  background-color: #ffae00;
  border-color: #e69d00;
  color: #fff; }
  .alert-warning hr {
    border-top-color: #cc8b00; }
  .alert-warning .alert-link {
    color: #e6e6e6; }

.alert-danger {
  background-color: #c20400;
  border-color: #a90300;
  color: #fff; }
  .alert-danger hr {
    border-top-color: #8f0300; }
  .alert-danger .alert-link {
    color: #e6e6e6; }

.list-group {
  margin-bottom: 20px;
  padding-left: 0; }

.list-group-item {
  position: relative;
  display: block;
  padding: 10px 15px;
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid #ddd; }
  .list-group-item:first-child {
    border-top-right-radius: 2px;
    border-top-left-radius: 2px; }
  .list-group-item:last-child {
    margin-bottom: 0;
    border-bottom-right-radius: 2px;
    border-bottom-left-radius: 2px; }

a.list-group-item, button.list-group-item {
  color: #555; }
  a.list-group-item .list-group-item-heading, button.list-group-item .list-group-item-heading {
    color: #333; }
  a.list-group-item:hover, button.list-group-item:hover, a.list-group-item:focus, button.list-group-item:focus {
    text-decoration: none;
    color: #555;
    background-color: #f5f5f5; }

button.list-group-item {
  width: 100%;
  text-align: left; }

.list-group-item.disabled, .list-group-item.disabled:hover, .list-group-item.disabled:focus {
  background-color: #eee;
  color: #777;
  cursor: not-allowed; }
  .list-group-item.disabled .list-group-item-heading, .list-group-item.disabled:hover .list-group-item-heading, .list-group-item.disabled:focus .list-group-item-heading {
    color: inherit; }
  .list-group-item.disabled .list-group-item-text, .list-group-item.disabled:hover .list-group-item-text, .list-group-item.disabled:focus .list-group-item-text {
    color: #777; }
  .list-group-item.active, .list-group-item.active:hover, .list-group-item.active:focus {
    z-index: 2;
    color: #fff;
    background-color: #337ab7;
    border-color: #337ab7; }
  .list-group-item.active .list-group-item-heading, .list-group-item.active:hover .list-group-item-heading, .list-group-item.active:focus .list-group-item-heading, .list-group-item.active .list-group-item-heading > small, .list-group-item.active:hover .list-group-item-heading > small, .list-group-item.active:focus .list-group-item-heading > small, .list-group-item.active .list-group-item-heading > .small, .list-group-item.active:hover .list-group-item-heading > .small, .list-group-item.active:focus .list-group-item-heading > .small {
    color: inherit; }
  .list-group-item.active .list-group-item-text, .list-group-item.active:hover .list-group-item-text, .list-group-item.active:focus .list-group-item-text {
    color: #c7ddef; }

.list-group-item-success {
  color: #3c763d;
  background-color: #dff0d8; }

a.list-group-item-success, button.list-group-item-success {
  color: #3c763d; }
  a.list-group-item-success .list-group-item-heading, button.list-group-item-success .list-group-item-heading {
    color: inherit; }
  a.list-group-item-success:hover, button.list-group-item-success:hover, a.list-group-item-success:focus, button.list-group-item-success:focus {
    color: #3c763d;
    background-color: #d0e9c6; }
  a.list-group-item-success.active, button.list-group-item-success.active, a.list-group-item-success.active:hover, button.list-group-item-success.active:hover, a.list-group-item-success.active:focus, button.list-group-item-success.active:focus {
    color: #fff;
    background-color: #3c763d;
    border-color: #3c763d; }

.list-group-item-info {
  color: #31708f;
  background-color: #d9edf7; }

a.list-group-item-info, button.list-group-item-info {
  color: #31708f; }
  a.list-group-item-info .list-group-item-heading, button.list-group-item-info .list-group-item-heading {
    color: inherit; }
  a.list-group-item-info:hover, button.list-group-item-info:hover, a.list-group-item-info:focus, button.list-group-item-info:focus {
    color: #31708f;
    background-color: #c4e3f3; }
  a.list-group-item-info.active, button.list-group-item-info.active, a.list-group-item-info.active:hover, button.list-group-item-info.active:hover, a.list-group-item-info.active:focus, button.list-group-item-info.active:focus {
    color: #fff;
    background-color: #31708f;
    border-color: #31708f; }

.list-group-item-warning {
  color: #8a6d3b;
  background-color: #fcf8e3; }

a.list-group-item-warning, button.list-group-item-warning {
  color: #8a6d3b; }
  a.list-group-item-warning .list-group-item-heading, button.list-group-item-warning .list-group-item-heading {
    color: inherit; }
  a.list-group-item-warning:hover, button.list-group-item-warning:hover, a.list-group-item-warning:focus, button.list-group-item-warning:focus {
    color: #8a6d3b;
    background-color: #faf2cc; }
  a.list-group-item-warning.active, button.list-group-item-warning.active, a.list-group-item-warning.active:hover, button.list-group-item-warning.active:hover, a.list-group-item-warning.active:focus, button.list-group-item-warning.active:focus {
    color: #fff;
    background-color: #8a6d3b;
    border-color: #8a6d3b; }

.list-group-item-danger {
  color: #a94442;
  background-color: #f2dede; }

a.list-group-item-danger, button.list-group-item-danger {
  color: #a94442; }
  a.list-group-item-danger .list-group-item-heading, button.list-group-item-danger .list-group-item-heading {
    color: inherit; }
  a.list-group-item-danger:hover, button.list-group-item-danger:hover, a.list-group-item-danger:focus, button.list-group-item-danger:focus {
    color: #a94442;
    background-color: #ebcccc; }
  a.list-group-item-danger.active, button.list-group-item-danger.active, a.list-group-item-danger.active:hover, button.list-group-item-danger.active:hover, a.list-group-item-danger.active:focus, button.list-group-item-danger.active:focus {
    color: #fff;
    background-color: #a94442;
    border-color: #a94442; }

.list-group-item-heading {
  margin-top: 0;
  margin-bottom: 5px; }

.list-group-item-text {
  margin-bottom: 0;
  line-height: 1.3; }

.panel {
  margin-bottom: 18px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, .05); }

.panel-body {
  padding: 15px; }
  .panel-body:before, .panel-body:after {
    content: " ";
    display: table; }
  .panel-body:after {
    clear: both; }

.panel-heading {
  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top-right-radius: 1px;
  border-top-left-radius: 1px; }
  .panel-heading > .dropdown .dropdown-toggle {
    color: inherit; }

.panel-title {
  margin-top: 0;
  margin-bottom: 0;
  font-size: 15px;
  color: inherit; }
  .panel-title > a, .panel-title > small, .panel-title > .small, .panel-title > small > a, .panel-title > .small > a {
    color: inherit; }

.panel-footer {
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
  border-bottom-right-radius: 1px;
  border-bottom-left-radius: 1px; }

.panel > .list-group, .panel > .panel-collapse > .list-group {
  margin-bottom: 0; }
  .panel > .list-group .list-group-item, .panel > .panel-collapse > .list-group .list-group-item {
    border-width: 1px 0;
    border-radius: 0; }
  .panel > .list-group:first-child .list-group-item:first-child, .panel > .panel-collapse > .list-group:first-child .list-group-item:first-child {
    border-top: 0;
    border-top-right-radius: 1px;
    border-top-left-radius: 1px; }
  .panel > .list-group:last-child .list-group-item:last-child, .panel > .panel-collapse > .list-group:last-child .list-group-item:last-child {
    border-bottom: 0;
    border-bottom-right-radius: 1px;
    border-bottom-left-radius: 1px; }
  .panel > .panel-heading + .panel-collapse > .list-group .list-group-item:first-child {
    border-top-right-radius: 0;
    border-top-left-radius: 0; }

.panel-heading + .list-group .list-group-item:first-child {
  border-top-width: 0; }

.list-group + .panel-footer {
  border-top-width: 0; }

.panel > .table, .panel > .table-responsive > .table, .panel > .panel-collapse > .table {
  margin-bottom: 0; }
  .panel > .table caption, .panel > .table-responsive > .table caption, .panel > .panel-collapse > .table caption {
    padding-left: 15px;
    padding-right: 15px; }
  .panel > .table:first-child, .panel > .table-responsive:first-child > .table:first-child {
    border-top-right-radius: 1px;
    border-top-left-radius: 1px; }
  .panel > .table:first-child > thead:first-child > tr:first-child, .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child, .panel > .table:first-child > tbody:first-child > tr:first-child, .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child {
    border-top-left-radius: 1px;
    border-top-right-radius: 1px; }
    .panel > .table:first-child > thead:first-child > tr:first-child td:first-child, .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:first-child, .panel > .table:first-child > tbody:first-child > tr:first-child td:first-child, .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:first-child, .panel > .table:first-child > thead:first-child > tr:first-child th:first-child, .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:first-child, .panel > .table:first-child > tbody:first-child > tr:first-child th:first-child, .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:first-child {
      border-top-left-radius: 1px; }
    .panel > .table:first-child > thead:first-child > tr:first-child td:last-child, .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:last-child, .panel > .table:first-child > tbody:first-child > tr:first-child td:last-child, .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:last-child, .panel > .table:first-child > thead:first-child > tr:first-child th:last-child, .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:last-child, .panel > .table:first-child > tbody:first-child > tr:first-child th:last-child, .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:last-child {
      border-top-right-radius: 1px; }
  .panel > .table:last-child, .panel > .table-responsive:last-child > .table:last-child {
    border-bottom-right-radius: 1px;
    border-bottom-left-radius: 1px; }
  .panel > .table:last-child > tbody:last-child > tr:last-child, .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child, .panel > .table:last-child > tfoot:last-child > tr:last-child, .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child {
    border-bottom-left-radius: 1px;
    border-bottom-right-radius: 1px; }
    .panel > .table:last-child > tbody:last-child > tr:last-child td:first-child, .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:first-child, .panel > .table:last-child > tfoot:last-child > tr:last-child td:first-child, .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:first-child, .panel > .table:last-child > tbody:last-child > tr:last-child th:first-child, .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:first-child, .panel > .table:last-child > tfoot:last-child > tr:last-child th:first-child, .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:first-child {
      border-bottom-left-radius: 1px; }
    .panel > .table:last-child > tbody:last-child > tr:last-child td:last-child, .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:last-child, .panel > .table:last-child > tfoot:last-child > tr:last-child td:last-child, .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:last-child, .panel > .table:last-child > tbody:last-child > tr:last-child th:last-child, .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:last-child, .panel > .table:last-child > tfoot:last-child > tr:last-child th:last-child, .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:last-child {
      border-bottom-right-radius: 1px; }
  .panel > .panel-body + .table, .panel > .panel-body + .table-responsive, .panel > .table + .panel-body, .panel > .table-responsive + .panel-body {
    border-top: 1px solid #ddd; }
  .panel > .table > tbody:first-child > tr:first-child th, .panel > .table > tbody:first-child > tr:first-child td {
    border-top: 0; }
  .panel > .table-bordered, .panel > .table-responsive > .table-bordered {
    border: 0; }
  .panel > .table-bordered > thead > tr > th:first-child, .panel > .table-responsive > .table-bordered > thead > tr > th:first-child, .panel > .table-bordered > tbody > tr > th:first-child, .panel > .table-responsive > .table-bordered > tbody > tr > th:first-child, .panel > .table-bordered > tfoot > tr > th:first-child, .panel > .table-responsive > .table-bordered > tfoot > tr > th:first-child, .panel > .table-bordered > thead > tr > td:first-child, .panel > .table-responsive > .table-bordered > thead > tr > td:first-child, .panel > .table-bordered > tbody > tr > td:first-child, .panel > .table-responsive > .table-bordered > tbody > tr > td:first-child, .panel > .table-bordered > tfoot > tr > td:first-child, .panel > .table-responsive > .table-bordered > tfoot > tr > td:first-child {
    border-left: 0; }
    .panel > .table-bordered > thead > tr > th:last-child, .panel > .table-responsive > .table-bordered > thead > tr > th:last-child, .panel > .table-bordered > tbody > tr > th:last-child, .panel > .table-responsive > .table-bordered > tbody > tr > th:last-child, .panel > .table-bordered > tfoot > tr > th:last-child, .panel > .table-responsive > .table-bordered > tfoot > tr > th:last-child, .panel > .table-bordered > thead > tr > td:last-child, .panel > .table-responsive > .table-bordered > thead > tr > td:last-child, .panel > .table-bordered > tbody > tr > td:last-child, .panel > .table-responsive > .table-bordered > tbody > tr > td:last-child, .panel > .table-bordered > tfoot > tr > td:last-child, .panel > .table-responsive > .table-bordered > tfoot > tr > td:last-child {
      border-right: 0; }
  .panel > .table-bordered > thead > tr:first-child > td, .panel > .table-responsive > .table-bordered > thead > tr:first-child > td, .panel > .table-bordered > tbody > tr:first-child > td, .panel > .table-responsive > .table-bordered > tbody > tr:first-child > td, .panel > .table-bordered > thead > tr:first-child > th, .panel > .table-responsive > .table-bordered > thead > tr:first-child > th, .panel > .table-bordered > tbody > tr:first-child > th, .panel > .table-responsive > .table-bordered > tbody > tr:first-child > th {
    border-bottom: 0; }
  .panel > .table-bordered > tbody > tr:last-child > td, .panel > .table-responsive > .table-bordered > tbody > tr:last-child > td, .panel > .table-bordered > tfoot > tr:last-child > td, .panel > .table-responsive > .table-bordered > tfoot > tr:last-child > td, .panel > .table-bordered > tbody > tr:last-child > th, .panel > .table-responsive > .table-bordered > tbody > tr:last-child > th, .panel > .table-bordered > tfoot > tr:last-child > th, .panel > .table-responsive > .table-bordered > tfoot > tr:last-child > th {
    border-bottom: 0; }
  .panel > .table-responsive {
    border: 0;
    margin-bottom: 0; }

.panel-group {
  margin-bottom: 18px; }
  .panel-group .panel {
    margin-bottom: 0;
    border-radius: 2px; }
  .panel-group .panel + .panel {
    margin-top: 5px; }
  .panel-group .panel-heading {
    border-bottom: 0; }
  .panel-group .panel-heading + .panel-collapse > .panel-body, .panel-group .panel-heading + .panel-collapse > .list-group {
    border-top: 1px solid #ddd; }
  .panel-group .panel-footer {
    border-top: 0; }
  .panel-group .panel-footer + .panel-collapse .panel-body {
    border-bottom: 1px solid #ddd; }

.panel-default {
  border-color: #ddd; }
  .panel-default > .panel-heading {
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd; }
  .panel-default > .panel-heading + .panel-collapse > .panel-body {
    border-top-color: #ddd; }
  .panel-default > .panel-heading .badge {
    color: #f5f5f5;
    background-color: #333; }
  .panel-default > .panel-footer + .panel-collapse > .panel-body {
    border-bottom-color: #ddd; }

.panel-primary {
  border-color: #337ab7; }
  .panel-primary > .panel-heading {
    color: #fff;
    background-color: #337ab7;
    border-color: #337ab7; }
  .panel-primary > .panel-heading + .panel-collapse > .panel-body {
    border-top-color: #337ab7; }
  .panel-primary > .panel-heading .badge {
    color: #337ab7;
    background-color: #fff; }
  .panel-primary > .panel-footer + .panel-collapse > .panel-body {
    border-bottom-color: #337ab7; }

.panel-success {
  border-color: #d6e9c6; }
  .panel-success > .panel-heading {
    color: #3c763d;
    background-color: #dff0d8;
    border-color: #d6e9c6; }
  .panel-success > .panel-heading + .panel-collapse > .panel-body {
    border-top-color: #d6e9c6; }
  .panel-success > .panel-heading .badge {
    color: #dff0d8;
    background-color: #3c763d; }
  .panel-success > .panel-footer + .panel-collapse > .panel-body {
    border-bottom-color: #d6e9c6; }

.panel-info {
  border-color: #bce8f1; }
  .panel-info > .panel-heading {
    color: #31708f;
    background-color: #d9edf7;
    border-color: #bce8f1; }
  .panel-info > .panel-heading + .panel-collapse > .panel-body {
    border-top-color: #bce8f1; }
  .panel-info > .panel-heading .badge {
    color: #d9edf7;
    background-color: #31708f; }
  .panel-info > .panel-footer + .panel-collapse > .panel-body {
    border-bottom-color: #bce8f1; }

.panel-warning {
  border-color: #faebcc; }
  .panel-warning > .panel-heading {
    color: #8a6d3b;
    background-color: #fcf8e3;
    border-color: #faebcc; }
  .panel-warning > .panel-heading + .panel-collapse > .panel-body {
    border-top-color: #faebcc; }
  .panel-warning > .panel-heading .badge {
    color: #fcf8e3;
    background-color: #8a6d3b; }
  .panel-warning > .panel-footer + .panel-collapse > .panel-body {
    border-bottom-color: #faebcc; }

.panel-danger {
  border-color: #ebccd1; }
  .panel-danger > .panel-heading {
    color: #a94442;
    background-color: #f2dede;
    border-color: #ebccd1; }
  .panel-danger > .panel-heading + .panel-collapse > .panel-body {
    border-top-color: #ebccd1; }
  .panel-danger > .panel-heading .badge {
    color: #f2dede;
    background-color: #a94442; }
  .panel-danger > .panel-footer + .panel-collapse > .panel-body {
    border-bottom-color: #ebccd1; }

.embed-responsive {
  position: relative;
  display: block;
  height: 0;
  padding: 0;
  overflow: hidden; }
  .embed-responsive .embed-responsive-item, .embed-responsive iframe, .embed-responsive embed, .embed-responsive object, .embed-responsive video {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    border: 0; }

.embed-responsive-16by9 {
  padding-bottom: 56.25%; }

.embed-responsive-4by3 {
  padding-bottom: 75%; }

.well {
  min-height: 20px;
  padding: 19px;
  margin-bottom: 20px;
  background-color: #f5f5f5;
  border: 1px solid #e3e3e3;
  border-radius: 2px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05); }
  .well blockquote {
    border-color: #ddd;
    border-color: rgba(0, 0, 0, .15); }

.well-lg {
  padding: 24px;
  border-radius: 6px; }

.well-sm {
  padding: 9px;
  border-radius: 0; }

.close {
  float: right;
  font-size: 19.5px;
  font-weight: bold;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: 0.2;
  filter: alpha(opacity=20); }
  .close:hover, .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
    opacity: 0.5;
    filter: alpha(opacity=50); }

button.close {
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  -webkit-appearance: none; }

.modal-open {
  overflow: hidden; }

.modal {
  display: none;
  overflow: hidden;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1050;
  -webkit-overflow-scrolling: touch;
  outline: 0; }
  .modal.fade .modal-dialog {
    -webkit-transform: translate(0, -25%);
    -ms-transform: translate(0, -25%);
    -o-transform: translate(0, -25%);
    transform: translate(0, -25%);
    -webkit-transition: -webkit-transform 0.3s ease-out;
    -moz-transition: -moz-transform 0.3s ease-out;
    -o-transition: -o-transform 0.3s ease-out;
    transition: transform 0.3s ease-out; }
  .modal.in .modal-dialog {
    -webkit-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    -o-transform: translate(0, 0);
    transform: translate(0, 0); }

.modal-open .modal {
  overflow-x: hidden;
  overflow-y: auto; }

.modal-dialog {
  position: relative;
  width: auto;
  margin: 10px; }

.modal-content {
  position: relative;
  background-color: #fff;
  border: 1px solid #999;
  border: 1px solid rgba(0, 0, 0, .2);
  border-radius: 6px;
  -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, .5);
  box-shadow: 0 3px 9px rgba(0, 0, 0, .5);
  background-clip: padding-box;
  outline: 0; }

.modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1040;
  background-color: #000; }
  .modal-backdrop.fade {
    opacity: 0;
    filter: alpha(opacity=0); }
  .modal-backdrop.in {
    opacity: 0.5;
    filter: alpha(opacity=50); }

.modal-header {
  padding: 15px;
  border-bottom: 1px solid #e5e5e5; }
  .modal-header:before, .modal-header:after {
    content: " ";
    display: table; }
  .modal-header:after {
    clear: both; }

.modal-header .close {
  margin-top: -2px; }

.modal-title {
  margin: 0;
  line-height: 1.42857; }

.modal-body {
  position: relative;
  padding: 15px; }

.modal-footer {
  padding: 15px;
  text-align: right;
  border-top: 1px solid #e5e5e5; }
  .modal-footer:before, .modal-footer:after {
    content: " ";
    display: table; }
  .modal-footer:after {
    clear: both; }
  .modal-footer .btn + .btn, .modal-footer .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .btn, .modal-footer .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .modal-footer .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .modal-footer button + .btn, .modal-footer .btn + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .modal-footer .btn + button {
    margin-left: 5px;
    margin-bottom: 0; }
  .modal-footer .btn-group .btn + .btn, .modal-footer .btn-group .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .btn, .modal-footer .btn-group .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .modal-footer .btn-group .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button + button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .modal-footer .btn-group button + .btn, .modal-footer .btn-group .btn + .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .modal-footer .btn-group .btn + button {
    margin-left: -1px; }
  .modal-footer .btn-block + .btn-block, .modal-footer .navbar-search .input-group .input-group-btn .dropdown-toggle + .btn-block, .modal-footer .navbar-search .input-number .input-group-btn .dropdown-toggle + .btn-block, .modal-footer .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .btn-block, .modal-footer .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .modal-footer .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .modal-footer .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .modal-footer .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .modal-footer .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .modal-footer .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .modal-footer .navbar-search .input-number .input-number .btn-plus .dropdown-toggle + .dropdown-toggle, .input-number .modal-footer .navbar-search .input-number .btn-plus .dropdown-toggle + .btn-block, .modal-footer .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .btn-block, .modal-footer .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .modal-footer .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .modal-footer .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .modal-footer .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .modal-footer .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .modal-footer .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .modal-footer .navbar-search .input-number .input-number .btn-minus .dropdown-toggle + .dropdown-toggle, .input-number .modal-footer .navbar-search .input-number .btn-minus .dropdown-toggle + .btn-block, .modal-footer .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .modal-footer .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .modal-footer .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .modal-footer .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .modal-footer .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .modal-footer .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .modal-footer .navbar-search .input-number .input-group-btn .dropdown-toggle + .dropdown-toggle, .modal-footer .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .btn-block, .modal-footer .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .modal-footer .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .modal-footer .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .modal-footer .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .modal-footer .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .modal-footer .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .modal-footer .navbar-search .input-group .input-number .btn-plus .dropdown-toggle + .dropdown-toggle, .input-number .modal-footer .navbar-search .input-group .btn-plus .dropdown-toggle + .btn-block, .modal-footer .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .btn-block, .modal-footer .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .modal-footer .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .modal-footer .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .modal-footer .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .modal-footer .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .modal-footer .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .modal-footer .navbar-search .input-group .input-number .btn-minus .dropdown-toggle + .dropdown-toggle, .input-number .modal-footer .navbar-search .input-group .btn-minus .dropdown-toggle + .btn-block, .modal-footer .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .modal-footer .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .modal-footer .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .modal-footer .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .modal-footer .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .modal-footer .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .modal-footer .navbar-search .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .modal-footer .navbar-search .input-group .input-group-btn .dropdown-toggle + .dropdown-toggle, .navbar-search .input-group .input-group-btn .modal-footer .dropdown-toggle + .btn-block, .modal-footer .btn-block + .navbar-search .input-group .input-group-btn .dropdown-toggle, .modal-footer .btn-block + .navbar-search .input-number .input-group-btn .dropdown-toggle, .modal-footer .btn-block + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .modal-footer .btn-block + .navbar-search .input-number .btn-plus .dropdown-toggle, .modal-footer .btn-block + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .modal-footer .btn-block + .navbar-search .input-number .btn-minus .dropdown-toggle, .modal-footer .btn-block + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .modal-footer .btn-block + .navbar-search .input-group .btn-plus .dropdown-toggle, .modal-footer .btn-block + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .modal-footer .btn-block + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .modal-footer .btn-block + .dropdown-toggle {
    margin-left: 0; }

.modal-scrollbar-measure {
  position: absolute;
  top: -9999px;
  width: 50px;
  height: 50px;
  overflow: scroll; }

@media (min-width: 768px) {
  .modal-dialog {
    width: 600px;
    margin: 30px auto; }

  .modal-content {
    -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
    box-shadow: 0 5px 15px rgba(0, 0, 0, .5); }

  .modal-sm {
    width: 300px; } }

@media (min-width: 992px) {
  .modal-lg, .mfp-wrap.iframe_layer .modal-dialog {
    width: 900px; } }

.tooltip {
  position: absolute;
  z-index: 1070;
  display: block;
  font-family: Roboto, Arial, sans-serif;
  font-style: normal;
  font-weight: normal;
  letter-spacing: normal;
  line-break: auto;
  line-height: 1.42857;
  text-align: left;
  text-align: start;
  text-decoration: none;
  text-shadow: none;
  text-transform: none;
  white-space: normal;
  word-break: normal;
  word-spacing: normal;
  word-wrap: normal;
  font-size: 12px;
  opacity: 0;
  filter: alpha(opacity=0); }
  .tooltip.in {
    opacity: 0.9;
    filter: alpha(opacity=90); }
  .tooltip.top {
    margin-top: -3px;
    padding: 5px 0; }
  .tooltip.right {
    margin-left: 3px;
    padding: 0 5px; }
  .tooltip.bottom {
    margin-top: 3px;
    padding: 5px 0; }
  .tooltip.left {
    margin-left: -3px;
    padding: 0 5px; }

.tooltip-inner {
  max-width: 200px;
  padding: 3px 8px;
  color: #fff;
  text-align: center;
  background-color: #000;
  border-radius: 2px; }

.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid; }

.tooltip.top .tooltip-arrow {
  bottom: 0;
  left: 50%;
  margin-left: -5px;
  border-width: 5px 5px 0;
  border-top-color: #000; }
  .tooltip.top-left .tooltip-arrow {
    bottom: 0;
    right: 5px;
    margin-bottom: -5px;
    border-width: 5px 5px 0;
    border-top-color: #000; }
  .tooltip.top-right .tooltip-arrow {
    bottom: 0;
    left: 5px;
    margin-bottom: -5px;
    border-width: 5px 5px 0;
    border-top-color: #000; }
  .tooltip.right .tooltip-arrow {
    top: 50%;
    left: 0;
    margin-top: -5px;
    border-width: 5px 5px 5px 0;
    border-right-color: #000; }
  .tooltip.left .tooltip-arrow {
    top: 50%;
    right: 0;
    margin-top: -5px;
    border-width: 5px 0 5px 5px;
    border-left-color: #000; }
  .tooltip.bottom .tooltip-arrow {
    top: 0;
    left: 50%;
    margin-left: -5px;
    border-width: 0 5px 5px;
    border-bottom-color: #000; }
  .tooltip.bottom-left .tooltip-arrow {
    top: 0;
    right: 5px;
    margin-top: -5px;
    border-width: 0 5px 5px;
    border-bottom-color: #000; }
  .tooltip.bottom-right .tooltip-arrow {
    top: 0;
    left: 5px;
    margin-top: -5px;
    border-width: 0 5px 5px;
    border-bottom-color: #000; }

.popover {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1060;
  display: none;
  max-width: 276px;
  padding: 1px;
  font-family: Roboto, Arial, sans-serif;
  font-style: normal;
  font-weight: normal;
  letter-spacing: normal;
  line-break: auto;
  line-height: 1.42857;
  text-align: left;
  text-align: start;
  text-decoration: none;
  text-shadow: none;
  text-transform: none;
  white-space: normal;
  word-break: normal;
  word-spacing: normal;
  word-wrap: normal;
  font-size: 13px;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ccc;
  border: 1px solid rgba(0, 0, 0, .2);
  border-radius: 6px;
  -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
  box-shadow: 0 5px 10px rgba(0, 0, 0, .2); }
  .popover.top {
    margin-top: -10px; }
  .popover.right {
    margin-left: 10px; }
  .popover.bottom {
    margin-top: 10px; }
  .popover.left {
    margin-left: -10px; }

.popover-title {
  margin: 0;
  padding: 8px 14px;
  font-size: 13px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #ebebeb;
  border-radius: 5px 5px 0 0; }

.popover-content {
  padding: 9px 14px; }

.popover > .arrow, .popover > .arrow:after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid; }

.popover > .arrow {
  border-width: 11px; }

.popover > .arrow:after {
  border-width: 10px;
  content: ""; }

.popover.top > .arrow {
  left: 50%;
  margin-left: -11px;
  border-bottom-width: 0;
  border-top-color: #999;
  border-top-color: rgba(0, 0, 0, 0.25);
  bottom: -11px; }
  .popover.top > .arrow:after {
    content: " ";
    bottom: 1px;
    margin-left: -10px;
    border-bottom-width: 0;
    border-top-color: #fff; }
  .popover.right > .arrow {
    top: 50%;
    left: -11px;
    margin-top: -11px;
    border-left-width: 0;
    border-right-color: #999;
    border-right-color: rgba(0, 0, 0, 0.25); }
  .popover.right > .arrow:after {
    content: " ";
    left: 1px;
    bottom: -10px;
    border-left-width: 0;
    border-right-color: #fff; }
  .popover.bottom > .arrow {
    left: 50%;
    margin-left: -11px;
    border-top-width: 0;
    border-bottom-color: #999;
    border-bottom-color: rgba(0, 0, 0, 0.25);
    top: -11px; }
  .popover.bottom > .arrow:after {
    content: " ";
    top: 1px;
    margin-left: -10px;
    border-top-width: 0;
    border-bottom-color: #fff; }
  .popover.left > .arrow {
    top: 50%;
    right: -11px;
    margin-top: -11px;
    border-right-width: 0;
    border-left-color: #999;
    border-left-color: rgba(0, 0, 0, 0.25); }
  .popover.left > .arrow:after {
    content: " ";
    right: 1px;
    border-right-width: 0;
    border-left-color: #fff;
    bottom: -10px; }

.clearfix:before, .product-info .product-info-details dl:before, .clearfix:after, .product-info .product-info-details dl:after {
  content: " ";
  display: table; }
  .clearfix:after, .product-info .product-info-details dl:after {
    clear: both; }

.center-block {
  display: block;
  margin-left: auto;
  margin-right: auto; }

.pull-right {
  float: right !important; }

.pull-left {
  float: left !important; }

.hide {
  display: none !important; }

.show {
  display: block !important; }

.invisible {
  visibility: hidden; }

.text-hide {
  font: 0/0 a;
  color: transparent;
  text-shadow: none;
  background-color: transparent;
  border: 0; }

.hidden {
  display: none !important; }

.affix {
  position: fixed; }
  @-ms-viewport {
    width: device-width; }

.visible-xs {
  display: none !important; }

.visible-sm {
  display: none !important; }

.visible-md {
  display: none !important; }

.visible-lg {
  display: none !important; }

.visible-xs-block, .visible-xs-inline, .visible-xs-inline-block, .visible-sm-block, .visible-sm-inline, .visible-sm-inline-block, .visible-md-block, .visible-md-inline, .visible-md-inline-block, .visible-lg-block, .visible-lg-inline, .visible-lg-inline-block {
  display: none !important; }

@media (max-width: 767px) {
  .visible-xs {
    display: block !important; }
    table.visible-xs {
      display: table !important; }
    tr.visible-xs {
      display: table-row !important; }
    th.visible-xs, td.visible-xs {
      display: table-cell !important; } }

@media (max-width: 767px) {
    .visible-xs-block {
      display: block !important; } }

@media (max-width: 767px) {
    .visible-xs-inline {
      display: inline !important; } }

@media (max-width: 767px) {
    .visible-xs-inline-block {
      display: inline-block !important; } }

@media (min-width: 768px) and (max-width: 991px) {
  .visible-sm {
    display: block !important; }
    table.visible-sm {
      display: table !important; }
    tr.visible-sm {
      display: table-row !important; }
    th.visible-sm, td.visible-sm {
      display: table-cell !important; } }

@media (min-width: 768px) and (max-width: 991px) {
    .visible-sm-block {
      display: block !important; } }

@media (min-width: 768px) and (max-width: 991px) {
    .visible-sm-inline {
      display: inline !important; } }

@media (min-width: 768px) and (max-width: 991px) {
    .visible-sm-inline-block {
      display: inline-block !important; } }

@media (min-width: 992px) and (max-width: 1199px) {
  .visible-md {
    display: block !important; }
    table.visible-md {
      display: table !important; }
    tr.visible-md {
      display: table-row !important; }
    th.visible-md, td.visible-md {
      display: table-cell !important; } }

@media (min-width: 992px) and (max-width: 1199px) {
    .visible-md-block {
      display: block !important; } }

@media (min-width: 992px) and (max-width: 1199px) {
    .visible-md-inline {
      display: inline !important; } }

@media (min-width: 992px) and (max-width: 1199px) {
    .visible-md-inline-block {
      display: inline-block !important; } }

@media (min-width: 1200px) {
  .visible-lg {
    display: block !important; }
    table.visible-lg {
      display: table !important; }
    tr.visible-lg {
      display: table-row !important; }
    th.visible-lg, td.visible-lg {
      display: table-cell !important; } }

@media (min-width: 1200px) {
    .visible-lg-block {
      display: block !important; } }

@media (min-width: 1200px) {
    .visible-lg-inline {
      display: inline !important; } }

@media (min-width: 1200px) {
    .visible-lg-inline-block {
      display: inline-block !important; } }

@media (max-width: 767px) {
  .hidden-xs {
    display: none !important; } }

@media (min-width: 768px) and (max-width: 991px) {
  .hidden-sm {
    display: none !important; } }

@media (min-width: 992px) and (max-width: 1199px) {
  .hidden-md {
    display: none !important; } }

@media (min-width: 1200px) {
  .hidden-lg {
    display: none !important; } }

.visible-print {
  display: none !important; }

@media print {
  .visible-print {
    display: block !important; }
    table.visible-print {
      display: table !important; }
    tr.visible-print {
      display: table-row !important; }
    th.visible-print, td.visible-print {
      display: table-cell !important; } }

.visible-print-block {
  display: none !important; }
  @media print {
  .visible-print-block {
    display: block !important; } }

.visible-print-inline {
  display: none !important; }
  @media print {
  .visible-print-inline {
    display: inline !important; } }

.visible-print-inline-block {
  display: none !important; }
  @media print {
  .visible-print-inline-block {
    display: inline-block !important; } }

@media print {
  .hidden-print {
    display: none !important; } }
/* Mixins
 ========================================================================== */
/* Global Styles
 ========================================================================== */
.page-postfinder ul.row, .page-postfinder .total-box table ul.total, .total-box table .page-postfinder ul.total, .page-postfinder ul.row li, .page-postfinder .total-box table ul.total li, .total-box table .page-postfinder ul.total li {
  list-style: none; }

ul.postfinder-head {
  background-color: #fc0;
  padding: 1ex 0;
  color: #000;
  font-weight: bold; }

ul.postfinder-body {
  background-color: #fff2bf;
  padding: 1ex 0; }
  ul.postfinder-body li form fieldset {
    margin: 0; }

table.box-error {
  background: #c20400 !important;
  border: 1px solid #a90300;
  color: #fff;
  display: block;
  margin: 15px auto;
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  border-radius: 2px; }
  table.box-error .errorBox {
    padding: 15px; }

table.box-warning {
  background: #d500f9 !important;
  border: 1px solid #d500f9;
  color: #fff;
  margin: 15px auto; }
  table.box-warning .warningBox {
    padding: 15px; }

.no-image {
  max-width: 160px;
  margin: 0 auto; }
  .no-image .product-image {
    background: #f9f9f9 none no-repeat;
    border: 1px solid #ddd;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    padding: 0 15px; }
  .no-image .product-image .glyphicon-picture, .no-image .product-image .fa-picture-o {
    font-size: 80px;
    line-height: 130px;
    text-align: center;
    width: 100%; }
  .no-image .product-image a, .no-image .product-image a:hover {
    color: inherit; }

.img-responsive-fix {
  width: 100%; }

.gm-icon-before, .swiper-button-next:before, .swiper-button-prev:before, .nav-tabs > li > a:before, .tab-content > .tab-pane > .tab-heading > a:before, .pageup, .pageup:before, .navbar-categories > .navbar-nav li > a:before, .panel > .navbar-categories-left > ul > li > a:before {
  font-family: "gm";
  font-style: normal;
  font-weight: normal;
  speak: none;
  display: inline-block;
  text-decoration: inherit;
  width: 1em;
  margin-right: 0.2em;
  text-align: center;
  font-variant: normal;
  text-transform: none;
  line-height: 1em;
  margin-left: 0.2em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; }

.btn, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button {
  text-transform: uppercase;
  letter-spacing: 1px; }
  .btn.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle {
    text-transform: none;
    letter-spacing: 0; }
  .btn:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:focus {
    outline: none; }

h1, h2, .nav-tabs > li > a, .tab-content > .tab-pane > .tab-heading > a, h3 {
  border-bottom: 3px solid #e7e7e7;
  padding-bottom: 13px;
  margin-bottom: 30px; }
  h1.no-underline, h2.no-underline, .nav-tabs > li > a.no-underline, .tab-content > .tab-pane > .tab-heading > a.no-underline, h3.no-underline {
    border-bottom: none;
    margin-bottom: 1.42857;
    padding-bottom: 0; }

::selection {
  background: #337ab7;
  /* WebKit/Blink Browsers */
  color: #fff; }

::-moz-selection {
  background: #337ab7;
  /* Gecko Browsers */
  color: #fff; }

address {
  font-style: italic;
  font-weight: bold; }

.text-bold {
  font-weight: bold; }

.text-small {
  font-size: 11px; }

.list-reset {
  margin: 0;
  padding: 0;
  list-style: none; }
  .list-reset > li {
    padding: 0; }

.alert.checkbox {
  padding-top: 15px; }

.indent-0 {
  padding-left: 15px; }

.indent-1 {
  padding-left: 45px; }

.indent-2 {
  padding-left: 75px; }

.indent-3 {
  padding-left: 105px; }

.indent-4 {
  padding-left: 135px; }

@media (min-width: 480px) {
  .indent-xs-0 {
    padding-left: 15px; }
    .indent-xs-1 {
      padding-left: 45px; }
    .indent-xs-2 {
      padding-left: 75px; }
    .indent-xs-3 {
      padding-left: 105px; }
    .indent-xs-4 {
      padding-left: 135px; } }

@media (min-width: 768px) {
  .indent-sm-0 {
    padding-left: 15px; }
    .indent-sm-1 {
      padding-left: 45px; }
    .indent-sm-2 {
      padding-left: 75px; }
    .indent-sm-3 {
      padding-left: 105px; }
    .indent-sm-4 {
      padding-left: 135px; } }

@media (min-width: 992px) {
  .indent-md-0 {
    padding-left: 15px; }
    .indent-md-1 {
      padding-left: 45px; }
    .indent-md-2 {
      padding-left: 75px; }
    .indent-md-3 {
      padding-left: 105px; }
    .indent-md-4 {
      padding-left: 135px; } }

@media (min-width: 1200px) {
  .indent-lg-0 {
    padding-left: 15px; }
    .indent-lg-1 {
      padding-left: 45px; }
    .indent-lg-2 {
      padding-left: 75px; }
    .indent-lg-3 {
      padding-left: 105px; }
    .indent-lg-4 {
      padding-left: 135px; } }

.space-0 {
  margin-bottom: 0px; }

.space-1 {
  margin-bottom: 30px; }

.space-2 {
  margin-bottom: 60px; }

.space-3 {
  margin-bottom: 90px; }

.space-4 {
  margin-bottom: 120px; }

.align-helper {
  height: 100%;
  display: inline-block;
  vertical-align: middle; }

a:focus {
  outline: none; }

body:not(.filterbox-enabled) .productlisting-filter-container .filter-button {
  display: none; }

.noscript-notice {
  left: 0;
  margin: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 3; }

.hyphenate {
  hyphens: auto;
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto; }
/* Layout
 ========================================================================== */
body, html {
  height: 100%; }

body {
  background-color: #fff;
  padding-top: 50px; }
  body #outer-wrapper {
    background-color: #fff; }
  @media (min-width: 768px) {
    body #outer-wrapper {
      margin-top: 0;
      margin-bottom: 0; } }
  @media (min-width: 768px) {
  body {
    padding-top: 150px; } }
  #wrapper {
    /* Wrapper for page content to push down footer */
    min-height: 100%;
    height: auto;
    margin-bottom: -400px;
    /* Negative indent footer by its height */
    padding-bottom: 400px;
    /* Pad bottom by footer height */ }
  #wrapper:before, #wrapper:after {
    content: " ";
    display: table; }
  #wrapper:after {
    clear: both; }
  #wrapper #main {
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px; }
  @media (min-width: 768px) {
    #wrapper #main {
      float: left;
      width: 66.66667%; } }
  @media (min-width: 768px) {
    #wrapper #main {
      left: 33.33333%; } }
  @media (min-width: 992px) {
    #wrapper #main {
      float: left;
      width: 66.66667%; } }
  @media (min-width: 992px) {
    #wrapper #main {
      left: 33.33333%; } }
  @media (min-width: 1200px) {
    #wrapper #main {
      float: left;
      width: 75%; } }
  @media (min-width: 1200px) {
    #wrapper #main {
      left: 25%; } }
  #wrapper #main .main-inside {
    padding-top: 15px;
    padding-bottom: 30px;
    min-height: 550px; }
  #wrapper #left {
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 15px;
    clear: left; }
  @media (min-width: 768px) {
    #wrapper #left {
      float: left;
      width: 100%; } }
  @media (min-width: 768px) {
    #wrapper #left {
      float: left;
      width: 33.33333%; } }
  @media (min-width: 768px) {
    #wrapper #left {
      right: 66.66667%; } }
  @media (min-width: 992px) {
    #wrapper #left {
      float: left;
      width: 100%; } }
  @media (min-width: 992px) {
    #wrapper #left {
      float: left;
      width: 33.33333%; } }
  @media (min-width: 992px) {
    #wrapper #left {
      right: 66.66667%; } }
  @media (min-width: 1200px) {
    #wrapper #left {
      float: left;
      width: 100%; } }
  @media (min-width: 1200px) {
    #wrapper #left {
      float: left;
      width: 25%; } }
  @media (min-width: 1200px) {
    #wrapper #left {
      right: 75%; } }
  @media (min-width: 768px) {
    #wrapper #left {
      padding-left: 0;
      clear: none; } }
  #wrapper #right {
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 15px; }
  @media (min-width: 768px) {
    #wrapper #right {
      float: left;
      width: 100%; } }
  @media (min-width: 992px) {
    #wrapper #right {
      float: left;
      width: 100%; } }
  @media (min-width: 1200px) {
    #wrapper #right {
      float: left;
      width: 100%; } }

#footer {
  min-height: 400px;
  /* wrap footer content in container */ }
  body.page-index #wrapper #left, body.page-index #wrapper #right {
    display: none; }
  body.page-index #wrapper #main {
    width: 100%;
    left: 0; }

body.page-product-info #wrapper #left, body.page-product-info #wrapper #right {
  display: none; }
  body.page-product-info #wrapper #main {
    width: 100%;
    left: 0; }

body.page-shopping-cart #wrapper #left, body.page-shopping-cart #wrapper #right {
  display: none; }
  body.page-shopping-cart #wrapper #main {
    width: 100%;
    left: 0; }

body.page-shop.page-checkout-started #wrapper #left, body.page-checkout-shipping #wrapper #left, body.page-checkout-shipping-address #wrapper #left, body.page-checkout-payment #wrapper #left, body.page-checkout-payment-address #wrapper #left, body.page-checkout-confirmation #wrapper #left, body.page-checkout-success #wrapper #left {
  display: none; }
  body.page-shop.page-checkout-started #wrapper #main, body.page-checkout-shipping #wrapper #main, body.page-checkout-shipping-address #wrapper #main, body.page-checkout-payment #wrapper #main, body.page-checkout-payment-address #wrapper #main, body.page-checkout-confirmation #wrapper #main, body.page-checkout-success #wrapper #main {
    left: 0;
    width: 100%;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px; }
  @media (min-width: 1200px) {
    body.page-shop.page-checkout-started #wrapper #main, body.page-checkout-shipping #wrapper #main, body.page-checkout-shipping-address #wrapper #main, body.page-checkout-payment #wrapper #main, body.page-checkout-payment-address #wrapper #main, body.page-checkout-confirmation #wrapper #main, body.page-checkout-success #wrapper #main {
      float: left;
      width: 83.33333%; } }
  @media (min-width: 1200px) {
    body.page-shop.page-checkout-started #wrapper #main, body.page-checkout-shipping #wrapper #main, body.page-checkout-shipping-address #wrapper #main, body.page-checkout-payment #wrapper #main, body.page-checkout-payment-address #wrapper #main, body.page-checkout-confirmation #wrapper #main, body.page-checkout-success #wrapper #main {
      margin-left: 8.33333%; } }

.content-page-index {
  margin-bottom: 30px; }

form {
  position: relative; }
  form .mandatory-info {
    position: absolute;
    top: 0;
    right: 0;
    color: #ccc; }
  form fieldset {
    margin-bottom: 30px; }
  form fieldset:first-of-type {
    margin-top: 30px; }
  form .form-group.mandatory .control-label:after {
    content: " *";
    font-family: Arial, sans-serif; }
  form .form-group .input-container {
    position: relative; }
    form .form-group .input-container .radio-inline input[type="radio"] {
      margin-top: 3px; }
  form .form-group.switch-text-input .radio-block .row, form .form-group.switch-text-input .radio-block .total-box table tr.total, .total-box table form .form-group.switch-text-input .radio-block tr.total {
    line-height: 35px; }
    form .form-group.switch-text-input .radio-block .row label.control-label, form .form-group.switch-text-input .radio-block .total-box table tr.total label.control-label, .total-box table form .form-group.switch-text-input .radio-block tr.total label.control-label {
      padding-top: 3px; }
    form .form-group.switch-text-input .radio-block .row input[type="radio"], form .form-group.switch-text-input .radio-block .total-box table tr.total input[type="radio"], .total-box table form .form-group.switch-text-input .radio-block tr.total input[type="radio"] {
      margin: 13px 0 0 0;
      outline: none; }
    form .form-group.switch-text-input .input-text-switch .form-control, form .form-group.switch-text-input .input-text-switch .input-text {
      display: none;
      margin-top: 20px; }
    form .form-group.switch-text-input .input-text-switch .form-control.active, form .form-group.switch-text-input .input-text-switch .input-text.active {
      display: block; }

.form-horizontal .control-label {
  text-align: left; }

label {
  font-weight: normal; }

#vvcode_image {
  display: block;
  margin: 0 0 5px; }

.form-control.error, .input-text.error {
  border-color: #a94442;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075); }
  .form-control.error:focus, .input-text.error:focus {
    border-color: #843534;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #ce8483;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #ce8483; }

.form-control, .input-text {
  -webkit-box-shadow: none;
  box-shadow: none; }

form#contactus textarea, form#product_reviews_write textarea {
  height: 120px; }
  form#contactus p, form#product_reviews_write p {
    margin: 0;
    line-height: 39px; }

form#contactus img#vvcode_input_image {
  margin-bottom: 15px; }
  form#contactus input#vvcode_input {
    max-width: 240px; }

form#sign img#vvcode_image {
  margin-bottom: 15px; }
  form#sign input#vvcode {
    max-width: 240px; }

form#product_reviews_write img#vvcode_image {
  margin-bottom: 15px; }
  form#product_reviews_write input#vvcode {
    max-width: 240px; }
  form#product_reviews_write .glyphicon-star, form#product_reviews_write .fa-star {
    color: #ff9000; }

form#callback_service fieldset {
  position: relative; }

form#gm_price_offer fieldset {
  position: relative; }

label.form-input {
  position: absolute;
  z-index: -1; }

input[type="text"]#form-input {
  background-color: transparent;
  border: none;
  position: absolute;
  left: -50%;
  z-index: -1; }

.modal-body input[type="text"]#form-input {
  left: unset; }

.swiper-slide {
  background-color: #fff; }

.swiper-button-next, .swiper-button-prev {
  background: none;
  color: #ccc;
  margin-top: -30px;
  width: 60px !important;
  height: 60px !important;
  background-image: none !important;
  -webkit-transition: 300ms ease opacity;
  -o-transition: 300ms ease opacity;
  transition: 300ms ease opacity; }
  .swiper-button-next:before, .swiper-button-prev:before {
    content: '\e800';
    font-size: 60px;
    margin: 0 !important; }
  .swiper-button-next:hover, .swiper-button-prev:hover {
    color: #337ab7; }

.swiper-button-prev:before, .swiper-container-rtl .swiper-button-next:before {
  content: '\e820'; }

.swiper-button-prev.swiper-button-disabled, .swiper-button-next.swiper-button-disabled {
  display: block !important;
  opacity: 0;
  filter: alpha(opacity=0); }

.swiper-vertical .swiper-button-next, .swiper-vertical .swiper-container-rtl .swiper-button-prev {
  bottom: 10px;
  margin-top: 0;
  left: 50%;
  margin-left: -30px;
  right: auto;
  top: auto; }
  .swiper-vertical .swiper-button-next:before, .swiper-vertical .swiper-container-rtl .swiper-button-prev:before {
    content: "\e81f"; }
  .swiper-vertical .swiper-button-prev, .swiper-vertical .swiper-container-rtl .swiper-button-next {
    top: 10px;
    margin-top: 0;
    left: 50%;
    margin-left: -30px;
    right: auto;
    bottom: auto; }
  .swiper-vertical .swiper-button-prev:before, .swiper-vertical .swiper-container-rtl .swiper-button-next:before {
    content: "\e801"; }

.swiper-is-not-active + div, .swiper-is-not-active + div + div {
  display: none !important; }

#slider_flyover_container {
  display: none;
  position: absolute;
  background-color: #fff;
  border-width: 1px;
  border-color: #ccc;
  border-style: solid;
  padding: 10px;
  max-width: 800px;
  z-index: 200; }
/* Tabs & Mobile-Accordion
 ========================================================================== */
.tab-content > .tab-pane .tab-heading > a {
  display: block;
  position: relative;
  padding: 10px 15px;
  line-height: 1.42857;
  border: 1px solid transparent;
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0; }
  .tab-content > .tab-pane .tab-heading > a:focus, .tab-content > .tab-pane .tab-heading > a:hover {
    text-decoration: none; }

.nav-tabs {
  border-bottom: 3px solid #e7e7e7;
  height: 50px; }

.nav-tabs > li, .tab-content > .tab-pane > .tab-heading {
  margin-bottom: 0; }
  .nav-tabs > li > a, .tab-content > .tab-pane > .tab-heading > a {
    color: #ccc;
    margin: 0;
    line-height: 1.42857;
    height: 50px;
    border: none;
    border-bottom: 3px solid transparent;
    background-color: transparent; }
  @media (max-width: 767px) {
    .nav-tabs > li > a, .tab-content > .tab-pane > .tab-heading > a {
      border-bottom: 3px solid #eee;
      padding: 10px 5px 10px 0; }
      .nav-tabs > li > a:before, .tab-content > .tab-pane > .tab-heading > a:before {
        float: right;
        font-size: 20px;
        margin-top: 3px;
        content: '\e800';
        /* chevron-right */
        -webkit-transition: ease 200ms transform;
        -o-transition: ease 200ms transform;
        transition: ease 200ms transform; } }
  .nav-tabs > li > a:hover, .tab-content > .tab-pane > .tab-heading > a:hover {
    color: #333;
    border-bottom: 3px solid #000;
    background-color: #fff; }

.nav-tabs > li.active > a, .tab-content > .tab-pane.active > .tab-heading > a, .nav-tabs > li.active > a:focus, .tab-content > .tab-pane.active > .tab-heading > a:focus, .nav-tabs > li.active > a:hover, .tab-content > .tab-pane.active > .tab-heading > a:hover {
  border: none;
  color: #333;
  background-color: #fff; }
  .has-multi-tabs .nav-tabs > li.active > a, .has-multi-tabs .tab-content > .tab-pane.active > .tab-heading > a, .has-multi-tabs .nav-tabs > li.active > a:focus, .has-multi-tabs .tab-content > .tab-pane.active > .tab-heading > a:focus, .has-multi-tabs .nav-tabs > li.active > a:hover, .has-multi-tabs .tab-content > .tab-pane.active > .tab-heading > a:hover {
    border-bottom: 3px solid #000; }
  @media (max-width: 767px) {
  .nav-tabs > li.active a:before, .tab-content > .tab-pane.active > .tab-heading a:before {
    transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg); } }

.nav-tabs > li.active {
  border-bottom: 3px solid #000; }
  .has-multi-tabs .nav-tabs > li.active {
    border-bottom: none; }

.nav-tabs {
  display: none; }

.tab-content > .tab-pane {
  display: block; }
  .tab-content > .tab-pane.active > .tab-body {
    border-bottom: 3px solid #eee;
    display: block; }
  .tab-content > .tab-pane > .tab-body {
    display: none; }

@media (min-width: 768px) {
  .nav-tabs {
    display: block; }

  .tab-content > .tab-pane {
    display: none; }
    .tab-content > .tab-pane.active {
      display: block; }
    .tab-content > .tab-pane > .tab-heading {
      display: none; }
    .tab-content > .tab-pane > .tab-body {
      display: block; }
      .tab-content > .tab-pane > .tab-body.active {
        border-bottom: 0; } }

.tab-body {
  padding: 30px 0; }
/* Table
 ========================================================================== */
.table {
  background-color: transparent; }
  .table > thead > tr > th, .table > tbody > tr > th, .table > tfoot > tr > th, .table > thead > tr > td, .table > tbody > tr > td, .table > tfoot > tr > td {
    border-top-color: #e7e7e7; }
  .table > thead > tr > th {
    font-weight: 700;
    text-transform: uppercase;
    font-size: inherit;
    color: inherit;
    border-bottom: 3px solid #e7e7e7;
    color: #999; }
  @media (max-width: 767px) {
    .table.table-responsive {
      border: none;
      overflow: none;
      overflow-x: auto;
      display: block;
      -webkit-overflow-scrolling: touch; }
      .table.table-responsive, .table.table-responsive tbody, .table.table-responsive tfoot, .table.table-responsive tr, .table.table-responsive td, .table.table-responsive th {
        display: block; }
        .table.table-responsive:before, .table.table-responsive tbody:before, .table.table-responsive tfoot:before, .table.table-responsive tr:before, .table.table-responsive td:before, .table.table-responsive th:before, .table.table-responsive:after, .table.table-responsive tbody:after, .table.table-responsive tfoot:after, .table.table-responsive tr:after, .table.table-responsive td:after, .table.table-responsive th:after {
          content: " ";
          display: table; }
        .table.table-responsive:after, .table.table-responsive tbody:after, .table.table-responsive tfoot:after, .table.table-responsive tr:after, .table.table-responsive td:after, .table.table-responsive th:after {
          clear: both; }
      .table.table-responsive thead {
        display: none; }
      .table.table-responsive > thead > tr > th, .table.table-responsive > tbody > tr > th, .table.table-responsive > tfoot > tr > th, .table.table-responsive > thead > tr > td, .table.table-responsive > tbody > tr > td, .table.table-responsive > tfoot > tr > td {
        border-top-width: 0;
        padding-left: 15px;
        padding-right: 15px; }
      .table.table-responsive > tbody > tr > td:nth-of-type(1) {
        border-top-width: 1px; }
      .table.table-responsive td[class*="col-"], .table.table-responsive th[class*="col-"] {
        float: left; } }
  .table.table-striped > tbody > tr:nth-of-type(odd) {
    background-color: #f9f9f9;
    color: #333; }
    .table.table-striped > tbody > tr:nth-of-type(even) {
      background-color: transparent;
      color: #333; }
/* Fieldset
 ========================================================================== */
fieldset {
  position: relative; }
  fieldset legend {
    font-weight: 700;
    text-transform: uppercase;
    font-size: inherit;
    color: inherit;
    color: #337ab7;
    min-height: 30px;
    border-bottom: 1px solid #337ab7; }
  fieldset legend .glyphicon, fieldset legend [class^="gm-"], fieldset legend .fa {
    color: #337ab7;
    font-size: 18px;
    display: inline-block;
    margin: 0 5px 0 0; }
  fieldset legend a {
    float: right;
    font-weight: normal;
    text-transform: none; }
    fieldset legend a .glyphicon, fieldset legend a [class^="gm-"], fieldset legend a .fa {
      font-size: inherit; }
/* List Groups
 ========================================================================== */
.list-group .list-group-item {
  border-top: none;
  border-left: none;
  border-right: none;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 15px;
  margin-bottom: 0; }
/* Pageup
 ========================================================================== */
.pageup {
  max-height: 0;
  overflow: hidden;
  position: fixed;
  bottom: 25px;
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, .7);
  z-index: 1020;
  padding-top: 10px;
  right: 25px;
  opacity: 0;
  filter: alpha(opacity=0);
  text-decoration: none;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%; }
  .pageup, .pageup:hover, .pageup:focus, .pageup:active {
    text-decoration: none;
    color: #337ab7; }
  .pageup, .pageup:before {
    -webkit-transition: 300ms ease all;
    -o-transition: 300ms ease all;
    transition: 300ms ease all;
    content: '\e801';
    font-size: 40px;
    margin: 0 !important; }
  .pageup:hover {
    color: #337ab7;
    background-color: #fff; }
  .pageup.visible {
    max-height: none;
    -webkit-box-shadow: 0 12px 18px rgba(0, 0, 0, .35);
    box-shadow: 0 12px 18px rgba(0, 0, 0, .35);
    opacity: 1;
    filter: alpha(opacity=100); }
  .pageup.transition {
    max-height: none; }
/* Input Number-Spinner
 ========================================================================== */
.input-number {
  padding-left: 15px !important;
  padding-right: 15px !important;
  padding-bottom: 15px !important; }
  .input-number .input-group, .input-number {
    width: 100%; }
  .input-number .btn-plus, .input-number .btn-minus {
    font-size: 17px;
    width: 60px; }
  .input-number .btn-minus {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border-right: none; }
  .input-number .btn-minus span.fa {
    color: #000; }
  .input-number .btn-plus {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    border-left: none; }
  .input-number .btn-plus span.fa {
    color: #000; }
  .input-number .form-control, .input-number .input-text {
    text-align: center;
    padding-left: 0; }
  .input-number .input-group-addon {
    border-left: none;
    border-right: none;
    color: #ccc;
    line-height: 1.33333; }
/* Breadcrumb Navigation
 ========================================================================== */
#breadcrumb_navi {
  padding: 5px 0 15px;
  color: #337ab7;
  display: none; }
  #breadcrumb_navi > span.breadcrumbEntry {
    color: #999;
    display: inline-block;
    font-size: 12px;
    padding: 0 10px 0 0; }
  #breadcrumb_navi > span.breadcrumbEntry > a {
    color: #999;
    font-size: 12px; }
  #breadcrumb_navi > span.breadcrumbSeparator {
    padding: 0 10px 0 0; }
  @media (min-width: 768px) {
  #breadcrumb_navi {
    display: block; } }

body.page-index #breadcrumb_navi {
  display: none; }
  @media (min-width: 992px) {
    body.page-product-info #breadcrumb_navi {
      width: 66.6667%; } }
/* Pagination
 ========================================================================== */
.panel-pagination .pagination > li > .active {
  background-color: #eee; }
  .panel-pagination .pagination > li > .active, .panel-pagination .pagination > li > .active:hover {
    color: #333; }

.pagination-info {
  color: #999;
  text-align: center;
  margin: 10px 0; }

#product_navigation.panel-pagination {
  position: relative;
  float: left;
  width: 100%;
  min-height: 1px;
  padding-left: 15px;
  padding-right: 15px;
  padding: 0; }
  @media (min-width: 768px) {
    #product_navigation.panel-pagination {
      position: relative;
      min-height: 1px;
      padding-left: 15px;
      padding-right: 15px;
      padding: 0; } }
  @media (min-width: 768px) and (min-width: 768px) {
        #product_navigation.panel-pagination {
          float: left;
          width: 66.66667%; } }
  #product_navigation.panel-pagination .pagination {
    margin: 0;
    float: left; }
  @media (max-width: 480px) {
      #product_navigation.panel-pagination .pagination {
        position: relative;
        float: left;
        width: 100%;
        min-height: 1px;
        padding-left: 15px;
        padding-right: 15px;
        padding: 0; } }
  #product_navigation.panel-pagination .pagination > li > a, #product_navigation.panel-pagination .pagination > li span {
    padding: 5px 9px; }
  #product_navigation.panel-pagination span {
    height: 30px;
    line-height: 30px;
    margin-left: 5px; }
  @media (max-width: 480px) {
      #product_navigation.panel-pagination span {
        position: relative;
        float: left;
        width: 100%;
        min-height: 1px;
        padding-left: 15px;
        padding-right: 15px;
        padding: 0;
        margin-left: 0; } }
/* Lightbox Layer
 ========================================================================== */
.mfp-wrap.iframe_layer .modal-dialog .modal-body {
  height: 360px;
  -webkit-overflow-scrolling: touch; }
  @media (max-width: 1024px) {
        .mfp-wrap.iframe_layer .modal-dialog .modal-body {
          overflow-y: auto;
          padding-bottom: 8px; }
          .mfp-wrap.iframe_layer .modal-dialog .modal-body > iframe {
            height: 98%; } }
  @media (min-height: 600px) {
        .mfp-wrap.iframe_layer .modal-dialog .modal-body {
          height: 500px; } }
  @media (min-height: 800px) {
        .mfp-wrap.iframe_layer .modal-dialog .modal-body {
          height: 700px; } }
  .mfp-wrap.layer-medium .modal-dialog .modal-body {
    height: 360px; }
  @media (min-height: 600px) {
        .mfp-wrap.layer-medium .modal-dialog .modal-body {
          height: 360px; } }
  @media (min-height: 800px) {
        .mfp-wrap.layer-medium .modal-dialog .modal-body {
          height: 360px; } }

@media (max-width: 450px) {
  .product-question-modal .mfp-container {
    height: auto; }
    .product-question-modal .mfp-container .modal-body {
      max-height: 300px;
      overflow-x: auto; } }
/*
 jQuery Daterangepicker
 ==========================================================================
 Additional styling for the jQuery Daterangepicker plugin.
 */
.comiseo-daterangepicker {
  width: 556px;
  padding: 0;
  border-radius: 2px;
  border: 3px solid rgba(0, 0, 0, .2);
  background: #fff; }
  .comiseo-daterangepicker .comiseo-daterangepicker-main {
    padding: 0;
    background: none;
    border: none; }
  .comiseo-daterangepicker .comiseo-daterangepicker-main .comiseo-daterangepicker-presets {
    display: none; }
  .comiseo-daterangepicker .comiseo-daterangepicker-main .comiseo-daterangepicker-calendar {
    display: block;
    height: auto;
    padding: 0;
    border: none; }
  .comiseo-daterangepicker .comiseo-daterangepicker-main .comiseo-daterangepicker-calendar .ui-datepicker {
    width: 550px !important;
    margin: 0;
    border-radius: 0;
    position: initial; }
  .comiseo-daterangepicker .comiseo-daterangepicker-main .comiseo-daterangepicker-calendar .ui-datepicker .ui-datepicker-group-last .ui-datepicker-calendar {
    border-left: 1px solid #285f8f; }
  .comiseo-daterangepicker .comiseo-daterangepicker-main .comiseo-daterangepicker-calendar .ui-datepicker .ui-datepicker-title select {
    background: #fff;
    border: 1px solid #285f8f;
    border-radius: 2px;
    line-height: 15px;
    padding: 3px; }
  .comiseo-daterangepicker .comiseo-daterangepicker-main .comiseo-daterangepicker-calendar .ui-datepicker .ui-datepicker-title .ui-datepicker-year {
    width: 30%; }
  .comiseo-daterangepicker .comiseo-daterangepicker-main .comiseo-daterangepicker-calendar .ui-datepicker .ui-datepicker-group table {
    width: 100%; }
  .comiseo-daterangepicker .comiseo-daterangepicker-main .comiseo-daterangepicker-calendar .ui-datepicker td.ui-state-highlight {
    background: #337ab7 !important;
    border-color: #337ab7; }
  .comiseo-daterangepicker .comiseo-daterangepicker-main .comiseo-daterangepicker-calendar .ui-datepicker td.ui-state-highlight a {
    background: none; }
  .comiseo-daterangepicker .comiseo-daterangepicker-main .comiseo-daterangepicker-calendar .ui-datepicker .ui-datepicker-today {
    background: #63a0d4; }
  .comiseo-daterangepicker .comiseo-daterangepicker-main .comiseo-daterangepicker-calendar .ui-datepicker .ui-datepicker-today a {
    background: none;
    color: #fff; }
  .comiseo-daterangepicker .comiseo-daterangepicker-main .comiseo-daterangepicker-calendar .ui-datepicker .ui-state-disabled {
    padding-top: 5px; }
  .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel {
    width: 100%;
    padding: 10px 5px;
    background: #f9f9f9;
    border: none;
    margin-top: 4px; }
  .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button {
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    float: right;
    opacity: 1;
    margin-top: 0; }
  .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button:nth-child(2) {
    display: none; }
  .daterangepicker-wrapper i {
    float: right;
    margin-top: -22px;
    margin-right: 8px; }

.panel-default {
  clear: both;
  border-color: #ddd; }
  .panel-default .panel-heading {
    border-bottom: none;
    color: #333;
    font-size: 16px;
    -webkit-box-shadow: inset 0 1px #fff;
    box-shadow: inset 0 1px #fff;
    background-color: #f5f5f5; }
  .panel-default .panel-heading .panel-title {
    display: block;
    padding: 8px 0;
    line-height: 1.1; }
  .panel-default .panel-body {
    border-bottom-right-radius: 2px;
    border-bottom-left-radius: 2px;
    background-color: #fff; }
  .panel-default .panel > nav {
    margin: 5px 0; }
/* Modals
 ========================================================================== */
.modal-dialog .modal-content {
  background-color: #fff; }
  .modal-dialog .modal-content .modal-title {
    font-size: 16px; }

.single-checkbox {
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 14px;
  text-align: center;
  border: 1px solid #999;
  background-color: #fff;
  cursor: pointer;
  margin-right: 5px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: border 0.2s ease;
  -o-transition: border 0.2s ease;
  transition: border 0.2s ease; }
  .single-checkbox .glyphicon, .single-checkbox .fa {
    font-size: 12px;
    color: #fff;
    visibility: hidden; }
  .single-checkbox.focused {
    border-color: #2196f3; }
  .single-checkbox.checked {
    background-color: #337ab7;
    border: 1px solid #337ab7; }
  .single-checkbox.checked .glyphicon, .single-checkbox.checked .fa {
    visibility: visible; }
  .single-checkbox.checked:active {
    background-color: #2d6da3; }
  .single-checkbox.disabled {
    cursor: not-allowed !important;
    background-color: #eee !important;
    border-color: #999 !important; }
  .single-checkbox.disabled .glyphicon, .single-checkbox.disabled .fa {
    color: #a7a7a7 !important; }
  .single-checkbox:active {
    background-color: adjust-lightness(#fff, -5); }
  .single-checkbox:hover {
    border-color: #337ab7;
    -webkit-transition: border 0.2s ease;
    -o-transition: border 0.2s ease;
    transition: border 0.2s ease; }

.checkbox .single-checkbox, .checkbox-inline .single-checkbox {
  position: absolute;
  margin-left: -20px;
  margin-top: 4px \9; }

.parcel-finder-notice {
  display: block;
  margin-top: 15px; }

.alert.checkbox label input {
  top: 50%;
  transform: translate(-140%, -50%);
  margin: 0px;
  left: 35px; }

fieldset input[type=checkbox] {
  transform: translateY(20%); }
/* Alerts
 ========================================================================== */
.alert {
  margin-bottom: 36px; }
  .alert.checkbox {
    padding: 5px 0;
    color: #fff;
    border-color: #e69d00;
    background-color: #ffae00; }
  .alert.checkbox label {
    display: block;
    padding: 5px 15px 5px 35px; }
  .alert.checkbox.active {
    color: #fff;
    border-color: #008009;
    background-color: #00990b; }
  .alert.alert-danger {
    color: #fff;
    border-color: #a90300;
    background-color: #c20400; }
  .alert.alert-success {
    background-color: #00990b;
    color: #fff;
    border-color: #008009;
    background-color: #00990b; }
  .alert.alert-info {
    color: #fff;
    border-color: #2d6da3;
    background-color: #ffae00; }
  .alert.alert-warning {
    color: #fff;
    border-color: #e69d00;
    background-color: #337ab7; }
  .alert a {
    color: #fff;
    text-decoration: underline; }
  .alert a:hover {
    text-decoration: none; }

.ui-datepicker {
  background-clip: padding-box;
  background-color: #fff;
  display: none;
  left: 0;
  position: absolute;
  text-align: left;
  padding: 0 !important;
  border: 3px solid rgba(0, 0, 0, 0.2) !important;
  margin: 5px 0 0 0;
  width: auto !important;
  white-space: normal;
  border-radius: 3px; }
  .ui-datepicker th, .ui-datepicker td {
    height: auto;
    line-height: 30px;
    text-align: center;
    width: auto; }
  .ui-datepicker .ui-datepicker-header {
    background: #337ab7;
    border: none;
    border-radius: 0;
    font-weight: normal;
    font-size: 15px;
    padding: 0 !important; }
  .ui-datepicker .ui-datepicker-header .ui-datepicker-title {
    border: 0;
    height: 35px;
    line-height: 30px;
    margin-top: 0.4em;
    text-align: center;
    width: 210px; }
  .ui-datepicker .ui-datepicker-header .ui-datepicker-title span.ui-datepicker-month, .ui-datepicker .ui-datepicker-header .ui-datepicker-title span.ui-datepicker-year {
    color: #fff;
    font-size: 14px;
    font-weight: bold; }
  .ui-datepicker .ui-datepicker-header .ui-datepicker-prev, .ui-datepicker .ui-datepicker-header .ui-datepicker-next {
    font-size: 12px;
    background: none;
    border: 0;
    border-radius: 0;
    cursor: pointer;
    height: 41px;
    line-height: 41px;
    text-align: center;
    top: 0;
    width: 41px; }
  .ui-datepicker .ui-datepicker-header .ui-datepicker-prev:hover, .ui-datepicker .ui-datepicker-header .ui-datepicker-next:hover {
    background: #5c95c5;
    text-decoration: none; }
  .ui-datepicker .ui-datepicker-header .ui-datepicker-prev:after, .ui-datepicker .ui-datepicker-header .ui-datepicker-next:after {
    color: #fff; }
  .ui-datepicker .ui-datepicker-header .ui-datepicker-prev span, .ui-datepicker .ui-datepicker-header .ui-datepicker-next span {
    background: none;
    height: 28px;
    width: 14px;
    margin-top: 7px;
    top: 0;
    font-weight: normal; }
  .ui-datepicker .ui-datepicker-header .ui-datepicker-next {
    border-left: 1px solid #285f8f;
    right: 0; }
  .ui-datepicker .ui-datepicker-header .ui-datepicker-next:after {
    content: "\f054"; }
  .ui-datepicker .ui-datepicker-header .ui-datepicker-prev {
    border-right: 1px solid #285f8f;
    left: 0; }
  .ui-datepicker .ui-datepicker-header .ui-datepicker-prev:after {
    content: "\f053"; }
  .ui-datepicker .ui-datepicker-header .ui-datepicker-month {
    margin-right: 5px;
    min-width: 0;
    width: 37%;
    max-width: 37%; }
  .ui-datepicker .ui-datepicker-header .ui-datepicker-year {
    min-width: 0;
    width: 37%;
    max-width: 37%; }
  .ui-datepicker table.ui-datepicker-calendar {
    border-color: #285f8f;
    margin: 0; }
  .ui-datepicker table.ui-datepicker-calendar thead th {
    background: #3072ab;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    line-height: 35px;
    border: 0;
    border-top: 1px solid #285f8f;
    padding: 0; }
  .ui-datepicker table.ui-datepicker-calendar thead th span {
    color: #fff; }
  .ui-datepicker table.ui-datepicker-calendar tbody tr:nth-child(even) {
    background: #fff; }
  .ui-datepicker table.ui-datepicker-calendar tbody tr:nth-child(odd) {
    background: #f5f5f5; }
  .ui-datepicker table.ui-datepicker-calendar tbody a {
    color: #333;
    border: none;
    background: none; }
  .ui-datepicker table.ui-datepicker-calendar tbody td, .ui-datepicker table.ui-datepicker-calendar tbody a {
    text-align: center;
    padding: 4px 1px; }
  .ui-datepicker table.ui-datepicker-calendar tbody td {
    border-right: 1px solid #e4e4e4;
    line-height: 22px; }
  .ui-datepicker table.ui-datepicker-calendar tbody td:last-child {
    border-right: 0; }
  .ui-datepicker table.ui-datepicker-calendar tbody td:hover {
    background: #e8e8e8; }
  .ui-datepicker table.ui-datepicker-calendar tbody td.ui-datepicker-today {
    background: #e8e8e8; }
  .ui-datepicker table.ui-datepicker-calendar tbody td.ui-datepicker-today a {
    font-weight: 700; }
  .ui-datepicker table.ui-datepicker-calendar tbody td.ui-datepicker-current-day {
    background: #337ab7; }
  .ui-datepicker table.ui-datepicker-calendar tbody td.ui-datepicker-current-day a {
    font-weight: bold;
    color: #fff; }
  .ui-datepicker table.ui-datepicker-calendar tbody td.ui-state-disabled {
    background: #f5f5f5;
    opacity: 1;
    filter: alpha(opacity=100); }
  .ui-datepicker table.ui-datepicker-calendar tbody td.ui-state-disabled span {
    opacity: 0.5;
    filter: alpha(opacity=50); }
  .ui-datepicker table.ui-datepicker-calendar tbody td.ui-datepicker-week-col:hover {
    background: #fff; }
  .ui-datepicker table.ui-datepicker-calendar tbody td span {
    border: none;
    background: none;
    text-align: center; }
  .ui-datepicker table.ui-datepicker-calendar tbody td a {
    color: #333;
    display: block;
    height: 100%;
    text-decoration: none;
    width: 100%; }
/* Buttons
 ========================================================================== */
.btn, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button {
  -webkit-border-radius: 0px;
  -moz-border-radius: 0px;
  border-radius: 0px;
  text-transform: uppercase; }
  .btn.btn-primary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn {
    color: #fff;
    background-color: #337ab7;
    border-color: #2d6da3;
    background-color: #337ab7; }
  .btn.btn-primary:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn:focus, .btn.btn-primary.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.focus {
    color: #fff;
    background-color: #285f8f;
    border-color: #122a3f; }
  .btn.btn-primary:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn:hover {
    color: #fff;
    background-color: #285f8f;
    border-color: #204d73; }
  .btn.btn-primary:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn:active, .btn.btn-primary.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.active, .open > .btn.btn-primary.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-primary.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-primary.btn.dropdown-toggle {
    color: #fff;
    background-color: #285f8f;
    border-color: #204d73; }
  .btn.btn-primary:active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary:active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn:active:hover, .btn.btn-primary.active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.active:hover, .open > .btn.btn-primary.dropdown-toggle:hover, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.dropdown-toggle:hover, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-primary.dropdown-toggle:hover, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.dropdown-toggle:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-primary.btn.dropdown-toggle:hover, .btn.btn-primary:active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary:active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn:active:focus, .btn.btn-primary.active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.active:focus, .open > .btn.btn-primary.dropdown-toggle:focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.dropdown-toggle:focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-primary.dropdown-toggle:focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.dropdown-toggle:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-primary.btn.dropdown-toggle:focus, .btn.btn-primary:active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary:active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn:active.focus, .btn.btn-primary.active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.active.focus, .open > .btn.btn-primary.dropdown-toggle.focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.dropdown-toggle.focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-primary.dropdown-toggle.focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.dropdown-toggle.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-primary.btn.dropdown-toggle.focus {
    color: #fff;
    background-color: #204d73;
    border-color: #122a3f; }
  .btn.btn-primary:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn:active, .btn.btn-primary.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.active, .open > .btn.btn-primary.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-primary.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-primary.btn.dropdown-toggle {
    background-image: none; }
  .btn.btn-primary.disabled:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.disabled:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.disabled:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.disabled:hover, .btn.btn-primary[disabled]:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary[disabled]:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary[disabled]:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn[disabled]:hover, fieldset[disabled] .btn.btn-primary:hover, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary:hover, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.btn-primary:hover, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.ui-priority-primary.btn:hover, .btn.btn-primary.disabled:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.disabled:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.disabled:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.disabled:focus, .btn.btn-primary[disabled]:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary[disabled]:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary[disabled]:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn[disabled]:focus, fieldset[disabled] .btn.btn-primary:focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary:focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.btn-primary:focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.ui-priority-primary.btn:focus, .btn.btn-primary.disabled.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.disabled.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.disabled.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.disabled.focus, .btn.btn-primary[disabled].focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary[disabled].focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary[disabled].focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn[disabled].focus, fieldset[disabled] .btn.btn-primary.focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.btn-primary.focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.ui-priority-primary.btn.focus {
    background-color: #337ab7;
    border-color: #2d6da3; }
  .btn.btn-primary .badge, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary .badge, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary .badge, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn .badge {
    color: #337ab7;
    background-color: #fff; }
  .btn.btn-default, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn {
    color: #666;
    background-color: #f3f3f3;
    border-color: #ccc;
    background-color: #f3f3f3; }
  .btn.btn-default:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn:focus, .btn.btn-default.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.focus {
    color: #666;
    background-color: #dadada;
    border-color: #8c8c8c; }
  .btn.btn-default:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn:hover {
    color: #666;
    background-color: #dadada;
    border-color: #adadad; }
  .btn.btn-default:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn:active, .btn.btn-default.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.active, .open > .btn.btn-default.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-default.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-secondary.btn.dropdown-toggle {
    color: #666;
    background-color: #dadada;
    border-color: #adadad; }
  .btn.btn-default:active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default:active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn:active:hover, .btn.btn-default.active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.active:hover, .open > .btn.btn-default.dropdown-toggle:hover, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.dropdown-toggle:hover, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.dropdown-toggle:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.dropdown-toggle:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-default.dropdown-toggle:hover, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.dropdown-toggle:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-secondary.btn.dropdown-toggle:hover, .btn.btn-default:active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default:active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn:active:focus, .btn.btn-default.active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.active:focus, .open > .btn.btn-default.dropdown-toggle:focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.dropdown-toggle:focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.dropdown-toggle:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.dropdown-toggle:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-default.dropdown-toggle:focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.dropdown-toggle:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-secondary.btn.dropdown-toggle:focus, .btn.btn-default:active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default:active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn:active.focus, .btn.btn-default.active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.active.focus, .open > .btn.btn-default.dropdown-toggle.focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.dropdown-toggle.focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.dropdown-toggle.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.dropdown-toggle.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-default.dropdown-toggle.focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.dropdown-toggle.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-secondary.btn.dropdown-toggle.focus {
    color: #666;
    background-color: #c8c8c8;
    border-color: #8c8c8c; }
  .btn.btn-default:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn:active, .btn.btn-default.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.active, .open > .btn.btn-default.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-default.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.ui-priority-secondary.btn.dropdown-toggle {
    background-image: none; }
  .btn.btn-default.disabled:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.disabled:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.disabled:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.disabled:hover, .btn.btn-default[disabled]:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default[disabled]:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary[disabled]:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn[disabled]:hover, fieldset[disabled] .btn.btn-default:hover, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default:hover, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.btn-default:hover, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.ui-priority-secondary.btn:hover, .btn.btn-default.disabled:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.disabled:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.disabled:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.disabled:focus, .btn.btn-default[disabled]:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default[disabled]:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary[disabled]:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn[disabled]:focus, fieldset[disabled] .btn.btn-default:focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default:focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.btn-default:focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.ui-priority-secondary.btn:focus, .btn.btn-default.disabled.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.disabled.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.disabled.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.disabled.focus, .btn.btn-default[disabled].focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default[disabled].focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary[disabled].focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn[disabled].focus, fieldset[disabled] .btn.btn-default.focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.btn-default.focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.ui-priority-secondary.btn.focus {
    background-color: #f3f3f3;
    border-color: #ccc; }
  .btn.btn-default .badge, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default .badge, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary .badge, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn .badge {
    color: #f3f3f3;
    background-color: #666; }
  .btn.btn-buy, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy {
    color: #fff;
    background-color: #2eae06;
    border-color: #279505;
    background-color: #2eae06; }
  .btn.btn-buy:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy:focus, .btn.btn-buy.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.focus {
    color: #fff;
    background-color: #217d04;
    border-color: #071a01; }
  .btn.btn-buy:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy:hover {
    color: #fff;
    background-color: #217d04;
    border-color: #185a03; }
  .btn.btn-buy:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy:active, .btn.btn-buy.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.active, .open > .btn.btn-buy.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-buy.dropdown-toggle {
    color: #fff;
    background-color: #217d04;
    border-color: #185a03; }
  .btn.btn-buy:active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy:active:hover, .btn.btn-buy.active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.active:hover, .open > .btn.btn-buy.dropdown-toggle:hover, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.dropdown-toggle:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-buy.dropdown-toggle:hover, .btn.btn-buy:active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy:active:focus, .btn.btn-buy.active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.active:focus, .open > .btn.btn-buy.dropdown-toggle:focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.dropdown-toggle:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-buy.dropdown-toggle:focus, .btn.btn-buy:active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy:active.focus, .btn.btn-buy.active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.active.focus, .open > .btn.btn-buy.dropdown-toggle.focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.dropdown-toggle.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-buy.dropdown-toggle.focus {
    color: #fff;
    background-color: #185a03;
    border-color: #071a01; }
  .btn.btn-buy:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy:active, .btn.btn-buy.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.active, .open > .btn.btn-buy.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-buy.dropdown-toggle {
    background-image: none; }
  .btn.btn-buy.disabled:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.disabled:hover, .btn.btn-buy[disabled]:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy[disabled]:hover, fieldset[disabled] .btn.btn-buy:hover, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.btn-buy:hover, .btn.btn-buy.disabled:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.disabled:focus, .btn.btn-buy[disabled]:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy[disabled]:focus, fieldset[disabled] .btn.btn-buy:focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.btn-buy:focus, .btn.btn-buy.disabled.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.disabled.focus, .btn.btn-buy[disabled].focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy[disabled].focus, fieldset[disabled] .btn.btn-buy.focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.btn-buy.focus {
    background-color: #2eae06;
    border-color: #279505; }
  .btn.btn-buy .badge, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy .badge {
    color: #2eae06;
    background-color: #fff; }
  .btn.btn-buy:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy:focus {
    outline: none; }
  .btn.btn-buy.inactive, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-buy.inactive {
    opacity: 0.5; }
  .btn.btn-price-on-request, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request {
    color: #fff;
    background-color: #2eae06;
    border-color: #279505;
    background-color: #2eae06; }
  .btn.btn-price-on-request:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request:focus, .btn.btn-price-on-request.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.focus {
    color: #fff;
    background-color: #217d04;
    border-color: #071a01; }
  .btn.btn-price-on-request:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request:hover {
    color: #fff;
    background-color: #217d04;
    border-color: #185a03; }
  .btn.btn-price-on-request:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request:active, .btn.btn-price-on-request.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.active, .open > .btn.btn-price-on-request.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-price-on-request.dropdown-toggle {
    color: #fff;
    background-color: #217d04;
    border-color: #185a03; }
  .btn.btn-price-on-request:active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request:active:hover, .btn.btn-price-on-request.active:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.active:hover, .open > .btn.btn-price-on-request.dropdown-toggle:hover, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.dropdown-toggle:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-price-on-request.dropdown-toggle:hover, .btn.btn-price-on-request:active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request:active:focus, .btn.btn-price-on-request.active:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.active:focus, .open > .btn.btn-price-on-request.dropdown-toggle:focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.dropdown-toggle:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-price-on-request.dropdown-toggle:focus, .btn.btn-price-on-request:active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request:active.focus, .btn.btn-price-on-request.active.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.active.focus, .open > .btn.btn-price-on-request.dropdown-toggle.focus, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.dropdown-toggle.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-price-on-request.dropdown-toggle.focus {
    color: #fff;
    background-color: #185a03;
    border-color: #071a01; }
  .btn.btn-price-on-request:active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request:active, .btn.btn-price-on-request.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.active, .open > .btn.btn-price-on-request.dropdown-toggle, .open > .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .open > button.btn-price-on-request.dropdown-toggle {
    background-image: none; }
  .btn.btn-price-on-request.disabled:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.disabled:hover, .btn.btn-price-on-request[disabled]:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request[disabled]:hover, fieldset[disabled] .btn.btn-price-on-request:hover, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request:hover, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.btn-price-on-request:hover, .btn.btn-price-on-request.disabled:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.disabled:focus, .btn.btn-price-on-request[disabled]:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request[disabled]:focus, fieldset[disabled] .btn.btn-price-on-request:focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.btn-price-on-request:focus, .btn.btn-price-on-request.disabled.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.disabled.focus, .btn.btn-price-on-request[disabled].focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request[disabled].focus, fieldset[disabled] .btn.btn-price-on-request.focus, fieldset[disabled] .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel fieldset[disabled] button.btn-price-on-request.focus {
    background-color: #2eae06;
    border-color: #279505; }
  .btn.btn-price-on-request .badge, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request .badge {
    color: #2eae06;
    background-color: #fff; }
  .btn.btn-price-on-request:focus, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request:focus {
    outline: none; }
  .btn.btn-price-on-request.inactive, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-price-on-request.inactive {
    opacity: 0.5; }

img.ppinstallments_selection {
  max-width: 20em;
  background-color: #fff;
  padding: 1.5em;
  border-radius: 0.4em; }

div.shopping-cart-button div.paypalinstallmentcontainer {
  padding: 0; }

div.paypalinstallmentcontainer {
  width: 100%;
  max-width: 40em;
  padding: 0 15px; }

#checkout_payment div.paypalinstallmentcontainer {
  padding: 0;
  width: 23em; }
  #checkout_payment div.paypalinstallmentspecific {
    margin: 1em 0; }
  #checkout_payment div.paypalinstallmentgeneric {
    margin: 1em 0; }
  #checkout_payment div.paypalinstallmentgeneric .introtext {
    text-align: left;
    padding: 0.2ex 0; }
  #checkout_payment div.paypalinstallmentgeneric .popup_installments_info {
    text-align: left; }
  #checkout_payment li.list-group-item.paypal3_installments:not(.active) div.paypalinstallmentgeneric {
    background-color: #eee; }

#checkout_payment .paypal3-plus-checkout div.paypalinstallmentcontainer {
  float: none;
  display: inline-block; }
  #checkout_payment .paypal3-plus-checkout img.ppinstallments_selection {
    max-width: 100%;
    padding: 1ex 0;
    border-radius: 0; }

div.paypalinstallmentgeneric {
  padding: 1ex;
  background-color: #fff;
  color: #333;
  margin: 1em auto;
  clear: both; }
  div.paypalinstallmentgeneric img.powered-by-paypal-horizontal {
    max-width: 100%;
    margin-bottom: 1ex; }
  div.paypalinstallmentgeneric .introtext {
    text-align: center;
    font-weight: bold;
    padding: 0.2ex 1ex; }
  div.paypalinstallmentgeneric .installments {
    text-transform: uppercase;
    color: #003087;
    font-size: 1.5em;
    text-align: center;
    font-weight: bolder;
    font-style: oblique; }
  div.paypalinstallmentgeneric .powered-by-paypal img.powered-by-paypal-vertical {
    width: 100%;
    padding: 1.5ex;
    display: inline-block; }
  div.paypalinstallmentgeneric .popup_installments_info {
    color: #3d92d5;
    cursor: pointer;
    text-decoration: underline;
    text-align: center; }

div.paypalinstallmentspecific {
  padding: 1ex;
  max-width: 25em;
  clear: both;
  background-color: #fff;
  margin: 1em auto; }
  div.paypalinstallmentspecific img.powered-by-paypal-horizontal {
    max-width: 100%;
    margin-bottom: 1ex; }
  div.paypalinstallmentspecific .ppi_introtext {
    font-weight: bold; }
  div.paypalinstallmentspecific div.credit-info-table {
    background-color: #eee; }
  div.paypalinstallmentspecific div.credit-info-table div.row, div.paypalinstallmentspecific div.credit-info-table .total-box table div.total, .total-box table div.paypalinstallmentspecific div.credit-info-table div.total {
    margin-left: 0;
    margin-right: 0; }
  div.paypalinstallmentspecific div.credit-info-table .pp_cs_label {
    padding: 0 0 0 2px; }
  div.paypalinstallmentspecific div.credit-info-table .pp_cs_data {
    padding: 0 2px 0 0;
    font-weight: bold;
    text-align: right; }
  div.paypalinstallmentspecific .popup_installments_info {
    color: #3d92d5;
    font-size: 1.1em;
    cursor: pointer;
    text-decoration: underline; }
  div.paypalinstallmentspecific .pp_cs_popup {
    display: none; }

body.page-shopping-cart div.paypalinstallmentcontainer div.paypalinstallmentspecific {
  background-color: #eee; }
  body.page-shopping-cart div.paypalinstallmentcontainer div.paypalinstallmentspecific div.credit-info-table {
    background-color: #fff; }
  body.page-shopping-cart div.paypalinstallmentgeneric {
    background-color: #eee; }

body > div.pp_cs_popup {
  position: fixed;
  z-index: 9999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8); }
  body > div.pp_cs_popup div.pp_cs_popup_inner {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    margin: auto;
    height: 90%;
    width: 80%;
    background-color: #fff;
    padding: 1ex;
    border: 2px solid #3d92d5;
    border-radius: 0.4em;
    overflow-y: auto; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .heading {
    text-align: center;
    max-width: 36em;
    margin: 1ex auto; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .heading .powered-by-paypal img.powered-by-paypal-vertical {
    width: 100%;
    padding: 1.5ex;
    display: inline-block; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .subheading {
    font-size: 1.1em;
    font-weight: bold;
    text-align: center; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .infotext {
    text-align: center; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .netloan {
    font-weight: bold;
    text-align: center; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .info-representative {
    clear: both;
    text-align: center; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .lender {
    text-align: center; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .qualifying-options, body > div.pp_cs_popup div.pp_cs_popup_inner .non-qualifying-options {
    text-align: center;
    margin: 0; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .non-qualifying-options .non-qualifying-intro {
    margin-top: 2em; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .credit-plan-outer {
    padding: 1ex 1em; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .credit-plan {
    border: 1px solid #000;
    padding: 1ex; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .credit-plan .credit-plan-heading {
    font-size: 1.1em;
    font-weight: bold; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .credit-plan table.credit-plan-details {
    width: 100%; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .credit-plan table.credit-plan-details td {
    padding: 0 0.5ex; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .credit-plan table.credit-plan-details td.pp_cs_label {
    text-align: left; }
  body > div.pp_cs_popup div.pp_cs_popup_inner .credit-plan table.credit-plan-details td.pp_cs_data {
    font-weight: bold;
    text-align: right; }
  body > div.pp_cs_popup button.mfp-close {
    color: #000; }
/* Header
 ========================================================================== */
#header {
  height: 50px;
  margin-bottom: 0;
  background-color: #fff;
  border-width: 0;
  -webkit-box-shadow: 0 0 25px rgba(0, 0, 0, .35);
  box-shadow: 0 0 25px rgba(0, 0, 0, .35);
  -webkit-transition: 300ms ease all;
  -o-transition: 300ms ease all;
  transition: 300ms ease all; }
  @media (min-width: 768px) {
  #header {
    background-color: #fff;
    height: 150px;
    -webkit-box-shadow: none;
    box-shadow: none; } }
  #header .inside:before, #header .inside:after {
    content: " ";
    display: table; }
  #header .inside:after {
    clear: both; }
  #header .inside.navbar-default {
    border: none;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0; }
  @media (min-width: 768px) {
      #header .inside .navbar-header {
        position: relative;
        min-height: 1px;
        padding-left: 15px;
        padding-right: 15px;
        position: relative;
        min-height: 1px;
        padding-left: 15px;
        padding-right: 15px;
        position: relative;
        min-height: 1px;
        padding-left: 15px;
        padding-right: 15px; } }
  @media (min-width: 768px) and (min-width: 768px) {
          #header .inside .navbar-header {
            float: left;
            width: 25%; } }
  @media (min-width: 768px) and (min-width: 992px) {
          #header .inside .navbar-header {
            float: left;
            width: 25%; } }
  @media (min-width: 768px) and (min-width: 1200px) {
          #header .inside .navbar-header {
            float: left;
            width: 25%; } }
  #header .inside .navbar-header .navbar-toggle {
    margin: 0;
    max-height: 60px;
    max-width: 60px;
    padding: 0;
    width: 50px;
    height: 50px;
    font-size: 30px; }
  #header .inside .navbar-header .navbar-toggle.cart-icon .gx-cart-basket {
    height: 30px;
    width: 30px;
    fill: #000; }
  #header .inside .navbar-header .navbar-toggle .gx-menu {
    height: 21px;
    width: 21px;
    fill: #000; }
  #header .inside .navbar-header .navbar-toggle .gx-search {
    height: 21px;
    width: 21px;
    fill: #000; }
  #header .inside .navbar-header .navbar-toggle.active {
    color: #337ab7; }
  #header .inside .navbar-header .navbar-toggle.active.cart-icon .gm-cart-basket {
    color: #337ab7; }
  #header .inside .navbar-header .navbar-toggle.active .gm-menu {
    color: #337ab7; }
  #header .inside .navbar-header .navbar-toggle.active .gm-search {
    color: #337ab7; }
  #header .inside .navbar-header .navbar-collapse {
    border-top: none; }
  @media (min-width: 768px) {
  #header.sticky {
    height: 60px;
    background: #fff;
    -webkit-box-shadow: 0 0 25px rgba(0, 0, 0, .35);
    box-shadow: 0 0 25px rgba(0, 0, 0, .35); }
    #header.sticky .gx-cart-basket {
      height: 30px !important;
      width: 30px !important;
      fill: #000 !important; } }
/* Dropdowns
 ========================================================================== */
ul.dropdown-menu {
  border: none;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  background-color: #fff; }
  @media (min-width: 768px) {
  ul.dropdown-menu {
    -webkit-box-shadow: 0 12px 18px rgba(0, 0, 0, .35);
    box-shadow: 0 12px 18px rgba(0, 0, 0, .35); } }
  ul.dropdown-menu li form {
    padding: 6px 15px 0; }
  ul.dropdown-menu li .form-group {
    padding: 6px 15px 0;
    padding-top: 0; }
  ul.dropdown-menu li .form-group > label {
    color: #333; }
  ul.dropdown-menu li > a, ul.dropdown-menu li span {
    color: #333;
    display: block;
    padding: 5px 15px; }
  ul.dropdown-menu li > a.disabled, ul.dropdown-menu li span.disabled {
    color: #999; }
  ul.dropdown-menu li > a.disabled:hover, ul.dropdown-menu li span.disabled:hover {
    background-color: transparent; }
  ul.dropdown-menu li > a:hover:not(.cart-dropdown a), ul.dropdown-menu li span:hover:not(.cart-dropdown a) {
    background-color: #eee; }
  ul.dropdown-menu.arrow-top {
    border-top-right-radius: 2px;
    border-top-left-radius: 2px; }
  ul.dropdown-menu.arrow-top > .arrow, ul.dropdown-menu.arrow-top > .arrow:after {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid; }
  ul.dropdown-menu.arrow-top > .arrow {
    display: none;
    border-width: 11px;
    right: 30px;
    margin-left: -11px;
    border-top-width: 0;
    border-bottom-color: #999;
    border-bottom-color: #fff;
    top: -11px; }
  ul.dropdown-menu.arrow-top > .arrow:after {
    content: " ";
    top: 1px;
    margin-left: -10px;
    border-top-width: 0;
    border-bottom-color: transparent;
    border-width: 10px;
    content: ""; }
  @media (min-width: 768px) {
    ul.dropdown-menu.arrow-top {
      margin-top: 10px;
      right: 50%;
      margin-right: -41px;
      -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, .35);
      box-shadow: 0 0 20px rgba(0, 0, 0, .35); }
      ul.dropdown-menu.arrow-top > .arrow {
        display: block; } }
  ul.dropdown-menu .dropdown-header {
    padding: 15px;
    font-size: 16px;
    color: #333; }
  ul.dropdown-menu .dropdown-footer {
    padding: 15px;
    margin-bottom: -5px;
    color: #333;
    border-bottom-right-radius: 2px;
    border-bottom-left-radius: 2px;
    background-color: transparent; }
  ul.dropdown-menu .dropdown-footer > ul {
    margin: 0;
    padding: 0;
    list-style: none;
    margin-left: -15px;
    margin-right: -15px;
    margin-top: 15px; }
  ul.dropdown-menu .dropdown-footer > ul > li {
    padding: 0; }
  ul.dropdown-menu .dropdown-footer > ul > li {
    display: block; }
  ul.dropdown-menu .dropdown-footer > ul > li > a {
    display: block;
    padding: 5px 15px; }
  ul.dropdown-menu .dropdown-footer > ul > li > a, ul.dropdown-menu .dropdown-footer > ul > li > a:hover, ul.dropdown-menu .dropdown-footer > ul > li > a:active, ul.dropdown-menu .dropdown-footer > ul > li > a:focus {
    color: #333;
    background-color: transparent; }
/* Topbar
 ========================================================================== */
.topbar-notification {
  display: table;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1040; }
  .topbar-notification .notification-content {
    display: table-cell;
    padding: 10px; }
  .topbar-notification .hide-topbar-notification {
    cursor: pointer;
    display: table-cell;
    width: 4em;
    vertical-align: top;
    padding: 5px; }

#topbar-container {
  background-color: #eee; }
  @media (max-width: 767px) {
    #topbar-container .top-mobile-search {
      height: 100%;
      width: 100%;
      top: 49px; } }
  #topbar-container .navbar-topbar {
    -webkit-transition: 300ms ease all;
    -o-transition: 300ms ease all;
    transition: 300ms ease all;
    min-height: 0;
    height: 30px;
    display: none; }
  @media (min-width: 768px) {
    #topbar-container .navbar-topbar {
      display: block; } }
  #topbar-container .navbar-topbar .dropdown-menu {
    min-width: 300px; }
  #topbar-container .navbar-topbar .navbar-nav > li > a {
    font-size: 12px;
    height: 30px;
    padding: 6px 15px;
    color: #9f9f9f;
    background-color: transparent; }
  #topbar-container .navbar-topbar .navbar-nav > li > a:hover, #topbar-container .navbar-topbar .navbar-nav > li > a:focus {
    color: #000;
    background-color: #ddd; }
  #topbar-container .navbar-topbar .navbar-nav > li > a .language-code {
    text-transform: uppercase; }
  #topbar-container .navbar-topbar .navbar-nav .active > a, #topbar-container .navbar-topbar .navbar-nav .active > a:hover, #topbar-container .navbar-topbar .navbar-nav .active > a:focus {
    color: #000;
    background-color: #ddd; }
  #topbar-container .navbar-topbar .navbar-nav .disabled > a, #topbar-container .navbar-topbar .navbar-nav .disabled > a:hover, #topbar-container .navbar-topbar .navbar-nav .disabled > a:focus {
    color: #444;
    background-color: transparent; }
  #topbar-container .navbar-topbar .navbar-nav .open > a {
    background-color: transparent;
    color: #000; }
  #topbar-container .navbar-topbar .navbar-nav .open > a, #topbar-container .navbar-topbar .navbar-nav .open > a:hover, #topbar-container .navbar-topbar .navbar-nav .open > a:focus {
    color: #000;
    background-color: #ddd; }
  #topbar-container .navbar-topbar .navbar-nav .open .dropdown-menu a:focus {
    background-color: #f5f5f5; }
  @media (max-width: 767px) {
      #topbar-container .navbar-topbar .navbar-nav ul.dropdown-menu .dropdown-header {
        border-color: #ccc; }
        #topbar-container .navbar-topbar .navbar-nav ul.dropdown-menu .divider {
          background-color: #ccc; }
        #topbar-container .navbar-topbar .navbar-nav ul.dropdown-menu a {
          color: #9f9f9f; }
          #topbar-container .navbar-topbar .navbar-nav ul.dropdown-menu a:hover, #topbar-container .navbar-topbar .navbar-nav ul.dropdown-menu a:focus {
            color: #000;
            background-color: #ddd; }
        #topbar-container .navbar-topbar .navbar-nav ul.dropdown-menu .active a, #topbar-container .navbar-topbar .navbar-nav ul.dropdown-menu .active a:hover, #topbar-container .navbar-topbar .navbar-nav ul.dropdown-menu .active a:focus {
          color: #000;
          background-color: #ddd; }
        #topbar-container .navbar-topbar .navbar-nav ul.dropdown-menu .disabled a, #topbar-container .navbar-topbar .navbar-nav ul.dropdown-menu .disabled a:hover, #topbar-container .navbar-topbar .navbar-nav ul.dropdown-menu .disabled a:focus {
          color: #444;
          background-color: transparent; } }

@media (max-width: 767px) {
  .search-open #topbar-container .top-mobile-search {
    position: fixed;
    z-index: 2; } }

@media (min-width: 768px) {
  .navbar-topbar > nav > .navbar-nav > li > ul.dropdown-menu {
    display: block !important;
    height: 0;
    overflow: hidden;
    z-index: -1;
    opacity: 0;
    filter: alpha(opacity=0);
    -webkit-transition: 300ms ease-out opacity, 300ms ease-out max-height;
    -o-transition: 300ms ease-out opacity, 300ms ease-out max-height;
    transition: 300ms ease-out opacity, 300ms ease-out max-height; }
    .navbar-topbar > nav > .navbar-nav > li.open > ul.dropdown-menu {
      height: auto;
      overflow: visible;
      z-index: 1000;
      opacity: 1;
      filter: alpha(opacity=100); }
    .navbar-topbar > nav > .navbar-nav > li.transition > ul.dropdown-menu {
      height: auto;
      overflow: visible; } }

@media (min-width: 768px) {
    #header.sticky .navbar-topbar {
      height: 0;
      overflow: hidden !important; }
      #header.transition .navbar-topbar {
        overflow: hidden !important; } }

.gambio-admin a {
  background-color: #d500f9 !important;
  color: #fff !important; }
  .gambio-admin a:hover {
    background-color: #bc00e0 !important; }
/* Categories
 ========================================================================== */
#categories {
  background-color: transparent; }
  #categories:before, #categories:after {
    content: " ";
    display: table; }
  #categories:after {
    clear: both; }

@media (max-width: 767px) {
  #header #categories {
    display: none; } }

.navbar-collapse .navbar-categories {
  overflow: hidden;
  height: 40px;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0; }

  .navbar-collapse .navbar-categories ul.navbar-nav {
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    background-color: #393939; }
  @media (max-width: 768px) {
      .navbar-collapse .navbar-categories ul.navbar-nav {
        margin-top: 0;
        margin-bottom: 0; } }
  @media (min-width: 768px) {
      .navbar-collapse .navbar-categories ul.navbar-nav {
        padding-left: 2px;
        width: 100%; } }
  .navbar-collapse .navbar-categories ul.navbar-nav > li > a {
    font-size: 13px;
    text-transform: uppercase;
    height: 40px;
    padding-top: 12px;
    padding-bottom: 12px; }
  .navbar-collapse .navbar-categories ul.navbar-nav > li > a span.fa {
    display: inline-block;
    text-align: center;
    width: 15px; }
  @media (min-width: 768px) {
          .navbar-collapse .navbar-categories ul.navbar-nav > li.open > a {
            border-top: 2px solid #393939;
            padding-top: 10px;
            color: #337ab7;
            background: #fff;
            border-top-right-radius: 0;
            border-top-left-radius: 0; } }
  .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a {
    height: 40px;
    display: list-item;
    background: #337ab7;
    color: #fff;
    font-size: 13px;
    padding-top: 12px;
    padding-bottom: 12px;
    text-transform: uppercase;
    float: left; }
    .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a:focus, .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a.focus, .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a:hover {
      background-color: #285f8f;
      color: #fff;
      text-decoration: none; }
    .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a:active, .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a.active, .open > .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a.dropdown-toggle {
      background-color: #285f8f;
      color: #fff; }
      .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a:active:hover, .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a.active:hover, .open > .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a.dropdown-toggle:hover, .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a:active:focus, .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a.active:focus, .open > .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a.dropdown-toggle:focus, .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a:active.focus, .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a.active.focus, .open > .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries > a.dropdown-toggle.focus {
        background-color: #204d73; }
    @media (min-width: 768px) {
          .navbar-collapse .navbar-categories ul.navbar-nav > li.custom.custom-entries {
            float: right; } }
  .navbar-collapse .navbar-categories ul.navbar-nav > li.more {
    display: none; }
  @media (min-width: 768px) {
        .navbar-collapse .navbar-categories ul.navbar-nav > li.navbar-topbar-item {
          display: none; } }
  @media (min-width: 768px) {
        .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu {
          background-color: #fff;
          width: 675px; }
          .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li {
            padding: 15px;
            width: 225px;
            float: left; }
            .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li:nth-of-type(3n+2) {
              clear: both; }
            .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > a {
              font-size: 18px;
              border-bottom: 3px solid #fff;
              color: #333;
              padding-left: 0;
              padding-right: 0;
              white-space: normal; }
            .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.open > a {
              background: transparent;
              color: #333; }
            .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.active > a, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li a:hover, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li a:active {
              background: transparent;
              color: #337ab7; }
            .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category {
              width: 100%;
              padding: 0;
              background-color: #eee; }
              .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a {
                color: #333;
                background-image: none;
                border: 0;
                cursor: pointer;
                display: inline-block;
                font-size: 13px;
                font-weight: normal;
                padding: 15px;
                text-align: left;
                touch-action: manipulation;
                vertical-align: middle;
                white-space: nowrap; }
                .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a:after {
                  content: "\e800";
                  font-family: "gm";
                  margin-left: 5px; }
                .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a:focus, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a:active:focus, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a.active:focus, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a.focus, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a:active.focus, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a.active.focus {
                  outline: 5px auto -webkit-focus-ring-color;
                  outline-offset: -2px; }
                .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a:hover, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a:focus, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a.focus {
                  text-decoration: none; }
                .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a:active, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a.active {
                  outline: 0;
                  background-image: none; }
                .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a.disabled, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a[disabled], fieldset[disabled] .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category a {
                  cursor: not-allowed;
                  pointer-events: none;
                  opacity: 0.65;
                  filter: alpha(opacity=65);
                  -webkit-box-shadow: none;
                  box-shadow: none; }
              .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category .close-menu-container {
                float: right;
                padding: 15px; }
                .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li.enter-category .close-menu-container .close-flyout {
                  color: #333;
                  padding: 0;
                  text-align: right; }
            .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > ul {
              background-color: transparent;
              display: block;
              position: relative;
              width: 100%;
              -webkit-box-shadow: none;
              box-shadow: none; }
              .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > ul > li {
                position: relative; }
                .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > ul > li > a {
                  color: #333;
                  padding-left: 0;
                  padding-right: 0;
                  white-space: normal; }
                .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > ul > li.active > a, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > ul > li.open > a, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > ul > li a:hover, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > ul > li a:active {
                  background: transparent;
                  color: #337ab7; }
                .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > ul > li > ul {
                  left: 30px; }
                  .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > ul > li > ul > li > a {
                    color: #333; }
                    .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > ul > li > ul > li.active > a, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > ul > li > ul > li.open > a, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > ul > li > ul > li a:hover, .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > ul > li > ul > li a:active {
                      background: transparent;
                      color: #337ab7; }
                .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > ul > li:hover > a {
                  color: #337ab7; }
                  .navbar-collapse .navbar-categories ul.navbar-nav > li > ul.dropdown-menu > li > ul > li:hover > ul {
                    margin-top: -5px;
                    display: block; }
        .navbar-collapse .navbar-categories ul.navbar-nav > li.dropdown-more > ul.dropdown-menu > li {
          clear: none; }
          .navbar-collapse .navbar-categories ul.navbar-nav > li.dropdown-more > ul.dropdown-menu > li:nth-of-type(3n+1) {
            clear: both; }
          .navbar-collapse .navbar-categories ul.navbar-nav > li.dropdown-more > ul.dropdown-menu > li .enter-category.show-more {
            display: list-item !important; }
            .navbar-collapse .navbar-categories ul.navbar-nav > li.dropdown-more > ul.dropdown-menu > li .enter-category.hidden-more {
              display: none !important; } }
  .navbar-collapse .navbar-categories ul.navbar-nav > li > a {
    padding-top: 17px;
    padding-bottom: 17px;
    height: 50px; }
  @media (min-width: 768px) {
          .navbar-collapse .navbar-categories ul.navbar-nav > li > a {
            padding-top: 12px;
            padding-bottom: 12px;
            height: 40px; } }
  .navbar-collapse .navbar-categories ul.navbar-nav > li > .dropdown-menu, .navbar-collapse .navbar-categories ul.navbar-nav > li.open > .dropdown-menu {
    padding-top: 0;
    padding-bottom: 0; }
    .navbar-collapse .navbar-categories ul.navbar-nav > li > .dropdown-menu > li > a, .navbar-collapse .navbar-categories ul.navbar-nav > li.open > .dropdown-menu > li > a {
      padding-top: 17px;
      padding-bottom: 17px;
      height: 50px; }
      @media (min-width: 768px) {
            .navbar-collapse .navbar-categories ul.navbar-nav > li > .dropdown-menu > li > a, .navbar-collapse .navbar-categories ul.navbar-nav > li.open > .dropdown-menu > li > a {
              padding-top: 3px;
              padding-bottom: 3px;
              height: auto; } }
    .navbar-collapse .navbar-categories ul.navbar-nav > li > .dropdown-menu > li > .dropdown-menu, .navbar-collapse .navbar-categories ul.navbar-nav > li.open > .dropdown-menu > li > .dropdown-menu, .navbar-collapse .navbar-categories ul.navbar-nav > li > .dropdown-menu > li.open > .dropdown-menu, .navbar-collapse .navbar-categories ul.navbar-nav > li.open > .dropdown-menu > li.open > .dropdown-menu {
      padding-top: 0;
      padding-bottom: 0; }
      @media (min-width: 768px) {
              .navbar-collapse .navbar-categories ul.navbar-nav > li > .dropdown-menu > li > .dropdown-menu, .navbar-collapse .navbar-categories ul.navbar-nav > li.open > .dropdown-menu > li > .dropdown-menu, .navbar-collapse .navbar-categories ul.navbar-nav > li > .dropdown-menu > li.open > .dropdown-menu, .navbar-collapse .navbar-categories ul.navbar-nav > li.open > .dropdown-menu > li.open > .dropdown-menu {
                padding-top: 5px;
                padding-bottom: 5px; } }
      .navbar-collapse .navbar-categories ul.navbar-nav > li > .dropdown-menu > li > .dropdown-menu > li > a, .navbar-collapse .navbar-categories ul.navbar-nav > li.open > .dropdown-menu > li > .dropdown-menu > li > a, .navbar-collapse .navbar-categories ul.navbar-nav > li > .dropdown-menu > li.open > .dropdown-menu > li > a, .navbar-collapse .navbar-categories ul.navbar-nav > li.open > .dropdown-menu > li.open > .dropdown-menu > li > a {
        padding-top: 17px;
        padding-bottom: 17px;
        height: 50px;
        padding-left: 40px; }
        @media (min-width: 768px) {
                .navbar-collapse .navbar-categories ul.navbar-nav > li > .dropdown-menu > li > .dropdown-menu > li > a, .navbar-collapse .navbar-categories ul.navbar-nav > li.open > .dropdown-menu > li > .dropdown-menu > li > a, .navbar-collapse .navbar-categories ul.navbar-nav > li > .dropdown-menu > li.open > .dropdown-menu > li > a, .navbar-collapse .navbar-categories ul.navbar-nav > li.open > .dropdown-menu > li.open > .dropdown-menu > li > a {
                  padding-top: 3px;
                  padding-bottom: 3px;
                  padding-left: 0;
                  height: auto; } }
        .navbar-collapse .navbar-categories ul.navbar-nav > li > .dropdown-menu > li > .dropdown-menu > li > .dropdown-menu > li > a, .navbar-collapse .navbar-categories ul.navbar-nav > li.open > .dropdown-menu > li > .dropdown-menu > li > .dropdown-menu > li > a, .navbar-collapse .navbar-categories ul.navbar-nav > li > .dropdown-menu > li.open > .dropdown-menu > li > .dropdown-menu > li > a, .navbar-collapse .navbar-categories ul.navbar-nav > li.open > .dropdown-menu > li.open > .dropdown-menu > li > .dropdown-menu > li > a, .navbar-collapse .navbar-categories ul.navbar-nav > li > .dropdown-menu > li > .dropdown-menu > li.open > .dropdown-menu > li > a, .navbar-collapse .navbar-categories ul.navbar-nav > li.open > .dropdown-menu > li > .dropdown-menu > li.open > .dropdown-menu > li > a, .navbar-collapse .navbar-categories ul.navbar-nav > li > .dropdown-menu > li.open > .dropdown-menu > li.open > .dropdown-menu > li > a, .navbar-collapse .navbar-categories ul.navbar-nav > li.open > .dropdown-menu > li.open > .dropdown-menu > li.open > .dropdown-menu > li > a {
          padding-top: 3px;
          padding-bottom: 3px; }

.navbar-categories > ul {
  position: relative; }
  .navbar-categories > ul > li {
    position: static; }
  .navbar-categories > ul > li > ul.dropdown-menu {
    width: 100% !important;
    left: 2px;
    right: 2px; }
  @media (min-width: 1200px) {
    .navbar-categories > ul > li {
      position: relative; }
      .navbar-categories > ul > li > ul.dropdown-menu {
        width: 675px !important;
        left: 0;
        right: auto; }
      .navbar-categories > ul > li.flyout-left > ul.dropdown-menu {
        left: auto;
        right: 0; } }

.navbar-categories > .navbar-nav li > a:before {
  float: right;
  font-size: 20px;
  content: '\e800';
  /* chevron-right */ }
  .navbar-categories > .navbar-nav li.dropdown:not(.custom):not(.login-off-item) > a:before {
    content: '\e81e';
    /* plus */ }
  .navbar-categories > .navbar-nav li.dropdown:not(.custom):not(.login-off-item).open > a:before {
    content: '\e810';
    /* minus */ }
  .navbar-categories > .navbar-nav li.navbar-topbar-item > a:before, .navbar-categories > .navbar-nav li.navbar-topbar-item.open > a:before {
    content: ''; }
  @media (min-width: 768px) {
    .navbar-categories > .navbar-nav li > a:before, .navbar-categories > .navbar-nav li.dropdown > a:before, .navbar-categories > .navbar-nav li.open > a:before {
      display: none;
      content: '' !important;
      margin: 0;
      width: 0;
      line-height: 0; } }

@media (max-width: 767px) {
  .navbar-collapse .navbar-categories > ul.navbar-nav li > a {
    color: #fff;
    font-weight: bold; }
    .navbar-collapse .navbar-categories > ul.navbar-nav li.open > a, .navbar-collapse .navbar-categories > ul.navbar-nav li.active > a {
      background: #282828;
      color: #fff; }
    .navbar-collapse .navbar-categories > ul.navbar-nav li .dropdown-menu > li > a {
      color: #fff;
      background-color: #393939; }
      .navbar-collapse .navbar-categories > ul.navbar-nav li .dropdown-menu > li.open > a, .navbar-collapse .navbar-categories > ul.navbar-nav li .dropdown-menu > li.active > a, .navbar-collapse .navbar-categories > ul.navbar-nav li .dropdown-menu > li a:hover, .navbar-collapse .navbar-categories > ul.navbar-nav li .dropdown-menu > li a:active {
        background: #282828;
        color: #fff; }
      .navbar-collapse .navbar-categories > ul.navbar-nav li .dropdown-menu > li form {
        padding: 15px 15px 0; }
    .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item {
      padding-left: 15px;
      padding-right: 15px; }
      .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item > a {
        color: #fff;
        text-transform: none;
        border-left: 1px solid #282828;
        border-right: 1px solid #282828;
        border-bottom: 1px solid #282828;
        padding-top: 17px;
        padding-bottom: 17px; }
      .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item > a:hover {
        border: 1px solid #282828; }
      .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item:first-child, .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item.first {
        margin-top: 15px; }
      .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item:first-child > a, .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item.first > a {
        border-top: 1px solid #282828;
        border-top-right-radius: 4px;
        border-top-left-radius: 4px; }
        .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item:first-child > a img, .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item.first > a img {
          vertical-align: top; }
      .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item:last-child {
        margin-bottom: 15px; }
      .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item:last-child > a {
        border-bottom: 1px solid #282828;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px; }
      .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item .dropdown-menu {
        background: #fff; }
      .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item .dropdown-menu > li > a {
        background-color: #fff;
        color: #333; }
      .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item .dropdown-menu .dropdown-header {
        padding: 15px 15px 0; }
      .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item .dropdown-footer ul li a {
        background: none;
        color: #337ab7; }
      .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item.open a.dropdown-toggle {
        border: 1px solid #282828; }
      .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item.open ul.dropdown-menu {
        border: 1px solid #282828;
        -webkit-border-radius: 0;
        -moz-border-radius: 0;
        border-radius: 0; }
        .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item.open ul.dropdown-menu span.disabled {
          padding: 17px 25px; }
        .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item.open ul.dropdown-menu li.divider {
          margin: 0; }
        .navbar-collapse .navbar-categories > ul.navbar-nav li.navbar-topbar-item.open ul.dropdown-menu .dropdown-footer {
          margin-bottom: 0; }
    .navbar-collapse .navbar-categories > ul.navbar-nav ul.level-3 a {
      font-weight: normal; } }

@media (max-width: 767px) {
  .navbar-collapse {
    border-top: 1px solid #e5e5e5 !important; }

  .navbar-collapse .navbar-categories > ul.navbar-nav {
    background-color: #fff; }
    .navbar-collapse .navbar-categories > ul.navbar-nav > li > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > a {
      background: #fff;
      color: #333;
      border-bottom: 1px solid #e5e5e5;
      font-weight: bold; }
      .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open.open > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li a:hover, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open a:hover {
        background-color: #337ab7;
        color: #fff; }
      .navbar-collapse .navbar-categories > ul.navbar-nav > li.active > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open.active > a {
        background-color: #fff;
        color: #337ab7;
        font-weight: bold; }
      .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li.open > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li.open > a {
        background: #fff;
        color: #333;
        border-bottom: 1px solid #e5e5e5; }
        .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li.open > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li.open > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li.open.open > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li.open.open > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li a:hover, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li a:hover, .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li.open a:hover, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li.open a:hover {
          color: #337ab7; }
        .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li.active > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li.active > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li.open.active > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li.open.active > a {
          background-color: #337ab7;
          color: #fff; }
        .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li > ul.dropdown-menu, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li > ul.dropdown-menu {
          border-bottom: 1px solid #e5e5e5; }
        .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li > ul.dropdown-menu > li > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li > ul.dropdown-menu > li > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li > ul.dropdown-menu > li.open > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li > ul.dropdown-menu > li.open > a {
          background: #fff;
          color: #333; }
          .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li > ul.dropdown-menu > li.open > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li > ul.dropdown-menu > li.open > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li > ul.dropdown-menu > li.open.open > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li > ul.dropdown-menu > li.open.open > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li > ul.dropdown-menu > li a:hover, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li > ul.dropdown-menu > li a:hover, .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li > ul.dropdown-menu > li.open a:hover, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li > ul.dropdown-menu > li.open a:hover {
            color: #337ab7; }
          .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li > ul.dropdown-menu > li.active > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li > ul.dropdown-menu > li.active > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li > ul.dropdown-menu > li > ul.dropdown-menu > li.open.active > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open > ul.dropdown-menu > li > ul.dropdown-menu > li.open.active > a {
            background-color: #337ab7;
            color: #fff; }
      .navbar-collapse .navbar-categories > ul.navbar-nav > li .dropdown-footer, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open .dropdown-footer {
        background: none; }
        .navbar-collapse .navbar-categories > ul.navbar-nav > li .dropdown-footer ul li a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open .dropdown-footer ul li a {
          background: none;
          color: #9f9f9f;
          font-weight: normal; }
      .navbar-collapse .navbar-categories > ul.navbar-nav > li.navbar-topbar-item > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open.navbar-topbar-item > a {
        color: #333;
        border: none;
        border-top: 1px solid #ddd;
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
        border-bottom: none;
        background: #fff; }
        .navbar-collapse .navbar-categories > ul.navbar-nav > li.navbar-topbar-item > a:hover, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open.navbar-topbar-item > a:hover {
          background-color: #337ab7;
          color: #fff; }
        .navbar-collapse .navbar-categories > ul.navbar-nav > li.navbar-topbar-item > a:hover, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open.navbar-topbar-item > a:hover, .navbar-collapse .navbar-categories > ul.navbar-nav > li.navbar-topbar-item > a:active, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open.navbar-topbar-item > a:active, .navbar-collapse .navbar-categories > ul.navbar-nav > li.navbar-topbar-item > a:focus, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open.navbar-topbar-item > a:focus, .navbar-collapse .navbar-categories > ul.navbar-nav > li.navbar-topbar-item > a:visited, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open.navbar-topbar-item > a:visited {
          border-top: 1px solid #ddd;
          border-left: 1px solid #ddd;
          border-right: 1px solid #ddd;
          border-bottom: none; }
        .navbar-collapse .navbar-categories > ul.navbar-nav > li.navbar-topbar-item:first-child > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open.navbar-topbar-item:first-child > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.navbar-topbar-item.first > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open.navbar-topbar-item.first > a {
          border-top-color: #ddd; }
        .navbar-collapse .navbar-categories > ul.navbar-nav > li.navbar-topbar-item:last-child > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open.navbar-topbar-item:last-child > a {
          border-bottom-color: #ddd; }
        .navbar-collapse .navbar-categories > ul.navbar-nav > li.navbar-topbar-item.open > a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open.navbar-topbar-item.open > a {
          background: #ddd;
          border: none; }
        .navbar-collapse .navbar-categories > ul.navbar-nav > li.navbar-topbar-item.open > ul.dropdown-menu, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open.navbar-topbar-item.open > ul.dropdown-menu {
          border: 1px solid #ddd;
          border-bottom: none; }
        .navbar-collapse .navbar-categories > ul.navbar-nav > li.navbar-topbar-item.open > ul.dropdown-menu a, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open.navbar-topbar-item.open > ul.dropdown-menu a {
          border-bottom: none; }
        .navbar-collapse .navbar-categories > ul.navbar-nav > li.navbar-topbar-item.open > ul.dropdown-menu .form-group label, .navbar-collapse .navbar-categories > ul.navbar-nav > li.open.navbar-topbar-item.open > ul.dropdown-menu .form-group label {
          color: #333; }
      .navbar-collapse .navbar-categories > ul.navbar-nav > li.custom > a {
        background: #fff !important;
        color: #333 !important;
        font-weight: bold; }
      .navbar-collapse .navbar-categories > ul.navbar-nav > li.custom > a:hover {
        background-color: #337ab7 !important;
        color: #fff !important; }
      .navbar-collapse .navbar-categories > ul.navbar-nav > li.custom.active > a {
        background-color: #337ab7 !important;
        color: #fff !important; } }

@media (max-width: 767px) {
  body.categories-open {
    overflow: hidden; }
    body.categories-open #header {
      height: 100%; }
      body.categories-open #header #categories {
        display: block;
        height: calc(100% - 49px);
        background: #fff; }
        body.categories-open #header #categories .navbar-collapse {
          max-height: 100%;
          border-top: none; }
          body.categories-open #header #categories .navbar-collapse .navbar-categories {
            height: auto; }
    body.categories-open #stage, body.categories-open #wrapper, body.categories-open #footer {
      display: none; } }

@media (min-width: 768px) {
    #header .navbar-categories {
      -webkit-transition: 300ms ease height;
      -o-transition: 300ms ease height;
      transition: 300ms ease height;
      height: 40px !important; }
      #header.sticky .navbar-categories {
        height: 0 !important;
        overflow: hidden !important; }
      #header.transition .navbar-categories {
        overflow: hidden !important; } }

@media (min-width: 768px) {
  .navbar-categories li.enter-category {
    display: none; }

  .navbar-categories li.enter-category.show {
    display: block; }

  body.has-touch .navbar-categories li.enter-category {
    display: block; } }

@media (max-width: 767px) {
  ul.navbar-nav li a .cat-image {
    display: none; } }
/* Bootstrap Header and Logo
 ========================================================================== */
#navbar-brand {
  display: table;
  padding: 0; }
  @media (min-width: 768px) {
  #navbar-brand {
    width: 100%;
    height: 80px; } }
  #navbar-brand a {
    display: table-cell;
    height: 50px;
    line-height: 48px;
    margin-left: 15px;
    max-width: 80px;
    padding-left: 15px;
    vertical-align: middle;
    width: 100%; }
  @media (min-width: 768px) {
    #navbar-brand a {
      height: 60px;
      line-height: 60px;
      margin: 10px 0;
      max-width: unset;
      padding-left: 0; } }
  #navbar-brand a img {
    max-height: 50px;
    -webkit-transition: 300ms ease all;
    -o-transition: 300ms ease all;
    transition: 300ms ease all; }
  @media (min-width: 768px) {
      #navbar-brand a img {
        max-height: 60px; } }

@media (min-width: 768px) {
    #header.sticky #navbar-brand {
      height: 60px; }
      #header.sticky #navbar-brand a {
        height: 40px;
        margin: 0; }
        #header.sticky #navbar-brand a img {
          max-height: 40px; } }
/* Header Search
 ========================================================================== */
@media (max-width: 767px) {
  #header .navbar-search {
    display: none; } }

.navbar-search {
  border-top: none;
  -webkit-transition: 300ms ease all;
  -o-transition: 300ms ease all;
  transition: 300ms ease all; }
  @media (min-width: 768px) {
  .navbar-search {
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px; }
    .navbar-search.collapse {
      padding: 22px 15px;
      margin: 0 0; } }
  @media (min-width: 768px) and (min-width: 768px) {
      .navbar-search {
        float: left;
        width: 41.66667%; } }
  @media (min-width: 768px) and (min-width: 992px) {
      .navbar-search {
        float: left;
        width: 33.33333%; } }
  @media (min-width: 768px) and (min-width: 1200px) {
      .navbar-search {
        float: left;
        width: 33.33333%; } }
  .navbar-search .navbar-search-header {
    margin: 0 15px 15px;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
    font-size: 16px;
    color: #333; }
  @media (min-width: 768px) {
    .navbar-search .navbar-search-header {
      display: none; } }
  .navbar-search .input-group, .navbar-search .input-number {
    margin: 15px 0;
    padding: 0 15px;
    width: 100%; }
  @media (min-width: 768px) {
    .navbar-search .input-group, .navbar-search .input-number {
      margin: 0;
      padding: 0; } }
  @media (max-width: 767px) {
    .navbar-search .input-group, .navbar-search .input-number {
      border-spacing: 0 15px; } }
  .navbar-search .input-group .search-input, .navbar-search .input-number .search-input {
    height: 36px;
    padding: 8px 38px 8px 12px; }
  @media (min-width: 768px) {
      .navbar-search .input-group .search-input, .navbar-search .input-number .search-input {
        border-bottom-right-radius: 6px;
        border-top-right-radius: 6px; } }
  @media (max-width: 767px) {
      .navbar-search .input-group .search-input, .navbar-search .input-number .search-input {
        display: table-header-group; } }
  .navbar-search .input-group .search-input::-ms-clear, .navbar-search .input-number .search-input::-ms-clear {
    display: none; }
  .navbar-search .input-group .form-control-feedback, .navbar-search .input-number .form-control-feedback {
    font-size: 23px;
    top: 1px !important;
    color: #666;
    display: none;
    pointer-events: auto;
    background-color: transparent;
    border: none;
    height: 100%;
    line-height: 100%;
    padding: 0px;
    z-index: 5; }
  @media (min-width: 768px) {
      .navbar-search .input-group .form-control-feedback, .navbar-search .input-number .form-control-feedback {
        display: block; } }
  .navbar-search .input-group .input-group-btn, .navbar-search .input-number .input-group-btn, .navbar-search .input-number .input-number .btn-plus, .input-number .navbar-search .input-number .btn-plus, .navbar-search .input-number .input-number .btn-minus, .input-number .navbar-search .input-number .btn-minus, .navbar-search .input-group .input-number .btn-plus, .input-number .navbar-search .input-group .btn-plus, .navbar-search .input-group .input-number .btn-minus, .input-number .navbar-search .input-group .btn-minus {
    display: block;
    width: auto;
    margin-bottom: 15px; }
  @media (min-width: 768px) {
      .navbar-search .input-group .input-group-btn, .navbar-search .input-number .input-group-btn, .navbar-search .input-number .input-number .btn-plus, .input-number .navbar-search .input-number .btn-plus, .navbar-search .input-number .input-number .btn-minus, .input-number .navbar-search .input-number .btn-minus, .navbar-search .input-group .input-number .btn-plus, .input-number .navbar-search .input-group .btn-plus, .navbar-search .input-group .input-number .btn-minus, .input-number .navbar-search .input-group .btn-minus {
        display: table-cell;
        margin-bottom: 0; } }
  @media (max-width: 767px) {
      .navbar-search .input-group .input-group-btn, .navbar-search .input-number .input-group-btn, .navbar-search .input-number .input-number .btn-plus, .input-number .navbar-search .input-number .btn-plus, .navbar-search .input-number .input-number .btn-minus, .input-number .navbar-search .input-number .btn-minus, .navbar-search .input-group .input-number .btn-plus, .input-number .navbar-search .input-group .btn-plus, .navbar-search .input-group .input-number .btn-minus, .input-number .navbar-search .input-group .btn-minus {
        display: table-footer-group; } }
  .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-group .btn-minus .dropdown-toggle {
    color: #555;
    height: 36px;
    background-image: -webkit-linear-gradient(top, #eee 0%, #dedede 100%);
    background-image: -o-linear-gradient(top, #eee 0%, #dedede 100%);
    background-image: linear-gradient(to bottom, #eee 0%, #dedede 100%);
    background-repeat: repeat-x;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFEEEEEE', endColorstr='#FFDEDEDE', GradientType=0); }
  @media (min-width: 768px) {
        .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-group .btn-minus .dropdown-toggle {
          border-bottom-left-radius: 6px;
          border-top-left-radius: 6px;
          border-bottom-right-radius: 0;
          border-top-right-radius: 0;
          border-color: #ccc;
          border-right: 0;
          padding-left: 0;
          padding-right: 0; } }
  @media (max-width: 1199px) {
        .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .input-group .btn-minus .dropdown-toggle {
          padding-left: 5px;
          padding-right: 5px; } }
  .navbar-search .input-group .input-group-btn .dropdown-menu, .navbar-search .input-number .input-group-btn .dropdown-menu, .navbar-search .input-number .input-number .btn-plus .dropdown-menu, .input-number .navbar-search .input-number .btn-plus .dropdown-menu, .navbar-search .input-number .input-number .btn-minus .dropdown-menu, .input-number .navbar-search .input-number .btn-minus .dropdown-menu, .navbar-search .input-group .input-number .btn-plus .dropdown-menu, .input-number .navbar-search .input-group .btn-plus .dropdown-menu, .navbar-search .input-group .input-number .btn-minus .dropdown-menu, .input-number .navbar-search .input-group .btn-minus .dropdown-menu {
    width: 100%; }
  @media (min-width: 768px) {
        .navbar-search .input-group .input-group-btn .dropdown-menu, .navbar-search .input-number .input-group-btn .dropdown-menu, .navbar-search .input-number .input-number .btn-plus .dropdown-menu, .input-number .navbar-search .input-number .btn-plus .dropdown-menu, .navbar-search .input-number .input-number .btn-minus .dropdown-menu, .input-number .navbar-search .input-number .btn-minus .dropdown-menu, .navbar-search .input-group .input-number .btn-plus .dropdown-menu, .input-number .navbar-search .input-group .btn-plus .dropdown-menu, .navbar-search .input-group .input-number .btn-minus .dropdown-menu, .input-number .navbar-search .input-group .btn-minus .dropdown-menu {
          width: auto; } }
  .navbar-search .navbar-search-footer {
    padding: 15px;
    background: #eee; }
  .navbar-search .navbar-search-footer .btn-default, .navbar-search .navbar-search-footer .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .navbar-search-footer button.ui-priority-secondary {
    background-color: transparent; }
  .navbar-search .navbar-search-footer .btn-block + .btn-block, .navbar-search .navbar-search-footer .input-group .input-group-btn .dropdown-toggle + .btn-block, .navbar-search .navbar-search-footer .input-number .input-group-btn .dropdown-toggle + .btn-block, .navbar-search .navbar-search-footer .input-number .input-number .btn-plus .dropdown-toggle + .btn-block, .navbar-search .navbar-search-footer .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .navbar-search-footer .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .navbar-search-footer .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .navbar-search-footer .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .navbar-search-footer .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .navbar-search-footer .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-number .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .navbar-search .navbar-search-footer .input-number .input-number .btn-plus .dropdown-toggle + .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-number .btn-plus .dropdown-toggle + .btn-block, .navbar-search .navbar-search-footer .input-number .input-number .btn-minus .dropdown-toggle + .btn-block, .navbar-search .navbar-search-footer .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .navbar-search-footer .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .navbar-search-footer .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .navbar-search-footer .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .navbar-search-footer .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .navbar-search-footer .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-number .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .navbar-search .navbar-search-footer .input-number .input-number .btn-minus .dropdown-toggle + .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-number .btn-minus .dropdown-toggle + .btn-block, .navbar-search .navbar-search-footer .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .navbar-search-footer .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .navbar-search-footer .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .navbar-search-footer .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .navbar-search-footer .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .navbar-search-footer .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-number .input-group-btn .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .navbar-search .navbar-search-footer .input-number .input-group-btn .dropdown-toggle + .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-number .btn-plus .dropdown-toggle + .btn-block, .navbar-search .navbar-search-footer .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-group .input-number .btn-plus .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .navbar-search .navbar-search-footer .input-group .input-number .btn-plus .dropdown-toggle + .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-group .btn-plus .dropdown-toggle + .btn-block, .navbar-search .navbar-search-footer .input-group .input-number .btn-minus .dropdown-toggle + .btn-block, .navbar-search .navbar-search-footer .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-group .input-number .btn-minus .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .navbar-search .navbar-search-footer .input-group .input-number .btn-minus .dropdown-toggle + .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-group .btn-minus .dropdown-toggle + .btn-block, .navbar-search .navbar-search-footer .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-group-btn .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-group-btn .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-number .btn-plus .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-number .btn-minus .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-group .btn-plus .dropdown-toggle, .navbar-search .navbar-search-footer .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .input-group .input-group-btn .dropdown-toggle + .navbar-search .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .navbar-search .navbar-search-footer .input-group .input-group-btn .dropdown-toggle + .dropdown-toggle, .navbar-search .input-group .input-group-btn .navbar-search-footer .dropdown-toggle + .btn-block, .navbar-search .navbar-search-footer .btn-block + .input-group .input-group-btn .dropdown-toggle, .navbar-search .navbar-search-footer .btn-block + .input-number .input-group-btn .dropdown-toggle, .navbar-search .navbar-search-footer .btn-block + .input-number .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .btn-block + .input-number .btn-plus .dropdown-toggle, .navbar-search .navbar-search-footer .btn-block + .input-number .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .btn-block + .input-number .btn-minus .dropdown-toggle, .navbar-search .navbar-search-footer .btn-block + .input-group .input-number .btn-plus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .btn-block + .input-group .btn-plus .dropdown-toggle, .navbar-search .navbar-search-footer .btn-block + .input-group .input-number .btn-minus .dropdown-toggle, .input-number .navbar-search .navbar-search-footer .btn-block + .input-group .btn-minus .dropdown-toggle, .navbar-search .input-group .input-group-btn .navbar-search-footer .btn-block + .dropdown-toggle {
    margin-top: 15px; }
  .navbar-search form {
    position: relative; }
  .navbar-search select[name="categories_id"] {
    display: none; }
  .navbar-search .search-result-container {
    position: absolute;
    width: 100%;
    height: 0;
    overflow: hidden;
    background-color: #fff;
    z-index: 2; }
  .navbar-search .search-result-container.open {
    height: auto;
    padding: 5px 0;
    -webkit-box-shadow: 0 12px 18px rgba(0, 0, 0, .35);
    box-shadow: 0 12px 18px rgba(0, 0, 0, .35); }
  .navbar-search .search-result-container #live-search-head, .navbar-search .search-result-container a {
    display: block;
    padding: 5px 15px;
    text-decoration: none;
    color: #333; }
  .navbar-search .search-result-container #live-search-head {
    font-weight: bold; }
  .navbar-search .search-result-container .search-result {
    margin: 0;
    padding: 0;
    list-style: none; }
  .navbar-search .search-result-container .search-result > li {
    padding: 0; }
  .navbar-search .search-result-container .search-result li {
    padding: 5px 15px;
    margin: 5px 0; }
  .navbar-search .search-result-container .search-result li .product-image {
    max-height: 25px;
    max-width: 25px;
    float: left;
    margin: 0 5px; }
  .navbar-search .search-result-container .search-result li .fa-picture-o {
    font-size: 25px; }
  .navbar-search .search-result-container .search-result li.active {
    background-color: #ddd; }
  .navbar-search .search-result-container .search-result li:hover {
    background-color: #eee; }
  @media (max-width: 767px) {
    .navbar-search .search-result-container {
      position: relative; } }
  @media (max-width: 767px) {
    .navbar-search .search-result-container {
      display: none; } }
  .navbar-search .gx-search-input {
    fill: #000;
    height: 21px;
    width: 21px; }

@media (max-width: 767px) {
  body.search-open {
    overflow: hidden; }
    body.search-open #header, body.search-open #header > .inside, body.search-open #header > .inside > .row, body.search-open #header > .inside > .total-box table tr.total, .total-box table body.search-open #header > .inside > tr.total {
      height: 100%; }
      body.search-open #header .navbar-search {
        display: block;
        max-height: 100%;
        height: calc(100% - 49px);
        background: #fff; } }

@media (min-width: 768px) {
    #header.sticky .navbar-search.collapse {
      padding: 12px 15px;
      margin: 0 0;
      height: 60px; } }
/* Header Custom Area for Content Manager Entries
 ========================================================================== */
#header .custom-container {
  -webkit-transition: 300ms ease all;
  -o-transition: 300ms ease all;
  transition: 300ms ease all;
  position: relative;
  min-height: 1px;
  padding-left: 15px;
  padding-right: 15px;
  position: relative;
  min-height: 1px;
  padding-left: 15px;
  padding-right: 15px;
  position: relative;
  min-height: 1px;
  padding-left: 15px;
  padding-right: 15px;
  display: none; }
  @media (min-width: 768px) {
    #header .custom-container {
      float: left;
      width: 0%; } }
  @media (min-width: 992px) {
    #header .custom-container {
      float: left;
      width: 16.66667%; } }
  @media (min-width: 1200px) {
    #header .custom-container {
      float: left;
      width: 25%; } }
  @media (min-width: 768px) {
    #header .custom-container {
      display: inline-block;
      overflow: hidden;
      height: 80px; } }
  @media (min-width: 768px) and (max-width: 991px) {
        #header .custom-container {
          display: none; } }
  #header .custom-container .inside {
    display: table;
    width: 100%;
    height: 100%;
    padding: 0; }
  #header .custom-container .inside p {
    margin: 0;
    display: table-cell;
    vertical-align: middle;
    text-align: center; }
  #header .custom-container .inside p:before, #header .custom-container .inside p:after {
    content: " ";
    display: table; }
  #header .custom-container .inside p:after {
    clear: both; }
  #header .custom-container .inside p img {
    -webkit-transition: 300ms ease all;
    -o-transition: 300ms ease all;
    transition: 300ms ease all;
    display: inline-block;
    max-height: 50px;
    width: auto; }

@media (min-width: 768px) {
    #header.sticky .custom-container {
      height: 60px; } }
/* Shopping-Cart
 ========================================================================== */
#cart-container.navbar-cart {
  display: none;
  position: relative;
  min-height: 1px;
  padding-left: 15px;
  padding-right: 15px;
  position: relative;
  min-height: 1px;
  padding-left: 15px;
  padding-right: 15px;
  position: relative;
  min-height: 1px;
  padding-left: 15px;
  padding-right: 15px;
  -webkit-transition: 300ms ease all;
  -o-transition: 300ms ease all;
  transition: 300ms ease all;
  height: 60px;
  margin: 10px 0;
  padding: 0; }
  @media (min-width: 768px) {
  #cart-container.navbar-cart {
    display: block; } }
  @media (min-width: 768px) {
  #cart-container.navbar-cart {
    float: left;
    width: 33.33333%; } }
  @media (min-width: 992px) {
  #cart-container.navbar-cart {
    float: left;
    width: 25%; } }
  @media (min-width: 1200px) {
  #cart-container.navbar-cart {
    float: left;
    width: 16.66667%; } }
  #cart-container.navbar-cart > ul {
    margin: 0;
    padding: 0;
    list-style: none; }
  #cart-container.navbar-cart > ul > li {
    padding: 0; }
  #cart-container.navbar-cart > ul > li > a.dropdown-toggle {
    -webkit-transition: 300ms ease all;
    -o-transition: 300ms ease all;
    transition: 300ms ease all;
    height: 60px;
    padding: 13px 70px 13px 15px;
    display: block; }
  #cart-container.navbar-cart > ul > li > a.dropdown-toggle .cart {
    color: #333;
    display: block;
    float: right;
    line-height: 15px;
    margin-top: 4px; }
  #cart-container.navbar-cart > ul > li > a.dropdown-toggle .products {
    display: block;
    float: right;
    clear: right;
    font-size: 12px;
    font-weight: bold; }
  #cart-container.navbar-cart > ul > li > a.dropdown-toggle .gx-cart-basket {
    fill: #000;
    height: 30px;
    width: 30px;
    position: absolute;
    right: 26px;
    top: inherit;
    margin-top: 0; }
  #cart-container.navbar-cart > ul > li.open > a.dropdown-toggle {
    color: #337ab7; }
  #cart-container.navbar-cart > ul > li > ul.dropdown-menu {
    width: 300px;
    right: 0;
    left: auto;
    z-index: 1001;
    padding: 0; }
  #cart-container.navbar-cart > ul > li > ul.dropdown-menu .dropdown-header {
    margin-top: 5px; }
  #cart-container.navbar-cart > ul > li > ul.dropdown-menu .dropdown-footer {
    margin-bottom: 0; }
  #cart-container.navbar-cart > ul > li > ul.dropdown-menu.arrow-top {
    margin-right: 0;
    margin-top: 0; }
  #cart-container.navbar-cart > ul > li > ul.dropdown-menu.cart-empty > .cart-dropdown-inside {
    padding: 30px;
    text-align: center; }
  #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside {
    font-size: 12px; }
  #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside ul.products-list {
    margin: 0;
    padding: 0;
    list-style: none;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    border-top: 1px solid #eee; }
    #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside ul.products-list > li {
      padding: 0; }
    #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside ul.products-list > li {
      display: block;
      margin: 0;
      border-top: 1px solid #eee; }
    #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside ul.products-list > li:before, #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside ul.products-list > li:after {
      content: " ";
      display: table; }
    #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside ul.products-list > li:after {
      clear: both; }
    #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside ul.products-list > li:first-of-type {
      border-top: none; }
    #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside ul.products-list > li > a {
      display: block;
      padding: 5px 0;
      color: #333; }
      #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside ul.products-list > li > a:before, #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside ul.products-list > li > a:after {
        content: " ";
        display: table; }
      #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside ul.products-list > li > a:after {
        clear: both; }
      #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside ul.products-list > li > a .img .no-pic {
        font-size: 42px; }
      #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside ul.products-list > li > a .products-vpe {
        color: #999;
        display: inline;
        font-size: 11px;
        padding: 0; }
      #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside ul.products-list > li > a .price {
        font-weight: 700;
        text-align: right; }
  #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside .total {
    font-weight: bold; }
    #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside .total:before, #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside .total:after {
      content: " ";
      display: table; }
    #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside .total:after {
      clear: both; }
    #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside .total .col-xs-8 {
      text-align: right;
      font-size: 18px; }
    #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside .total .col-xs-4 {
      padding-top: 12px;
      text-transform: uppercase; }
  #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside .tax {
    font-size: 11px;
    color: #999;
    padding-bottom: 15px;
    text-align: right; }
    #cart-container.navbar-cart > ul > li > ul.dropdown-menu > .cart-dropdown-inside .tax > a > span {
      display: inline;
      padding: 0; }

.navbar-toogle.cart-icon {
  color: #333; }

.cart-products-count {
  background-color: #337ab7;
  height: 20px;
  width: 20px;
  padding: 1px;
  text-decoration: none;
  display: block;
  color: #fff;
  font-weight: 700;
  font-size: 11px;
  position: absolute;
  left: auto;
  border: 2px solid #fff;
  text-align: center;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  right: 0;
  top: 5px; }
  @media (min-width: 768px) {
  .cart-products-count {
    right: 15px;
    top: 18px; } }

@media (min-width: 768px) {
    #header.sticky .navbar-cart {
      margin: 0 0; }
      #header.sticky .navbar-cart .dropdown-toggle {
        padding-top: 10px;
        padding-bottom: 10px; }
        #header.sticky .navbar-cart .dropdown-toggle .cart {
          color: #333; }
        #header.sticky .navbar-cart .dropdown-toggle .gm-cart-basket {
          color: #333; } }
/* Stage Teaser Slider
 ========================================================================== */
#stage {
  clear: both; }

#stage .swiper-button-prev, #stage .swiper-button-next {
  display: none; }
  @media (min-width: 768px) {
    #stage .swiper-button-prev, #stage .swiper-button-next {
      display: block; } }
  #stage .swiper-button-prev.swiper-button-disabled, #stage .swiper-button-next.swiper-button-disabled {
    display: none !important; }
  #stage .swiper-button-prev {
    left: 30px; }
  #stage .swiper-button-next {
    right: 30px; }
  #stage .swiper-pagination > img.swiper-pagination-bullet {
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    opacity: 1;
    filter: alpha(opacity=100);
    border: 2px solid rgba(255, 255, 255, 0);
    background-color: transparent;
    height: auto;
    width: 50px; }
  @media (min-width: 768px) {
      #stage .swiper-pagination > img.swiper-pagination-bullet {
        width: auto;
        max-width: 120px;
        max-height: 200px; } }
  #stage .swiper-pagination > img.swiper-pagination-bullet.swiper-pagination-bullet-active, #stage .swiper-pagination > img.swiper-pagination-bullet:active {
    border-color: #fff; }
  #stage .swiper-pagination > img.swiper-pagination-bullet:hover {
    border-color: #337ab7; }
  #stage .swiper-pagination > span.swiper-pagination-bullet {
    background-color: #fff;
    opacity: 0.7;
    filter: alpha(opacity=70); }
  #stage .swiper-pagination > span.swiper-pagination-bullet.swiper-pagination-bullet-active, #stage .swiper-pagination > span.swiper-pagination-bullet:active {
    opacity: 1;
    filter: alpha(opacity=100);
    background-color: #337ab7; }
/* Footer
 ========================================================================== */
#footer {
  background-color: #d1d1d1;
  color: #666; }
  #footer h4 {
    color: #666;
    font-size: 16px;
    display: block;
    padding: 8px 0;
    margin: 0;
    font-weight: 700;
    text-transform: uppercase;
    font-size: inherit;
    color: inherit; }
  #footer .footer-header {
    background-color: transparent;
    color: #666;
    min-height: 50px;
    padding-top: 15px;
    padding-bottom: 0; }
  #footer .footer-header .form-group {
    margin-bottom: 0; }
  @media (min-width: 768px) {
        #footer .footer-header .form-group > div {
          padding: 0 7px; } }
  #footer .footer-header .form-group .form-control, #footer .footer-header .form-group .input-text, #footer .footer-header .form-group .btn, #footer .footer-header .form-group .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel #footer .footer-header .form-group button {
    margin-bottom: 15px; }
  #footer .inside {
    padding: 30px 15px 0;
    min-height: 300px;
    border-bottom: 1px solid #bbb; }
  #footer .inside > .row > div, #footer .inside > .total-box table tr.total > div, .total-box table #footer .inside > tr.total > div {
    margin-bottom: 30px; }
  @media (min-width: 768px) {
      #footer .inside > .row > div:nth-of-type(2n + 1), #footer .inside > .total-box table tr.total > div:nth-of-type(2n + 1), .total-box table #footer .inside > tr.total > div:nth-of-type(2n + 1) {
        border-right: 1px solid #bbb; } }
  @media (min-width: 1200px) {
      #footer .inside > .row > div:nth-of-type(2n + 2), #footer .inside > .total-box table tr.total > div:nth-of-type(2n + 2), .total-box table #footer .inside > tr.total > div:nth-of-type(2n + 2) {
        border-right: 1px solid #bbb; }
      #footer .inside > .row > div:last-of-type, #footer .inside > .total-box table tr.total > div:last-of-type, .total-box table #footer .inside > tr.total > div:last-of-type {
        border-right-color: transparent; } }
  @media (min-width: 768px) {
        #footer .inside .row .footer-col-1, #footer .inside .total-box table tr.total .footer-col-1, .total-box table #footer .inside tr.total .footer-col-1, #footer .inside .row .footer-col-2, #footer .inside .total-box table tr.total .footer-col-2, .total-box table #footer .inside tr.total .footer-col-2, #footer .inside .row .footer-col-3, #footer .inside .total-box table tr.total .footer-col-3, .total-box table #footer .inside tr.total .footer-col-3, #footer .inside .row .footer-col-4, #footer .inside .total-box table tr.total .footer-col-4, .total-box table #footer .inside tr.total .footer-col-4 {
          height: 400px; } }
  #footer .inside .row .footer-col-1 p, #footer .inside .total-box table tr.total .footer-col-1 p, .total-box table #footer .inside tr.total .footer-col-1 p, #footer .inside .row .footer-col-2 p, #footer .inside .total-box table tr.total .footer-col-2 p, .total-box table #footer .inside tr.total .footer-col-2 p, #footer .inside .row .footer-col-3 p, #footer .inside .total-box table tr.total .footer-col-3 p, .total-box table #footer .inside tr.total .footer-col-3 p, #footer .inside .row .footer-col-4 p, #footer .inside .total-box table tr.total .footer-col-4 p, .total-box table #footer .inside tr.total .footer-col-4 p {
    line-height: 2.3; }
  #footer .inside .row .footer-col-1 a, #footer .inside .total-box table tr.total .footer-col-1 a, .total-box table #footer .inside tr.total .footer-col-1 a, #footer .inside .row .footer-col-2 a, #footer .inside .total-box table tr.total .footer-col-2 a, .total-box table #footer .inside tr.total .footer-col-2 a, #footer .inside .row .footer-col-3 a, #footer .inside .total-box table tr.total .footer-col-3 a, .total-box table #footer .inside tr.total .footer-col-3 a, #footer .inside .row .footer-col-4 a, #footer .inside .total-box table tr.total .footer-col-4 a, .total-box table #footer .inside tr.total .footer-col-4 a {
    color: #666; }
  #footer .inside .row .footer-col-1 a:hover, #footer .inside .total-box table tr.total .footer-col-1 a:hover, .total-box table #footer .inside tr.total .footer-col-1 a:hover, #footer .inside .row .footer-col-2 a:hover, #footer .inside .total-box table tr.total .footer-col-2 a:hover, .total-box table #footer .inside tr.total .footer-col-2 a:hover, #footer .inside .row .footer-col-3 a:hover, #footer .inside .total-box table tr.total .footer-col-3 a:hover, .total-box table #footer .inside tr.total .footer-col-3 a:hover, #footer .inside .row .footer-col-4 a:hover, #footer .inside .total-box table tr.total .footer-col-4 a:hover, .total-box table #footer .inside tr.total .footer-col-4 a:hover {
    color: #333; }
  #footer .inside .row .footer-col-1 .social-media-icons, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons, #footer .inside .row .footer-col-2 .social-media-icons, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons, #footer .inside .row .footer-col-3 .social-media-icons, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons, #footer .inside .row .footer-col-4 .social-media-icons, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons {
    position: absolute;
    list-style: none;
    padding: 0;
    margin: 0;
    top: -50px; }
  #footer .inside .row .footer-col-1 .social-media-icons > li, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li, #footer .inside .row .footer-col-2 .social-media-icons > li, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li, #footer .inside .row .footer-col-3 .social-media-icons > li, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li, #footer .inside .row .footer-col-4 .social-media-icons > li, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li {
    display: block;
    float: left;
    padding-left: 0;
    padding-right: 10px; }
    #footer .inside .row .footer-col-1 .social-media-icons > li a, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a, #footer .inside .row .footer-col-2 .social-media-icons > li a, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a, #footer .inside .row .footer-col-3 .social-media-icons > li a, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a, #footer .inside .row .footer-col-4 .social-media-icons > li a, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a {
      display: table-cell;
      vertical-align: middle;
      text-align: center;
      width: 40px;
      height: 40px;
      background: #000;
      color: #fff;
      font-size: 22px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%; }
    #footer .inside .row .footer-col-1 .social-media-icons > li a.facebook, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.facebook, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.facebook, #footer .inside .row .footer-col-2 .social-media-icons > li a.facebook, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.facebook, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.facebook, #footer .inside .row .footer-col-3 .social-media-icons > li a.facebook, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.facebook, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.facebook, #footer .inside .row .footer-col-4 .social-media-icons > li a.facebook, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.facebook, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.facebook {
      background-color: #3b5998; }
      #footer .inside .row .footer-col-1 .social-media-icons > li a.facebook:hover, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.facebook:hover, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.facebook:hover, #footer .inside .row .footer-col-2 .social-media-icons > li a.facebook:hover, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.facebook:hover, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.facebook:hover, #footer .inside .row .footer-col-3 .social-media-icons > li a.facebook:hover, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.facebook:hover, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.facebook:hover, #footer .inside .row .footer-col-4 .social-media-icons > li a.facebook:hover, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.facebook:hover, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.facebook:hover {
        background: #fff;
        color: #3b5998; }
    #footer .inside .row .footer-col-1 .social-media-icons > li a.twitter, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.twitter, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.twitter, #footer .inside .row .footer-col-2 .social-media-icons > li a.twitter, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.twitter, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.twitter, #footer .inside .row .footer-col-3 .social-media-icons > li a.twitter, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.twitter, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.twitter, #footer .inside .row .footer-col-4 .social-media-icons > li a.twitter, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.twitter, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.twitter {
      background-color: #00aced; }
      #footer .inside .row .footer-col-1 .social-media-icons > li a.twitter:hover, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.twitter:hover, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.twitter:hover, #footer .inside .row .footer-col-2 .social-media-icons > li a.twitter:hover, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.twitter:hover, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.twitter:hover, #footer .inside .row .footer-col-3 .social-media-icons > li a.twitter:hover, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.twitter:hover, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.twitter:hover, #footer .inside .row .footer-col-4 .social-media-icons > li a.twitter:hover, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.twitter:hover, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.twitter:hover {
        background: #fff;
        color: #00aced; }
    #footer .inside .row .footer-col-1 .social-media-icons > li a.instagram, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.instagram, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.instagram, #footer .inside .row .footer-col-2 .social-media-icons > li a.instagram, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.instagram, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.instagram, #footer .inside .row .footer-col-3 .social-media-icons > li a.instagram, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.instagram, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.instagram, #footer .inside .row .footer-col-4 .social-media-icons > li a.instagram, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.instagram, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.instagram {
      background-color: #517fa4; }
      #footer .inside .row .footer-col-1 .social-media-icons > li a.instagram:hover, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.instagram:hover, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.instagram:hover, #footer .inside .row .footer-col-2 .social-media-icons > li a.instagram:hover, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.instagram:hover, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.instagram:hover, #footer .inside .row .footer-col-3 .social-media-icons > li a.instagram:hover, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.instagram:hover, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.instagram:hover, #footer .inside .row .footer-col-4 .social-media-icons > li a.instagram:hover, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.instagram:hover, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.instagram:hover {
        background: #fff;
        color: #517fa4; }
    #footer .inside .row .footer-col-1 .social-media-icons > li a.youtube, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.youtube, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.youtube, #footer .inside .row .footer-col-2 .social-media-icons > li a.youtube, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.youtube, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.youtube, #footer .inside .row .footer-col-3 .social-media-icons > li a.youtube, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.youtube, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.youtube, #footer .inside .row .footer-col-4 .social-media-icons > li a.youtube, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.youtube, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.youtube {
      background-color: #b00; }
      #footer .inside .row .footer-col-1 .social-media-icons > li a.youtube:hover, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.youtube:hover, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.youtube:hover, #footer .inside .row .footer-col-2 .social-media-icons > li a.youtube:hover, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.youtube:hover, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.youtube:hover, #footer .inside .row .footer-col-3 .social-media-icons > li a.youtube:hover, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.youtube:hover, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.youtube:hover, #footer .inside .row .footer-col-4 .social-media-icons > li a.youtube:hover, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.youtube:hover, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.youtube:hover {
        background: #fff;
        color: #b00; }
    #footer .inside .row .footer-col-1 .social-media-icons > li a.pinterest, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.pinterest, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.pinterest, #footer .inside .row .footer-col-2 .social-media-icons > li a.pinterest, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.pinterest, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.pinterest, #footer .inside .row .footer-col-3 .social-media-icons > li a.pinterest, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.pinterest, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.pinterest, #footer .inside .row .footer-col-4 .social-media-icons > li a.pinterest, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.pinterest, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.pinterest {
      background-color: #cb2027; }
      #footer .inside .row .footer-col-1 .social-media-icons > li a.pinterest:hover, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.pinterest:hover, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.pinterest:hover, #footer .inside .row .footer-col-2 .social-media-icons > li a.pinterest:hover, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.pinterest:hover, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.pinterest:hover, #footer .inside .row .footer-col-3 .social-media-icons > li a.pinterest:hover, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.pinterest:hover, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.pinterest:hover, #footer .inside .row .footer-col-4 .social-media-icons > li a.pinterest:hover, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.pinterest:hover, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.pinterest:hover {
        background: #fff;
        color: #cb2027; }
    #footer .inside .row .footer-col-1 .social-media-icons > li a.linkedin, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.linkedin, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.linkedin, #footer .inside .row .footer-col-2 .social-media-icons > li a.linkedin, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.linkedin, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.linkedin, #footer .inside .row .footer-col-3 .social-media-icons > li a.linkedin, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.linkedin, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.linkedin, #footer .inside .row .footer-col-4 .social-media-icons > li a.linkedin, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.linkedin, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.linkedin {
      background-color: #007bb6; }
      #footer .inside .row .footer-col-1 .social-media-icons > li a.linkedin:hover, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.linkedin:hover, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.linkedin:hover, #footer .inside .row .footer-col-2 .social-media-icons > li a.linkedin:hover, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.linkedin:hover, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.linkedin:hover, #footer .inside .row .footer-col-3 .social-media-icons > li a.linkedin:hover, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.linkedin:hover, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.linkedin:hover, #footer .inside .row .footer-col-4 .social-media-icons > li a.linkedin:hover, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.linkedin:hover, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.linkedin:hover {
        background: #fff;
        color: #007bb6; }
    #footer .inside .row .footer-col-1 .social-media-icons > li a.vimeo, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.vimeo, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.vimeo, #footer .inside .row .footer-col-2 .social-media-icons > li a.vimeo, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.vimeo, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.vimeo, #footer .inside .row .footer-col-3 .social-media-icons > li a.vimeo, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.vimeo, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.vimeo, #footer .inside .row .footer-col-4 .social-media-icons > li a.vimeo, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.vimeo, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.vimeo {
      background-color: #aad450; }
      #footer .inside .row .footer-col-1 .social-media-icons > li a.vimeo:hover, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.vimeo:hover, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.vimeo:hover, #footer .inside .row .footer-col-2 .social-media-icons > li a.vimeo:hover, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.vimeo:hover, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.vimeo:hover, #footer .inside .row .footer-col-3 .social-media-icons > li a.vimeo:hover, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.vimeo:hover, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.vimeo:hover, #footer .inside .row .footer-col-4 .social-media-icons > li a.vimeo:hover, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.vimeo:hover, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.vimeo:hover {
        background: #fff;
        color: #aad450; }
    #footer .inside .row .footer-col-1 .social-media-icons > li a.tumblr, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.tumblr, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.tumblr, #footer .inside .row .footer-col-2 .social-media-icons > li a.tumblr, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.tumblr, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.tumblr, #footer .inside .row .footer-col-3 .social-media-icons > li a.tumblr, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.tumblr, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.tumblr, #footer .inside .row .footer-col-4 .social-media-icons > li a.tumblr, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.tumblr, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.tumblr {
      background-color: #32506d; }
      #footer .inside .row .footer-col-1 .social-media-icons > li a.tumblr:hover, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.tumblr:hover, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.tumblr:hover, #footer .inside .row .footer-col-2 .social-media-icons > li a.tumblr:hover, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.tumblr:hover, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.tumblr:hover, #footer .inside .row .footer-col-3 .social-media-icons > li a.tumblr:hover, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.tumblr:hover, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.tumblr:hover, #footer .inside .row .footer-col-4 .social-media-icons > li a.tumblr:hover, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.tumblr:hover, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.tumblr:hover {
        background: #fff;
        color: #32506d; }
    #footer .inside .row .footer-col-1 .social-media-icons > li a.flickr, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.flickr, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.flickr, #footer .inside .row .footer-col-2 .social-media-icons > li a.flickr, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.flickr, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.flickr, #footer .inside .row .footer-col-3 .social-media-icons > li a.flickr, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.flickr, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.flickr, #footer .inside .row .footer-col-4 .social-media-icons > li a.flickr, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.flickr, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.flickr {
      background-color: #ff0084; }
      #footer .inside .row .footer-col-1 .social-media-icons > li a.flickr:hover, #footer .inside .total-box table tr.total .footer-col-1 .social-media-icons > li a.flickr:hover, .total-box table #footer .inside tr.total .footer-col-1 .social-media-icons > li a.flickr:hover, #footer .inside .row .footer-col-2 .social-media-icons > li a.flickr:hover, #footer .inside .total-box table tr.total .footer-col-2 .social-media-icons > li a.flickr:hover, .total-box table #footer .inside tr.total .footer-col-2 .social-media-icons > li a.flickr:hover, #footer .inside .row .footer-col-3 .social-media-icons > li a.flickr:hover, #footer .inside .total-box table tr.total .footer-col-3 .social-media-icons > li a.flickr:hover, .total-box table #footer .inside tr.total .footer-col-3 .social-media-icons > li a.flickr:hover, #footer .inside .row .footer-col-4 .social-media-icons > li a.flickr:hover, #footer .inside .total-box table tr.total .footer-col-4 .social-media-icons > li a.flickr:hover, .total-box table #footer .inside tr.total .footer-col-4 .social-media-icons > li a.flickr:hover {
        background: #fff;
        color: #ff0084; }
  #footer .inside .row .footer-col-1, #footer .inside .total-box table tr.total .footer-col-1, .total-box table #footer .inside tr.total .footer-col-1 {
    position: relative;
    float: left;
    width: 100%;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px; }
  @media (min-width: 768px) {
        #footer .inside .row .footer-col-1, #footer .inside .total-box table tr.total .footer-col-1, .total-box table #footer .inside tr.total .footer-col-1 {
          min-height: 300px; } }
  @media (min-width: 768px) {
        #footer .inside .row .footer-col-1, #footer .inside .total-box table tr.total .footer-col-1, .total-box table #footer .inside tr.total .footer-col-1 {
          float: left;
          width: 50%; } }
  @media (min-width: 1200px) {
        #footer .inside .row .footer-col-1, #footer .inside .total-box table tr.total .footer-col-1, .total-box table #footer .inside tr.total .footer-col-1 {
          float: left;
          width: 25%; } }
  #footer .inside .row .footer-col-2, #footer .inside .total-box table tr.total .footer-col-2, .total-box table #footer .inside tr.total .footer-col-2 {
    position: relative;
    float: left;
    width: 100%;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px; }
  @media (min-width: 768px) {
        #footer .inside .row .footer-col-2, #footer .inside .total-box table tr.total .footer-col-2, .total-box table #footer .inside tr.total .footer-col-2 {
          min-height: 300px; } }
  @media (min-width: 768px) {
        #footer .inside .row .footer-col-2, #footer .inside .total-box table tr.total .footer-col-2, .total-box table #footer .inside tr.total .footer-col-2 {
          float: left;
          width: 50%; } }
  @media (min-width: 1200px) {
        #footer .inside .row .footer-col-2, #footer .inside .total-box table tr.total .footer-col-2, .total-box table #footer .inside tr.total .footer-col-2 {
          float: left;
          width: 25%; } }
  #footer .inside .row .footer-col-3, #footer .inside .total-box table tr.total .footer-col-3, .total-box table #footer .inside tr.total .footer-col-3 {
    position: relative;
    float: left;
    width: 100%;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px; }
  @media (min-width: 768px) {
        #footer .inside .row .footer-col-3, #footer .inside .total-box table tr.total .footer-col-3, .total-box table #footer .inside tr.total .footer-col-3 {
          min-height: 300px; } }
  @media (min-width: 768px) {
        #footer .inside .row .footer-col-3, #footer .inside .total-box table tr.total .footer-col-3, .total-box table #footer .inside tr.total .footer-col-3 {
          float: left;
          width: 50%; } }
  @media (min-width: 1200px) {
        #footer .inside .row .footer-col-3, #footer .inside .total-box table tr.total .footer-col-3, .total-box table #footer .inside tr.total .footer-col-3 {
          float: left;
          width: 25%; } }
  #footer .inside .row .footer-col-4, #footer .inside .total-box table tr.total .footer-col-4, .total-box table #footer .inside tr.total .footer-col-4 {
    position: relative;
    float: left;
    width: 100%;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px; }
  @media (min-width: 768px) {
        #footer .inside .row .footer-col-4, #footer .inside .total-box table tr.total .footer-col-4, .total-box table #footer .inside tr.total .footer-col-4 {
          min-height: 300px; } }
  @media (min-width: 768px) {
        #footer .inside .row .footer-col-4, #footer .inside .total-box table tr.total .footer-col-4, .total-box table #footer .inside tr.total .footer-col-4 {
          float: left;
          width: 50%; } }
  @media (min-width: 1200px) {
        #footer .inside .row .footer-col-4, #footer .inside .total-box table tr.total .footer-col-4, .total-box table #footer .inside tr.total .footer-col-4 {
          float: left;
          width: 25%; } }
  #footer .footer-bottom {
    text-align: center;
    padding-top: 15px;
    min-height: 50px;
    clear: both; }
  #footer .footer-bottom a {
    color: #666; }
  #footer .footer-bottom a:hover {
    color: #333; }
  #footer .panel {
    background: transparent;
    border: none;
    -webkit-box-shadow: none;
    box-shadow: none; }
  #footer .panel .panel-heading, #footer .panel .panel-body {
    border: none;
    background: transparent;
    -webkit-box-shadow: none;
    box-shadow: none;
    color: #666;
    padding: 0; }
  #footer .panel .panel-heading {
    text-transform: uppercase;
    padding: 0;
    font-size: 13px;
    min-height: 30px; }
  #footer .panel .panel-heading .panel-title {
    font-weight: 700;
    text-transform: uppercase;
    font-size: inherit;
    color: inherit; }
  #footer .panel .panel-body ul, #footer .panel .panel-body li {
    list-style: none;
    line-height: 2.3;
    margin: 0;
    padding: 0; }
  #footer .panel .panel-body ul a, #footer .panel .panel-body li a {
    color: #666;
    display: block;
    padding: 0; }
  #footer .panel .panel-body ul a:focus, #footer .panel .panel-body li a:focus, #footer .panel .panel-body ul a:active, #footer .panel .panel-body li a:active, #footer .panel .panel-body ul a:hover, #footer .panel .panel-body li a:hover {
    background-color: transparent;
    text-decoration: underline; }
  #footer .panel .panel-body li {
    padding: 2px 0; }
  #footer .panel .panel-body li:first-child {
    padding-top: 0; }
  #footer .nav > li > a:hover {
    background: transparent;
    color: #333;
    text-decoration: underline; }
/* Product Info
 ========================================================================== */
.product-info .product-info-stage {
  height: 380px;
  margin-bottom: 30px; }
  .product-info .product-info-stage.centered {
    padding: 0 15px; }
  .product-info .product-info-stage .ribbon-manufacturer {
    position: absolute;
    top: 0px;
    right: 55px;
    left: auto;
    z-index: 2; }
  @media (min-width: 992px) {
    .product-info .product-info-stage {
      height: 450px;
      padding-left: 130px; } }
  .product-info .product-info-title-mobile > span {
    color: #333;
    margin-top: 9px;
    margin-bottom: 18px;
    display: block;
    font-size: 16px; }
  .product-info .product-info-details {
    z-index: 2;
    color: #333;
    min-height: 300px;
    margin-bottom: 30px;
    padding: 15px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    background-color: #eee;
    border-width: 0;
    border-style: none;
    border-color: transparent; }
  @media (min-width: 992px) {
    .product-info .product-info-details {
      min-height: 450px;
      position: absolute;
      top: -38px;
      right: 0; } }
  .product-info .product-info-details .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, .7) url("../../images/loading.gif") 50% 50% no-repeat;
    z-index: 1;
    display: none; }
  .loading .product-info .product-info-details .loading-overlay {
    display: block; }
  .product-info .product-info-details.loading .loading-overlay {
    display: block; }
  .product-info .product-info-details .product-info-title-desktop {
    color: #333;
    border-bottom: 1px solid #d5d5d5;
    margin-bottom: 15px; }
  .product-info .product-info-details .dl-horizontal a.js-open-modal.text-small, .product-info .product-info-details dl a.js-open-modal.text-small {
    white-space: nowrap; }
  .product-info .product-info-details .form-horizontal fieldset .form-group label.control-label {
    word-wrap: break-word; }
  .product-info .product-info-details .ribbon-spacing {
    min-height: 6px; }
  .product-info .product-info-details .blockpricing-heading {
    font-size: 16px; }
  .product-info .product-info-description {
    margin-bottom: 30px;
    clear: both;
    margin-top: 30px; }
  @media (min-width: 992px) {
    .product-info .product-info-description {
      clear: left; } }
  .product-info .product-info-description .nav-tabs-container > .nav.nav-tabs {
    height: auto; }
  .product-info .product-info-description .nav-tabs-container > .nav.nav-tabs li {
    position: relative;
    top: 3px; }
  .product-info .products_info_available {
    margin-bottom: 30px;
    color: #999; }
  .product-info .paypal-ec-button-container {
    text-align: center;
    margin: 8px 0; }
  .product-info .paypal-ec-button-container .paypal-ec-button {
    cursor: pointer; }

.product-info-image, .product-info-layer-image {
  margin-bottom: 5px; }
  .product-info-image .product-info-image-inside, .product-info-layer-image .product-info-image-inside {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer; }
  .product-info-image .product-info-image-inside .swiper-slide, .product-info-layer-image .product-info-image-inside .swiper-slide {
    content: " ";
    display: table;
    table-layout: fixed;
    background-color: transparent; }
  .product-info-image .product-info-image-inside .swiper-slide .swiper-slide-inside, .product-info-layer-image .product-info-image-inside .swiper-slide .swiper-slide-inside {
    display: table-cell;
    float: none;
    vertical-align: middle;
    text-align: center;
    width: 100%; }
  .product-info-image .product-info-image-inside .swiper-slide .swiper-slide-inside img, .product-info-layer-image .product-info-image-inside .swiper-slide .swiper-slide-inside img {
    display: inline-block;
    max-height: 100%;
    width: auto; }

.product-info-image {
  height: 300px; }
  @media (min-width: 992px) {
  .product-info-image {
    height: 450px; } }
  .product-info-image .swiper-slide-inside {
    height: 300px; }
  @media (min-width: 992px) {
    .product-info-image .swiper-slide-inside {
      height: 450px; } }

.product-info-layer-image {
  height: 300px; }
  @media (min-width: 992px) {
  .product-info-layer-image {
    height: 450px; } }
  .product-info-layer-image .swiper-slide-inside {
    height: 300px; }
  @media (min-width: 992px) {
    .product-info-layer-image .swiper-slide-inside {
      height: 450px; } }

.product-info-image .swiper-button-prev, .product-info-image .swiper-button-next {
  display: none; }

@media (min-width: 992px) {
  .product-info-image.has-zoom img[data-magnifier-src] {
    cursor: url("../../images/magnifier.cur"), auto; } }

.product-info-thumbnails.product-info-layer-thumbnails, .product-info-thumbnails-mobile.product-info-layer-thumbnails, .product-info-layer-thumbnails.product-info-layer-thumbnails {
  position: relative; }
  .product-info-thumbnails #product-info-layer-thumbnails .swiper-slide-inside, .product-info-thumbnails-mobile #product-info-layer-thumbnails .swiper-slide-inside, .product-info-layer-thumbnails #product-info-layer-thumbnails .swiper-slide-inside {
    display: table; }
  .product-info-thumbnails #product-info-layer-thumbnails .swiper-slide-inside .align-middle, .product-info-thumbnails-mobile #product-info-layer-thumbnails .swiper-slide-inside .align-middle, .product-info-layer-thumbnails #product-info-layer-thumbnails .swiper-slide-inside .align-middle {
    display: table-cell;
    vertical-align: middle; }
  .product-info-thumbnails #product-info-layer-thumbnails .swiper-slide-inside .align-middle img, .product-info-thumbnails-mobile #product-info-layer-thumbnails .swiper-slide-inside .align-middle img, .product-info-layer-thumbnails #product-info-layer-thumbnails .swiper-slide-inside .align-middle img {
    margin: 0 auto; }
  .product-info-thumbnails .swiper-button-prev, .product-info-thumbnails-mobile .swiper-button-prev, .product-info-layer-thumbnails .swiper-button-prev, .product-info-thumbnails .swiper-button-next, .product-info-thumbnails-mobile .swiper-button-next, .product-info-layer-thumbnails .swiper-button-next {
    width: 40px;
    height: 40px; }
  @media (max-width: 991px) {
    .product-info-thumbnails .swiper-button-prev, .product-info-thumbnails-mobile .swiper-button-prev, .product-info-layer-thumbnails .swiper-button-prev, .product-info-thumbnails .swiper-button-next, .product-info-thumbnails-mobile .swiper-button-next, .product-info-layer-thumbnails .swiper-button-next {
      width: 25px !important; } }
  .product-info-thumbnails .swiper-button-prev:before, .product-info-thumbnails-mobile .swiper-button-prev:before, .product-info-layer-thumbnails .swiper-button-prev:before, .product-info-thumbnails .swiper-button-next:before, .product-info-thumbnails-mobile .swiper-button-next:before, .product-info-layer-thumbnails .swiper-button-next:before {
    font-size: 40px; }
  .product-info-thumbnails .swiper-button-prev, .product-info-thumbnails-mobile .swiper-button-prev, .product-info-layer-thumbnails .swiper-button-prev {
    margin-left: -20px; }
  .product-info-thumbnails .swiper-slide, .product-info-thumbnails-mobile .swiper-slide, .product-info-layer-thumbnails .swiper-slide {
    padding: 0;
    text-align: center;
    width: 94px;
    cursor: pointer;
    overflow: hidden; }
  .product-info-thumbnails .swiper-slide.active, .product-info-thumbnails-mobile .swiper-slide.active, .product-info-layer-thumbnails .swiper-slide.active, .product-info-thumbnails .swiper-slide:hover, .product-info-thumbnails-mobile .swiper-slide:hover, .product-info-layer-thumbnails .swiper-slide:hover {
    border-color: #337ab7; }
  .product-info-thumbnails .swiper-slide .swiper-slide-inside, .product-info-thumbnails-mobile .swiper-slide .swiper-slide-inside, .product-info-layer-thumbnails .swiper-slide .swiper-slide-inside {
    height: 100%;
    width: 100%; }
  .product-info-thumbnails .swiper-slide .swiper-slide-inside.vertical, .product-info-thumbnails-mobile .swiper-slide .swiper-slide-inside.vertical, .product-info-layer-thumbnails .swiper-slide .swiper-slide-inside.vertical {
    display: table; }
  .product-info-thumbnails .swiper-slide .swiper-slide-inside.vertical .align-middle, .product-info-thumbnails-mobile .swiper-slide .swiper-slide-inside.vertical .align-middle, .product-info-layer-thumbnails .swiper-slide .swiper-slide-inside.vertical .align-middle {
    display: table-cell;
    vertical-align: middle;
    padding-bottom: 2px; }
  .product-info-thumbnails .swiper-slide .swiper-slide-inside.vertical .align-middle img, .product-info-thumbnails-mobile .swiper-slide .swiper-slide-inside.vertical .align-middle img, .product-info-layer-thumbnails .swiper-slide .swiper-slide-inside.vertical .align-middle img {
    margin: 0 auto; }
  .product-info-thumbnails .swiper-slide .swiper-slide-inside img, .product-info-thumbnails-mobile .swiper-slide .swiper-slide-inside img, .product-info-layer-thumbnails .swiper-slide .swiper-slide-inside img {
    max-height: 100%;
    max-width: 100%;
    width: auto; }

.product-info-thumbnails {
  position: absolute;
  left: 0;
  top: 0;
  width: 130px;
  height: 450px;
  padding: 0 15px; }
  .product-info-thumbnails #product_thumbnail_swiper {
    height: 370px;
    margin-top: 40px; }
  .product-info-thumbnails.swiper-vertical .swiper-container-vertical {
    max-width: 94px; }
  .product-info-thumbnails.swiper-vertical .swiper-button-prev {
    top: 0;
    margin-left: -20px; }
  .product-info-thumbnails.swiper-vertical .swiper-button-next {
    bottom: -15px;
    margin-left: -20px; }

.product-info-thumbnails-mobile, .product-info-layer-thumbnails, .product-info-thumbnails-mobile #product_thumbnail_swiper_mobile, .product-info-layer-thumbnails #product_thumbnail_swiper_mobile {
  height: 80px; }
  .product-info-thumbnails-mobile .swiper-slide-inside, .product-info-layer-thumbnails .swiper-slide-inside, .product-info-thumbnails-mobile #product_thumbnail_swiper_mobile .swiper-slide-inside, .product-info-layer-thumbnails #product_thumbnail_swiper_mobile .swiper-slide-inside {
    display: table; }
  .product-info-thumbnails-mobile .swiper-slide-inside .align-vertical, .product-info-layer-thumbnails .swiper-slide-inside .align-vertical, .product-info-thumbnails-mobile #product_thumbnail_swiper_mobile .swiper-slide-inside .align-vertical, .product-info-layer-thumbnails #product_thumbnail_swiper_mobile .swiper-slide-inside .align-vertical {
    display: table-cell;
    height: 80px;
    padding-bottom: 2px;
    vertical-align: middle; }
  @media (min-width: 768px) {
  .product-info-thumbnails-mobile, .product-info-layer-thumbnails {
    padding: 0 40px; } }
  .product-info-thumbnails-mobile .swiper-button-prev, .product-info-layer-thumbnails .swiper-button-prev {
    left: 0;
    margin-top: -20px;
    width: 40px !important; }
  .product-info-thumbnails-mobile .swiper-button-next, .product-info-layer-thumbnails .swiper-button-next {
    right: 0;
    margin-top: -20px;
    width: 40px !important; }

.product-info-thumbnails-mobile .swiper-button-prev {
  margin-left: -20px; }
  .product-info-thumbnails-mobile .swiper-button-next {
    margin-right: -20px; }

.product-info-layer-thumbnails .swiper-button-prev {
  margin-left: 0; }
  .product-info-layer-thumbnails .swiper-button-next {
    margin-right: 0; }

#product_image_layer {
  display: none; }

@media (min-width: 1200px) {
      .product_images .modal-dialog {
        width: 1000px !important;
        height: 800px; } }

.product-info .magnifier-overlay {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 1000;
  opacity: 0.7;
  filter: alpha(opacity=70); }
  body.magnifier-active .product-info .magnifier-overlay {
    display: block; }

.product-info .magnifier-target {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background-color: #fff;
  overflow: hidden;
  height: 450px;
  z-index: 1000;
  -webkit-box-shadow: 0 0 25px rgba(0, 0, 0, .35);
  box-shadow: 0 0 25px rgba(0, 0, 0, .35); }
  @media (min-width: 992px) {
  .product-info .magnifier-target {
    height: 450px; } }

.page-product-info .product-info .magnifier-target .preloader {
  width: 100%;
  height: 100%;
  background: #fff url("../../images/loading.gif") 50% 50% no-repeat; }

.product-info-stage .product-info-image .product-info-image-inside .swiper-container .swiper-slide[data-index] {
  z-index: -1; }
  .product-info-stage .product-info-image .product-info-image-inside .swiper-container .swiper-slide[data-index] .swiper-slide-inside img.img-responsive, .product-info-stage .product-info-image .product-info-image-inside .swiper-container .swiper-slide[data-index] .swiper-slide-inside #header .custom-container .inside p img, #header .custom-container .inside p .product-info-stage .product-info-image .product-info-image-inside .swiper-container .swiper-slide[data-index] .swiper-slide-inside img, .product-info-stage .product-info-image .product-info-image-inside .swiper-container .swiper-slide[data-index] .swiper-slide-inside .product-container .gallery > li img, .product-container .gallery > li .product-info-stage .product-info-image .product-info-image-inside .swiper-container .swiper-slide[data-index] .swiper-slide-inside img, .product-info-stage .product-info-image .product-info-image-inside .swiper-container .swiper-slide[data-index] .swiper-slide-inside #shop-top-banner img, #shop-top-banner .product-info-stage .product-info-image .product-info-image-inside .swiper-container .swiper-slide[data-index] .swiper-slide-inside img {
    display: none; }
  .product-info-stage .product-info-thumbnails.swiper-vertical .swiper-slide[data-index] {
    display: none; }

.product-info .product-info-details dl dt label {
  text-overflow: initial;
  white-space: normal;
  overflow: initial;
  font-weight: bold;
  margin-bottom: 0; }
  .product-info .product-info-details dl dt {
    position: relative;
    float: left;
    width: 33.33333%;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    text-align: left;
    padding: 4.5px 15px 4.5px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; }
  .product-info .product-info-details dl dd {
    position: relative;
    float: left;
    width: 66.66667%;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    margin-left: 0;
    padding: 4.5px 15px; }
  @media (max-width: 991px) {
      .product-info .product-info-details dl:first-of-type.dl-horizontal, .product-info .product-info-details dl:first-of-type {
        border: 0; } }
  .product-info .product-info-details .attribute-images dl dt {
    position: relative;
    float: left;
    width: 100%;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    padding-left: 0; }
  .product-info .product-info-details .attribute-images dl dd {
    position: relative;
    float: left;
    width: 100%;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    padding: 0; }
  .product-info .product-info-details #properties_image {
    position: relative;
    float: left;
    width: 100%;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    padding: 0 0 15px 0; }
  .product-info .product-info-details dl, .product-info .product-info-details fieldset {
    border-bottom: 1px solid #d5d5d5;
    padding-bottom: 15px;
    margin-bottom: 15px; }
  .product-info .product-info-details fieldset {
    padding-bottom: 0; }
  .product-info .product-info-details fieldset.attributes {
    clear: both; }
  .product-info .product-info-details fieldset.attributes .attr-name {
    padding-top: 0; }
  .product-info .product-info-details fieldset.attributes .attr-selection {
    display: flex; }
  .product-info .product-info-details fieldset.attributes .attr-selection .attr-option-input {
    display: inline-block; }
  .product-info .product-info-details fieldset.attributes .attr-selection .attr-option-name {
    display: inline-block;
    padding-left: 5px; }
  .product-info .product-info-details .rating-stars {
    margin: 5px 0; }
  .product-info .product-info-details .cart-error-msg {
    display: none; }
  .product-info .product-info-details .price-container .current-price-container {
    font-size: 22px;
    line-height: 25px;
    font-weight: 700;
    text-align: right; }
  .product-info .product-info-details .price-container .current-price-container .productOldPrice {
    font-weight: normal;
    font-size: 18px;
    color: #777; }
  .product-info .product-info-details .price-container .current-price-container .gm_products_vpe, .product-info .product-info-details .price-container .current-price-container .products-vpe {
    font-size: 12px;
    font-weight: normal;
    color: #777; }
  .product-info .product-info-details .price-container .tax-shipping-text {
    text-align: right;
    color: #777;
    margin: 5px 0 15px; }
  .product-info .product-info-details .product-info-links {
    padding: 15px 15px 15px;
    margin: 0 auto;
    min-width: 230px;
    max-width: 300px;
    width: 67.66667%; }
  .product-info .product-info-details .product-info-links > div > a {
    font-size: 11px;
    text-align: center;
    margin-bottom: 5px;
    color: #999;
    background-color: transparent;
    border-color: #ddd;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0; }
  .product-info .product-info-details .product-info-links > div > a:focus, .product-info .product-info-details .product-info-links > div > a.focus {
    color: #999;
    background-color: transparent;
    border-color: #c4c4c4; }
  .product-info .product-info-details .product-info-links > div > a:hover {
    color: #808080;
    background-color: transparent;
    border-color: #c4c4c4; }
  .product-info .product-info-details .product-info-links > div > a:active, .product-info .product-info-details .product-info-links > div > a.active, .open > .product-info .product-info-details .product-info-links > div > a.dropdown-toggle {
    color: #999;
    background-color: rgba(0, 0, 0, 0);
    border-color: #c4c4c4; }
  .product-info .product-info-details .product-info-links > div > a:active:hover, .product-info .product-info-details .product-info-links > div > a.active:hover, .open > .product-info .product-info-details .product-info-links > div > a.dropdown-toggle:hover, .product-info .product-info-details .product-info-links > div > a:active:focus, .product-info .product-info-details .product-info-links > div > a.active:focus, .open > .product-info .product-info-details .product-info-links > div > a.dropdown-toggle:focus, .product-info .product-info-details .product-info-links > div > a:active.focus, .product-info .product-info-details .product-info-links > div > a.active.focus, .open > .product-info .product-info-details .product-info-links > div > a.dropdown-toggle.focus {
    color: #999;
    background-color: rgba(0, 0, 0, 0);
    border-color: #9d9d9d; }
  .product-info .product-info-details .product-info-links > div > a:active, .product-info .product-info-details .product-info-links > div > a.active, .open > .product-info .product-info-details .product-info-links > div > a.dropdown-toggle {
    background-image: none; }
  .product-info .product-info-details .product-info-links > div > a.disabled:hover, .product-info .product-info-details .product-info-links > div > a[disabled]:hover, fieldset[disabled] .product-info .product-info-details .product-info-links > div > a:hover, .product-info .product-info-details .product-info-links > div > a.disabled:focus, .product-info .product-info-details .product-info-links > div > a[disabled]:focus, fieldset[disabled] .product-info .product-info-details .product-info-links > div > a:focus, .product-info .product-info-details .product-info-links > div > a.disabled.focus, .product-info .product-info-details .product-info-links > div > a[disabled].focus, fieldset[disabled] .product-info .product-info-details .product-info-links > div > a.focus {
    background-color: transparent;
    border-color: #ddd; }
  .product-info .product-info-details .product-info-links > div > a .badge {
    color: transparent;
    background-color: transparent; }
  .product-info .product-info-details .product-info-links > div > a > span {
    float: inherit; }
  .product-info .product-info-details .product-info-links > div > a > span.btn-icon {
    display: inline-block;
    padding: 0 5px; }
  .product-info .product-info-details .product-info-links > div > a > span.btn-text {
    display: inline-block;
    padding: 0; }
  .product-info .product-info-details .product-info-links > div > a > span > .fa {
    font-size: 16px; }

.product-info .product-info-details .input-number {
  position: relative;
  float: left;
  width: 100%;
  min-height: 1px;
  padding-left: 15px;
  padding-right: 15px; }
  .product-info .product-info-details .input-number input[type="number"]::-webkit-outer-spin-button, .product-info .product-info-details .input-number input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0; }
  .product-info .product-info-details .input-number input[type="number"] {
    -moz-appearance: textfield; }
  .product-info .product-info-details .input-number input[type=number]::-ms-clear {
    display: none; }
  .product-info .product-info-details .button-container {
    padding: 0 15px; }

.product-info-share {
  padding: 0 15px 10px; }
  .product-info-share:before, .product-info-share:after {
    content: " ";
    display: table; }
  .product-info-share:after {
    clear: both; }

.product-info-rating .rating-item {
  padding-top: 20px; }
  .product-info-rating .rating-item .rating-stars {
    margin-bottom: 15px;
    margin-top: 0; }
  .product-info-rating .rating-item .rating-caption {
    color: #999;
    margin-bottom: 0; }
  .product-info-rating .no-rating-hint {
    color: #333; }
  .product-info-rating .rating-comment .more-text-container > span {
    white-space: pre-line; }
  .product-info-rating .btn, .product-info-rating .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .product-info-rating button {
    margin-top: 30px; }

.no-login-hint {
  color: #ccc;
  font-style: italic; }
  .no-login-hint a {
    color: #ccc;
    text-decoration: underline; }

.product-info-listings {
  margin-top: 30px; }
/* GX-Customizer START */
body #gm_gprint_tabs {
  padding: 0px;
  overflow: hidden;
  display: none;
  height: 100%; }

body #gm_gprint_tabs .gm_gprint_tab_active {
  margin: 0px;
  float: left;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  cursor: default; }

body #gm_gprint_tabs .gm_gprint_tab {
  margin: 0px;
  float: left;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  cursor: pointer; }

body #gm_gprint_tabs span {
  float: left;
  white-space: nowrap; }

body #gm_gprint_content {
  display: none; }

.surfaces_groups, .delete_surfaces_groups {
  cursor: pointer; }

.gm_gprint_flyover {
  position: absolute;
  display: none;
  background-color: #d6e6f3;
  border-style: dotted;
  border-width: 1px;
  margin: 2px;
  padding: 5px;
  z-index: 999;
  cursor: move; }

#gm_gprint_content input[type="file"] {
  font-size: 12px; }

#gm_gprint ul {
  background-color: transparent;
  background-image: none; }

#gm_gprint_tabs {
  border-left: 1px solid #ccc;
  margin-bottom: 2px;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0; }

#gm_gprint_tabs .gm_gprint_tab {
  background-color: #fff;
  background-image: none;
  background-position: top left;
  background-repeat: repeat-x;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-top: 1px solid #ccc;
  padding-bottom: 5px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 5px; }

#gm_gprint_tabs .gm_gprint_tab_active {
  background-color: #e7e7e7;
  background-image: none;
  background-position: top left;
  background-repeat: repeat-x;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-top: 1px solid #ccc;
  padding-bottom: 5px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 5px; }

#gm_gprint_tabs span {
  color: #000;
  font-size: 10px;
  text-transform: uppercase; }

#gm_gprint {
  margin-bottom: 8px;
  margin-left: 0;
  margin-right: 0; }

#gm_gprint a {
  color: #000; }

.gm_gprint_dropdown {
  background-color: #fff;
  border: 1px solid #ccc;
  color: #000;
  font-size: 12px; }

.gm_gprint_field {
  background-color: #fff;
  border: 1px solid #ccc;
  color: #000;
  font-size: 12px;
  padding: 0; }

.gm_gprint_surface {
  background-color: #fff;
  border: 1px solid #ccc;
  color: #000;
  font-size: 12px; }
/* GX-Customizer END */
.page-product-info .mfp-gallery .mfp-content .mfp-counter {
  display: none; }
/* Buy Button
 ========================================================================== */
.btn-buy {
  position: relative;
  -webkit-transition: ease 500ms all;
  -o-transition: ease 500ms all;
  transition: ease 500ms all; }
  .btn-buy.btn-buy-complete {
    color: #fff;
    background-color: #337ab7;
    border-color: #337ab7; }
  .btn-buy.btn-buy-complete:focus, .btn-buy.btn-buy-complete.focus {
    color: #fff;
    background-color: #285f8f;
    border-color: #173853; }
  .btn-buy.btn-buy-complete:hover {
    color: #fff;
    background-color: #285f8f;
    border-color: #265a87; }
  .btn-buy.btn-buy-complete:active, .btn-buy.btn-buy-complete.active, .open > .btn-buy.btn-buy-complete.dropdown-toggle {
    color: #fff;
    background-color: #285f8f;
    border-color: #265a87; }
  .btn-buy.btn-buy-complete:active:hover, .btn-buy.btn-buy-complete.active:hover, .open > .btn-buy.btn-buy-complete.dropdown-toggle:hover, .btn-buy.btn-buy-complete:active:focus, .btn-buy.btn-buy-complete.active:focus, .open > .btn-buy.btn-buy-complete.dropdown-toggle:focus, .btn-buy.btn-buy-complete:active.focus, .btn-buy.btn-buy-complete.active.focus, .open > .btn-buy.btn-buy-complete.dropdown-toggle.focus {
    color: #fff;
    background-color: #204d73;
    border-color: #173853; }
  .btn-buy.btn-buy-complete:active, .btn-buy.btn-buy-complete.active, .open > .btn-buy.btn-buy-complete.dropdown-toggle {
    background-image: none; }
  .btn-buy.btn-buy-complete.disabled:hover, .btn-buy.btn-buy-complete[disabled]:hover, fieldset[disabled] .btn-buy.btn-buy-complete:hover, .btn-buy.btn-buy-complete.disabled:focus, .btn-buy.btn-buy-complete[disabled]:focus, fieldset[disabled] .btn-buy.btn-buy-complete:focus, .btn-buy.btn-buy-complete.disabled.focus, .btn-buy.btn-buy-complete[disabled].focus, fieldset[disabled] .btn-buy.btn-buy-complete.focus {
    background-color: #337ab7;
    border-color: #337ab7; }
  .btn-buy.btn-buy-complete .badge {
    color: #337ab7;
    background-color: #fff; }
  .btn-buy .throbbler {
    display: inline-block;
    font-size: 10px;
    text-indent: -9999em;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #fff;
    background: -moz-linear-gradient(left, #fff 10%, rgba(255, 255, 255, 0) 42%);
    background: -webkit-linear-gradient(left, #fff 10%, rgba(255, 255, 255, 0) 42%);
    background: -o-linear-gradient(left, #fff 10%, rgba(255, 255, 255, 0) 42%);
    background: -ms-linear-gradient(left, #fff 10%, rgba(255, 255, 255, 0) 42%);
    background: linear-gradient(to right, #fff 10%, rgba(255, 255, 255, 0) 42%);
    -webkit-animation: load3 1.4s infinite linear;
    animation: load3 1.4s infinite linear;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    position: absolute;
    left: 10px;
    top: 9px; }
  .btn-buy .throbbler:before {
    width: 50%;
    height: 50%;
    background: #fff;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: ''; }
  .btn-buy .throbbler:after {
    background: #2eae06;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0; }

@-webkit-keyframes load3 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg); }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg); } }

@keyframes load3 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg); }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg); } }

.product-review-heading {
  margin-bottom: 0; }

.price-on-request {
  width: 100%; }
/* Under 18
 ========================================================================== */
.dl-fsk18 {
  align-content: flex-start;
  align-items: center;
  display: inline-flex; }
  .dl-fsk18 .fsk18-icon {
    padding-bottom: 20px !important;
    padding-top: 20px !important;
    text-align: center !important; }
  .dl-fsk18 .fsk18-icon span {
    background: #b90014;
    border-radius: 100%;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    padding: 9px; }
  .dl-fsk18 .fsk18-text {
    color: #b90014;
    font-weight: bold;
    text-align: center !important; }
/* Productlisting
 ========================================================================== */
.productlist {
  padding: 0 0 30px;
  opacity: 1;
  filter: alpha(opacity=100);
  -webkit-transition: 300ms ease opacity;
  -o-transition: 300ms ease opacity;
  transition: 300ms ease opacity; }
  .productlist.fadeOut {
    opacity: 0;
    filter: alpha(opacity=0); }

.productlist-swiper {
  position: relative;
  margin-bottom: 30px; }
  .productlist-swiper .swiper-button-prev {
    left: 0;
    margin-top: -30px; }
  @media (min-width: 768px) {
    .productlist-swiper .swiper-button-prev {
      left: -15px; } }
  @media (min-width: 1320px) {
    .productlist-swiper .swiper-button-prev {
      left: -60px; } }
  .productlist-swiper .swiper-button-next {
    right: 0;
    margin-top: -30px; }
  @media (min-width: 768px) {
    .productlist-swiper .swiper-button-next {
      right: -15px; } }
  @media (min-width: 1320px) {
    .productlist-swiper .swiper-button-next {
      right: -60px; } }
  .productlist-swiper .swiper-pagination {
    display: none; }
  @media (max-width: 1319px) {
    .productlist-swiper .swiper-button-prev, .productlist-swiper .swiper-button-next {
      display: block;
      background: rgba(220, 220, 220, .6);
      color: #fff;
      z-index: 1001; }
      .productlist-swiper .swiper-button-prev:hover, .productlist-swiper .swiper-button-next:hover {
        background: rgba(220, 220, 220, .9); } }

.product-container {
  position: relative;
  padding: 0;
  background-color: #fff; }
  .product-container.flyover .inside {
    min-height: 380px; }
  .product-container .inside .hidden-list {
    display: none; }
  .product-container .inside .content-container .content-container-inner {
    padding: 0 15px; }
  .product-container .inside .content-container .content-container-inner .title {
    font-weight: 400;
    font-size: 14px;
    max-height: 81px;
    overflow: hidden;
    text-overflow: ellipsis; }
  @media (min-width: 480px) {
          .product-container .inside .content-container .content-container-inner .title {
            font-size: 16px; } }
  @media (max-width: 480px) {
          .product-container .inside .content-container .content-container-inner .title {
            max-height: 75px; } }
  .product-container .inside .content-container .content-container-inner .title a {
    color: #333; }
  .product-container .inside .content-container .content-container-inner .title a:hover {
    text-decoration: none; }
  .product-container .inside .content-container .content-container-inner .price {
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap; }
  @media (min-width: 480px) {
          .product-container .inside .content-container .content-container-inner .price {
            font-size: 16px;
            white-space: inherit; } }
  .product-container .inside .content-container .content-container-inner .price .productOldPrice {
    font-size: 13px;
    color: #777;
    font-weight: normal; }
  .product-container .inside .content-container .content-container-inner .price a {
    color: #333; }
  .product-container .inside .content-container .content-container-inner .price a:hover {
    text-decoration: none; }
  .product-container .inside .content-container .content-container-inner .price .gm_products_vpe.products-vpe {
    font-size: 12px;
    font-weight: normal;
    color: #777; }
  .product-container .inside .content-container .content-container-inner .tax-shipping-hint {
    font-size: 12px;
    color: #777; }
  .product-container .inside .content-container .content-container-inner .tax-shipping-hint a {
    color: #777;
    text-decoration: underline; }
  .product-container .inside .content-container .content-container-inner .graduated-prices {
    margin-top: 15px; }
  .product-container.has-discount .price {
    text-decoration: line-through; }
  .product-container .shipping-info-short {
    display: inline-block; }
  .product-container .gallery {
    position: absolute;
    display: none;
    width: 95px;
    left: 0;
    top: 0;
    height: 379px;
    overflow-y: auto;
    border-bottom-left-radius: 2px;
    border-top-left-radius: 2px;
    background-color: #eee;
    margin: 0;
    padding: 0;
    list-style: none; }
  .product-container .gallery > li {
    padding: 0; }
  .product-container .gallery > li {
    display: block;
    margin: 10px 10px 0 10px;
    height: 75px;
    overflow: hidden;
    border: 1px solid #ddd;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    background-color: #fff; }
  .product-container .gallery > li.loaded a {
    display: block; }
  .product-container .gallery > li img {
    border: none;
    max-height: 95%;
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    width: 90%; }
  .product-container .gallery > li img.spinner {
    width: 32px;
    height: 32px;
    margin-left: -4px; }
  .product-container .gallery > li a {
    height: 100%;
    width: 100%; }
  .productlist-viewmode-grid .product-container, .productlist-swiper .product-container, .product-container.flyover {
    height: 330px;
    text-align: center;
    z-index: 1;
    position: relative;
    float: left;
    width: 50%;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    padding: 0; }
  @media (max-width: 767px) {
    .productlist-viewmode-grid .product-container, .productlist-swiper .product-container, .product-container.flyover {
      height: 330px; } }
  @media (min-width: 768px) {
    .productlist-viewmode-grid .product-container, .productlist-swiper .product-container, .product-container.flyover {
      float: left;
      width: 50%; } }
  @media (min-width: 992px) {
    .productlist-viewmode-grid .product-container, .productlist-swiper .product-container, .product-container.flyover {
      float: left;
      width: 33.33333%; } }
  @media (min-width: 1200px) {
    .productlist-viewmode-grid .product-container, .productlist-swiper .product-container, .product-container.flyover {
      float: left;
      width: 25%; } }
  .productlist-viewmode-grid .product-container .hidden-grid, .productlist-swiper .product-container .hidden-grid, .product-container.flyover .hidden-grid {
    display: none; }
  .productlist-viewmode-grid .product-container .hidden-list, .productlist-swiper .product-container .hidden-list, .product-container.flyover .hidden-list {
    display: block; }
  .productlist-viewmode-grid .product-container .product-tile, .productlist-swiper .product-container .product-tile, .product-container.flyover .product-tile {
    border-right: 1px solid #eee;
    height: 100%; }
  .productlist-viewmode-grid .product-container .product-tile figure, .productlist-swiper .product-container .product-tile figure, .product-container.flyover .product-tile figure {
    padding: 0 15px 0 15px;
    display: table;
    height: 130px;
    width: 100%;
    /* Add some rules only needed for IE missbehaviours */ }
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
        .productlist-viewmode-grid .product-container .product-tile figure, .productlist-swiper .product-container .product-tile figure, .product-container.flyover .product-tile figure {
          table-layout: fixed; } }
  @media (max-width: 767px) {
        .productlist-viewmode-grid .product-container .product-tile figure, .productlist-swiper .product-container .product-tile figure, .product-container.flyover .product-tile figure {
          height: 130px; } }
  .productlist-viewmode-grid .product-container .product-tile figure .product-image, .productlist-swiper .product-container .product-tile figure .product-image, .product-container.flyover .product-tile figure .product-image {
    display: table-cell;
    vertical-align: bottom;
    /* Add some rules only needed for IE missbehaviours */ }
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
          .productlist-viewmode-grid .product-container .product-tile figure .product-image, .productlist-swiper .product-container .product-tile figure .product-image, .product-container.flyover .product-tile figure .product-image {
            width: 100%; } }
  .productlist-viewmode-grid .product-container .product-tile figure .product-image img, .productlist-swiper .product-container .product-tile figure .product-image img, .product-container.flyover .product-tile figure .product-image img {
    display: inline-block;
    height: auto;
    max-height: 130px;
    max-width: 100%; }
  @media (max-width: 767px) {
            .productlist-viewmode-grid .product-container .product-tile figure .product-image img, .productlist-swiper .product-container .product-tile figure .product-image img, .product-container.flyover .product-tile figure .product-image img {
              max-height: 130px; } }
  .productlist-viewmode-grid .product-container .product-tile .ribbons, .productlist-swiper .product-container .product-tile .ribbons, .product-container.flyover .product-tile .ribbons {
    right: 0; }
  .productlist-viewmode-grid .product-container .product-tile .title-description, .productlist-swiper .product-container .product-tile .title-description, .product-container.flyover .product-tile .title-description {
    display: table;
    height: 90px;
    padding: 0 15px;
    width: 100%; }
  @media (min-width: 768px) {
        .productlist-viewmode-grid .product-container .product-tile .title-description, .productlist-swiper .product-container .product-tile .title-description, .product-container.flyover .product-tile .title-description {
          padding: 0 30px; } }
  .productlist-viewmode-grid .product-container .product-tile .title-description .title, .productlist-swiper .product-container .product-tile .title-description .title, .product-container.flyover .product-tile .title-description .title {
    display: table-cell;
    font-weight: 400;
    font-size: 14px;
    padding-top: 15px;
    vertical-align: top; }
  .productlist-viewmode-grid .product-container .product-tile .title-description .title a, .productlist-swiper .product-container .product-tile .title-description .title a, .product-container.flyover .product-tile .title-description .title a {
    color: #333;
    display: inline-block;
    max-height: 60px;
    overflow: hidden;
    text-overflow: ellipsis; }
  .productlist-viewmode-grid .product-container .product-tile .title-description .title a:hover, .productlist-swiper .product-container .product-tile .title-description .title a:hover, .product-container.flyover .product-tile .title-description .title a:hover {
    text-decoration: none; }
  .productlist-viewmode-grid .product-container .product-tile .rating-container, .productlist-swiper .product-container .product-tile .rating-container, .product-container.flyover .product-tile .rating-container {
    display: table;
    height: 30px;
    width: 100%; }
  .productlist-viewmode-grid .product-container .product-tile .rating-container > span, .productlist-swiper .product-container .product-tile .rating-container > span, .product-container.flyover .product-tile .rating-container > span {
    display: table-cell;
    vertical-align: middle; }
  .productlist-viewmode-grid .product-container .product-tile .price-tax .price, .productlist-swiper .product-container .product-tile .price-tax .price, .product-container.flyover .product-tile .price-tax .price {
    font-size: 14px;
    font-weight: 700; }
  @media (min-width: 480px) {
          .productlist-viewmode-grid .product-container .product-tile .price-tax .price, .productlist-swiper .product-container .product-tile .price-tax .price, .product-container.flyover .product-tile .price-tax .price {
            font-size: 16px; } }
  .productlist-viewmode-grid .product-container .product-tile .price-tax .price .current-price-container:before, .productlist-swiper .product-container .product-tile .price-tax .price .current-price-container:before, .product-container.flyover .product-tile .price-tax .price .current-price-container:before {
    content: " ";
    display: block;
    height: 20px; }
  .productlist-viewmode-grid .product-container .product-tile .price-tax .price .current-price-container .productOldPrice, .productlist-swiper .product-container .product-tile .price-tax .price .current-price-container .productOldPrice, .product-container.flyover .product-tile .price-tax .price .current-price-container .productOldPrice {
    margin-top: -22px;
    display: block;
    margin-bottom: -20px;
    font-size: 13px;
    color: #777;
    font-weight: normal; }
  .productlist-viewmode-grid .product-container .product-tile .price-tax .price a, .productlist-swiper .product-container .product-tile .price-tax .price a, .product-container.flyover .product-tile .price-tax .price a {
    color: #333; }
  .productlist-viewmode-grid .product-container .product-tile .price-tax .price a:hover, .productlist-swiper .product-container .product-tile .price-tax .price a:hover, .product-container.flyover .product-tile .price-tax .price a:hover {
    text-decoration: none; }
  .productlist-viewmode-grid .product-container .product-tile .price-tax .price .gm_products_vpe.products-vpe, .productlist-swiper .product-container .product-tile .price-tax .price .gm_products_vpe.products-vpe, .product-container.flyover .product-tile .price-tax .price .gm_products_vpe.products-vpe {
    font-size: 12px;
    font-weight: normal;
    color: #777; }
  .productlist-viewmode-grid .product-container {
    margin-bottom: 30px; }
  .productlist-viewmode-grid .product-container .price-tax {
    border-bottom: 1px solid #eee;
    margin: 0 15px;
    padding-bottom: 30px; }
  .productlist-swiper .product-container {
    border-bottom: transparent; }
  .productlist-swiper .product-container > form {
    border-bottom-color: transparent; }
  .productlist-swiper .product-container > form {
    border-right: 1px solid #eee !important; }
  .productlist-viewmode-list .product-container {
    border-bottom: 1px solid #eee; }
  .productlist-viewmode-list .product-container:before, .productlist-viewmode-list .product-container:after {
    content: " ";
    display: table; }
  .productlist-viewmode-list .product-container:after {
    clear: both; }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner {
    width: 100%;
    text-align: left;
    padding: 15px 0; }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner:before, .productlist-viewmode-list .product-container .inside .content-container .content-container-inner:after {
    content: " ";
    display: table; }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner:after {
    clear: both; }
  @media (min-width: 992px) {
          .productlist-viewmode-list .product-container .inside .content-container .content-container-inner {
            display: table; } }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .image {
    position: relative;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px; }
  @media (min-width: 768px) {
            .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .image {
              float: left;
              width: 33.33333%; } }
  @media (min-width: 992px) {
            .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .image {
              float: left;
              width: 16.66667%; } }
  @media (min-width: 1200px) {
            .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .image {
              float: left;
              width: 16.66667%; } }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .image a {
    height: 130px;
    width: 100%; }
  @media (min-width: 992px) {
            .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .image {
              float: none !important;
              display: table-cell;
              height: 100%;
              vertical-align: top; } }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .image .product-image {
    display: block;
    cursor: pointer;
    height: 130px;
    overflow: hidden;
    display: table-cell;
    vertical-align: middle; }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .image .product-image img {
    position: absolute;
    top: 50%;
    left: 50%;
    max-width: 100%;
    max-height: 100%;
    transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translateX(-50%) translateY(-50%);
    -moz-transform: translateX(-50%) translateY(-50%);
    -ms-transform: translateX(-50%) translateY(-50%); }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .image.no-image {
    padding: 0 5px; }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .image.no-image .product-image {
    display: block; }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .title-description {
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px; }
  @media (min-width: 768px) {
            .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .title-description {
              float: left;
              width: 66.66667%; } }
  @media (min-width: 992px) {
            .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .title-description {
              float: left;
              width: 50%; } }
  @media (min-width: 1200px) {
            .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .title-description {
              float: left;
              width: 50%; } }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .title-description .title {
    margin-bottom: 15px; }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .title-description .description {
    min-height: 50px; }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .title-description .shipping {
    margin-top: 15px;
    font-size: 12px; }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .title-description .shipping.visible-list {
    display: inline-block !important; }
  @media (min-width: 992px) {
            .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .title-description {
              float: none !important;
              display: table-cell;
              height: 100%;
              vertical-align: top; } }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .title-description .listing_attributes_selection dl {
    margin-top: 18px; }
    .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .title-description .listing_attributes_selection dl .option-value select.col-xs-12 {
      margin-bottom: 10px;
      padding: 5px; }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax {
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 30px;
    padding-right: 0;
    padding-left: 0;
    position: relative;
    text-align: right; }
  @media (min-width: 768px) {
            .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax {
              float: left;
              width: 100%; } }
  @media (min-width: 992px) {
            .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax {
              float: left;
              width: 33.33333%; } }
  @media (min-width: 1200px) {
            .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax {
              float: left;
              width: 33.33333%; } }
  @media (min-width: 992px) {
            .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax {
              padding-left: 15px; } }
  @media (min-width: 1200px) {
            .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax .rating {
              position: absolute;
              top: 0;
              right: 0; }
            .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax .quantity-input {
              padding-right: 0; } }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax .quantity-unit {
    display: inherit;
    text-align: left; }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax .cart-error-msg {
    text-align: center; }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax .tax-shipping-hint {
    margin-bottom: 15px; }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax .input-number, .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax .form-control, .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax .input-text {
    margin-bottom: 15px; }
  @media (min-width: 1200px) {
              .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax .input-number, .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax .form-control, .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax .input-text {
                margin-bottom: 0; } }
  .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax .btn, .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax button {
    font-size: 12px; }
  @media (min-width: 992px) {
            .productlist-viewmode-list .product-container .inside .content-container .content-container-inner .price-tax {
              float: none !important;
              display: table-cell;
              height: 100%;
              vertical-align: bottom;
              border-left: 1px solid #eee; } }
  .product-container.flyover {
    position: absolute;
    float: none;
    height: 349px !important;
    z-index: 1000;
    border-right-color: transparent;
    border-bottom-color: transparent;
    box-sizing: content-box;
    margin: -15px;
    padding: 15px;
    cursor: pointer;
    background-color: #fff;
    -webkit-box-shadow: 0 0 25px rgba(0, 0, 0, .35);
    box-shadow: 0 0 25px rgba(0, 0, 0, .35);
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    display: none; }
  .product-container.flyover .product-tile {
    border-color: transparent; }
  .product-container.flyover .product-tile .price-tax {
    margin: 0;
    border: 0; }
  .product-container.flyover .product-tile .shipping {
    color: #999;
    padding: 0 30px;
    width: 100%; }
  .product-container.flyover .product-tile .shipping.visible-flyover, .product-container.flyover .product-tile .shipping.hidden-grid {
    display: block !important; }
  .product-container.flyover .product-tile .shipping.visible-flyover :not(.shipping-info-short), .product-container.flyover .product-tile .shipping.hidden-grid :not(.shipping-info-short) {
    display: none; }
  @media (min-width: 768px) {
    .product-container.flyover {
      display: block; } }
  body.has-touch .product-container.flyover {
    display: none; }
  .product-container.flyover.has-gallery {
    margin-left: -95px;
    padding-left: 95px; }
  .product-container.flyover.has-gallery .gallery {
    display: block; }
  .product-container.flyover.has-gallery.gallery-right {
    margin-left: 0px;
    padding-left: 0px;
    margin-right: -95px;
    padding-right: 95px;
    border-bottom-left-radius: 2px;
    border-top-left-radius: 2px; }
  .product-container.flyover.has-gallery.gallery-right .gallery {
    right: 0px;
    left: auto;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    border-bottom-right-radius: 2px;
    border-top-right-radius: 2px; }
  .product-container .manufacturer-logo {
    display: none; }
  .product-container.flyover .manufacturer-logo {
    display: block; }

@media (max-width: 767px) {
    .product-container:nth-of-type(2n+0) .product-tile {
      border-right-color: transparent; } }
  @media (min-width: 768px) and (max-width: 991px) {
    .product-container:nth-of-type(2n+0) .product-tile {
      border-right-color: transparent; } }
  @media (min-width: 992px) and (max-width: 1199px) {
    .product-container:nth-of-type(3n+0) .product-tile {
      border-right-color: transparent; } }
  @media (min-width: 1200px) {
  .product-container:nth-of-type(4n+0) .product-tile {
    border-right-color: transparent; } }

@media (min-width: 1200px) {
    body.page-index .swiper-container .product-container {
      width: 20%; }
    body.page-index .productlist-viewmode-grid .product-container {
      width: 20%; }
      body.page-index .productlist-viewmode-grid .product-container .product-tile {
        border-right: 1px solid #eee; }
      body.page-index .productlist-viewmode-grid .product-container:nth-of-type(5n+0) .product-tile {
        border-right-color: transparent; } }

@media (min-width: 1200px) {
    body.page-product-info .swiper-container .product-container {
      width: 20%; }
    body.page-product-info .productlist-viewmode-grid .product-container {
      width: 20%; }
      body.page-product-info .productlist-viewmode-grid .product-container .product-tile {
        border-right: 1px solid #eee; }
      body.page-product-info .productlist-viewmode-grid .product-container:nth-of-type(5n+0) .product-tile {
        border-right-color: transparent; } }
/* Productlisting-Filter
 ========================================================================== */
.productlisting-filter-container {
  padding: 10px 0;
  border-top: 1px solid #e7e7e7;
  border-bottom: 1px solid #e7e7e7;
  margin-bottom: 15px; }
  .productlisting-filter-container form > div > div {
    margin-bottom: -5px; }
  .productlisting-filter-container .input-select {
    display: none; }
  .productlisting-filter-container .btn.btn-default, .productlisting-filter-container .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default, .productlisting-filter-container .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .productlisting-filter-container .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .productlisting-filter-container button.btn-default, .productlisting-filter-container .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .productlisting-filter-container button.ui-priority-secondary.btn {
    border-color: #ddd;
    text-transform: none;
    letter-spacing: 0; }
  .productlisting-filter-container .btn.btn-default.active, .productlisting-filter-container .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-default.active, .productlisting-filter-container .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .productlisting-filter-container .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .productlisting-filter-container button.btn-default.active, .productlisting-filter-container .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-secondary.btn.active, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .productlisting-filter-container button.ui-priority-secondary.btn.active {
    border-color: #ccc; }
  .productlisting-filter-container .btn-group {
    vertical-align: inherit; }
  .productlisting-filter-container .filter-button {
    vertical-align: top; }
  .productlisting-filter-container .custom-dropdown.open .dropdown-menu {
    max-height: 289px;
    overflow-x: auto; }
  .productlisting-filter-container .panel-pagination:before, .productlisting-filter-container .panel-pagination:after {
    content: " ";
    display: table; }
  .productlisting-filter-container .panel-pagination:after {
    clear: both; }
  .productlisting-filter-container .panel-pagination > nav > ul {
    margin: 10px 0 0;
    float: left; }
  @media (min-width: 1200px) {
      .productlisting-filter-container .panel-pagination > nav > ul {
        margin-top: 0;
        float: right; } }
  .productlisting-filter-container .panel-pagination > nav > ul li {
    display: inline-block; }
/* Shopping Cart
 ========================================================================== */
body.page-shopping-cart #breadcrumb_navi {
  display: none; }

.order-wishlist {
  padding-left: 0;
  padding-right: 0; }
  @media (min-width: 992px) {
  body.page-shopping-cart .order-wishlist {
    padding-right: 30px; } }
  .order-wishlist table {
    margin-bottom: 0; }
  @media (min-width: 992px) {
    .order-wishlist table {
      margin-bottom: 18px; } }
  .order-wishlist table tr {
    margin-left: 0;
    margin-right: 0; }
  .order-wishlist table tr.item th {
    border-color: #e7e7e7;
    color: #999; }
  .order-wishlist table tr.item td a.product-title {
    color: #333; }
  .order-wishlist table tr.item td.image, .order-wishlist table tr.item td.product {
    max-width: 245px; }
  .order-wishlist table tr.item td.product {
    color: #555; }
  .order-wishlist table tr.item td.text-right {
    color: #333; }
  .order-wishlist table tr.item .product .error-msg {
    display: none;
    margin-top: 15px; }
  .order-wishlist table tr.item.error .product .error-msg {
    display: block; }
  @media (min-width: 992px) {
      .order-wishlist table tr.item:last-child td {
        border-bottom: 3px solid #e7e7e7; } }
  .order-wishlist table tr > td {
    padding: 15px 0; }
  @media (min-width: 992px) {
        .order-wishlist table tr > td {
          padding: 8px; } }
  .order-wishlist table tr > td.product {
    color: #555; }
  .order-wishlist table tr > td.product .product-title {
    display: inline-block;
    margin-bottom: 10px;
    color: #333;
    font-size: 16px; }
  .order-wishlist table tr > td.product ul {
    margin: 0;
    padding: 0;
    list-style: none; }
  .order-wishlist table tr > td.product ul > li {
    padding: 0; }
  .order-wishlist table tr > td.qty input[type=text] {
    float: none;
    text-align: right; }
  @media (min-width: 768px) {
            .order-wishlist table tr > td.qty input[type=text] {
              width: 50px;
              float: left; } }
  .order-wishlist table tr > td.qty a {
    display: inline-block;
    margin: 8px 0 0 10px; }
  @media (min-width: 768px) {
            .order-wishlist table tr > td.qty a {
              display: block;
              float: left; } }
  @media (min-width: 992px) {
          .order-wishlist table tr > td.price {
            font-size: 16px; } }
  @media (max-width: 767px) {
        .order-wishlist table tr > td.image {
          position: relative;
          float: left;
          width: 16.66667%;
          min-height: 1px;
          padding-left: 15px;
          padding-right: 15px; }
        .order-wishlist table tr > td.product {
          position: relative;
          float: left;
          width: 50%;
          min-height: 1px;
          padding-left: 15px;
          padding-right: 15px; }
        .order-wishlist table tr > td.qty {
          position: relative;
          float: left;
          width: 33.33333%;
          min-height: 1px;
          padding-left: 15px;
          padding-right: 15px;
          text-align: right; }
        .order-wishlist table tr > td.price {
          position: relative;
          float: left;
          width: 33.33333%;
          min-height: 1px;
          padding-left: 15px;
          padding-right: 15px;
          float: right; } }
  @media (max-width: 480px) {
        .order-wishlist table tr > td.image {
          display: none; }
        .order-wishlist table tr > td.qty {
          position: relative;
          float: left;
          width: 50%;
          min-height: 1px;
          padding-left: 15px;
          padding-right: 15px;
          text-align: right; } }
  @media (max-width: 767px) {
        .order-wishlist table tr > td.product, .order-wishlist table tr > td.qty {
          border-top-width: 1px; } }
  .order-wishlist .continue-shopping-button-container {
    padding: 0;
    margin-bottom: 20px; }

.total-box {
  border-top: 2px solid #e7e7e7;
  color: #333;
  padding: 0;
  background-color: #fff;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  border-radius: 0; }
  @media (min-width: 992px) {
  .total-box {
    border: 0;
    padding: 15px 15px 0;
    margin-bottom: 15px;
    -webkit-box-shadow: 0 0 25px rgba(0, 0, 0, .35);
    box-shadow: 0 0 25px rgba(0, 0, 0, .35); } }
  .total-box h4 {
    color: #333; }
  .total-box table {
    margin-bottom: 0; }
  .total-box table tr > td {
    border-color: #e7e7e7;
    position: relative;
    float: left;
    width: 50%;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px; }
  .total-box table tr > td.colspan-2 {
    position: relative;
    float: left;
    width: 100%;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px; }
  .total-box table tr > td, .total-box table tr > td.colspan-2 {
    padding: 11px 0; }
  .total-box table tr > td:nth-of-type(2) {
    text-align: right; }
  .total-box table tr > td.additional-info {
    border-top: none;
    padding-top: 0; }
  .total-box table tr.total {
    display: block;
    background-color: #eee;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0; }

  .total-box table tr.total td {
    padding: 7.5px 15px;
    border-color: transparent; }
  .total-box table tr.total td .total-info {
    font-size: 13px;
    font-weight: normal; }
  .total-box table tr.total.sum td {
    padding: 15px 15px 7.5px;
    border-color: #e7e7e7; }
  .total-box table tr.total.sum td:nth-of-type(1) {
    font-weight: 700;
    text-transform: uppercase;
    font-size: inherit;
    color: inherit; }
  .total-box table tr.total.sum td:nth-of-type(2) {
    font-size: 18px;
    font-weight: bold; }
  .total-box table tr.total.checkout-button td {
    padding-bottom: 15px; }
  .total-box table tr.total:last-of-type td {
    padding-bottom: 15px;
    /*
     // N.B.: (13px * 1.42857) + (2 * 9px) + (2 * 1px) is the height of the checkout button (cf. below)
     padding: ($grid-gutter-width / 2) ($grid-gutter-width / 2) ((13px * 1.42857) + (2 * 9px) + (2 * 1px) + $grid-gutter-width) ($grid-gutter-width / 2);
     */ }
  .total-box table tr.redeem-gift-coupon-code td {
    border: none;
    padding: 15px 0; }
  .total-box div.ot-coupon-info div.ot-coupon-info-block, .total-box div.ot-gv-info div.ot-coupon-info-block, .total-box div.ot-coupon-info div.ot-gv-info-block, .total-box div.ot-gv-info div.ot-gv-info-block {
    padding: 1ex 1em;
    overflow: hidden;
    transition: height 0.25s;
    margin: auto;
    background-color: #eee; }
  .total-box div.ot-coupon-info div#ot-coupon-info-toggle, .total-box div.ot-gv-info div#ot-coupon-info-toggle {
    cursor: pointer; }
  .total-box a.toggleusebalance {
    text-decoration: none; }
  .total-box div.gift-coupon-code-entry {
    overflow: auto; }
  .total-box #gift-coupon-cell div#gift-coupon-toggle {
    cursor: pointer; }
  .total-box #gift-coupon-cell span.rotating-caret {
    float: right;
    transition: transform 0.25s; }
  .total-box #gift-coupon-cell div#gift-coupon-block {
    transition: height 0.25s;
    overflow: hidden; }
  .total-box #gift-coupon-cell.extended #gift-coupon-block {
    height: 125px; }
  .total-box #gift-coupon-cell.extended span.rotating-caret {
    transform: rotate(-180deg); }

.shopping-cart-button {
  padding: 0;
  clear: right; }
  @media (min-width: 992px) {
  .shopping-cart-button {
    padding: 0 15px; } }
  .shopping-cart-button .total-block-wrapper {
    min-height: 75px; }

.shared_cart_label {
  position: relative;
  top: 30px; }

.gift-cart-content-wrapper input#gv_redeem_code {
  width: 65%;
  margin: 0 auto; }
  .gift-cart-content-wrapper input[type="submit"].btn, .gift-cart-content-wrapper .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel input[type="submit"], .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .gift-cart-content-wrapper input[type="submit"] {
    display: block;
    margin: 15px auto;
    width: 65%; }

.chevron-right {
  height: 10px;
  width: 10px;
  fill: #999; }

.shopping-cart-shipping-payment-text {
  color: #999;
  font-size: 12px;
  margin: 30px 0;
  padding: 0; }

.share-cart-content-wrapper input, .share-cart-content-wrapper .row, .share-cart-content-wrapper .total-box table tr.total, .total-box table .share-cart-content-wrapper tr.total {
  display: block;
  margin: 0 auto 12px;
  width: 80%; }
  .share-cart-content-wrapper .row.text, .share-cart-content-wrapper .total-box table tr.total.text, .total-box table .share-cart-content-wrapper tr.total.text {
    padding: 0 60px; }
  .share-cart-content-wrapper .row:last-child, .share-cart-content-wrapper .total-box table tr.total:last-child, .total-box table .share-cart-content-wrapper tr.total:last-child {
    margin-bottom: 0; }

#ot-coupon-info-toggle .fa, #ot-gv-info-toggle .fa, #ot-shipping-info-toggle .fa, #ot-coupon-info-toggle .fas, #ot-coupon-info-toggle .ui-datepicker .ui-datepicker-header .ui-datepicker-prev:after, .ui-datepicker .ui-datepicker-header #ot-coupon-info-toggle .ui-datepicker-prev:after, #ot-coupon-info-toggle .ui-datepicker .ui-datepicker-header .ui-datepicker-next:after, .ui-datepicker .ui-datepicker-header #ot-coupon-info-toggle .ui-datepicker-next:after, #ot-gv-info-toggle .fas, #ot-gv-info-toggle .ui-datepicker .ui-datepicker-header .ui-datepicker-prev:after, .ui-datepicker .ui-datepicker-header #ot-gv-info-toggle .ui-datepicker-prev:after, #ot-gv-info-toggle .ui-datepicker .ui-datepicker-header .ui-datepicker-next:after, .ui-datepicker .ui-datepicker-header #ot-gv-info-toggle .ui-datepicker-next:after, #ot-shipping-info-toggle .fas, #ot-shipping-info-toggle .ui-datepicker .ui-datepicker-header .ui-datepicker-prev:after, .ui-datepicker .ui-datepicker-header #ot-shipping-info-toggle .ui-datepicker-prev:after, #ot-shipping-info-toggle .ui-datepicker .ui-datepicker-header .ui-datepicker-next:after, .ui-datepicker .ui-datepicker-header #ot-shipping-info-toggle .ui-datepicker-next:after, #ot-coupon-info-toggle .far, #ot-gv-info-toggle .far, #ot-shipping-info-toggle .far {
  color: #337ab7;
  cursor: pointer;
  padding-left: 3px; }

.total-box a, .shopping-cart-shipping-payment-text a {
  color: inherit;
  text-decoration: underline; }
  .total-box a .glyphicon, .shopping-cart-shipping-payment-text a .glyphicon, .total-box a .fa, .shopping-cart-shipping-payment-text a .fa, .total-box a .fas, .total-box a .ui-datepicker .ui-datepicker-header .ui-datepicker-prev:after, .ui-datepicker .ui-datepicker-header .total-box a .ui-datepicker-prev:after, .total-box a .ui-datepicker .ui-datepicker-header .ui-datepicker-next:after, .ui-datepicker .ui-datepicker-header .total-box a .ui-datepicker-next:after, .shopping-cart-shipping-payment-text a .fas, .shopping-cart-shipping-payment-text a .ui-datepicker .ui-datepicker-header .ui-datepicker-prev:after, .ui-datepicker .ui-datepicker-header .shopping-cart-shipping-payment-text a .ui-datepicker-prev:after, .shopping-cart-shipping-payment-text a .ui-datepicker .ui-datepicker-header .ui-datepicker-next:after, .ui-datepicker .ui-datepicker-header .shopping-cart-shipping-payment-text a .ui-datepicker-next:after {
    color: #337ab7; }
  .total-box a.button-submit, .shopping-cart-shipping-payment-text a.button-submit {
    text-decoration: none; }
  .total-box a.cart-action-link, .shopping-cart-shipping-payment-text a.cart-action-link {
    padding: 12px 0 0;
    display: inline-block;
    cursor: pointer;
    color: #337ab7;
    text-decoration: none; }
  .total-box a.cart-action-link:hover, .shopping-cart-shipping-payment-text a.cart-action-link:hover {
    color: #999;
    text-decoration: none; }
  .total-box a.cart-action-link:active, .shopping-cart-shipping-payment-text a.cart-action-link:active, .total-box a.cart-action-link:focus, .shopping-cart-shipping-payment-text a.cart-action-link:focus {
    border: none;
    color: #337ab7;
    outline: none;
    text-decoration: none; }
  .total-box a.cart-action-link:last-child, .shopping-cart-shipping-payment-text a.cart-action-link:last-child {
    float: right; }

.coupon-box {
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  border-radius: 0;
  padding: 15px;
  margin-top: 15px;
  background-color: #f8f8f8;
  /* $gx-total-box-bottom-bg-color, */ }
  .coupon-box #gift-coupon-block .gv-amount {
    color: #999; }
  .coupon-box #gift-coupon-block .gv-amount .gv-amount-toggleuse {
    margin: 10px 0; }
  .coupon-box #gift-coupon-block .gv-amount input[type="checkbox"] {
    vertical-align: text-bottom;
    margin: 0 5px 0 0; }
  .coupon-box #gift-coupon-block button#gift-coupon-code-submit {
    height: 38px;
    background-color: #ccc; }

#gift-coupon-note-block {
  margin-top: 15px;
  color: #999;
  font-size: 12px; }

.checkout-buttons {
  display: inline-block;
  margin: 24px 0;
  width: 100%;
  text-align: right; }
  .checkout-buttons img {
    cursor: pointer;
    margin-bottom: 10px; }
  @media (max-width: 767px) {
  .checkout-buttons .paypal-ec-button {
    margin-right: -2px; } }
  @media (min-width: 768px) {
  .checkout-buttons .paypal-ec-button {
    margin-top: -6px;
    margin-left: 6px; } }

.shopping-cart-content-note {
  margin-top: 24px;
  margin-bottom: 24px; }

/* Checkout Processfunnel
 ========================================================================== */

.checkout-processfunnel {
  margin: 0;
  padding: 0;
  list-style: none;
  height: 30px;
  margin: 15px 0 30px; }
  .checkout-processfunnel > li {
    padding: 0; }
  .checkout-processfunnel li {
    height: 30px;
    line-height: 30px;
    padding: 0; }
  .checkout-processfunnel li:not(:first-child) {
    padding-left: 3px; }
  .checkout-processfunnel li:not(:first-child) .step-text {
    padding-left: 20px; }
  .checkout-processfunnel li:not(:last-child):after, .checkout-processfunnel li:not(:first-child):before {
    border-top: 15px inset transparent;
    border-bottom: 15px inset transparent;
    content: "";
    height: 0;
    position: absolute;
    top: 0;
    width: 0; }
  .checkout-processfunnel li:not(:first-child):before {
    border-left: 20px solid #fff;
    left: 3px;
    z-index: 3; }
  .checkout-processfunnel li:not(:last-child):after {
    border-left: 20px solid #f3f3f3;
    right: -20px;
    z-index: 4; }
  @media (max-width: 767px) {
    .checkout-processfunnel li:first-child .step-text {
      padding-left: 15px; }

    .checkout-processfunnel li:not(:last-child):not(:first-child) .step-text {
      padding-left: 25px; } }
  .checkout-processfunnel li .step-text {
    display: inline-block;
    font-size: 14px;
    line-height: 32px;
    height: 30px;
    overflow: hidden;
    background-color: #f3f3f3;
    color: #666;
    text-transform: uppercase;
    text-align: center;
    width: 100%; }
  @media (min-width: 768px) {
      .checkout-processfunnel li .step-text.visble-xs {
        display: none; } }
  .checkout-processfunnel li.active .step-text {
    background-color: #337ab7;
    color: #fff; }
  @media (max-width: 767px) {
        .checkout-processfunnel li.active .step-text {
          font-size: 12px;
          line-height: 30px; } }
  .checkout-processfunnel li.active:after {
    border-left-color: #337ab7; }

.order-wishlist ul.row, .order-wishlist .total-box table ul.total, .total-box table .order-wishlist ul.total, .order-wishlist ul.row li, .order-wishlist .total-box table ul.total li, .total-box table .order-wishlist ul.total li {
  margin: 0;
  padding: 0;
  list-style: none; }
  .order-wishlist ul.row > li, .order-wishlist .total-box table ul.total > li, .total-box table .order-wishlist ul.total > li, .order-wishlist ul.row li > li, .order-wishlist .total-box table ul.total li > li, .total-box table .order-wishlist ul.total li > li {
    padding: 0; }
  @media (min-width: 992px) {
    .order-wishlist.qty {
      min-width: 111px; } }
  .order-wishlist.qty .loader {
    display: none; }
  .order-wishlist .loading td {
    position: relative; }
  .order-wishlist .loading td .loader {
    display: block;
    width: 100%;
    height: 99%;
    position: absolute;
    top: 0px;
    background: rgba(255, 255, 255, 0.7); }
  .order-wishlist .loading td .loader.spinner {
    background: rgba(255, 255, 255, 0.7) url(../../images/loading.gif) no-repeat center center; }
  .order-wishlist .image a {
    color: #333; }

.filter-selection-container .filter-selection, .filter-selection-container .filter-item, .filter-selection-container .filter-item li {
  margin: 0;
  padding: 0;
  list-style: none; }
  .filter-selection-container .filter-selection > li, .filter-selection-container .filter-item > li, .filter-selection-container .filter-item li > li {
    padding: 0; }
  .filter-selection-container .filter-selection {
    display: inline-block; }
  .filter-selection-container .filter-selection li {
    display: inline-block; }

.categories-description-container .categories-images {
  margin-bottom: 15px; }
  .categories-description-container .categories-images img {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px; }
  .categories-description-container .categories-images .align-helper strong {
    font-size: 16px; }

.subcategories-listing-container {
  overflow: hidden;
  margin-top: 15px; }
  .subcategories-listing-container .subcategories-listing, .subcategories-listing-container .subcategories-listing li {
    margin: 0;
    padding: 0;
    list-style: none;
    display: inline-block; }
  .subcategories-listing-container .subcategories-listing > li, .subcategories-listing-container .subcategories-listing li > li {
    padding: 0; }
  .subcategories-listing-container .subcategories-listing > li, .subcategories-listing-container .subcategories-listing li > li {
    padding: 0 15px 15px; }
  .subcategories-listing-container .subcategories-listing {
    margin: 0 -15px 15px;
    display: block; }
  .subcategories-listing-container .subcategories-listing .subcategory-item {
    position: relative;
    float: left;
    width: 50%;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px; }
  @media (min-width: 768px) {
      .subcategories-listing-container .subcategories-listing .subcategory-item {
        float: left;
        width: 50%; } }
  @media (min-width: 1200px) {
      .subcategories-listing-container .subcategories-listing .subcategory-item {
        float: left;
        width: 50%; } }
  .subcategories-listing-container .subcategories-listing .subcategory-item:hover a {
    text-decoration: none; }
  .subcategories-listing-container .subcategories-listing .subcategory-item:hover .cat-name {
    background-color: #dcdcdc;
    border-color: #bebebe; }
  .subcategories-listing-container .subcategories-listing .subcategory-item:hover .cat-image-container {
    border-color: #bebebe; }
  .subcategories-listing-container .subcategories-listing .subcategory-item .cat-image-container {
    align-items: center;
    border: 1px solid #ddd;
    display: flex;
    height: 75px;
    justify-content: center;
    width: 100%;
    overflow: hidden; }
  @media (min-width: 768px) {
        .subcategories-listing-container .subcategories-listing .subcategory-item .cat-image-container {
          height: 200px; } }
  .subcategories-listing-container .subcategories-listing .subcategory-item .cat-image-container div.fa-picture-o {
    color: #333;
    font-size: 80px; }
  .subcategories-listing-container .subcategories-listing .subcategory-item .cat-image {
    max-height: 75px;
    padding: 0; }
  @media (min-width: 768px) {
        .subcategories-listing-container .subcategories-listing .subcategory-item .cat-image {
          max-height: 200px; } }
  .subcategories-listing-container .subcategories-listing .subcategory-item .cat-name {
    align-items: center;
    border: 1px solid #ddd;
    border-top-width: 0;
    color: #333;
    display: flex;
    height: 50px;
    justify-content: center;
    text-align: center;
    background-color: #f5f5f5; }
  .subcategories-listing-container .subcategories-listing .subcategory-item .cat-name.no-image {
    border-top-width: 1px; }
  .subcategories-listing-container .subcategories-listing .subcategory-item .cat-image, .subcategories-listing-container .subcategories-listing .subcategory-item .cat-name, .subcategories-listing-container .subcategories-listing .subcategory-item .cat-image-container {
    -webkit-transition: all 500ms ease;
    -o-transition: all 500ms ease;
    transition: all 500ms ease; }
/* Fieldset
 ========================================================================== */
body.page-login #main .row-login > div {
  padding: 15px 50px 0; }
  body.page-login #main .row-login > div + div .fieldset-content {
    border-top: 1px solid #eee;
    padding-top: 30px; }
  body.page-login #main .row-login > div .fieldset-content {
    margin-bottom: 30px;
    text-align: center; }
  @media (min-width: 1200px) {
        body.page-login #main .row-login > div .fieldset-content {
          min-height: 230px;
          margin-bottom: 0; } }
  body.page-login #main .row-login > div .fieldset-content h4 {
    font-weight: 700;
    text-transform: uppercase;
    font-size: inherit;
    color: inherit;
    margin-bottom: 30px; }
  @media (min-width: 1200px) {
      body.page-login #main .row-login > div .fieldset-content, body.page-login #main .row-login > div + div .fieldset-content {
        padding-top: 0;
        border-top: none; }
      body.page-login #main .row-login > div + div {
        border-left: 1px solid #eee; } }
/* Checkout Shipping
 ========================================================================== */
body.page-shop.page-checkout-started .checkout-chevron, body.page-checkout-shipping .checkout-chevron, body.page-checkout-shipping-address .checkout-chevron, body.page-checkout-payment .checkout-chevron, body.page-checkout-payment-address .checkout-chevron, body.page-checkout-confirmation .checkout-chevron, body.page-checkout-success .checkout-chevron {
  height: 10px;
  width: 10px;
  fill: #337ab7; }
  body.page-shop.page-checkout-started #wrapper #main .main-inside, body.page-checkout-shipping #wrapper #main .main-inside, body.page-checkout-shipping-address #wrapper #main .main-inside, body.page-checkout-payment #wrapper #main .main-inside, body.page-checkout-payment-address #wrapper #main .main-inside, body.page-checkout-confirmation #wrapper #main .main-inside, body.page-checkout-success #wrapper #main .main-inside {
    padding-bottom: 60px; }
  body.page-shop.page-checkout-started #breadcrumb_navi, body.page-checkout-shipping #breadcrumb_navi, body.page-checkout-shipping-address #breadcrumb_navi, body.page-checkout-payment #breadcrumb_navi, body.page-checkout-payment-address #breadcrumb_navi, body.page-checkout-confirmation #breadcrumb_navi, body.page-checkout-success #breadcrumb_navi {
    display: none; }
  body.page-shop.page-checkout-started #shipping_error, body.page-checkout-shipping #shipping_error, body.page-checkout-shipping-address #shipping_error, body.page-checkout-payment #shipping_error, body.page-checkout-payment-address #shipping_error, body.page-checkout-confirmation #shipping_error, body.page-checkout-success #shipping_error {
    color: #fe0000; }
  body.page-shop.page-checkout-started .list-group .list-group-item, body.page-checkout-shipping .list-group .list-group-item, body.page-checkout-shipping-address .list-group .list-group-item, body.page-checkout-payment .list-group .list-group-item, body.page-checkout-payment-address .list-group .list-group-item, body.page-checkout-confirmation .list-group .list-group-item, body.page-checkout-success .list-group .list-group-item {
    border: 1px solid #eee;
    color: #333;
    margin-bottom: 15px;
    padding: 5px 15px 15px;
    background-color: transparent; }
  body.page-shop.page-checkout-started .list-group .list-group-item a, body.page-checkout-shipping .list-group .list-group-item a, body.page-checkout-shipping-address .list-group .list-group-item a, body.page-checkout-payment .list-group .list-group-item a, body.page-checkout-payment-address .list-group .list-group-item a, body.page-checkout-confirmation .list-group .list-group-item a, body.page-checkout-success .list-group .list-group-item a {
    color: #337ab7; }
  body.page-shop.page-checkout-started .list-group .list-group-item .price, body.page-checkout-shipping .list-group .list-group-item .price, body.page-checkout-shipping-address .list-group .list-group-item .price, body.page-checkout-payment .list-group .list-group-item .price, body.page-checkout-payment-address .list-group .list-group-item .price, body.page-checkout-confirmation .list-group .list-group-item .price, body.page-checkout-success .list-group .list-group-item .price {
    padding-top: 10px; }
  body.page-shop.page-checkout-started .list-group .list-group-item select, body.page-checkout-shipping .list-group .list-group-item select, body.page-checkout-shipping-address .list-group .list-group-item select, body.page-checkout-payment .list-group .list-group-item select, body.page-checkout-payment-address .list-group .list-group-item select, body.page-checkout-confirmation .list-group .list-group-item select, body.page-checkout-success .list-group .list-group-item select {
    color: initial; }
  body.page-shop.page-checkout-started .list-group .list-group-item .shipping-logo img, body.page-checkout-shipping .list-group .list-group-item .shipping-logo img, body.page-checkout-shipping-address .list-group .list-group-item .shipping-logo img, body.page-checkout-payment .list-group .list-group-item .shipping-logo img, body.page-checkout-payment-address .list-group .list-group-item .shipping-logo img, body.page-checkout-confirmation .list-group .list-group-item .shipping-logo img, body.page-checkout-success .list-group .list-group-item .shipping-logo img {
    max-width: 100px; }
  body.page-shop.page-checkout-started .list-group .list-group-item.paypal3-plus, body.page-checkout-shipping .list-group .list-group-item.paypal3-plus, body.page-checkout-shipping-address .list-group .list-group-item.paypal3-plus, body.page-checkout-payment .list-group .list-group-item.paypal3-plus, body.page-checkout-payment-address .list-group .list-group-item.paypal3-plus, body.page-checkout-confirmation .list-group .list-group-item.paypal3-plus, body.page-checkout-success .list-group .list-group-item.paypal3-plus {
    border-color: transparent;
    padding-left: 0;
    padding-right: 0; }
  body.page-shop.page-checkout-started .list-group .list-group-item.paypal3-plus .ppplus_payment_item, body.page-checkout-shipping .list-group .list-group-item.paypal3-plus .ppplus_payment_item, body.page-checkout-shipping-address .list-group .list-group-item.paypal3-plus .ppplus_payment_item, body.page-checkout-payment .list-group .list-group-item.paypal3-plus .ppplus_payment_item, body.page-checkout-payment-address .list-group .list-group-item.paypal3-plus .ppplus_payment_item, body.page-checkout-confirmation .list-group .list-group-item.paypal3-plus .ppplus_payment_item, body.page-checkout-success .list-group .list-group-item.paypal3-plus .ppplus_payment_item {
    padding: 0; }
  body.page-shop.page-checkout-started .list-group .list-group-item.paypal3-plus .ppplus_payment_item input[type="radio"], body.page-checkout-shipping .list-group .list-group-item.paypal3-plus .ppplus_payment_item input[type="radio"], body.page-checkout-shipping-address .list-group .list-group-item.paypal3-plus .ppplus_payment_item input[type="radio"], body.page-checkout-payment .list-group .list-group-item.paypal3-plus .ppplus_payment_item input[type="radio"], body.page-checkout-payment-address .list-group .list-group-item.paypal3-plus .ppplus_payment_item input[type="radio"], body.page-checkout-confirmation .list-group .list-group-item.paypal3-plus .ppplus_payment_item input[type="radio"], body.page-checkout-success .list-group .list-group-item.paypal3-plus .ppplus_payment_item input[type="radio"] {
    visibility: hidden; }
  body.page-shop.page-checkout-started .list-group .list-group-item.list-group-item-active, body.page-checkout-shipping .list-group .list-group-item.list-group-item-active, body.page-checkout-shipping-address .list-group .list-group-item.list-group-item-active, body.page-checkout-payment .list-group .list-group-item.list-group-item-active, body.page-checkout-payment-address .list-group .list-group-item.list-group-item-active, body.page-checkout-confirmation .list-group .list-group-item.list-group-item-active, body.page-checkout-success .list-group .list-group-item.list-group-item-active, body.page-shop.page-checkout-started .list-group .list-group-item.active, body.page-checkout-shipping .list-group .list-group-item.active, body.page-checkout-shipping-address .list-group .list-group-item.active, body.page-checkout-payment .list-group .list-group-item.active, body.page-checkout-payment-address .list-group .list-group-item.active, body.page-checkout-confirmation .list-group .list-group-item.active, body.page-checkout-success .list-group .list-group-item.active {
    border: 1px solid #ccc;
    color: #333;
    background-color: #eee; }
  body.page-shop.page-checkout-started .list-group .list-group-item.list-group-item-active a, body.page-checkout-shipping .list-group .list-group-item.list-group-item-active a, body.page-checkout-shipping-address .list-group .list-group-item.list-group-item-active a, body.page-checkout-payment .list-group .list-group-item.list-group-item-active a, body.page-checkout-payment-address .list-group .list-group-item.list-group-item-active a, body.page-checkout-confirmation .list-group .list-group-item.list-group-item-active a, body.page-checkout-success .list-group .list-group-item.list-group-item-active a, body.page-shop.page-checkout-started .list-group .list-group-item.active a, body.page-checkout-shipping .list-group .list-group-item.active a, body.page-checkout-shipping-address .list-group .list-group-item.active a, body.page-checkout-payment .list-group .list-group-item.active a, body.page-checkout-payment-address .list-group .list-group-item.active a, body.page-checkout-confirmation .list-group .list-group-item.active a, body.page-checkout-success .list-group .list-group-item.active a {
    color: #337ab7;
    text-decoration: underline; }
  body.page-shop.page-checkout-started .list-group .list-group-item.list-group-item-active a:hover, body.page-checkout-shipping .list-group .list-group-item.list-group-item-active a:hover, body.page-checkout-shipping-address .list-group .list-group-item.list-group-item-active a:hover, body.page-checkout-payment .list-group .list-group-item.list-group-item-active a:hover, body.page-checkout-payment-address .list-group .list-group-item.list-group-item-active a:hover, body.page-checkout-confirmation .list-group .list-group-item.list-group-item-active a:hover, body.page-checkout-success .list-group .list-group-item.list-group-item-active a:hover, body.page-shop.page-checkout-started .list-group .list-group-item.active a:hover, body.page-checkout-shipping .list-group .list-group-item.active a:hover, body.page-checkout-shipping-address .list-group .list-group-item.active a:hover, body.page-checkout-payment .list-group .list-group-item.active a:hover, body.page-checkout-payment-address .list-group .list-group-item.active a:hover, body.page-checkout-confirmation .list-group .list-group-item.active a:hover, body.page-checkout-success .list-group .list-group-item.active a:hover {
    text-decoration: none; }
  body.page-shop.page-checkout-started .list-group .list-group-item.list-group-item-active.paypal3-plus, body.page-checkout-shipping .list-group .list-group-item.list-group-item-active.paypal3-plus, body.page-checkout-shipping-address .list-group .list-group-item.list-group-item-active.paypal3-plus, body.page-checkout-payment .list-group .list-group-item.list-group-item-active.paypal3-plus, body.page-checkout-payment-address .list-group .list-group-item.list-group-item-active.paypal3-plus, body.page-checkout-confirmation .list-group .list-group-item.list-group-item-active.paypal3-plus, body.page-checkout-success .list-group .list-group-item.list-group-item-active.paypal3-plus, body.page-shop.page-checkout-started .list-group .list-group-item.active.paypal3-plus, body.page-checkout-shipping .list-group .list-group-item.active.paypal3-plus, body.page-checkout-shipping-address .list-group .list-group-item.active.paypal3-plus, body.page-checkout-payment .list-group .list-group-item.active.paypal3-plus, body.page-checkout-payment-address .list-group .list-group-item.active.paypal3-plus, body.page-checkout-confirmation .list-group .list-group-item.active.paypal3-plus, body.page-checkout-success .list-group .list-group-item.active.paypal3-plus {
    background-color: transparent;
    border-color: transparent; }
  body.page-shop.page-checkout-started .list-group .list-group-item.error, body.page-checkout-shipping .list-group .list-group-item.error, body.page-checkout-shipping-address .list-group .list-group-item.error, body.page-checkout-payment .list-group .list-group-item.error, body.page-checkout-payment-address .list-group .list-group-item.error, body.page-checkout-confirmation .list-group .list-group-item.error, body.page-checkout-success .list-group .list-group-item.error {
    padding: 10px 15px 10px 15px; }
  body.page-shop.page-checkout-started fieldset, body.page-checkout-shipping fieldset, body.page-checkout-shipping-address fieldset, body.page-checkout-payment fieldset, body.page-checkout-payment-address fieldset, body.page-checkout-confirmation fieldset, body.page-checkout-success fieldset {
    margin-bottom: 45px; }
  body.page-shop.page-checkout-started fieldset:first-of-type, body.page-checkout-shipping fieldset:first-of-type, body.page-checkout-shipping-address fieldset:first-of-type, body.page-checkout-payment fieldset:first-of-type, body.page-checkout-payment-address fieldset:first-of-type, body.page-checkout-confirmation fieldset:first-of-type, body.page-checkout-success fieldset:first-of-type {
    margin-top: 0; }
  body.page-shop.page-checkout-started fieldset .form-group iframe.form-control, body.page-shop.page-checkout-started fieldset .form-group iframe.input-text, body.page-checkout-shipping fieldset .form-group iframe.form-control, body.page-checkout-shipping fieldset .form-group iframe.input-text, body.page-checkout-shipping-address fieldset .form-group iframe.form-control, body.page-checkout-shipping-address fieldset .form-group iframe.input-text, body.page-checkout-payment fieldset .form-group iframe.form-control, body.page-checkout-payment fieldset .form-group iframe.input-text, body.page-checkout-payment-address fieldset .form-group iframe.form-control, body.page-checkout-payment-address fieldset .form-group iframe.input-text, body.page-checkout-confirmation fieldset .form-group iframe.form-control, body.page-checkout-confirmation fieldset .form-group iframe.input-text, body.page-checkout-success fieldset .form-group iframe.form-control, body.page-checkout-success fieldset .form-group iframe.input-text {
    height: auto;
    min-height: 200px; }
  body.page-shop.page-checkout-started div.amzadvpay_countrynotallowed, body.page-checkout-shipping div.amzadvpay_countrynotallowed, body.page-checkout-shipping-address div.amzadvpay_countrynotallowed, body.page-checkout-payment div.amzadvpay_countrynotallowed, body.page-checkout-payment-address div.amzadvpay_countrynotallowed, body.page-checkout-confirmation div.amzadvpay_countrynotallowed, body.page-checkout-success div.amzadvpay_countrynotallowed {
    color: #fff;
    background: #c20400;
    padding: 15px;
    margin-top: 15px; }
  body.page-shop.page-checkout-started .end-shopping, body.page-checkout-shipping .end-shopping, body.page-checkout-shipping-address .end-shopping, body.page-checkout-payment .end-shopping, body.page-checkout-payment-address .end-shopping, body.page-checkout-confirmation .end-shopping, body.page-checkout-success .end-shopping {
    margin-top: 15px; }

#checkout_payment textarea {
  min-height: 200px; }
  #checkout_payment .miscellaneous-container {
    height: 200px;
    overflow-y: auto;
    border-radius: 2px;
    border: 1px solid #ccc;
    background-color: #eee;
    padding: 9px 12px;
    opacity: 1;
    font-family: Roboto, Arial, sans-serif;
    font-size: 13px;
    line-height: 1.42857;
    color: #555;
    -webkit-overflow-scrolling: touch; }
  #checkout_payment .miscellaneous-container.iframe {
    padding: 0; }
  #checkout_payment .miscellaneous-container.iframe iframe {
    width: 100%;
    height: 190px;
    border: 0; }
  #checkout_payment .additional-condition {
    margin-top: 15px; }

textarea#comments {
  height: 100px;
  min-height: 0; }

.checkout-payment-form {
  color: #333;
  padding-top: 15px; }

body.page-checkout-confirmation .checkout-confirmation-submit {
  margin-bottom: 15px; }
  @media (min-width: 768px) {
    body.page-checkout-confirmation .checkout-confirmation-submit {
      margin-bottom: 0; } }
  @media (min-width: 768px) {
    body.page-checkout-confirmation .checkout-confirmation-back-button {
      margin-top: 50px; } }
  body.page-checkout-confirmation .order-wishlist > table > thead > tr > th {
    border-color: #e7e7e7;
    color: #999; }
  body.page-checkout-confirmation .order-wishlist > table > tbody > tr > td, body.page-checkout-confirmation .order-total > tbody > tr, body.page-checkout-confirmation .order-total > tbody > tr > td {
    border-color: #e7e7e7;
    color: #333;
    background-color: #f3f3f3; }
  body.page-checkout-confirmation .order-wishlist > table > tbody > tr > td.product, body.page-checkout-confirmation .order-total > tbody > tr.product, body.page-checkout-confirmation .order-total > tbody > tr > td.product {
    color: #555; }
  body.page-checkout-confirmation .order-wishlist > table > tbody > tr > td.product .product-title, body.page-checkout-confirmation .order-total > tbody > tr.product .product-title, body.page-checkout-confirmation .order-total > tbody > tr > td.product .product-title {
    color: #333; }
  body.page-checkout-confirmation .order-wishlist > table {
    border-bottom: 3px solid #e7e7e7; }
  body.page-checkout-confirmation .order-wishlist > table > tbody > tr {
    margin-left: 0 !important;
    margin-right: 0 !important; }
  @media (min-width: 992px) {
    body.page-checkout-confirmation .order-wishlist > table > tbody > tr.item:last-child td {
      border-bottom: 3px solid #e7e7e7; } }
  body.page-checkout-confirmation .order-total > tbody > tr > td {
    border-top-width: 1px;
    border-color: #e7e7e7; }
  body.page-checkout-confirmation .order-wishlist table {
    margin-bottom: 0; }
  body.page-checkout-confirmation .order-total > tbody > tr:first-of-type > td {
    border-top: none !important; }

  @media (min-width: 768px) and (min-width: 992px) {
      body.page-checkout-confirmation .order-total > tbody > tr.order-total-last > td {
        font-size: 16px; } }
  body.page-checkout-confirmation fieldset.payment-information-data {
    margin-bottom: 0; }
  body.page-checkout-confirmation fieldset.payment-information-data address {
    margin-bottom: 0; }
  body.page-checkout-confirmation table.payment-information-table {
    margin-bottom: 45px; }
  body.page-checkout-confirmation table.payment-information-table tr:first-of-type td {
    border-top-color: transparent; }
  body.page-checkout-confirmation table.voucher-info {
    width: 100%;
    margin: 0 auto; }
  body.page-checkout-confirmation table.voucher-info th, body.page-checkout-confirmation table.voucher-info td {
    padding: 3px 5px; }
  body.page-checkout-confirmation table.voucher-info th.giftvoucher-balance, body.page-checkout-confirmation table.voucher-info td.giftvoucher-balance {
    text-align: right; }
/* Checkout Shipping specific styling
 ======================================================================== */
body.page-checkout-shipping .list-group .list-group-item.free {
  padding-top: 15px; }
  body.page-checkout-shipping .list-group .list-group-item .shipping-module-container {
    display: table;
    padding-left: 0;
    width: 100%; }
  body.page-checkout-shipping .list-group .list-group-item .shipping-module-container .shipping-module-selection, body.page-checkout-shipping .list-group .list-group-item .shipping-module-container .shipping-module-info, body.page-checkout-shipping .list-group .list-group-item .shipping-module-container .shipping-module-icon {
    display: table-cell;
    float: none;
    vertical-align: middle; }
  body.page-checkout-shipping .list-group .list-group-item .shipping-module-container .shipping-module-selection {
    padding: 0;
    min-width: 16px; }
  body.page-checkout-shipping .list-group .list-group-item .shipping-module-container .shipping-module-selection:focus, body.page-checkout-shipping .list-group .list-group-item .shipping-module-container .shipping-module-selection:active {
    outline: none; }
  body.page-checkout-shipping .list-group .list-group-item .shipping-module-container .shipping-module-selection input[type="radio"] {
    margin-left: 0;
    position: relative; }
  body.page-checkout-shipping .list-group .list-group-item .shipping-module-container .shipping-module-selection input[type="radio"]:focus, body.page-checkout-shipping .list-group .list-group-item .shipping-module-container .shipping-module-selection input[type="radio"]:active {
    outline: none; }
  body.page-checkout-shipping .list-group .list-group-item .shipping-module-container .shipping-module-info .shipping-module-title, body.page-checkout-shipping .list-group .list-group-item .shipping-module-container .shipping-module-info .shipping-module-cost {
    font-weight: bold; }
  body.page-checkout-shipping .list-group .list-group-item .shipping-module-container .shipping-module-info .shipping-module-description {
    display: block; }
  body.page-checkout-shipping .list-group .list-group-item .shipping-module-container .shipping-module-icon {
    padding-right: 5px;
    text-align: right; }
  body.page-checkout-shipping .list-group .list-group-item .shipping-module-container .shipping-module-icon img {
    background-color: #f3f3f3;
    border-radius: 5px;
    display: inline-block;
    height: 50px; }
  body.page-checkout-shipping .list-group .list-group-item.active .shipping-module-icon img {
    background-color: #fff; }
  @media (min-width: 768px) {
      body.page-checkout-shipping .list-group .shipping-submodule-title {
        margin-bottom: -30px; } }
  body.page-checkout-shipping .list-group .shipping-submodule-title .shipping-module-container .shipping-module-info {
    vertical-align: top;
    padding-top: 15px; }
  body.page-checkout-shipping .list-group .shipping-submodule-title .shipping-module-container .shipping-module-selection {
    vertical-align: unset; }
  body.page-checkout-shipping .list-group .shipping-submodule-title .shipping-module-container .shipping-module-selection input {
    margin-top: 17px; }
  body.page-checkout-shipping .list-group .shipping-submodule-title .shipping-module-icon {
    padding-top: 10px; }
  body.page-checkout-shipping .list-group .shipping-submodule {
    margin-left: 30px; }
  body.page-checkout-shipping .list-group .shipping-submodule .shipping-submodule-selection input {
    position: inherit;
    margin: 0; }
  body.page-checkout-shipping .list-group .shipping-submodule .shipping-module-container {
    width: 90% !important;
    display: inline-block !important; }
/* Checkout Payment specific styling
 ======================================================================== */
body.page-checkout-payment .list-group .list-group-item:only-child .payment-module-container .payment-module-info .checkout-payment-form {
  display: block; }
  body.page-checkout-payment .list-group .list-group-item .payment-module-container {
    display: table;
    padding-left: 0;
    width: 100%; }
  body.page-checkout-payment .list-group .list-group-item .payment-module-container .hub-logo, body.page-checkout-payment .list-group .list-group-item .payment-module-container .gambio-pay-icon {
    display: none !important; }
  body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-selection, body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-info, body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-icon {
    display: table-cell;
    float: none; }
  body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-info {
    vertical-align: middle; }
  body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-selection {
    padding: 0; }
  body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-selection:focus, body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-selection:active {
    outline: none; }
  body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-selection input[type="radio"] {
    margin-left: 0;
    position: relative; }
  body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-selection input[type="radio"]:focus, body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-selection input[type="radio"]:active {
    outline: none; }
  body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-info .payment-module-title, body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-info .payment-module-cost {
    font-weight: bold; }
  body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-info .payment-module-description {
    display: block;
    overflow: hidden; }
  body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-info .checkout-payment-form {
    display: none; }
  body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-info .checkout-payment-form .well {
    border: none;
    box-shadow: none;
    -webkit-box-shadow: none;
    background-color: #ccc; }
  body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-icon {
    padding-right: 5px;
    text-align: right; }
  body.page-checkout-payment .list-group .list-group-item .payment-module-container .payment-module-icon img {
    background-color: #f3f3f3;
    border-radius: 5px;
    display: inline-block;
    height: 50px; }
  body.page-checkout-payment .list-group .list-group-item.active .payment-module-info .payment-module-description {
    overflow: inherit; }
  body.page-checkout-payment .list-group .list-group-item.active .payment-module-info .checkout-payment-form {
    display: block; }
  @media (max-width: 767px) {
            body.page-checkout-payment .list-group .list-group-item.active .payment-module-info .checkout-payment-form {
              margin-left: -26px;
              margin-top: 15px;
              min-width: 250px; } }
  body.page-checkout-payment .list-group .list-group-item.active .payment-module-icon img {
    background-color: #fff; }
  body.page-checkout-payment .list-group .list-group-item.active .has-form .payment-module-selection {
    vertical-align: top; }
  body.page-checkout-payment .list-group .list-group-item.active .has-form .payment-module-icon {
    vertical-align: top; }
  body.page-checkout-payment .list-group .list-group-item.sofort_sofortueberweisung .payment-module-description > ul {
    padding-left: 12px; }
/* PayPal3 Plus Checkout Payment Block
 ======================================================================== */
body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item {
  padding: 0;
  margin: 0;
  display: none; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item .payment_item label .module-icon {
    display: none; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item .payment_item label .module-info {
    padding: 0; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus) {
    background-color: #fff;
    border-color: #dfdfdf;
    border-width: 0 0 1px 0;
    margin: 0 -7px 0 -6px;
    min-height: 64px;
    top: -34px;
    z-index: 2;
    padding-top: 6px; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).above {
    border-width: 1px 0 0 0;
    top: 26px;
    z-index: 3; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus) .payment_item {
    display: table;
    height: 60px;
    padding-top: 0; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus) .payment_item label {
    display: table-cell;
    vertical-align: middle; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus) .payment_item label .module-icon {
    display: block;
    margin: -6px 0 0 -20px;
    max-width: 127px;
    padding: 0 0 0 15px; }
    @media (max-width: 479px) {
              body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus) .payment_item label .module-icon {
                margin-left: -26px; } }
    body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus) .payment_item label .module-icon img {
      border-radius: 5px;
      height: 50px;
      background-color: #f3f3f3; }
    @media (max-width: 767px) {
                body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus) .payment_item label .module-icon img {
                  height: auto;
                  max-height: 50px; } }
  @media (min-width: 768px) {
                body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus) .payment_item label .module-info {
                  line-height: 38px; } }
    body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus) .payment_item label .module-info .module-name {
      color: #666;
      display: block;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14px;
      font-weight: 300;
      padding: 0 0 0 15px; }
    body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus) .payment_item label .module-info .module-description {
      color: #3f3f3f;
      display: none;
      font-size: 11px;
      padding: 0 15px; }
    body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus) .payment_item label .module-info .checkout-payment-form {
      display: none; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus) .payment_item.radio .control {
    display: block;
    text-align: right; }
    body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus) .payment_item.radio .control input[type="radio"] {
      display: none;
      margin: 0; }
  @media (max-width: 767px) {
            body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus) .payment_item .checkout-payment-form.visible-xs {
              display: none !important; } }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active {
    background-color: #f9f9f9;
    border-color: #dfdfdf;
    color: #666; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active .payment_item .module-icon img {
    background-color: #f3f3f3; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active .payment_item .module-info {
    line-height: inherit; }
    body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active .payment_item .module-info .module-name {
      font-weight: bold; }
    body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active .payment_item .module-info .module-description {
      display: block; }
    body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active .payment_item .module-info .checkout-payment-form {
      display: block; }
    @media (max-width: 767px) {
                body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active .payment_item .module-info .checkout-payment-form {
                  min-width: 283px;
                  margin-left: -55px; } }
    body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active .payment_item .module-info .checkout-payment-form .well {
      display: block; }
      body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active .payment_item .module-info .checkout-payment-form .well .form-group {
        display: block; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active .payment_item .no-description .module-info {
    line-height: 38px; }
    body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active .payment_item .no-description .module-info .well span {
      line-height: initial; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active .payment_item.radio .control:after {
    content: " ";
    background-image: url("public/theme//images/checkmark.png");
    display: inline-block;
    height: 18px;
    width: 23px; }
    @media (max-width: 479px) {
                  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active .payment_item.radio .control:after {
                    margin-left: -20px; } }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active .payment_item.with-form .module-name {
    margin-top: 10px; }
    body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active .payment_item.with-form .module-icon {
      margin-top: 2px; }
    body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).active .payment_item.with-form.radio .control {
      margin-top: 5px; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus):hover {
    background-color: #f9f9f9; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item[class^='payone'].active label a, body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item[class*=' payone'].active label a {
    color: #337ab7;
    text-decoration: none; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.paypal3-plus {
    display: block;
    margin-top: 1px; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.paypal3-plus .payment_item label {
    width: 100%;
    padding-left: 15px; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.paypal3-plus .payment_item label .control {
    visibility: hidden; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.paypal3-plus .payment_item label .module-description #ppplus iframe {
    background-color: transparent; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.paypal3_installments.active .payment_item label:not(.no-description) .module-icon, body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.sofort_sofortueberweisung.active .payment_item label:not(.no-description) .module-icon {
    margin-top: 2px; }
    body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.paypal3_installments.active .payment_item label:not(.no-description) .control, body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.sofort_sofortueberweisung.active .payment_item label:not(.no-description) .control {
      margin-top: 2px; }
  body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.sofort_sofortueberweisung .module-description > ul {
    margin-bottom: 5px;
    padding-left: 10px; }
/* GV Code Credit Styling
 ======================================================================== */
body.page-checkout-payment fieldset.credit {
  margin-top: 30px; }
  @media (min-width: 768px) {
      body.page-checkout-payment fieldset.credit {
        margin-left: -30px; } }
  body.page-checkout-payment fieldset.credit .gv-value {
    border: 1px solid #eee;
    color: #333;
    margin-bottom: 15px;
    padding: 5px 15px 15px;
    background-color: transparent; }
  @media (min-width: 768px) {
        body.page-checkout-payment fieldset.credit .gv-value {
          margin-left: 30px; } }
  body.page-checkout-payment fieldset.credit .gv-value input {
    top: -15px;
    margin-left: -21px;
    position: relative;
    display: inline-block; }
  @media (min-width: 768px) {
          body.page-checkout-payment fieldset.credit .gv-value input {
            top: -10px; } }
  body.page-checkout-payment fieldset.credit .gv-value .gv-prompt {
    margin-left: 7px;
    position: relative; }
  body.page-checkout-payment fieldset.credit .gv-value.active {
    border: 1px solid #ccc;
    color: #333;
    background-color: #eee; }
/* checkout_success styling */
body.page-checkout-success div.gift-vouchers-status table {
  margin: 0 0 30px; }
  body.page-checkout-success div.gift-vouchers-status table th.giftvoucher-code, body.page-checkout-success div.gift-vouchers-status table td.giftvoucher-code {
    padding: 3px 15px 3px 0; }
  body.page-checkout-success div.gift-vouchers-status table th.giftvoucher-balance-remaining, body.page-checkout-success div.gift-vouchers-status table td.giftvoucher-balance-remaining {
    padding: 3px 0 3px 15px;
    text-align: right; }
/* Rating Star Display
 ========================================================================== */
.rating-stars {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 16px;
  margin-bottom: 10px;
  color: #ccc; }
  .rating-stars .rating-stars-mask {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    overflow: hidden; }
  .rating-stars .rating-stars-mask .rating-stars-inside {
    color: #ff9000;
    display: inline-block;
    height: inherit;
    white-space: nowrap;
    width: 80px; }
  .rating-stars .glyphicon, .rating-stars .fa, .rating-stars .gm-star {
    float: left;
    font-size: 16px;
    width: 16px; }
  .rating-stars [class^="gm-"]:before, .rating-stars [class*=" gm-"]:before {
    margin-left: 0; }
  .rating-stars.rating-stars-0 > .rating-stars-mask {
    width: 0%; }
  .rating-stars.rating-stars-5 > .rating-stars-mask {
    width: 10%; }
  .rating-stars.rating-stars-10 > .rating-stars-mask {
    width: 20%; }
  .rating-stars.rating-stars-15 > .rating-stars-mask {
    width: 30%; }
  .rating-stars.rating-stars-20 > .rating-stars-mask {
    width: 40%; }
  .rating-stars.rating-stars-25 > .rating-stars-mask {
    width: 50%; }
  .rating-stars.rating-stars-30 > .rating-stars-mask {
    width: 60%; }
  .rating-stars.rating-stars-35 > .rating-stars-mask {
    width: 70%; }
  .rating-stars.rating-stars-40 > .rating-stars-mask {
    width: 80%; }
  .rating-stars.rating-stars-45 > .rating-stars-mask {
    width: 90%; }
  .rating-stars.rating-stars-50 > .rating-stars-mask {
    width: 100%; }
  .rating-item .rating-stars {
    margin-top: 10px;
    margin-bottom: 5px; }

.rating-item a.btn, .rating-item .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel a, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .rating-item a {
  display: none; }

.rating-stars-separate {
  color: #ff9000; }

.shipping-calculator-shipping-modules, .shipping-calculator-shipping-weight-unit, .shipping-calculator-shipping-costs {
  padding: 10px 15px; }
  .shipping-calculator-shipping-modules select, .shipping-calculator-shipping-weight-unit select, .shipping-calculator-shipping-costs select {
    margin: -10px 0; }
/* Ribbons
 ========================================================================== */
.ribbons {
  position: absolute;
  right: -30px;
  top: 0px; }
  .ribbons > div {
    height: 20px;
    width: 40px;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    border-right: 1px solid #fff;
    padding-top: 2px; }
  .ribbons > div:last-of-type {
    border-right: 0; }
  .ribbons > div.ribbon-sold-out {
    width: 70px; }
  .ribbons > .ribbon-new {
    background: #515151;
    color: #fff; }
  .ribbons > .ribbon-special {
    background: #f1544d;
    color: #fff; }
  .ribbons > .ribbon-available {
    background: #79a70a;
    color: #fff; }
  .ribbons > .ribbon-recommendation {
    background: #337ab7;
    color: #fff; }
  .ribbons > .ribbon-sold-out {
    background: #c20400;
    color: #fff; }
  .productlist-viewmode-list .ribbons {
    left: 0;
    right: auto;
    top: 0; }
  .product-info-details .ribbons {
    right: 15px;
    top: 15px; }
/* Manufacturer Logo
 ========================================================================== */
.manufacturer-logo {
  position: absolute;
  left: -25px;
  top: -15px;
  max-height: 80px;
  max-width: 80px; }
  body.page-product-info .manufacturer-logo {
    left: auto;
    right: 15px;
    top: 0px;
    z-index: 2; }
  @media (min-width: 768px) {
    body.page-product-info .manufacturer-logo {
      max-height: 150px;
      max-width: 150px; } }

.page-account-history .order-history-element {
  margin-bottom: 40px; }
  .page-account-history .order-history-element h3 {
    border-width: 2px;
    font-size: 16px;
    margin-bottom: 15px;
    padding-bottom: 5px; }

.page-account-history-info h3 {
  margin-top: 45px;
  margin-bottom: 25px; }
  .page-account-history-info table > tfoot {
    background-color: #eee; }
  .page-account-history-info table > tfoot > tr > th, .page-account-history-info table > tfoot > tr > td {
    border: none;
    text-align: right; }
  @media (max-width: 767px) {
          .page-account-history-info table > tfoot > tr > th.capture, .page-account-history-info table > tfoot > tr > td.capture {
            position: relative;
            float: left;
            width: 66.66667%;
            min-height: 1px;
            padding-left: 15px;
            padding-right: 15px; }
          .page-account-history-info table > tfoot > tr > th.value, .page-account-history-info table > tfoot > tr > td.value {
            position: relative;
            float: left;
            width: 33.33333%;
            min-height: 1px;
            padding-left: 15px;
            padding-right: 15px; } }
  .page-account-history-info table > tfoot tr:first-of-type {
    border-top: 1px solid #ddd; }

ul.col-xs-12.history-download-list {
  list-style-type: none; }

#create_account #captcha {
  padding-left: 0; }
  #create_account .password-note {
    margin-top: 24px;
    margin-bottom: 24px; }
  #create_account fieldset.password-optional {
    background-color: rgba(51, 122, 183, 0.1);
    padding: 24px 24px 9px;
    color: #337ab7; }
  @media (max-width: 1199px) {
    #create_account fieldset.password-optional {
      padding-right: 24px; } }
  #create_account fieldset.password-optional .password-option-margin {
    margin-left: 50px; }
  #create_account fieldset.password-optional span.password-option-margin {
    display: inline-block; }
  #create_account fieldset.password-optional .row.password-option-margin, #create_account fieldset.password-optional .total-box table tr.total.password-option-margin, .total-box table #create_account fieldset.password-optional tr.total.password-option-margin {
    margin-left: 35px; }
  #create_account fieldset.password-optional input[type="checkbox"] {
    display: inline;
    margin: 0 5px 0 0; }
  #create_account fieldset.password-optional i.green-check {
    color: #008000;
    margin-right: 12px; }
  #create_account fieldset.password-optional label.headline {
    display: inline;
    color: #337ab7;
    text-transform: uppercase;
    font-weight: bold; }

.page-account .account-options-container ul {
  list-style: none;
  padding-left: 0; }
  .page-account .account-options-container ul li {
    border-bottom: 1px transparent;
    border-top: 1px solid #eee;
    padding: 3px 0 3px; }
  .page-account .account-options-container ul li:last-of-type {
    border-bottom: 1px solid #eee; }
  .page-account .account-options-container ul li a {
    color: #333;
    display: inline-block;
    font-size: 14px;
    line-height: 37px; }
  .page-account .account-options-container ul li.send-gift .current-balance {
    display: block;
    margin-bottom: 10px; }
  .page-account td.downloads {
    max-width: 100px; }
  .page-account td ul.download-products-list {
    list-style: none;
    padding-left: 0;
    margin: 0; }
  .page-account td ul.download-products-list li {
    padding-bottom: 10px; }
  .page-account td ul.download-products-list li span.download-info {
    display: block;
    padding: 6px 0; }

dd.button-container {
  margin: 5px 0 0 0; }
  dd.button-container a.btn, dd.button-container .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel a, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel dd.button-container a {
    margin-right: 5px;
    overflow: hidden;
    text-overflow: ellipsis; }
  dd.button-container a.btn:last-child, dd.button-container .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel a:last-child, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel dd.button-container a:last-child {
    margin-right: 0; }

.navigation-buttons {
  margin-top: 35px; }

.address-notification {
  margin: 15px 0; }

div.privacy-link {
  margin-top: 45px; }

table.parcelshops {
  width: 100%; }
  table.parcelshops > thead > tr > th, table.parcelshops > tbody > tr > td {
    border-bottom: 1px solid #444;
    vertical-align: top;
    padding: 1ex; }
  table.parcelshops > tbody > tr > td {
    border-bottom-color: #888; }
  table.parcelshops > tbody > tr > td.geoposition {
    text-align: center; }
  table.parcelshops tr.parcelshop.marker_clicked {
    background: #fc0; }
  table.parcelshops td.prepare_ab_button {
    vertical-align: middle; }

table.openinghours td:nth-child(1) {
  padding-right: 1ex; }

div.resultmap, div#map {
  margin: 1.5em auto; }
  div#map {
    height: 400px; }
  div.mapmarkerlabel {
    background: #ff5050;
    border-radius: 1em;
    padding: 5px 10px;
    display: inline-block;
    font-size: 1.1em;
    font-weight: bold;
    margin: 1ex 0;
    cursor: pointer; }
  div.mapmarkerlabel_icon {
    background-repeat: no-repeat;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: inline-block;
    font-size: 1.1em;
    font-weight: bold;
    padding-top: 10px; }
  div.mapmarkerlabel_postoffice {
    background-image: url("public/theme//images/icons/postfiliale.png"); }
  div.mapmarkerlabel_packstation {
    background-image: url("public/theme//images/icons/packstation.png"); }
  div.mapmarkerlabel_parcelshop {
    background-image: url("public/theme//images/icons/paketshop.png"); }

p.error {
  padding: 1ex 1em;
  color: #fff;
  background-color: #c20400;
  text-align: center;
  font-size: 1.2em; }

form#psf_new_ab {
  margin-top: 2em;
  display: none; }
  form#psf_new_ab input.invalid {
    border-color: #f00 !important; }

#psf-form {
  display: none; }
  #psf-form fieldset {
    margin-bottom: 15px; }
  #psf-form #psfsubmit {
    width: 100%; }

.cookie-bar {
  display: none;
  left: 0;
  margin: 0;
  position: fixed;
  width: 100%;
  z-index: 3; }
  .cookie-bar.top {
    top: 0; }
  .cookie-bar.bottom {
    bottom: 0; }
  .cookie-bar .content {
    display: table-cell;
    float: none; }
  .cookie-bar .content p {
    display: inline-block;
    margin: 0; }
  .cookie-bar .content .btn, .cookie-bar .content .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .cookie-bar .content button {
    margin: 5px 15px; }
  .cookie-bar .close-button {
    cursor: pointer;
    display: table-cell;
    float: none;
    margin: 6px 0;
    text-align: right; }
  .cookie-bar .close-button.btn, .cookie-bar .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.close-button, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .cookie-bar button.close-button {
    display: inline-block; }

.shipping-payment-mobile .shipping-payment-block {
  padding: 5px 10px;
  border-bottom: 1px solid #e7e7e7; }
  .shipping-payment-mobile .shipping-payment-block:first-child {
    border-top: 1px solid #e7e7e7; }
  .shipping-payment-mobile .shipping-payment-block:nth-child(odd) {
    background-color: #f9f9f9; }
  .shipping-payment-mobile .shipping-payment-block .row, .shipping-payment-mobile .shipping-payment-block .total-box table tr.total, .total-box table .shipping-payment-mobile .shipping-payment-block tr.total {
    padding: 5px 0;
    margin-left: -10px;
    margin-right: -10px; }
  .shipping-payment-mobile .shipping-payment-block .row .info, .shipping-payment-mobile .shipping-payment-block .total-box table tr.total .info, .total-box table .shipping-payment-mobile .shipping-payment-block tr.total .info {
    font-weight: bold; }

@media (max-width: 1199px) {
    body.page-withdrawal .btn.btn-primary.btn-block, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.btn-primary.btn-block, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn-block, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-group-btn button.dropdown-toggle.ui-priority-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-group-btn button.dropdown-toggle.ui-priority-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-number .btn-plus button.dropdown-toggle.ui-priority-primary, .input-number body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .btn-plus button.dropdown-toggle.ui-priority-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-number .btn-minus button.dropdown-toggle.ui-priority-primary, .input-number body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .btn-minus button.dropdown-toggle.ui-priority-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-number .btn-plus button.dropdown-toggle.ui-priority-primary, .input-number body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .btn-plus button.dropdown-toggle.ui-priority-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-number .btn-minus button.dropdown-toggle.ui-priority-primary, .input-number body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .btn-minus button.dropdown-toggle.ui-priority-primary, .navbar-search .input-group .input-group-btn body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle.ui-priority-primary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn-block, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-group-btn button.dropdown-toggle.btn-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-group-btn button.dropdown-toggle.btn-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-number .btn-plus button.dropdown-toggle.btn-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-number .btn-plus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-number .btn-plus button.ui-priority-primary.dropdown-toggle, .input-number body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .btn-plus button.dropdown-toggle.btn-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-number .btn-minus button.dropdown-toggle.btn-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-number .btn-minus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-number .btn-minus button.ui-priority-primary.dropdown-toggle, .input-number body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .btn-minus button.dropdown-toggle.btn-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-group-btn .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-group-btn button.ui-priority-primary.dropdown-toggle, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-number .btn-plus button.dropdown-toggle.btn-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-number .btn-plus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-number .btn-plus button.ui-priority-primary.dropdown-toggle, .input-number body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .btn-plus button.dropdown-toggle.btn-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-number .btn-minus button.dropdown-toggle.btn-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-number .btn-minus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-number .btn-minus button.ui-priority-primary.dropdown-toggle, .input-number body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .btn-minus button.dropdown-toggle.btn-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-group-btn .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-group-btn button.ui-priority-primary.dropdown-toggle, .navbar-search .input-group .input-group-btn body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle.btn-primary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal button.btn-primary.btn-block, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.btn.btn-block, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-group-btn button.dropdown-toggle.ui-priority-primary.btn, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-group-btn button.dropdown-toggle.ui-priority-primary.btn, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-number .btn-plus button.dropdown-toggle.ui-priority-primary.btn, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-number .btn-plus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle.ui-priority-primary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-number .btn-plus button.dropdown-toggle.ui-priority-primary, .input-number body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .btn-plus button.dropdown-toggle.ui-priority-primary.btn, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-number .btn-minus button.dropdown-toggle.ui-priority-primary.btn, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-number .btn-minus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle.ui-priority-primary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-number .btn-minus button.dropdown-toggle.ui-priority-primary, .input-number body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .btn-minus button.dropdown-toggle.ui-priority-primary.btn, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-group-btn .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle.ui-priority-primary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-number .input-group-btn button.dropdown-toggle.ui-priority-primary, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-number .btn-plus button.dropdown-toggle.ui-priority-primary.btn, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-number .btn-plus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle.ui-priority-primary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-number .btn-plus button.dropdown-toggle.ui-priority-primary, .input-number body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .btn-plus button.dropdown-toggle.ui-priority-primary.btn, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-number .btn-minus button.dropdown-toggle.ui-priority-primary.btn, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-number .btn-minus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle.ui-priority-primary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-number .btn-minus button.dropdown-toggle.ui-priority-primary, .input-number body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .btn-minus button.dropdown-toggle.ui-priority-primary.btn, body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-group-btn .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle.ui-priority-primary, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .navbar-search .input-group .input-group-btn button.dropdown-toggle.ui-priority-primary, .navbar-search .input-group .input-group-btn body.page-withdrawal .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle.ui-priority-primary.btn, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal button.ui-priority-primary.btn.btn-block, body.page-withdrawal .navbar-search .input-group .input-group-btn .dropdown-toggle.btn.btn-primary, body.page-withdrawal .navbar-search .input-number .input-group-btn .dropdown-toggle.btn.btn-primary, body.page-withdrawal .navbar-search .input-number .input-number .btn-plus .dropdown-toggle.btn.btn-primary, body.page-withdrawal .navbar-search .input-number .input-number .btn-plus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle.btn-primary, body.page-withdrawal .navbar-search .input-number .input-number .btn-plus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-number .input-number .btn-plus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-number .input-number .btn-plus button.dropdown-toggle.btn-primary, body.page-withdrawal .navbar-search .input-number .input-number .btn-plus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle.btn, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-number .input-number .btn-plus button.ui-priority-primary.dropdown-toggle.btn, .input-number body.page-withdrawal .navbar-search .input-number .btn-plus .dropdown-toggle.btn.btn-primary, body.page-withdrawal .navbar-search .input-number .input-number .btn-minus .dropdown-toggle.btn.btn-primary, body.page-withdrawal .navbar-search .input-number .input-number .btn-minus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle.btn-primary, body.page-withdrawal .navbar-search .input-number .input-number .btn-minus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-number .input-number .btn-minus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-number .input-number .btn-minus button.dropdown-toggle.btn-primary, body.page-withdrawal .navbar-search .input-number .input-number .btn-minus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle.btn, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-number .input-number .btn-minus button.ui-priority-primary.dropdown-toggle.btn, .input-number body.page-withdrawal .navbar-search .input-number .btn-minus .dropdown-toggle.btn.btn-primary, body.page-withdrawal .navbar-search .input-number .input-group-btn .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle.btn-primary, body.page-withdrawal .navbar-search .input-number .input-group-btn .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-number .input-group-btn .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-number .input-group-btn button.dropdown-toggle.btn-primary, body.page-withdrawal .navbar-search .input-number .input-group-btn .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle.btn, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-number .input-group-btn button.ui-priority-primary.dropdown-toggle.btn, body.page-withdrawal .navbar-search .input-group .input-number .btn-plus .dropdown-toggle.btn.btn-primary, body.page-withdrawal .navbar-search .input-group .input-number .btn-plus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle.btn-primary, body.page-withdrawal .navbar-search .input-group .input-number .btn-plus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-group .input-number .btn-plus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-group .input-number .btn-plus button.dropdown-toggle.btn-primary, body.page-withdrawal .navbar-search .input-group .input-number .btn-plus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle.btn, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-group .input-number .btn-plus button.ui-priority-primary.dropdown-toggle.btn, .input-number body.page-withdrawal .navbar-search .input-group .btn-plus .dropdown-toggle.btn.btn-primary, body.page-withdrawal .navbar-search .input-group .input-number .btn-minus .dropdown-toggle.btn.btn-primary, body.page-withdrawal .navbar-search .input-group .input-number .btn-minus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle.btn-primary, body.page-withdrawal .navbar-search .input-group .input-number .btn-minus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-group .input-number .btn-minus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-group .input-number .btn-minus button.dropdown-toggle.btn-primary, body.page-withdrawal .navbar-search .input-group .input-number .btn-minus .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle.btn, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-group .input-number .btn-minus button.ui-priority-primary.dropdown-toggle.btn, .input-number body.page-withdrawal .navbar-search .input-group .btn-minus .dropdown-toggle.btn.btn-primary, body.page-withdrawal .navbar-search .input-group .input-group-btn .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.dropdown-toggle.btn-primary, body.page-withdrawal .navbar-search .input-group .input-group-btn .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-group .input-group-btn .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-group .input-group-btn button.dropdown-toggle.btn-primary, body.page-withdrawal .navbar-search .input-group .input-group-btn .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel button.ui-priority-primary.dropdown-toggle.btn, .comiseo-daterangepicker .comiseo-daterangepicker-buttonpanel body.page-withdrawal .navbar-search .input-group .input-group-btn button.ui-priority-primary.dropdown-toggle.btn, .navbar-search .input-group .input-group-btn body.page-withdrawal .dropdown-toggle.btn.btn-primary {
      white-space: inherit; } }

div.payment_instruction {
  width: 80%;
  margin: 1ex auto;
  background-color: #eee;
  padding: 1em; }
  div.payment_instruction p.payment_note {
    font-size: 1.2em;
    margin-top: 0; }
  div.payment_instruction table.payment_instruction_data td.pp-label {
    font-weight: bold;
    padding: 0 1em 0 0; }

.box.box-bestsellers ol {
  list-style: none;
  padding: 0; }
  .box.box-bestsellers ol li:before, .box.box-bestsellers ol li:after {
    content: " ";
    display: table; }
  .box.box-bestsellers ol li:after {
    clear: both; }
  .box.box-bestsellers ol li .col-xs-8 {
    padding-left: 0; }
  .box.box-bestsellers ol li a {
    color: #333;
    text-decoration: none;
    display: block;
    padding: 10px 0; }
  .box.box-bestsellers ol li a:before, .box.box-bestsellers ol li a:after {
    content: " ";
    display: table; }
  .box.box-bestsellers ol li a:after {
    clear: both; }
  .box.box-bestsellers ol li a:hover {
    background-color: #eee; }
  .box.box-bestsellers ol li a .price {
    font-weight: 900; }
  .box.box-bestsellers ol li a .price .products-vpe {
    font-size: 12px;
    font-weight: normal;
    color: #777; }
  .box.box-bestsellers ol li a .img-thumbnail, .box.box-bestsellers ol li a .product-info-thumbnails .swiper-slide, .product-info-thumbnails .box.box-bestsellers ol li a .swiper-slide, .box.box-bestsellers ol li a .product-info-thumbnails-mobile .swiper-slide, .product-info-thumbnails-mobile .box.box-bestsellers ol li a .swiper-slide, .box.box-bestsellers ol li a .product-info-layer-thumbnails .swiper-slide, .product-info-layer-thumbnails .box.box-bestsellers ol li a .swiper-slide, .box.box-bestsellers ol li a .product-container .gallery > li img, .product-container .gallery > li .box.box-bestsellers ol li a img {
    height: 61px;
    width: 61px;
    text-align: center; }
  .box.box-bestsellers ol li a .img-thumbnail img, .box.box-bestsellers ol li a .product-info-thumbnails .swiper-slide img, .product-info-thumbnails .box.box-bestsellers ol li a .swiper-slide img, .box.box-bestsellers ol li a .product-info-thumbnails-mobile .swiper-slide img, .product-info-thumbnails-mobile .box.box-bestsellers ol li a .swiper-slide img, .box.box-bestsellers ol li a .product-info-layer-thumbnails .swiper-slide img, .product-info-layer-thumbnails .box.box-bestsellers ol li a .swiper-slide img, .box.box-bestsellers ol li a .product-container .gallery > li img img, .product-container .gallery > li .box.box-bestsellers ol li a img img {
    display: inline-block;
    max-width: 85%;
    max-height: 85%;
    margin: auto; }
/* Vertical categories box
 ========================================================================== */
.panel > .navbar-categories-left {
  margin: 0; }
  .panel > .navbar-categories-left > ul > li {
    border-bottom: 1px solid #ddd; }
  .panel > .navbar-categories-left > ul > li:first-of-type > a {
    border-top-right-radius: 2px;
    border-top-left-radius: 2px; }
  .panel > .navbar-categories-left > ul > li:last-of-type {
    border-bottom-right-radius: 2px;
    border-bottom-left-radius: 2px; }
  .panel > .navbar-categories-left > ul > li:last-of-type > a {
    border-bottom-right-radius: 2px;
    border-bottom-left-radius: 2px; }
  .panel > .navbar-categories-left > ul > li > a {
    font-size: 13px; }
  .panel > .navbar-categories-left > ul > li > a:before {
    float: right;
    font-size: 16px;
    content: '\e800';
    /* chevron-right */
    -webkit-transition: 300ms ease transform;
    -o-transition: 300ms ease transform;
    transition: 300ms ease transform; }
  .panel > .navbar-categories-left > ul > li.dropdown.open > a {
    color: #333;
    background-color: #eee; }
  .panel > .navbar-categories-left > ul > li.dropdown.open > a:before {
    color: #333;
    transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg); }
  .panel > .navbar-categories-left > ul > li.dropdown.open.active > a {
    color: #fff;
    background-color: #337ab7; }
  .panel > .navbar-categories-left > ul > li.dropdown.open.active > a:before {
    color: #fff; }
  .panel > .navbar-categories-left > ul > li > a {
    padding-left: 15px; }
  .panel > .navbar-categories-left > ul > li.active > a {
    margin: 0 -1px;
    padding-left: 16px; }
  .panel > .navbar-categories-left > ul > li > ul > li > a {
    padding-left: 30px; }
  .panel > .navbar-categories-left > ul > li > ul > li.active > a {
    margin: 0 -1px;
    padding-left: 31px; }
  .panel > .navbar-categories-left > ul > li > ul > li > ul > li > a {
    padding-left: 45px; }
  .panel > .navbar-categories-left > ul > li > ul > li > ul > li.active > a {
    margin: 0 -1px;
    padding-left: 46px; }
  .panel > .navbar-categories-left > ul > li > ul > li > ul > li > ul > li > a {
    padding-left: 60px; }
  .panel > .navbar-categories-left > ul > li > ul > li > ul > li > ul > li.active > a {
    margin: 0 -1px;
    padding-left: 61px; }
  .panel > .navbar-categories-left > ul > li > ul > li > ul > li > ul > li > ul > li > a {
    padding-left: 75px; }
  .panel > .navbar-categories-left > ul > li > ul > li > ul > li > ul > li > ul > li.active > a {
    margin: 0 -1px;
    padding-left: 76px; }
  .panel > .navbar-categories-left > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > a {
    padding-left: 90px; }
  .panel > .navbar-categories-left > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li.active > a {
    margin: 0 -1px;
    padding-left: 91px; }
  .panel > .navbar-categories-left > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > a {
    padding-left: 105px; }
  .panel > .navbar-categories-left > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li.active > a {
    margin: 0 -1px;
    padding-left: 106px; }
  .panel > .navbar-categories-left > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > a {
    padding-left: 120px; }
  .panel > .navbar-categories-left > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li.active > a {
    margin: 0 -1px;
    padding-left: 121px; }
  .panel > .navbar-categories-left > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > a {
    padding-left: 135px; }
  .panel > .navbar-categories-left > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > ul > li.active > a {
    margin: 0 -1px;
    padding-left: 136px; }
  .panel > .navbar-categories-left > ul li a {
    background-color: #fff; }
  .panel > .navbar-categories-left > ul li a, .panel > .navbar-categories-left > ul li a:before {
    color: #333; }
  .panel > .navbar-categories-left > ul li a:hover {
    color: #333;
    background-color: #eee; }
  .panel > .navbar-categories-left > ul li a:hover:before {
    color: #333; }
  .panel > .navbar-categories-left > ul li.active > a {
    background-color: #337ab7; }
  .panel > .navbar-categories-left > ul li.active > a, .panel > .navbar-categories-left > ul li.active > a:before {
    color: #fff; }
  .panel > .navbar-categories-left > ul li.active > a:hover {
    background-color: #337ab7; }
  .panel > .navbar-categories-left > ul li.active > a:hover, .panel > .navbar-categories-left > ul li.active > a:hover:before {
    color: #fff; }
  .panel > .navbar-categories-left > ul li .dropdown-menu {
    margin: 0;
    padding: 0;
    position: relative;
    float: none;
    z-index: 0;
    -webkit-box-shadow: none;
    box-shadow: none; }
  .panel > .navbar-categories-left > ul li .enter-category {
    display: none; }
  .panel > .navbar-categories-left > ul li .enter-category.show {
    display: block; }

.box-categories {
  border-bottom: none; }
  .box-categories .navbar-categories-left > ul > li a {
    white-space: normal; }
  @media (min-width: 768px) {
            .box-categories .navbar-categories-left > ul > li a.has-image:before {
              margin-top: 4px; } }
  .box-categories .navbar-categories-left > ul > li a.has-image .cat-image {
    display: inline-block;
    margin-right: 10px;
    max-height: 25px;
    max-width: 25px; }

@media (min-width: 768px) {
  .navbar-categories-left .level-1 .unfolded a {
    background-color: #fff; }
    .navbar-categories-left .level-1 .unfolded a:before {
      content: none; }
    .navbar-categories-left .level-1 .unfolded a:hover {
      background-color: #eee; }
    .navbar-categories-left .level-1 .unfolded.active > a {
      background-color: #337ab7; }
    .navbar-categories-left .level-1 .unfolded.level-1-child > a {
      background-color: #eee; }
    .navbar-categories-left .level-1 .unfolded.level-1-child.active > a {
      background-color: #337ab7; } }

.box-filter {
  position: relative; }
  .box-filter .panel-heading {
    display: none; }
  .box-filter .panel-body {
    background-color: #eee; }
  .box-filter fieldset {
    overflow: hidden;
    position: relative; }
  .box-filter fieldset.collapsed {
    max-height: 165px; }
  .box-filter fieldset .option-heading {
    text-transform: uppercase;
    font-weight: bold; }
  .box-filter fieldset .show-more {
    position: absolute;
    bottom: 0px;
    width: 100%;
    -webkit-box-shadow: inset 0px -48px 12px -12px #eee;
    box-shadow: inset 0px -48px 12px -12px #eee;
    height: 48px;
    padding-top: 32px;
    text-align: center;
    color: #999;
    font-weight: bold;
    cursor: pointer; }
  .box-filter fieldset.form-horizontal label {
    margin-bottom: 5px; }
  .box-filter .preloader {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%; }
  .box-filter .preloader-message {
    display: none; }
  .box-filter .preloader-message span {
    display: none; }
  .box-filter .preloader-message.error span {
    display: inline; }

.mfp-content .box-filter fieldset .show-more {
  -webkit-box-shadow: inset 0px -48px 12px -12px #fff;
  box-shadow: inset 0px -48px 12px -12px #fff; }

.gx-shevron-down {
  height: 10px;
  width: 10px;
  fill: #999; }

#quick_find .list-group .list-group-item {
  border: 0;
  padding: 0; }

.box-newsletter #email.form-control, .box-newsletter .input-text#email {
  padding: 9px 25px 9px 12px; }
  .box-newsletter .fa-envelope {
    float: right;
    margin-top: -26px;
    margin-right: 10px; }

.box-manufacturers #manufacturers select {
  padding: 9px 12px 9px 12px;
  width: 100%; }

.box-login-links {
  margin: 15px 0 0;
  padding: 0;
  list-style: none; }
  .box-login-links > li > a {
    display: block;
    padding: 5px 0;
    color: #333; }

.box-last-viewed .panel-body, .box-specials .panel-body, .box-whatsnew .panel-body {
  text-align: center; }
  .box-last-viewed .panel-body .promotion-box-image a, .box-specials .panel-body .promotion-box-image a, .box-whatsnew .panel-body .promotion-box-image a {
    display: inline-block; }
  .box-last-viewed .panel-body .promotion-box-title, .box-specials .panel-body .promotion-box-title, .box-whatsnew .panel-body .promotion-box-title {
    font-weight: 400;
    font-size: 14px;
    max-height: 81px;
    overflow: hidden;
    text-overflow: ellipsis; }
  @media (min-width: 480px) {
      .box-last-viewed .panel-body .promotion-box-title, .box-specials .panel-body .promotion-box-title, .box-whatsnew .panel-body .promotion-box-title {
        font-size: 16px; } }
  @media (max-width: 480px) {
      .box-last-viewed .panel-body .promotion-box-title, .box-specials .panel-body .promotion-box-title, .box-whatsnew .panel-body .promotion-box-title {
        max-height: 75px; } }
  .box-last-viewed .panel-body .promotion-box-title a, .box-specials .panel-body .promotion-box-title a, .box-whatsnew .panel-body .promotion-box-title a {
    color: #333; }
  .box-last-viewed .panel-body .promotion-box-title a:hover, .box-specials .panel-body .promotion-box-title a:hover, .box-whatsnew .panel-body .promotion-box-title a:hover {
    text-decoration: none; }
  .box-last-viewed .panel-body .promotion-box-price, .box-specials .panel-body .promotion-box-price, .box-whatsnew .panel-body .promotion-box-price {
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap; }
  @media (min-width: 480px) {
      .box-last-viewed .panel-body .promotion-box-price, .box-specials .panel-body .promotion-box-price, .box-whatsnew .panel-body .promotion-box-price {
        font-size: 16px;
        white-space: inherit; } }
  .box-last-viewed .panel-body .promotion-box-price .productOldPrice, .box-specials .panel-body .promotion-box-price .productOldPrice, .box-whatsnew .panel-body .promotion-box-price .productOldPrice {
    font-size: 13px;
    color: #777;
    font-weight: normal; }
  .box-last-viewed .panel-body .promotion-box-price a, .box-specials .panel-body .promotion-box-price a, .box-whatsnew .panel-body .promotion-box-price a {
    color: #333; }
  .box-last-viewed .panel-body .promotion-box-price a:hover, .box-specials .panel-body .promotion-box-price a:hover, .box-whatsnew .panel-body .promotion-box-price a:hover {
    text-decoration: none; }

body.popup-coupon-help {
  padding-top: 0; }

.popup-notification .mfp-container {
  height: auto; }
  .popup-notification .mfp-container .mfp-content .modal-dialog {
    max-width: 600px; }
  .popup-notification .mfp-container .mfp-content .modal-dialog .modal-content .modal-header .title {
    font-size: 16px;
    font-weight: bold;
    padding: 0; }
  .popup-notification .mfp-container .mfp-content .modal-dialog .modal-content .modal-header .hide-popup-notification {
    cursor: pointer;
    font-size: 16px;
    line-height: 22px;
    padding: 0;
    text-align: right; }
  .popup-notification .mfp-container .mfp-content .modal-dialog .modal-content .modal-body {
    max-height: 500px;
    overflow: auto; }

ul.fl-autocomplete .col.label {
  padding: 0;
  font-size: 100%;
  font-weight: normal;
  color: #000;
  text-align: left;
  border-radius: 0;
  vertical-align: initial; }

.page-checkout-success .coupon-info-text {
  margin-bottom: 30px; }
  .page-checkout-success .coupon-wall-container {
    position: relative; }
  .page-checkout-success .coupon-wall-container .sunnycash-coupon-wall-navigation-container.back {
    padding: 0 15px 0 0; }
  .page-checkout-success .coupon-wall-container .sunnycash-coupon-wall-navigation-container.forward {
    padding: 0 0 0 15px; }
  .page-checkout-success .coupon-wall-container .sunnycash-coupon-wall-navigation-container .sunnycash-coupon-wall-navigation {
    font-size: 18px;
    text-align: center;
    position: relative;
    border: 1px solid #ccc;
    height: 40px;
    padding: 5px;
    display: block;
    margin-bottom: 30px;
    color: #666;
    text-decoration: none;
    visibility: hidden; }
  .page-checkout-success .coupon-wall-container .sunnycash-coupon-wall-navigation-container .sunnycash-coupon-wall-navigation:hover {
    border-color: #66afe9;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 8px rgba(102, 175, 233, 0.6);
    text-decoration: none;
    color: #2196f3; }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon {
    margin-bottom: 30px; }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon .coupon-container {
    height: 235px;
    display: block;
    border: 1px solid #ccc;
    padding: 10px 15px;
    text-align: center; }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon .coupon-container:hover {
    text-decoration: none;
    border-color: #66afe9;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 8px rgba(102, 175, 233, 0.6); }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon .coupon-container .coupon-image-container {
    display: table;
    width: 100%;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    height: calc(40% - 10px); }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon .coupon-container .coupon-image-container .coupon-image {
    display: table-cell;
    vertical-align: middle; }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon .coupon-container .coupon-image-container .coupon-image img {
    max-width: 100%;
    width: auto;
    max-height: 100px;
    height: auto;
    margin: 0 auto;
    background-color: #fff; }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon .coupon-container .coupon-title-container {
    display: table;
    text-align: center;
    width: 100%;
    font-size: 16px;
    height: calc(40% - 10px); }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon .coupon-container .coupon-title-container .coupon-title {
    font-size: 0.8em;
    display: table-cell;
    text-align: center;
    vertical-align: middle; }
  @media (min-width: 768px) {
              .page-checkout-success .coupon-wall-container .coupons-container .coupon .coupon-container .coupon-title-container .coupon-title {
                font-size: 14px; } }
  @media (min-width: 992px) {
              .page-checkout-success .coupon-wall-container .coupons-container .coupon .coupon-container .coupon-title-container .coupon-title {
                font-size: 16px; } }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon .coupon-container .coupon-action-button-container {
    height: 20%;
    width: 90%;
    display: inline-block; }
  @media (max-width: 767px) {
              .page-checkout-success .coupon-wall-container .coupons-container .coupon .coupon-container .coupon-action-button-container a {
                font-size: 10px;
                white-space: inherit; } }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon-redeem-modal .coupon-info-container {
    margin-bottom: 15px; }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon-redeem-modal .coupon-info-container .coupon-logo {
    text-align: center; }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon-redeem-modal .coupon-info-container .coupon-logo img {
    display: inline-block; }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon-redeem-modal .coupon-code-intro {
    display: inline-block;
    padding-right: 15px;
    text-transform: uppercase; }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon-redeem-modal .coupon-code-container {
    text-align: center; }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon-redeem-modal .coupon-code-container .coupon-code-box {
    background-color: #f3f3f3;
    border: 1px solid #ccc;
    color: #666;
    display: inline-block;
    margin: 0 auto;
    min-width: 50%;
    padding: 15px;
    text-align: center; }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon-redeem-modal .coupon-code-container .copy-coupon-icon {
    display: inline-block;
    font-size: 20px;
    padding-left: 15px; }
  .page-checkout-success .coupon-wall-container .coupons-container .coupon-redeem-modal .coupon-code-container div:hover.copy-coupon-icon {
    cursor: pointer;
    color: #2196f3; }

.sunnycash-scroller {
  position: fixed;
  bottom: 0;
  right: 25px;
  z-index: 1021;
  background-color: #337ab7;
  color: #fff;
  font-size: 12px;
  width: 180px;
  padding: 5px 10px;
  opacity: 0;
  filter: alpha(opacity=0); }
  .sunnycash-scroller i.fa {
    font-size: 30px;
    line-height: 34px;
    margin-right: 12px; }
  .sunnycash-scroller:active, .sunnycash-scroller:focus {
    background-color: #337ab7;
    color: #fff;
    text-decoration: none; }
  .sunnycash-scroller:hover {
    background-color: #285f8f;
    color: #fff;
    text-decoration: none; }
  .sunnycash-scroller, .sunnycash-scroller:before {
    -webkit-transition: 300ms ease all;
    -o-transition: 300ms ease all;
    transition: 300ms ease all; }
  .sunnycash-scroller.visible {
    opacity: 1;
    filter: alpha(opacity=100); }

.dropdown-sso .separator span, .box-sso .separator span {
  background-color: transparent; }

/**
 * additional CSS included by PHP only
 *
*//* Fontello font file URLs need to be dynamically resolved, depending on whether the dymanic_theme_style.css.php or main.css is called. */

/*
@font-face {
  font-family: 'gm';
  src: url('public/theme/public/theme/styles/system/fontello/font/gm.eot?51482360');
  src: url('public/theme/public/theme/styles/system/fontello/font/gm.eot?51482360#iefix') format('embedded-opentype'),
       url('public/theme/public/theme/styles/system/fontello/font/gm.woff?51482360') format('woff'),
       url('public/theme/public/theme/styles/system/fontello/font/gm.ttf?51482360') format('truetype'),
       url('public/theme/public/theme/styles/system/fontello/font/gm.svg?51482360#gm') format('svg');
  font-weight: normal;
  font-style: normal;
}
*/
/* Chrome hack: SVG is rendered more smooth in Windozze. 100% magic, uncomment if you need it. */
/* Note, that will break hinting! In other OS-es font will be not as sharp as it could be */
/*
@media screen and (-webkit-min-device-pixel-ratio:0) {
  @font-face {
    font-family: 'gm';
    src: url('../font/gm.svg?51482360#gm') format('svg');
  }
}
*/

[class^="gm-"]:before, [class*=" gm-"]:before {
    font-family: "gm";
    font-style: normal;
    font-weight: normal;
    speak: none;

    display: inline-block;
    text-decoration: inherit;
    width: 1em;
    margin-right: .2em;
    text-align: center;
    /* opacity: .8; */

    /* For safety - reset parent styles, that can break glyph codes*/
    font-variant: normal;
    text-transform: none;

    /* fix buttons height, for twitter bootstrap */
    line-height: 1em;

    /* Animation center compensation - margins should be symmetric */
    /* remove if not needed */
    margin-left: .2em;

    /* you can be more comfortable with increased icons size */
    /* font-size: 120%; */

    /* Font smoothing. That was taken from TWBS */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    /* Uncomment for 3D effect */
    /* text-shadow: 1px 1px 1px rgba(127, 127, 127, 0.3); */
}

.gm-chevron-right:before {
    content: '\e800';
}

/* '' */
.gm-chevron-up:before {
    content: '\e801';
}

/* '' */
.gm-star:before {
    content: '\e802';
}

/* '' */
.gm-search:before {
    content: '\e80b';
}

/* '' */
.gm-cart-basket:before {
    content: '\e80c';
}

/* '' */
.gm-menu:before {
    content: '\e80d';
}

/* '' */
.gm-minus:before {
    content: '\e810';
}

/* '' */
.gm-plus:before {
    content: '\e81e';
}

/* '' */
.gm-chevron-down:before {
    content: '\e81f';
}

/* '' */
.gm-chevron-left:before {
    content: '\e820';
}

/* '' */
.gm-cart:before {
    content: '\e821';
}

/* '' *//**/
/**/
/* Magnific Popup CSS */
.mfp-bg {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1042;
  overflow: hidden;
  position: fixed;
  background: #0b0b0b;
  opacity: 0.8; }

.mfp-wrap {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1043;
  position: fixed;
  outline: none !important;
  -webkit-backface-visibility: hidden; }

.mfp-container {
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  padding: 0 8px;
  box-sizing: border-box; }

.mfp-container:before {
  content: '';
  display: inline-block;
  height: 100%;
  vertical-align: middle; }

.mfp-align-top .mfp-container:before {
  display: none; }

.mfp-content {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin: 0 auto;
  text-align: left;
  z-index: 1045; }

.mfp-inline-holder .mfp-content,
.mfp-ajax-holder .mfp-content {
  width: 100%;
  cursor: auto; }

.mfp-ajax-cur {
  cursor: progress; }

.mfp-zoom-out-cur, .mfp-zoom-out-cur .mfp-image-holder .mfp-close {
  cursor: -moz-zoom-out;
  cursor: -webkit-zoom-out;
  cursor: zoom-out; }

.mfp-zoom {
  cursor: pointer;
  cursor: -webkit-zoom-in;
  cursor: -moz-zoom-in;
  cursor: zoom-in; }

.mfp-auto-cursor .mfp-content {
  cursor: auto; }

.mfp-close,
.mfp-arrow,
.mfp-preloader,
.mfp-counter {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none; }

.mfp-loading.mfp-figure {
  display: none; }

.mfp-hide {
  display: none !important; }

.mfp-preloader {
  color: #CCC;
  position: absolute;
  top: 50%;
  width: auto;
  text-align: center;
  margin-top: -0.8em;
  left: 8px;
  right: 8px;
  z-index: 1044; }
  .mfp-preloader a {
    color: #CCC; }
    .mfp-preloader a:hover {
      color: #FFF; }

.mfp-s-ready .mfp-preloader {
  display: none; }

.mfp-s-error .mfp-content {
  display: none; }

button.mfp-close,
button.mfp-arrow {
  overflow: visible;
  cursor: pointer;
  background: transparent;
  border: 0;
  -webkit-appearance: none;
  display: block;
  outline: none;
  padding: 0;
  z-index: 1046;
  box-shadow: none;
  touch-action: manipulation; }

button::-moz-focus-inner {
  padding: 0;
  border: 0; }

.mfp-close {
  width: 44px;
  height: 44px;
  line-height: 44px;
  position: absolute;
  right: 0;
  top: 0;
  text-decoration: none;
  text-align: center;
  opacity: 0.65;
  padding: 0 0 18px 10px;
  color: #FFF;
  font-style: normal;
  font-size: 28px;
  font-family: Arial, Baskerville, monospace; }
  .mfp-close:hover,
  .mfp-close:focus {
    opacity: 1; }
  .mfp-close:active {
    top: 1px; }

.mfp-close-btn-in .mfp-close {
  color: #333; }

.mfp-image-holder .mfp-close,
.mfp-iframe-holder .mfp-close {
  color: #FFF;
  right: -6px;
  text-align: right;
  padding-right: 6px;
  width: 100%; }

.mfp-counter {
  position: absolute;
  top: 0;
  right: 0;
  color: #CCC;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap; }

.mfp-arrow {
  position: absolute;
  opacity: 0.65;
  margin: 0;
  top: 50%;
  margin-top: -55px;
  padding: 0;
  width: 90px;
  height: 110px;
  -webkit-tap-highlight-color: transparent; }
  .mfp-arrow:active {
    margin-top: -54px; }
  .mfp-arrow:hover,
  .mfp-arrow:focus {
    opacity: 1; }
  .mfp-arrow:before,
  .mfp-arrow:after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    left: 0;
    top: 0;
    margin-top: 35px;
    margin-left: 35px;
    border: medium inset transparent; }
  .mfp-arrow:after {
    border-top-width: 13px;
    border-bottom-width: 13px;
    top: 8px; }
  .mfp-arrow:before {
    border-top-width: 21px;
    border-bottom-width: 21px;
    opacity: 0.7; }

.mfp-arrow-left {
  left: 0; }
  .mfp-arrow-left:after {
    border-right: 17px solid #FFF;
    margin-left: 31px; }
  .mfp-arrow-left:before {
    margin-left: 25px;
    border-right: 27px solid #3F3F3F; }

.mfp-arrow-right {
  right: 0; }
  .mfp-arrow-right:after {
    border-left: 17px solid #FFF;
    margin-left: 39px; }
  .mfp-arrow-right:before {
    border-left: 27px solid #3F3F3F; }

.mfp-iframe-holder {
  padding-top: 40px;
  padding-bottom: 40px; }
  .mfp-iframe-holder .mfp-content {
    line-height: 0;
    width: 100%;
    max-width: 900px; }
  .mfp-iframe-holder .mfp-close {
    top: -40px; }

.mfp-iframe-scaler {
  width: 100%;
  height: 0;
  overflow: hidden;
  padding-top: 56.25%; }
  .mfp-iframe-scaler iframe {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
    background: #000; }

/* Main image in popup */
img.mfp-img {
  width: auto;
  max-width: 100%;
  height: auto;
  display: block;
  line-height: 0;
  box-sizing: border-box;
  padding: 40px 0 40px;
  margin: 0 auto; }

/* The shadow behind the image */
.mfp-figure {
  line-height: 0; }
  .mfp-figure:after {
    content: '';
    position: absolute;
    left: 0;
    top: 40px;
    bottom: 40px;
    display: block;
    right: 0;
    width: auto;
    height: auto;
    z-index: -1;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
    background: #444; }
  .mfp-figure small {
    color: #BDBDBD;
    display: block;
    font-size: 12px;
    line-height: 14px; }
  .mfp-figure figure {
    margin: 0; }

.mfp-bottom-bar {
  margin-top: -36px;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  cursor: auto; }

.mfp-title {
  text-align: left;
  line-height: 18px;
  color: #F3F3F3;
  word-wrap: break-word;
  padding-right: 36px; }

.mfp-image-holder .mfp-content {
  max-width: 100%; }

.mfp-gallery .mfp-image-holder .mfp-figure {
  cursor: pointer; }

@media screen and (max-width: 800px) and (orientation: landscape), screen and (max-height: 300px) {
  /**
       * Remove all paddings around the image on small screen
       */
  .mfp-img-mobile .mfp-image-holder {
    padding-left: 0;
    padding-right: 0; }
  .mfp-img-mobile img.mfp-img {
    padding: 0; }
  .mfp-img-mobile .mfp-figure:after {
    top: 0;
    bottom: 0; }
  .mfp-img-mobile .mfp-figure small {
    display: inline;
    margin-left: 5px; }
  .mfp-img-mobile .mfp-bottom-bar {
    background: rgba(0, 0, 0, 0.6);
    bottom: 0;
    margin: 0;
    top: auto;
    padding: 3px 5px;
    position: fixed;
    box-sizing: border-box; }
    .mfp-img-mobile .mfp-bottom-bar:empty {
      padding: 0; }
  .mfp-img-mobile .mfp-counter {
    right: 5px;
    top: 3px; }
  .mfp-img-mobile .mfp-close {
    top: 0;
    right: 0;
    width: 35px;
    height: 35px;
    line-height: 35px;
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    text-align: center;
    padding: 0; } }

@media all and (max-width: 900px) {
  .mfp-arrow {
    -webkit-transform: scale(0.75);
    transform: scale(0.75); }
  .mfp-arrow-left {
    -webkit-transform-origin: 0;
    transform-origin: 0; }
  .mfp-arrow-right {
    -webkit-transform-origin: 100%;
    transform-origin: 100%; }
  .mfp-container {
    padding-left: 6px;
    padding-right: 6px; } }

/**
 * Swiper 3.4.2
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 *
 * http://www.idangero.us/swiper/
 *
 * Copyright 2017, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under MIT
 *
 * Released on: March 10, 2017
 */
.swiper-container {
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  /* Fix of Webkit flickering */
  z-index: 1;
}
.swiper-container-no-flexbox .swiper-slide {
  float: left;
}
.swiper-container-vertical > .swiper-wrapper {
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  -ms-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;
}
.swiper-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-transition-property: -webkit-transform;
  -moz-transition-property: -moz-transform;
  -o-transition-property: -o-transform;
  -ms-transition-property: -ms-transform;
  transition-property: transform;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}
.swiper-container-android .swiper-slide,
.swiper-wrapper {
  -webkit-transform: translate3d(0px, 0, 0);
  -moz-transform: translate3d(0px, 0, 0);
  -o-transform: translate(0px, 0px);
  -ms-transform: translate3d(0px, 0, 0);
  transform: translate3d(0px, 0, 0);
}
.swiper-container-multirow > .swiper-wrapper {
  -webkit-box-lines: multiple;
  -moz-box-lines: multiple;
  -ms-flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
}
.swiper-container-free-mode > .swiper-wrapper {
  -webkit-transition-timing-function: ease-out;
  -moz-transition-timing-function: ease-out;
  -ms-transition-timing-function: ease-out;
  -o-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
  margin: 0 auto;
}
.swiper-slide {
  -webkit-flex-shrink: 0;
  -ms-flex: 0 0 auto;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  position: relative;
}
/* Auto Height */
.swiper-container-autoheight,
.swiper-container-autoheight .swiper-slide {
  height: auto;
}
.swiper-container-autoheight .swiper-wrapper {
  -webkit-box-align: start;
  -ms-flex-align: start;
  -webkit-align-items: flex-start;
  align-items: flex-start;
  -webkit-transition-property: -webkit-transform, height;
  -moz-transition-property: -moz-transform;
  -o-transition-property: -o-transform;
  -ms-transition-property: -ms-transform;
  transition-property: transform, height;
}
/* a11y */
.swiper-container .swiper-notification {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  opacity: 0;
  z-index: -1000;
}
/* IE10 Windows Phone 8 Fixes */
.swiper-wp8-horizontal {
  -ms-touch-action: pan-y;
  touch-action: pan-y;
}
.swiper-wp8-vertical {
  -ms-touch-action: pan-x;
  touch-action: pan-x;
}
/* Arrows */
.swiper-button-prev,
.swiper-button-next {
  position: absolute;
  top: 50%;
  width: 27px;
  height: 44px;
  margin-top: -22px;
  z-index: 10;
  cursor: pointer;
  -moz-background-size: 27px 44px;
  -webkit-background-size: 27px 44px;
  background-size: 27px 44px;
  background-position: center;
  background-repeat: no-repeat;
}
.swiper-button-prev.swiper-button-disabled,
.swiper-button-next.swiper-button-disabled {
  opacity: 0.35;
  cursor: auto;
  pointer-events: none;
}
.swiper-button-prev,
.swiper-container-rtl .swiper-button-next {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E");
  left: 10px;
  right: auto;
}
.swiper-button-prev.swiper-button-black,
.swiper-container-rtl .swiper-button-next.swiper-button-black {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E");
}
.swiper-button-prev.swiper-button-white,
.swiper-container-rtl .swiper-button-next.swiper-button-white {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E");
}
.swiper-button-next,
.swiper-container-rtl .swiper-button-prev {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E");
  right: 10px;
  left: auto;
}
.swiper-button-next.swiper-button-black,
.swiper-container-rtl .swiper-button-prev.swiper-button-black {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E");
}
.swiper-button-next.swiper-button-white,
.swiper-container-rtl .swiper-button-prev.swiper-button-white {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E");
}
/* Pagination Styles */
.swiper-pagination {
  position: absolute;
  text-align: center;
  -webkit-transition: 300ms;
  -moz-transition: 300ms;
  -o-transition: 300ms;
  transition: 300ms;
  -webkit-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  z-index: 10;
}
.swiper-pagination.swiper-pagination-hidden {
  opacity: 0;
}
/* Common Styles */
.swiper-pagination-fraction,
.swiper-pagination-custom,
.swiper-container-horizontal > .swiper-pagination-bullets {
  bottom: 10px;
  left: 0;
  width: 100%;
}
/* Bullets */
.swiper-pagination-bullet {
  width: 8px;
  height: 8px;
  display: inline-block;
  border-radius: 100%;
  background: #000;
  opacity: 0.2;
}
button.swiper-pagination-bullet {
  border: none;
  margin: 0;
  padding: 0;
  box-shadow: none;
  -moz-appearance: none;
  -ms-appearance: none;
  -webkit-appearance: none;
  appearance: none;
}
.swiper-pagination-clickable .swiper-pagination-bullet {
  cursor: pointer;
}
.swiper-pagination-white .swiper-pagination-bullet {
  background: #fff;
}
.swiper-pagination-bullet-active {
  opacity: 1;
  background: #007aff;
}
.swiper-pagination-white .swiper-pagination-bullet-active {
  background: #fff;
}
.swiper-pagination-black .swiper-pagination-bullet-active {
  background: #000;
}
.swiper-container-vertical > .swiper-pagination-bullets {
  right: 10px;
  top: 50%;
  -webkit-transform: translate3d(0px, -50%, 0);
  -moz-transform: translate3d(0px, -50%, 0);
  -o-transform: translate(0px, -50%);
  -ms-transform: translate3d(0px, -50%, 0);
  transform: translate3d(0px, -50%, 0);
}
.swiper-container-vertical > .swiper-pagination-bullets .swiper-pagination-bullet {
  margin: 5px 0;
  display: block;
}
.swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet {
  margin: 0 5px;
}
/* Progress */
.swiper-pagination-progress {
  background: rgba(0, 0, 0, 0.25);
  position: absolute;
}
.swiper-pagination-progress .swiper-pagination-progressbar {
  background: #007aff;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  -webkit-transform: scale(0);
  -ms-transform: scale(0);
  -o-transform: scale(0);
  transform: scale(0);
  -webkit-transform-origin: left top;
  -moz-transform-origin: left top;
  -ms-transform-origin: left top;
  -o-transform-origin: left top;
  transform-origin: left top;
}
.swiper-container-rtl .swiper-pagination-progress .swiper-pagination-progressbar {
  -webkit-transform-origin: right top;
  -moz-transform-origin: right top;
  -ms-transform-origin: right top;
  -o-transform-origin: right top;
  transform-origin: right top;
}
.swiper-container-horizontal > .swiper-pagination-progress {
  width: 100%;
  height: 4px;
  left: 0;
  top: 0;
}
.swiper-container-vertical > .swiper-pagination-progress {
  width: 4px;
  height: 100%;
  left: 0;
  top: 0;
}
.swiper-pagination-progress.swiper-pagination-white {
  background: rgba(255, 255, 255, 0.5);
}
.swiper-pagination-progress.swiper-pagination-white .swiper-pagination-progressbar {
  background: #fff;
}
.swiper-pagination-progress.swiper-pagination-black .swiper-pagination-progressbar {
  background: #000;
}
/* 3D Container */
.swiper-container-3d {
  -webkit-perspective: 1200px;
  -moz-perspective: 1200px;
  -o-perspective: 1200px;
  perspective: 1200px;
}
.swiper-container-3d .swiper-wrapper,
.swiper-container-3d .swiper-slide,
.swiper-container-3d .swiper-slide-shadow-left,
.swiper-container-3d .swiper-slide-shadow-right,
.swiper-container-3d .swiper-slide-shadow-top,
.swiper-container-3d .swiper-slide-shadow-bottom,
.swiper-container-3d .swiper-cube-shadow {
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  -ms-transform-style: preserve-3d;
  transform-style: preserve-3d;
}
.swiper-container-3d .swiper-slide-shadow-left,
.swiper-container-3d .swiper-slide-shadow-right,
.swiper-container-3d .swiper-slide-shadow-top,
.swiper-container-3d .swiper-slide-shadow-bottom {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}
.swiper-container-3d .swiper-slide-shadow-left {
  background-image: -webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0)));
  /* Safari 4+, Chrome */
  background-image: -webkit-linear-gradient(right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Chrome 10+, Safari 5.1+, iOS 5+ */
  background-image: -moz-linear-gradient(right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Firefox 3.6-15 */
  background-image: -o-linear-gradient(right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Opera 11.10-12.00 */
  background-image: linear-gradient(to left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Firefox 16+, IE10, Opera 12.50+ */
}
.swiper-container-3d .swiper-slide-shadow-right {
  background-image: -webkit-gradient(linear, right top, left top, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0)));
  /* Safari 4+, Chrome */
  background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Chrome 10+, Safari 5.1+, iOS 5+ */
  background-image: -moz-linear-gradient(left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Firefox 3.6-15 */
  background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Opera 11.10-12.00 */
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Firefox 16+, IE10, Opera 12.50+ */
}
.swiper-container-3d .swiper-slide-shadow-top {
  background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0)));
  /* Safari 4+, Chrome */
  background-image: -webkit-linear-gradient(bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Chrome 10+, Safari 5.1+, iOS 5+ */
  background-image: -moz-linear-gradient(bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Firefox 3.6-15 */
  background-image: -o-linear-gradient(bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Opera 11.10-12.00 */
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Firefox 16+, IE10, Opera 12.50+ */
}
.swiper-container-3d .swiper-slide-shadow-bottom {
  background-image: -webkit-gradient(linear, left bottom, left top, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0)));
  /* Safari 4+, Chrome */
  background-image: -webkit-linear-gradient(top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Chrome 10+, Safari 5.1+, iOS 5+ */
  background-image: -moz-linear-gradient(top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Firefox 3.6-15 */
  background-image: -o-linear-gradient(top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Opera 11.10-12.00 */
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  /* Firefox 16+, IE10, Opera 12.50+ */
}
/* Coverflow */
.swiper-container-coverflow .swiper-wrapper,
.swiper-container-flip .swiper-wrapper {
  /* Windows 8 IE 10 fix */
  -ms-perspective: 1200px;
}
/* Cube + Flip */
.swiper-container-cube,
.swiper-container-flip {
  overflow: visible;
}
.swiper-container-cube .swiper-slide,
.swiper-container-flip .swiper-slide {
  pointer-events: none;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  backface-visibility: hidden;
  z-index: 1;
}
.swiper-container-cube .swiper-slide .swiper-slide,
.swiper-container-flip .swiper-slide .swiper-slide {
  pointer-events: none;
}
.swiper-container-cube .swiper-slide-active,
.swiper-container-flip .swiper-slide-active,
.swiper-container-cube .swiper-slide-active .swiper-slide-active,
.swiper-container-flip .swiper-slide-active .swiper-slide-active {
  pointer-events: auto;
}
.swiper-container-cube .swiper-slide-shadow-top,
.swiper-container-flip .swiper-slide-shadow-top,
.swiper-container-cube .swiper-slide-shadow-bottom,
.swiper-container-flip .swiper-slide-shadow-bottom,
.swiper-container-cube .swiper-slide-shadow-left,
.swiper-container-flip .swiper-slide-shadow-left,
.swiper-container-cube .swiper-slide-shadow-right,
.swiper-container-flip .swiper-slide-shadow-right {
  z-index: 0;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  backface-visibility: hidden;
}
/* Cube */
.swiper-container-cube .swiper-slide {
  visibility: hidden;
  -webkit-transform-origin: 0 0;
  -moz-transform-origin: 0 0;
  -ms-transform-origin: 0 0;
  transform-origin: 0 0;
  width: 100%;
  height: 100%;
}
.swiper-container-cube.swiper-container-rtl .swiper-slide {
  -webkit-transform-origin: 100% 0;
  -moz-transform-origin: 100% 0;
  -ms-transform-origin: 100% 0;
  transform-origin: 100% 0;
}
.swiper-container-cube .swiper-slide-active,
.swiper-container-cube .swiper-slide-next,
.swiper-container-cube .swiper-slide-prev,
.swiper-container-cube .swiper-slide-next + .swiper-slide {
  pointer-events: auto;
  visibility: visible;
}
.swiper-container-cube .swiper-cube-shadow {
  position: absolute;
  left: 0;
  bottom: 0px;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.6;
  -webkit-filter: blur(50px);
  filter: blur(50px);
  z-index: 0;
}
/* Fade */
.swiper-container-fade.swiper-container-free-mode .swiper-slide {
  -webkit-transition-timing-function: ease-out;
  -moz-transition-timing-function: ease-out;
  -ms-transition-timing-function: ease-out;
  -o-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
}
.swiper-container-fade .swiper-slide {
  pointer-events: none;
  -webkit-transition-property: opacity;
  -moz-transition-property: opacity;
  -o-transition-property: opacity;
  transition-property: opacity;
}
.swiper-container-fade .swiper-slide .swiper-slide {
  pointer-events: none;
}
.swiper-container-fade .swiper-slide-active,
.swiper-container-fade .swiper-slide-active .swiper-slide-active {
  pointer-events: auto;
}
.swiper-zoom-container {
  width: 100%;
  height: 100%;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -moz-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -moz-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  text-align: center;
}
.swiper-zoom-container > img,
.swiper-zoom-container > svg,
.swiper-zoom-container > canvas {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
/* Scrollbar */
.swiper-scrollbar {
  border-radius: 10px;
  position: relative;
  -ms-touch-action: none;
  background: rgba(0, 0, 0, 0.1);
}
.swiper-container-horizontal > .swiper-scrollbar {
  position: absolute;
  left: 1%;
  bottom: 3px;
  z-index: 50;
  height: 5px;
  width: 98%;
}
.swiper-container-vertical > .swiper-scrollbar {
  position: absolute;
  right: 3px;
  top: 1%;
  z-index: 50;
  width: 5px;
  height: 98%;
}
.swiper-scrollbar-drag {
  height: 100%;
  width: 100%;
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  left: 0;
  top: 0;
}
.swiper-scrollbar-cursor-drag {
  cursor: move;
}
/* Preloader */
.swiper-lazy-preloader {
  width: 42px;
  height: 42px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -21px;
  margin-top: -21px;
  z-index: 10;
  -webkit-transform-origin: 50%;
  -moz-transform-origin: 50%;
  transform-origin: 50%;
  -webkit-animation: swiper-preloader-spin 1s steps(12, end) infinite;
  -moz-animation: swiper-preloader-spin 1s steps(12, end) infinite;
  animation: swiper-preloader-spin 1s steps(12, end) infinite;
}
.swiper-lazy-preloader:after {
  display: block;
  content: "";
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
  background-position: 50%;
  -webkit-background-size: 100%;
  background-size: 100%;
  background-repeat: no-repeat;
}
.swiper-lazy-preloader-white:after {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%23fff'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
}
@-webkit-keyframes swiper-preloader-spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes swiper-preloader-spin {
  100% {
    transform: rotate(360deg);
  }
}

/*# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hZ25pZmljLXBvcHVwLmNzcyIsInN3aXBlci5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InZlbmRvci5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBNYWduaWZpYyBQb3B1cCBDU1MgKi9cbi5tZnAtYmcge1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHotaW5kZXg6IDEwNDI7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgYmFja2dyb3VuZDogIzBiMGIwYjtcbiAgb3BhY2l0eTogMC44OyB9XG5cbi5tZnAtd3JhcCB7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgei1pbmRleDogMTA0MztcbiAgcG9zaXRpb246IGZpeGVkO1xuICBvdXRsaW5lOiBub25lICFpbXBvcnRhbnQ7XG4gIC13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuOyB9XG5cbi5tZnAtY29udGFpbmVyIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGxlZnQ6IDA7XG4gIHRvcDogMDtcbiAgcGFkZGluZzogMCA4cHg7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IH1cblxuLm1mcC1jb250YWluZXI6YmVmb3JlIHtcbiAgY29udGVudDogJyc7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgaGVpZ2h0OiAxMDAlO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyB9XG5cbi5tZnAtYWxpZ24tdG9wIC5tZnAtY29udGFpbmVyOmJlZm9yZSB7XG4gIGRpc3BsYXk6IG5vbmU7IH1cblxuLm1mcC1jb250ZW50IHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIG1hcmdpbjogMCBhdXRvO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICB6LWluZGV4OiAxMDQ1OyB9XG5cbi5tZnAtaW5saW5lLWhvbGRlciAubWZwLWNvbnRlbnQsXG4ubWZwLWFqYXgtaG9sZGVyIC5tZnAtY29udGVudCB7XG4gIHdpZHRoOiAxMDAlO1xuICBjdXJzb3I6IGF1dG87IH1cblxuLm1mcC1hamF4LWN1ciB7XG4gIGN1cnNvcjogcHJvZ3Jlc3M7IH1cblxuLm1mcC16b29tLW91dC1jdXIsIC5tZnAtem9vbS1vdXQtY3VyIC5tZnAtaW1hZ2UtaG9sZGVyIC5tZnAtY2xvc2Uge1xuICBjdXJzb3I6IC1tb3otem9vbS1vdXQ7XG4gIGN1cnNvcjogLXdlYmtpdC16b29tLW91dDtcbiAgY3Vyc29yOiB6b29tLW91dDsgfVxuXG4ubWZwLXpvb20ge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGN1cnNvcjogLXdlYmtpdC16b29tLWluO1xuICBjdXJzb3I6IC1tb3otem9vbS1pbjtcbiAgY3Vyc29yOiB6b29tLWluOyB9XG5cbi5tZnAtYXV0by1jdXJzb3IgLm1mcC1jb250ZW50IHtcbiAgY3Vyc29yOiBhdXRvOyB9XG5cbi5tZnAtY2xvc2UsXG4ubWZwLWFycm93LFxuLm1mcC1wcmVsb2FkZXIsXG4ubWZwLWNvdW50ZXIge1xuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICB1c2VyLXNlbGVjdDogbm9uZTsgfVxuXG4ubWZwLWxvYWRpbmcubWZwLWZpZ3VyZSB7XG4gIGRpc3BsYXk6IG5vbmU7IH1cblxuLm1mcC1oaWRlIHtcbiAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50OyB9XG5cbi5tZnAtcHJlbG9hZGVyIHtcbiAgY29sb3I6ICNDQ0M7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA1MCU7XG4gIHdpZHRoOiBhdXRvO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIG1hcmdpbi10b3A6IC0wLjhlbTtcbiAgbGVmdDogOHB4O1xuICByaWdodDogOHB4O1xuICB6LWluZGV4OiAxMDQ0OyB9XG4gIC5tZnAtcHJlbG9hZGVyIGEge1xuICAgIGNvbG9yOiAjQ0NDOyB9XG4gICAgLm1mcC1wcmVsb2FkZXIgYTpob3ZlciB7XG4gICAgICBjb2xvcjogI0ZGRjsgfVxuXG4ubWZwLXMtcmVhZHkgLm1mcC1wcmVsb2FkZXIge1xuICBkaXNwbGF5OiBub25lOyB9XG5cbi5tZnAtcy1lcnJvciAubWZwLWNvbnRlbnQge1xuICBkaXNwbGF5OiBub25lOyB9XG5cbmJ1dHRvbi5tZnAtY2xvc2UsXG5idXR0b24ubWZwLWFycm93IHtcbiAgb3ZlcmZsb3c6IHZpc2libGU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlcjogMDtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuICBkaXNwbGF5OiBibG9jaztcbiAgb3V0bGluZTogbm9uZTtcbiAgcGFkZGluZzogMDtcbiAgei1pbmRleDogMTA0NjtcbiAgYm94LXNoYWRvdzogbm9uZTtcbiAgdG91Y2gtYWN0aW9uOiBtYW5pcHVsYXRpb247IH1cblxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyIHtcbiAgcGFkZGluZzogMDtcbiAgYm9yZGVyOiAwOyB9XG5cbi5tZnAtY2xvc2Uge1xuICB3aWR0aDogNDRweDtcbiAgaGVpZ2h0OiA0NHB4O1xuICBsaW5lLWhlaWdodDogNDRweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMDtcbiAgdG9wOiAwO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgb3BhY2l0eTogMC42NTtcbiAgcGFkZGluZzogMCAwIDE4cHggMTBweDtcbiAgY29sb3I6ICNGRkY7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zaXplOiAyOHB4O1xuICBmb250LWZhbWlseTogQXJpYWwsIEJhc2tlcnZpbGxlLCBtb25vc3BhY2U7IH1cbiAgLm1mcC1jbG9zZTpob3ZlcixcbiAgLm1mcC1jbG9zZTpmb2N1cyB7XG4gICAgb3BhY2l0eTogMTsgfVxuICAubWZwLWNsb3NlOmFjdGl2ZSB7XG4gICAgdG9wOiAxcHg7IH1cblxuLm1mcC1jbG9zZS1idG4taW4gLm1mcC1jbG9zZSB7XG4gIGNvbG9yOiAjMzMzOyB9XG5cbi5tZnAtaW1hZ2UtaG9sZGVyIC5tZnAtY2xvc2UsXG4ubWZwLWlmcmFtZS1ob2xkZXIgLm1mcC1jbG9zZSB7XG4gIGNvbG9yOiAjRkZGO1xuICByaWdodDogLTZweDtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gIHBhZGRpbmctcmlnaHQ6IDZweDtcbiAgd2lkdGg6IDEwMCU7IH1cblxuLm1mcC1jb3VudGVyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBjb2xvcjogI0NDQztcbiAgZm9udC1zaXplOiAxMnB4O1xuICBsaW5lLWhlaWdodDogMThweDtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDsgfVxuXG4ubWZwLWFycm93IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBvcGFjaXR5OiAwLjY1O1xuICBtYXJnaW46IDA7XG4gIHRvcDogNTAlO1xuICBtYXJnaW4tdG9wOiAtNTVweDtcbiAgcGFkZGluZzogMDtcbiAgd2lkdGg6IDkwcHg7XG4gIGhlaWdodDogMTEwcHg7XG4gIC13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjogdHJhbnNwYXJlbnQ7IH1cbiAgLm1mcC1hcnJvdzphY3RpdmUge1xuICAgIG1hcmdpbi10b3A6IC01NHB4OyB9XG4gIC5tZnAtYXJyb3c6aG92ZXIsXG4gIC5tZnAtYXJyb3c6Zm9jdXMge1xuICAgIG9wYWNpdHk6IDE7IH1cbiAgLm1mcC1hcnJvdzpiZWZvcmUsXG4gIC5tZnAtYXJyb3c6YWZ0ZXIge1xuICAgIGNvbnRlbnQ6ICcnO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIHdpZHRoOiAwO1xuICAgIGhlaWdodDogMDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogMDtcbiAgICB0b3A6IDA7XG4gICAgbWFyZ2luLXRvcDogMzVweDtcbiAgICBtYXJnaW4tbGVmdDogMzVweDtcbiAgICBib3JkZXI6IG1lZGl1bSBpbnNldCB0cmFuc3BhcmVudDsgfVxuICAubWZwLWFycm93OmFmdGVyIHtcbiAgICBib3JkZXItdG9wLXdpZHRoOiAxM3B4O1xuICAgIGJvcmRlci1ib3R0b20td2lkdGg6IDEzcHg7XG4gICAgdG9wOiA4cHg7IH1cbiAgLm1mcC1hcnJvdzpiZWZvcmUge1xuICAgIGJvcmRlci10b3Atd2lkdGg6IDIxcHg7XG4gICAgYm9yZGVyLWJvdHRvbS13aWR0aDogMjFweDtcbiAgICBvcGFjaXR5OiAwLjc7IH1cblxuLm1mcC1hcnJvdy1sZWZ0IHtcbiAgbGVmdDogMDsgfVxuICAubWZwLWFycm93LWxlZnQ6YWZ0ZXIge1xuICAgIGJvcmRlci1yaWdodDogMTdweCBzb2xpZCAjRkZGO1xuICAgIG1hcmdpbi1sZWZ0OiAzMXB4OyB9XG4gIC5tZnAtYXJyb3ctbGVmdDpiZWZvcmUge1xuICAgIG1hcmdpbi1sZWZ0OiAyNXB4O1xuICAgIGJvcmRlci1yaWdodDogMjdweCBzb2xpZCAjM0YzRjNGOyB9XG5cbi5tZnAtYXJyb3ctcmlnaHQge1xuICByaWdodDogMDsgfVxuICAubWZwLWFycm93LXJpZ2h0OmFmdGVyIHtcbiAgICBib3JkZXItbGVmdDogMTdweCBzb2xpZCAjRkZGO1xuICAgIG1hcmdpbi1sZWZ0OiAzOXB4OyB9XG4gIC5tZnAtYXJyb3ctcmlnaHQ6YmVmb3JlIHtcbiAgICBib3JkZXItbGVmdDogMjdweCBzb2xpZCAjM0YzRjNGOyB9XG5cbi5tZnAtaWZyYW1lLWhvbGRlciB7XG4gIHBhZGRpbmctdG9wOiA0MHB4O1xuICBwYWRkaW5nLWJvdHRvbTogNDBweDsgfVxuICAubWZwLWlmcmFtZS1ob2xkZXIgLm1mcC1jb250ZW50IHtcbiAgICBsaW5lLWhlaWdodDogMDtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBtYXgtd2lkdGg6IDkwMHB4OyB9XG4gIC5tZnAtaWZyYW1lLWhvbGRlciAubWZwLWNsb3NlIHtcbiAgICB0b3A6IC00MHB4OyB9XG5cbi5tZnAtaWZyYW1lLXNjYWxlciB7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDA7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHBhZGRpbmctdG9wOiA1Ni4yNSU7IH1cbiAgLm1mcC1pZnJhbWUtc2NhbGVyIGlmcmFtZSB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiAwO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBib3gtc2hhZG93OiAwIDAgOHB4IHJnYmEoMCwgMCwgMCwgMC42KTtcbiAgICBiYWNrZ3JvdW5kOiAjMDAwOyB9XG5cbi8qIE1haW4gaW1hZ2UgaW4gcG9wdXAgKi9cbmltZy5tZnAtaW1nIHtcbiAgd2lkdGg6IGF1dG87XG4gIG1heC13aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiBhdXRvO1xuICBkaXNwbGF5OiBibG9jaztcbiAgbGluZS1oZWlnaHQ6IDA7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIHBhZGRpbmc6IDQwcHggMCA0MHB4O1xuICBtYXJnaW46IDAgYXV0bzsgfVxuXG4vKiBUaGUgc2hhZG93IGJlaGluZCB0aGUgaW1hZ2UgKi9cbi5tZnAtZmlndXJlIHtcbiAgbGluZS1oZWlnaHQ6IDA7IH1cbiAgLm1mcC1maWd1cmU6YWZ0ZXIge1xuICAgIGNvbnRlbnQ6ICcnO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBsZWZ0OiAwO1xuICAgIHRvcDogNDBweDtcbiAgICBib3R0b206IDQwcHg7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgcmlnaHQ6IDA7XG4gICAgd2lkdGg6IGF1dG87XG4gICAgaGVpZ2h0OiBhdXRvO1xuICAgIHotaW5kZXg6IC0xO1xuICAgIGJveC1zaGFkb3c6IDAgMCA4cHggcmdiYSgwLCAwLCAwLCAwLjYpO1xuICAgIGJhY2tncm91bmQ6ICM0NDQ7IH1cbiAgLm1mcC1maWd1cmUgc21hbGwge1xuICAgIGNvbG9yOiAjQkRCREJEO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBsaW5lLWhlaWdodDogMTRweDsgfVxuICAubWZwLWZpZ3VyZSBmaWd1cmUge1xuICAgIG1hcmdpbjogMDsgfVxuXG4ubWZwLWJvdHRvbS1iYXIge1xuICBtYXJnaW4tdG9wOiAtMzZweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDEwMCU7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBjdXJzb3I6IGF1dG87IH1cblxuLm1mcC10aXRsZSB7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGxpbmUtaGVpZ2h0OiAxOHB4O1xuICBjb2xvcjogI0YzRjNGMztcbiAgd29yZC13cmFwOiBicmVhay13b3JkO1xuICBwYWRkaW5nLXJpZ2h0OiAzNnB4OyB9XG5cbi5tZnAtaW1hZ2UtaG9sZGVyIC5tZnAtY29udGVudCB7XG4gIG1heC13aWR0aDogMTAwJTsgfVxuXG4ubWZwLWdhbGxlcnkgLm1mcC1pbWFnZS1ob2xkZXIgLm1mcC1maWd1cmUge1xuICBjdXJzb3I6IHBvaW50ZXI7IH1cblxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogODAwcHgpIGFuZCAob3JpZW50YXRpb246IGxhbmRzY2FwZSksIHNjcmVlbiBhbmQgKG1heC1oZWlnaHQ6IDMwMHB4KSB7XG4gIC8qKlxuICAgICAgICogUmVtb3ZlIGFsbCBwYWRkaW5ncyBhcm91bmQgdGhlIGltYWdlIG9uIHNtYWxsIHNjcmVlblxuICAgICAgICovXG4gIC5tZnAtaW1nLW1vYmlsZSAubWZwLWltYWdlLWhvbGRlciB7XG4gICAgcGFkZGluZy1sZWZ0OiAwO1xuICAgIHBhZGRpbmctcmlnaHQ6IDA7IH1cbiAgLm1mcC1pbWctbW9iaWxlIGltZy5tZnAtaW1nIHtcbiAgICBwYWRkaW5nOiAwOyB9XG4gIC5tZnAtaW1nLW1vYmlsZSAubWZwLWZpZ3VyZTphZnRlciB7XG4gICAgdG9wOiAwO1xuICAgIGJvdHRvbTogMDsgfVxuICAubWZwLWltZy1tb2JpbGUgLm1mcC1maWd1cmUgc21hbGwge1xuICAgIGRpc3BsYXk6IGlubGluZTtcbiAgICBtYXJnaW4tbGVmdDogNXB4OyB9XG4gIC5tZnAtaW1nLW1vYmlsZSAubWZwLWJvdHRvbS1iYXIge1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC42KTtcbiAgICBib3R0b206IDA7XG4gICAgbWFyZ2luOiAwO1xuICAgIHRvcDogYXV0bztcbiAgICBwYWRkaW5nOiAzcHggNXB4O1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyB9XG4gICAgLm1mcC1pbWctbW9iaWxlIC5tZnAtYm90dG9tLWJhcjplbXB0eSB7XG4gICAgICBwYWRkaW5nOiAwOyB9XG4gIC5tZnAtaW1nLW1vYmlsZSAubWZwLWNvdW50ZXIge1xuICAgIHJpZ2h0OiA1cHg7XG4gICAgdG9wOiAzcHg7IH1cbiAgLm1mcC1pbWctbW9iaWxlIC5tZnAtY2xvc2Uge1xuICAgIHRvcDogMDtcbiAgICByaWdodDogMDtcbiAgICB3aWR0aDogMzVweDtcbiAgICBoZWlnaHQ6IDM1cHg7XG4gICAgbGluZS1oZWlnaHQ6IDM1cHg7XG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjYpO1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgcGFkZGluZzogMDsgfSB9XG5cbkBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6IDkwMHB4KSB7XG4gIC5tZnAtYXJyb3cge1xuICAgIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgwLjc1KTtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzUpOyB9XG4gIC5tZnAtYXJyb3ctbGVmdCB7XG4gICAgLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luOiAwO1xuICAgIHRyYW5zZm9ybS1vcmlnaW46IDA7IH1cbiAgLm1mcC1hcnJvdy1yaWdodCB7XG4gICAgLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luOiAxMDAlO1xuICAgIHRyYW5zZm9ybS1vcmlnaW46IDEwMCU7IH1cbiAgLm1mcC1jb250YWluZXIge1xuICAgIHBhZGRpbmctbGVmdDogNnB4O1xuICAgIHBhZGRpbmctcmlnaHQ6IDZweDsgfSB9XG4iLCIvKipcbiAqIFN3aXBlciAzLjQuMlxuICogTW9zdCBtb2Rlcm4gbW9iaWxlIHRvdWNoIHNsaWRlciBhbmQgZnJhbWV3b3JrIHdpdGggaGFyZHdhcmUgYWNjZWxlcmF0ZWQgdHJhbnNpdGlvbnNcbiAqIFxuICogaHR0cDovL3d3dy5pZGFuZ2Vyby51cy9zd2lwZXIvXG4gKiBcbiAqIENvcHlyaWdodCAyMDE3LCBWbGFkaW1pciBLaGFybGFtcGlkaVxuICogVGhlIGlEYW5nZXJvLnVzXG4gKiBodHRwOi8vd3d3LmlkYW5nZXJvLnVzL1xuICogXG4gKiBMaWNlbnNlZCB1bmRlciBNSVRcbiAqIFxuICogUmVsZWFzZWQgb246IE1hcmNoIDEwLCAyMDE3XG4gKi9cbi5zd2lwZXItY29udGFpbmVyIHtcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gIG1hcmdpbi1yaWdodDogYXV0bztcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICAvKiBGaXggb2YgV2Via2l0IGZsaWNrZXJpbmcgKi9cbiAgei1pbmRleDogMTtcbn1cbi5zd2lwZXItY29udGFpbmVyLW5vLWZsZXhib3ggLnN3aXBlci1zbGlkZSB7XG4gIGZsb2F0OiBsZWZ0O1xufVxuLnN3aXBlci1jb250YWluZXItdmVydGljYWwgPiAuc3dpcGVyLXdyYXBwZXIge1xuICAtd2Via2l0LWJveC1vcmllbnQ6IHZlcnRpY2FsO1xuICAtbW96LWJveC1vcmllbnQ6IHZlcnRpY2FsO1xuICAtbXMtZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgLXdlYmtpdC1mbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xufVxuLnN3aXBlci13cmFwcGVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICB6LWluZGV4OiAxO1xuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcbiAgZGlzcGxheTogLW1vei1ib3g7XG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xuICBkaXNwbGF5OiAtd2Via2l0LWZsZXg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIC13ZWJraXQtdHJhbnNpdGlvbi1wcm9wZXJ0eTogLXdlYmtpdC10cmFuc2Zvcm07XG4gIC1tb3otdHJhbnNpdGlvbi1wcm9wZXJ0eTogLW1vei10cmFuc2Zvcm07XG4gIC1vLXRyYW5zaXRpb24tcHJvcGVydHk6IC1vLXRyYW5zZm9ybTtcbiAgLW1zLXRyYW5zaXRpb24tcHJvcGVydHk6IC1tcy10cmFuc2Zvcm07XG4gIHRyYW5zaXRpb24tcHJvcGVydHk6IHRyYW5zZm9ybTtcbiAgLXdlYmtpdC1ib3gtc2l6aW5nOiBjb250ZW50LWJveDtcbiAgLW1vei1ib3gtc2l6aW5nOiBjb250ZW50LWJveDtcbiAgYm94LXNpemluZzogY29udGVudC1ib3g7XG59XG4uc3dpcGVyLWNvbnRhaW5lci1hbmRyb2lkIC5zd2lwZXItc2xpZGUsXG4uc3dpcGVyLXdyYXBwZXIge1xuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMHB4LCAwLCAwKTtcbiAgLW1vei10cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDBweCwgMCwgMCk7XG4gIC1vLXRyYW5zZm9ybTogdHJhbnNsYXRlKDBweCwgMHB4KTtcbiAgLW1zLXRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMHB4LCAwLCAwKTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwcHgsIDAsIDApO1xufVxuLnN3aXBlci1jb250YWluZXItbXVsdGlyb3cgPiAuc3dpcGVyLXdyYXBwZXIge1xuICAtd2Via2l0LWJveC1saW5lczogbXVsdGlwbGU7XG4gIC1tb3otYm94LWxpbmVzOiBtdWx0aXBsZTtcbiAgLW1zLWZsZXgtd3JhcDogd3JhcDtcbiAgLXdlYmtpdC1mbGV4LXdyYXA6IHdyYXA7XG4gIGZsZXgtd3JhcDogd3JhcDtcbn1cbi5zd2lwZXItY29udGFpbmVyLWZyZWUtbW9kZSA+IC5zd2lwZXItd3JhcHBlciB7XG4gIC13ZWJraXQtdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xuICAtbW96LXRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDtcbiAgLW1zLXRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDtcbiAgLW8tdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xuICB0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1vdXQ7XG4gIG1hcmdpbjogMCBhdXRvO1xufVxuLnN3aXBlci1zbGlkZSB7XG4gIC13ZWJraXQtZmxleC1zaHJpbms6IDA7XG4gIC1tcy1mbGV4OiAwIDAgYXV0bztcbiAgZmxleC1zaHJpbms6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbi8qIEF1dG8gSGVpZ2h0ICovXG4uc3dpcGVyLWNvbnRhaW5lci1hdXRvaGVpZ2h0LFxuLnN3aXBlci1jb250YWluZXItYXV0b2hlaWdodCAuc3dpcGVyLXNsaWRlIHtcbiAgaGVpZ2h0OiBhdXRvO1xufVxuLnN3aXBlci1jb250YWluZXItYXV0b2hlaWdodCAuc3dpcGVyLXdyYXBwZXIge1xuICAtd2Via2l0LWJveC1hbGlnbjogc3RhcnQ7XG4gIC1tcy1mbGV4LWFsaWduOiBzdGFydDtcbiAgLXdlYmtpdC1hbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gIC13ZWJraXQtdHJhbnNpdGlvbi1wcm9wZXJ0eTogLXdlYmtpdC10cmFuc2Zvcm0sIGhlaWdodDtcbiAgLW1vei10cmFuc2l0aW9uLXByb3BlcnR5OiAtbW96LXRyYW5zZm9ybTtcbiAgLW8tdHJhbnNpdGlvbi1wcm9wZXJ0eTogLW8tdHJhbnNmb3JtO1xuICAtbXMtdHJhbnNpdGlvbi1wcm9wZXJ0eTogLW1zLXRyYW5zZm9ybTtcbiAgdHJhbnNpdGlvbi1wcm9wZXJ0eTogdHJhbnNmb3JtLCBoZWlnaHQ7XG59XG4vKiBhMTF5ICovXG4uc3dpcGVyLWNvbnRhaW5lciAuc3dpcGVyLW5vdGlmaWNhdGlvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgb3BhY2l0eTogMDtcbiAgei1pbmRleDogLTEwMDA7XG59XG4vKiBJRTEwIFdpbmRvd3MgUGhvbmUgOCBGaXhlcyAqL1xuLnN3aXBlci13cDgtaG9yaXpvbnRhbCB7XG4gIC1tcy10b3VjaC1hY3Rpb246IHBhbi15O1xuICB0b3VjaC1hY3Rpb246IHBhbi15O1xufVxuLnN3aXBlci13cDgtdmVydGljYWwge1xuICAtbXMtdG91Y2gtYWN0aW9uOiBwYW4teDtcbiAgdG91Y2gtYWN0aW9uOiBwYW4teDtcbn1cbi8qIEFycm93cyAqL1xuLnN3aXBlci1idXR0b24tcHJldixcbi5zd2lwZXItYnV0dG9uLW5leHQge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogNTAlO1xuICB3aWR0aDogMjdweDtcbiAgaGVpZ2h0OiA0NHB4O1xuICBtYXJnaW4tdG9wOiAtMjJweDtcbiAgei1pbmRleDogMTA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgLW1vei1iYWNrZ3JvdW5kLXNpemU6IDI3cHggNDRweDtcbiAgLXdlYmtpdC1iYWNrZ3JvdW5kLXNpemU6IDI3cHggNDRweDtcbiAgYmFja2dyb3VuZC1zaXplOiAyN3B4IDQ0cHg7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbn1cbi5zd2lwZXItYnV0dG9uLXByZXYuc3dpcGVyLWJ1dHRvbi1kaXNhYmxlZCxcbi5zd2lwZXItYnV0dG9uLW5leHQuc3dpcGVyLWJ1dHRvbi1kaXNhYmxlZCB7XG4gIG9wYWNpdHk6IDAuMzU7XG4gIGN1cnNvcjogYXV0bztcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG4uc3dpcGVyLWJ1dHRvbi1wcmV2LFxuLnN3aXBlci1jb250YWluZXItcnRsIC5zd2lwZXItYnV0dG9uLW5leHQge1xuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJkYXRhOmltYWdlL3N2Zyt4bWw7Y2hhcnNldD11dGYtOCwlM0NzdmclMjB4bWxucyUzRCdodHRwJTNBJTJGJTJGd3d3LnczLm9yZyUyRjIwMDAlMkZzdmcnJTIwdmlld0JveCUzRCcwJTIwMCUyMDI3JTIwNDQnJTNFJTNDcGF0aCUyMGQlM0QnTTAlMkMyMkwyMiUyQzBsMi4xJTJDMi4xTDQuMiUyQzIybDE5LjklMkMxOS45TDIyJTJDNDRMMCUyQzIyTDAlMkMyMkwwJTJDMjJ6JyUyMGZpbGwlM0QnJTIzMDA3YWZmJyUyRiUzRSUzQyUyRnN2ZyUzRVwiKTtcbiAgbGVmdDogMTBweDtcbiAgcmlnaHQ6IGF1dG87XG59XG4uc3dpcGVyLWJ1dHRvbi1wcmV2LnN3aXBlci1idXR0b24tYmxhY2ssXG4uc3dpcGVyLWNvbnRhaW5lci1ydGwgLnN3aXBlci1idXR0b24tbmV4dC5zd2lwZXItYnV0dG9uLWJsYWNrIHtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiZGF0YTppbWFnZS9zdmcreG1sO2NoYXJzZXQ9dXRmLTgsJTNDc3ZnJTIweG1sbnMlM0QnaHR0cCUzQSUyRiUyRnd3dy53My5vcmclMkYyMDAwJTJGc3ZnJyUyMHZpZXdCb3glM0QnMCUyMDAlMjAyNyUyMDQ0JyUzRSUzQ3BhdGglMjBkJTNEJ00wJTJDMjJMMjIlMkMwbDIuMSUyQzIuMUw0LjIlMkMyMmwxOS45JTJDMTkuOUwyMiUyQzQ0TDAlMkMyMkwwJTJDMjJMMCUyQzIyeiclMjBmaWxsJTNEJyUyMzAwMDAwMCclMkYlM0UlM0MlMkZzdmclM0VcIik7XG59XG4uc3dpcGVyLWJ1dHRvbi1wcmV2LnN3aXBlci1idXR0b24td2hpdGUsXG4uc3dpcGVyLWNvbnRhaW5lci1ydGwgLnN3aXBlci1idXR0b24tbmV4dC5zd2lwZXItYnV0dG9uLXdoaXRlIHtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiZGF0YTppbWFnZS9zdmcreG1sO2NoYXJzZXQ9dXRmLTgsJTNDc3ZnJTIweG1sbnMlM0QnaHR0cCUzQSUyRiUyRnd3dy53My5vcmclMkYyMDAwJTJGc3ZnJyUyMHZpZXdCb3glM0QnMCUyMDAlMjAyNyUyMDQ0JyUzRSUzQ3BhdGglMjBkJTNEJ00wJTJDMjJMMjIlMkMwbDIuMSUyQzIuMUw0LjIlMkMyMmwxOS45JTJDMTkuOUwyMiUyQzQ0TDAlMkMyMkwwJTJDMjJMMCUyQzIyeiclMjBmaWxsJTNEJyUyM2ZmZmZmZiclMkYlM0UlM0MlMkZzdmclM0VcIik7XG59XG4uc3dpcGVyLWJ1dHRvbi1uZXh0LFxuLnN3aXBlci1jb250YWluZXItcnRsIC5zd2lwZXItYnV0dG9uLXByZXYge1xuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJkYXRhOmltYWdlL3N2Zyt4bWw7Y2hhcnNldD11dGYtOCwlM0NzdmclMjB4bWxucyUzRCdodHRwJTNBJTJGJTJGd3d3LnczLm9yZyUyRjIwMDAlMkZzdmcnJTIwdmlld0JveCUzRCcwJTIwMCUyMDI3JTIwNDQnJTNFJTNDcGF0aCUyMGQlM0QnTTI3JTJDMjJMMjclMkMyMkw1JTJDNDRsLTIuMS0yLjFMMjIuOCUyQzIyTDIuOSUyQzIuMUw1JTJDMEwyNyUyQzIyTDI3JTJDMjJ6JyUyMGZpbGwlM0QnJTIzMDA3YWZmJyUyRiUzRSUzQyUyRnN2ZyUzRVwiKTtcbiAgcmlnaHQ6IDEwcHg7XG4gIGxlZnQ6IGF1dG87XG59XG4uc3dpcGVyLWJ1dHRvbi1uZXh0LnN3aXBlci1idXR0b24tYmxhY2ssXG4uc3dpcGVyLWNvbnRhaW5lci1ydGwgLnN3aXBlci1idXR0b24tcHJldi5zd2lwZXItYnV0dG9uLWJsYWNrIHtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiZGF0YTppbWFnZS9zdmcreG1sO2NoYXJzZXQ9dXRmLTgsJTNDc3ZnJTIweG1sbnMlM0QnaHR0cCUzQSUyRiUyRnd3dy53My5vcmclMkYyMDAwJTJGc3ZnJyUyMHZpZXdCb3glM0QnMCUyMDAlMjAyNyUyMDQ0JyUzRSUzQ3BhdGglMjBkJTNEJ00yNyUyQzIyTDI3JTJDMjJMNSUyQzQ0bC0yLjEtMi4xTDIyLjglMkMyMkwyLjklMkMyLjFMNSUyQzBMMjclMkMyMkwyNyUyQzIyeiclMjBmaWxsJTNEJyUyMzAwMDAwMCclMkYlM0UlM0MlMkZzdmclM0VcIik7XG59XG4uc3dpcGVyLWJ1dHRvbi1uZXh0LnN3aXBlci1idXR0b24td2hpdGUsXG4uc3dpcGVyLWNvbnRhaW5lci1ydGwgLnN3aXBlci1idXR0b24tcHJldi5zd2lwZXItYnV0dG9uLXdoaXRlIHtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiZGF0YTppbWFnZS9zdmcreG1sO2NoYXJzZXQ9dXRmLTgsJTNDc3ZnJTIweG1sbnMlM0QnaHR0cCUzQSUyRiUyRnd3dy53My5vcmclMkYyMDAwJTJGc3ZnJyUyMHZpZXdCb3glM0QnMCUyMDAlMjAyNyUyMDQ0JyUzRSUzQ3BhdGglMjBkJTNEJ00yNyUyQzIyTDI3JTJDMjJMNSUyQzQ0bC0yLjEtMi4xTDIyLjglMkMyMkwyLjklMkMyLjFMNSUyQzBMMjclMkMyMkwyNyUyQzIyeiclMjBmaWxsJTNEJyUyM2ZmZmZmZiclMkYlM0UlM0MlMkZzdmclM0VcIik7XG59XG4vKiBQYWdpbmF0aW9uIFN0eWxlcyAqL1xuLnN3aXBlci1wYWdpbmF0aW9uIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIC13ZWJraXQtdHJhbnNpdGlvbjogMzAwbXM7XG4gIC1tb3otdHJhbnNpdGlvbjogMzAwbXM7XG4gIC1vLXRyYW5zaXRpb246IDMwMG1zO1xuICB0cmFuc2l0aW9uOiAzMDBtcztcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDAsIDApO1xuICAtbXMtdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcbiAgLW8tdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcbiAgei1pbmRleDogMTA7XG59XG4uc3dpcGVyLXBhZ2luYXRpb24uc3dpcGVyLXBhZ2luYXRpb24taGlkZGVuIHtcbiAgb3BhY2l0eTogMDtcbn1cbi8qIENvbW1vbiBTdHlsZXMgKi9cbi5zd2lwZXItcGFnaW5hdGlvbi1mcmFjdGlvbixcbi5zd2lwZXItcGFnaW5hdGlvbi1jdXN0b20sXG4uc3dpcGVyLWNvbnRhaW5lci1ob3Jpem9udGFsID4gLnN3aXBlci1wYWdpbmF0aW9uLWJ1bGxldHMge1xuICBib3R0b206IDEwcHg7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDAlO1xufVxuLyogQnVsbGV0cyAqL1xuLnN3aXBlci1wYWdpbmF0aW9uLWJ1bGxldCB7XG4gIHdpZHRoOiA4cHg7XG4gIGhlaWdodDogOHB4O1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGJvcmRlci1yYWRpdXM6IDEwMCU7XG4gIGJhY2tncm91bmQ6ICMwMDA7XG4gIG9wYWNpdHk6IDAuMjtcbn1cbmJ1dHRvbi5zd2lwZXItcGFnaW5hdGlvbi1idWxsZXQge1xuICBib3JkZXI6IG5vbmU7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgYm94LXNoYWRvdzogbm9uZTtcbiAgLW1vei1hcHBlYXJhbmNlOiBub25lO1xuICAtbXMtYXBwZWFyYW5jZTogbm9uZTtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuICBhcHBlYXJhbmNlOiBub25lO1xufVxuLnN3aXBlci1wYWdpbmF0aW9uLWNsaWNrYWJsZSAuc3dpcGVyLXBhZ2luYXRpb24tYnVsbGV0IHtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuLnN3aXBlci1wYWdpbmF0aW9uLXdoaXRlIC5zd2lwZXItcGFnaW5hdGlvbi1idWxsZXQge1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xufVxuLnN3aXBlci1wYWdpbmF0aW9uLWJ1bGxldC1hY3RpdmUge1xuICBvcGFjaXR5OiAxO1xuICBiYWNrZ3JvdW5kOiAjMDA3YWZmO1xufVxuLnN3aXBlci1wYWdpbmF0aW9uLXdoaXRlIC5zd2lwZXItcGFnaW5hdGlvbi1idWxsZXQtYWN0aXZlIHtcbiAgYmFja2dyb3VuZDogI2ZmZjtcbn1cbi5zd2lwZXItcGFnaW5hdGlvbi1ibGFjayAuc3dpcGVyLXBhZ2luYXRpb24tYnVsbGV0LWFjdGl2ZSB7XG4gIGJhY2tncm91bmQ6ICMwMDA7XG59XG4uc3dpcGVyLWNvbnRhaW5lci12ZXJ0aWNhbCA+IC5zd2lwZXItcGFnaW5hdGlvbi1idWxsZXRzIHtcbiAgcmlnaHQ6IDEwcHg7XG4gIHRvcDogNTAlO1xuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMHB4LCAtNTAlLCAwKTtcbiAgLW1vei10cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDBweCwgLTUwJSwgMCk7XG4gIC1vLXRyYW5zZm9ybTogdHJhbnNsYXRlKDBweCwgLTUwJSk7XG4gIC1tcy10cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDBweCwgLTUwJSwgMCk7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMHB4LCAtNTAlLCAwKTtcbn1cbi5zd2lwZXItY29udGFpbmVyLXZlcnRpY2FsID4gLnN3aXBlci1wYWdpbmF0aW9uLWJ1bGxldHMgLnN3aXBlci1wYWdpbmF0aW9uLWJ1bGxldCB7XG4gIG1hcmdpbjogNXB4IDA7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuLnN3aXBlci1jb250YWluZXItaG9yaXpvbnRhbCA+IC5zd2lwZXItcGFnaW5hdGlvbi1idWxsZXRzIC5zd2lwZXItcGFnaW5hdGlvbi1idWxsZXQge1xuICBtYXJnaW46IDAgNXB4O1xufVxuLyogUHJvZ3Jlc3MgKi9cbi5zd2lwZXItcGFnaW5hdGlvbi1wcm9ncmVzcyB7XG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4yNSk7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbn1cbi5zd2lwZXItcGFnaW5hdGlvbi1wcm9ncmVzcyAuc3dpcGVyLXBhZ2luYXRpb24tcHJvZ3Jlc3NiYXIge1xuICBiYWNrZ3JvdW5kOiAjMDA3YWZmO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IDA7XG4gIHRvcDogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDApO1xuICAtbXMtdHJhbnNmb3JtOiBzY2FsZSgwKTtcbiAgLW8tdHJhbnNmb3JtOiBzY2FsZSgwKTtcbiAgdHJhbnNmb3JtOiBzY2FsZSgwKTtcbiAgLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luOiBsZWZ0IHRvcDtcbiAgLW1vei10cmFuc2Zvcm0tb3JpZ2luOiBsZWZ0IHRvcDtcbiAgLW1zLXRyYW5zZm9ybS1vcmlnaW46IGxlZnQgdG9wO1xuICAtby10cmFuc2Zvcm0tb3JpZ2luOiBsZWZ0IHRvcDtcbiAgdHJhbnNmb3JtLW9yaWdpbjogbGVmdCB0b3A7XG59XG4uc3dpcGVyLWNvbnRhaW5lci1ydGwgLnN3aXBlci1wYWdpbmF0aW9uLXByb2dyZXNzIC5zd2lwZXItcGFnaW5hdGlvbi1wcm9ncmVzc2JhciB7XG4gIC13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbjogcmlnaHQgdG9wO1xuICAtbW96LXRyYW5zZm9ybS1vcmlnaW46IHJpZ2h0IHRvcDtcbiAgLW1zLXRyYW5zZm9ybS1vcmlnaW46IHJpZ2h0IHRvcDtcbiAgLW8tdHJhbnNmb3JtLW9yaWdpbjogcmlnaHQgdG9wO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiByaWdodCB0b3A7XG59XG4uc3dpcGVyLWNvbnRhaW5lci1ob3Jpem9udGFsID4gLnN3aXBlci1wYWdpbmF0aW9uLXByb2dyZXNzIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogNHB4O1xuICBsZWZ0OiAwO1xuICB0b3A6IDA7XG59XG4uc3dpcGVyLWNvbnRhaW5lci12ZXJ0aWNhbCA+IC5zd2lwZXItcGFnaW5hdGlvbi1wcm9ncmVzcyB7XG4gIHdpZHRoOiA0cHg7XG4gIGhlaWdodDogMTAwJTtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xufVxuLnN3aXBlci1wYWdpbmF0aW9uLXByb2dyZXNzLnN3aXBlci1wYWdpbmF0aW9uLXdoaXRlIHtcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpO1xufVxuLnN3aXBlci1wYWdpbmF0aW9uLXByb2dyZXNzLnN3aXBlci1wYWdpbmF0aW9uLXdoaXRlIC5zd2lwZXItcGFnaW5hdGlvbi1wcm9ncmVzc2JhciB7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG59XG4uc3dpcGVyLXBhZ2luYXRpb24tcHJvZ3Jlc3Muc3dpcGVyLXBhZ2luYXRpb24tYmxhY2sgLnN3aXBlci1wYWdpbmF0aW9uLXByb2dyZXNzYmFyIHtcbiAgYmFja2dyb3VuZDogIzAwMDtcbn1cbi8qIDNEIENvbnRhaW5lciAqL1xuLnN3aXBlci1jb250YWluZXItM2Qge1xuICAtd2Via2l0LXBlcnNwZWN0aXZlOiAxMjAwcHg7XG4gIC1tb3otcGVyc3BlY3RpdmU6IDEyMDBweDtcbiAgLW8tcGVyc3BlY3RpdmU6IDEyMDBweDtcbiAgcGVyc3BlY3RpdmU6IDEyMDBweDtcbn1cbi5zd2lwZXItY29udGFpbmVyLTNkIC5zd2lwZXItd3JhcHBlcixcbi5zd2lwZXItY29udGFpbmVyLTNkIC5zd2lwZXItc2xpZGUsXG4uc3dpcGVyLWNvbnRhaW5lci0zZCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1sZWZ0LFxuLnN3aXBlci1jb250YWluZXItM2QgLnN3aXBlci1zbGlkZS1zaGFkb3ctcmlnaHQsXG4uc3dpcGVyLWNvbnRhaW5lci0zZCAuc3dpcGVyLXNsaWRlLXNoYWRvdy10b3AsXG4uc3dpcGVyLWNvbnRhaW5lci0zZCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1ib3R0b20sXG4uc3dpcGVyLWNvbnRhaW5lci0zZCAuc3dpcGVyLWN1YmUtc2hhZG93IHtcbiAgLXdlYmtpdC10cmFuc2Zvcm0tc3R5bGU6IHByZXNlcnZlLTNkO1xuICAtbW96LXRyYW5zZm9ybS1zdHlsZTogcHJlc2VydmUtM2Q7XG4gIC1tcy10cmFuc2Zvcm0tc3R5bGU6IHByZXNlcnZlLTNkO1xuICB0cmFuc2Zvcm0tc3R5bGU6IHByZXNlcnZlLTNkO1xufVxuLnN3aXBlci1jb250YWluZXItM2QgLnN3aXBlci1zbGlkZS1zaGFkb3ctbGVmdCxcbi5zd2lwZXItY29udGFpbmVyLTNkIC5zd2lwZXItc2xpZGUtc2hhZG93LXJpZ2h0LFxuLnN3aXBlci1jb250YWluZXItM2QgLnN3aXBlci1zbGlkZS1zaGFkb3ctdG9wLFxuLnN3aXBlci1jb250YWluZXItM2QgLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiAwO1xuICB0b3A6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB6LWluZGV4OiAxMDtcbn1cbi5zd2lwZXItY29udGFpbmVyLTNkIC5zd2lwZXItc2xpZGUtc2hhZG93LWxlZnQge1xuICBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWdyYWRpZW50KGxpbmVhciwgbGVmdCB0b3AsIHJpZ2h0IHRvcCwgZnJvbShyZ2JhKDAsIDAsIDAsIDAuNSkpLCB0byhyZ2JhKDAsIDAsIDAsIDApKSk7XG4gIC8qIFNhZmFyaSA0KywgQ2hyb21lICovXG4gIGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KHJpZ2h0LCByZ2JhKDAsIDAsIDAsIDAuNSksIHJnYmEoMCwgMCwgMCwgMCkpO1xuICAvKiBDaHJvbWUgMTArLCBTYWZhcmkgNS4xKywgaU9TIDUrICovXG4gIGJhY2tncm91bmQtaW1hZ2U6IC1tb3otbGluZWFyLWdyYWRpZW50KHJpZ2h0LCByZ2JhKDAsIDAsIDAsIDAuNSksIHJnYmEoMCwgMCwgMCwgMCkpO1xuICAvKiBGaXJlZm94IDMuNi0xNSAqL1xuICBiYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQocmlnaHQsIHJnYmEoMCwgMCwgMCwgMC41KSwgcmdiYSgwLCAwLCAwLCAwKSk7XG4gIC8qIE9wZXJhIDExLjEwLTEyLjAwICovXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byBsZWZ0LCByZ2JhKDAsIDAsIDAsIDAuNSksIHJnYmEoMCwgMCwgMCwgMCkpO1xuICAvKiBGaXJlZm94IDE2KywgSUUxMCwgT3BlcmEgMTIuNTArICovXG59XG4uc3dpcGVyLWNvbnRhaW5lci0zZCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1yaWdodCB7XG4gIGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtZ3JhZGllbnQobGluZWFyLCByaWdodCB0b3AsIGxlZnQgdG9wLCBmcm9tKHJnYmEoMCwgMCwgMCwgMC41KSksIHRvKHJnYmEoMCwgMCwgMCwgMCkpKTtcbiAgLyogU2FmYXJpIDQrLCBDaHJvbWUgKi9cbiAgYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQobGVmdCwgcmdiYSgwLCAwLCAwLCAwLjUpLCByZ2JhKDAsIDAsIDAsIDApKTtcbiAgLyogQ2hyb21lIDEwKywgU2FmYXJpIDUuMSssIGlPUyA1KyAqL1xuICBiYWNrZ3JvdW5kLWltYWdlOiAtbW96LWxpbmVhci1ncmFkaWVudChsZWZ0LCByZ2JhKDAsIDAsIDAsIDAuNSksIHJnYmEoMCwgMCwgMCwgMCkpO1xuICAvKiBGaXJlZm94IDMuNi0xNSAqL1xuICBiYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQobGVmdCwgcmdiYSgwLCAwLCAwLCAwLjUpLCByZ2JhKDAsIDAsIDAsIDApKTtcbiAgLyogT3BlcmEgMTEuMTAtMTIuMDAgKi9cbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCByZ2JhKDAsIDAsIDAsIDAuNSksIHJnYmEoMCwgMCwgMCwgMCkpO1xuICAvKiBGaXJlZm94IDE2KywgSUUxMCwgT3BlcmEgMTIuNTArICovXG59XG4uc3dpcGVyLWNvbnRhaW5lci0zZCAuc3dpcGVyLXNsaWRlLXNoYWRvdy10b3Age1xuICBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWdyYWRpZW50KGxpbmVhciwgbGVmdCB0b3AsIGxlZnQgYm90dG9tLCBmcm9tKHJnYmEoMCwgMCwgMCwgMC41KSksIHRvKHJnYmEoMCwgMCwgMCwgMCkpKTtcbiAgLyogU2FmYXJpIDQrLCBDaHJvbWUgKi9cbiAgYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQoYm90dG9tLCByZ2JhKDAsIDAsIDAsIDAuNSksIHJnYmEoMCwgMCwgMCwgMCkpO1xuICAvKiBDaHJvbWUgMTArLCBTYWZhcmkgNS4xKywgaU9TIDUrICovXG4gIGJhY2tncm91bmQtaW1hZ2U6IC1tb3otbGluZWFyLWdyYWRpZW50KGJvdHRvbSwgcmdiYSgwLCAwLCAwLCAwLjUpLCByZ2JhKDAsIDAsIDAsIDApKTtcbiAgLyogRmlyZWZveCAzLjYtMTUgKi9cbiAgYmFja2dyb3VuZC1pbWFnZTogLW8tbGluZWFyLWdyYWRpZW50KGJvdHRvbSwgcmdiYSgwLCAwLCAwLCAwLjUpLCByZ2JhKDAsIDAsIDAsIDApKTtcbiAgLyogT3BlcmEgMTEuMTAtMTIuMDAgKi9cbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIHRvcCwgcmdiYSgwLCAwLCAwLCAwLjUpLCByZ2JhKDAsIDAsIDAsIDApKTtcbiAgLyogRmlyZWZveCAxNissIElFMTAsIE9wZXJhIDEyLjUwKyAqL1xufVxuLnN3aXBlci1jb250YWluZXItM2QgLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tIHtcbiAgYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1ncmFkaWVudChsaW5lYXIsIGxlZnQgYm90dG9tLCBsZWZ0IHRvcCwgZnJvbShyZ2JhKDAsIDAsIDAsIDAuNSkpLCB0byhyZ2JhKDAsIDAsIDAsIDApKSk7XG4gIC8qIFNhZmFyaSA0KywgQ2hyb21lICovXG4gIGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KHRvcCwgcmdiYSgwLCAwLCAwLCAwLjUpLCByZ2JhKDAsIDAsIDAsIDApKTtcbiAgLyogQ2hyb21lIDEwKywgU2FmYXJpIDUuMSssIGlPUyA1KyAqL1xuICBiYWNrZ3JvdW5kLWltYWdlOiAtbW96LWxpbmVhci1ncmFkaWVudCh0b3AsIHJnYmEoMCwgMCwgMCwgMC41KSwgcmdiYSgwLCAwLCAwLCAwKSk7XG4gIC8qIEZpcmVmb3ggMy42LTE1ICovXG4gIGJhY2tncm91bmQtaW1hZ2U6IC1vLWxpbmVhci1ncmFkaWVudCh0b3AsIHJnYmEoMCwgMCwgMCwgMC41KSwgcmdiYSgwLCAwLCAwLCAwKSk7XG4gIC8qIE9wZXJhIDExLjEwLTEyLjAwICovXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHJnYmEoMCwgMCwgMCwgMC41KSwgcmdiYSgwLCAwLCAwLCAwKSk7XG4gIC8qIEZpcmVmb3ggMTYrLCBJRTEwLCBPcGVyYSAxMi41MCsgKi9cbn1cbi8qIENvdmVyZmxvdyAqL1xuLnN3aXBlci1jb250YWluZXItY292ZXJmbG93IC5zd2lwZXItd3JhcHBlcixcbi5zd2lwZXItY29udGFpbmVyLWZsaXAgLnN3aXBlci13cmFwcGVyIHtcbiAgLyogV2luZG93cyA4IElFIDEwIGZpeCAqL1xuICAtbXMtcGVyc3BlY3RpdmU6IDEyMDBweDtcbn1cbi8qIEN1YmUgKyBGbGlwICovXG4uc3dpcGVyLWNvbnRhaW5lci1jdWJlLFxuLnN3aXBlci1jb250YWluZXItZmxpcCB7XG4gIG92ZXJmbG93OiB2aXNpYmxlO1xufVxuLnN3aXBlci1jb250YWluZXItY3ViZSAuc3dpcGVyLXNsaWRlLFxuLnN3aXBlci1jb250YWluZXItZmxpcCAuc3dpcGVyLXNsaWRlIHtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIC13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xuICAtbW96LWJhY2tmYWNlLXZpc2liaWxpdHk6IGhpZGRlbjtcbiAgLW1zLWJhY2tmYWNlLXZpc2liaWxpdHk6IGhpZGRlbjtcbiAgYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xuICB6LWluZGV4OiAxO1xufVxuLnN3aXBlci1jb250YWluZXItY3ViZSAuc3dpcGVyLXNsaWRlIC5zd2lwZXItc2xpZGUsXG4uc3dpcGVyLWNvbnRhaW5lci1mbGlwIC5zd2lwZXItc2xpZGUgLnN3aXBlci1zbGlkZSB7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuLnN3aXBlci1jb250YWluZXItY3ViZSAuc3dpcGVyLXNsaWRlLWFjdGl2ZSxcbi5zd2lwZXItY29udGFpbmVyLWZsaXAgLnN3aXBlci1zbGlkZS1hY3RpdmUsXG4uc3dpcGVyLWNvbnRhaW5lci1jdWJlIC5zd2lwZXItc2xpZGUtYWN0aXZlIC5zd2lwZXItc2xpZGUtYWN0aXZlLFxuLnN3aXBlci1jb250YWluZXItZmxpcCAuc3dpcGVyLXNsaWRlLWFjdGl2ZSAuc3dpcGVyLXNsaWRlLWFjdGl2ZSB7XG4gIHBvaW50ZXItZXZlbnRzOiBhdXRvO1xufVxuLnN3aXBlci1jb250YWluZXItY3ViZSAuc3dpcGVyLXNsaWRlLXNoYWRvdy10b3AsXG4uc3dpcGVyLWNvbnRhaW5lci1mbGlwIC5zd2lwZXItc2xpZGUtc2hhZG93LXRvcCxcbi5zd2lwZXItY29udGFpbmVyLWN1YmUgLnN3aXBlci1zbGlkZS1zaGFkb3ctYm90dG9tLFxuLnN3aXBlci1jb250YWluZXItZmxpcCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1ib3R0b20sXG4uc3dpcGVyLWNvbnRhaW5lci1jdWJlIC5zd2lwZXItc2xpZGUtc2hhZG93LWxlZnQsXG4uc3dpcGVyLWNvbnRhaW5lci1mbGlwIC5zd2lwZXItc2xpZGUtc2hhZG93LWxlZnQsXG4uc3dpcGVyLWNvbnRhaW5lci1jdWJlIC5zd2lwZXItc2xpZGUtc2hhZG93LXJpZ2h0LFxuLnN3aXBlci1jb250YWluZXItZmxpcCAuc3dpcGVyLXNsaWRlLXNoYWRvdy1yaWdodCB7XG4gIHotaW5kZXg6IDA7XG4gIC13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xuICAtbW96LWJhY2tmYWNlLXZpc2liaWxpdHk6IGhpZGRlbjtcbiAgLW1zLWJhY2tmYWNlLXZpc2liaWxpdHk6IGhpZGRlbjtcbiAgYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xufVxuLyogQ3ViZSAqL1xuLnN3aXBlci1jb250YWluZXItY3ViZSAuc3dpcGVyLXNsaWRlIHtcbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW46IDAgMDtcbiAgLW1vei10cmFuc2Zvcm0tb3JpZ2luOiAwIDA7XG4gIC1tcy10cmFuc2Zvcm0tb3JpZ2luOiAwIDA7XG4gIHRyYW5zZm9ybS1vcmlnaW46IDAgMDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbn1cbi5zd2lwZXItY29udGFpbmVyLWN1YmUuc3dpcGVyLWNvbnRhaW5lci1ydGwgLnN3aXBlci1zbGlkZSB7XG4gIC13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbjogMTAwJSAwO1xuICAtbW96LXRyYW5zZm9ybS1vcmlnaW46IDEwMCUgMDtcbiAgLW1zLXRyYW5zZm9ybS1vcmlnaW46IDEwMCUgMDtcbiAgdHJhbnNmb3JtLW9yaWdpbjogMTAwJSAwO1xufVxuLnN3aXBlci1jb250YWluZXItY3ViZSAuc3dpcGVyLXNsaWRlLWFjdGl2ZSxcbi5zd2lwZXItY29udGFpbmVyLWN1YmUgLnN3aXBlci1zbGlkZS1uZXh0LFxuLnN3aXBlci1jb250YWluZXItY3ViZSAuc3dpcGVyLXNsaWRlLXByZXYsXG4uc3dpcGVyLWNvbnRhaW5lci1jdWJlIC5zd2lwZXItc2xpZGUtbmV4dCArIC5zd2lwZXItc2xpZGUge1xuICBwb2ludGVyLWV2ZW50czogYXV0bztcbiAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbn1cbi5zd2lwZXItY29udGFpbmVyLWN1YmUgLnN3aXBlci1jdWJlLXNoYWRvdyB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogMDtcbiAgYm90dG9tOiAwcHg7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJhY2tncm91bmQ6ICMwMDA7XG4gIG9wYWNpdHk6IDAuNjtcbiAgLXdlYmtpdC1maWx0ZXI6IGJsdXIoNTBweCk7XG4gIGZpbHRlcjogYmx1cig1MHB4KTtcbiAgei1pbmRleDogMDtcbn1cbi8qIEZhZGUgKi9cbi5zd2lwZXItY29udGFpbmVyLWZhZGUuc3dpcGVyLWNvbnRhaW5lci1mcmVlLW1vZGUgLnN3aXBlci1zbGlkZSB7XG4gIC13ZWJraXQtdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xuICAtbW96LXRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDtcbiAgLW1zLXRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDtcbiAgLW8tdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xuICB0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1vdXQ7XG59XG4uc3dpcGVyLWNvbnRhaW5lci1mYWRlIC5zd2lwZXItc2xpZGUge1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgLXdlYmtpdC10cmFuc2l0aW9uLXByb3BlcnR5OiBvcGFjaXR5O1xuICAtbW96LXRyYW5zaXRpb24tcHJvcGVydHk6IG9wYWNpdHk7XG4gIC1vLXRyYW5zaXRpb24tcHJvcGVydHk6IG9wYWNpdHk7XG4gIHRyYW5zaXRpb24tcHJvcGVydHk6IG9wYWNpdHk7XG59XG4uc3dpcGVyLWNvbnRhaW5lci1mYWRlIC5zd2lwZXItc2xpZGUgLnN3aXBlci1zbGlkZSB7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuLnN3aXBlci1jb250YWluZXItZmFkZSAuc3dpcGVyLXNsaWRlLWFjdGl2ZSxcbi5zd2lwZXItY29udGFpbmVyLWZhZGUgLnN3aXBlci1zbGlkZS1hY3RpdmUgLnN3aXBlci1zbGlkZS1hY3RpdmUge1xuICBwb2ludGVyLWV2ZW50czogYXV0bztcbn1cbi5zd2lwZXItem9vbS1jb250YWluZXIge1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcbiAgZGlzcGxheTogLW1vei1ib3g7XG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xuICBkaXNwbGF5OiAtd2Via2l0LWZsZXg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIC13ZWJraXQtYm94LXBhY2s6IGNlbnRlcjtcbiAgLW1vei1ib3gtcGFjazogY2VudGVyO1xuICAtbXMtZmxleC1wYWNrOiBjZW50ZXI7XG4gIC13ZWJraXQtanVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAtd2Via2l0LWJveC1hbGlnbjogY2VudGVyO1xuICAtbW96LWJveC1hbGlnbjogY2VudGVyO1xuICAtbXMtZmxleC1hbGlnbjogY2VudGVyO1xuICAtd2Via2l0LWFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cbi5zd2lwZXItem9vbS1jb250YWluZXIgPiBpbWcsXG4uc3dpcGVyLXpvb20tY29udGFpbmVyID4gc3ZnLFxuLnN3aXBlci16b29tLWNvbnRhaW5lciA+IGNhbnZhcyB7XG4gIG1heC13aWR0aDogMTAwJTtcbiAgbWF4LWhlaWdodDogMTAwJTtcbiAgb2JqZWN0LWZpdDogY29udGFpbjtcbn1cbi8qIFNjcm9sbGJhciAqL1xuLnN3aXBlci1zY3JvbGxiYXIge1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIC1tcy10b3VjaC1hY3Rpb246IG5vbmU7XG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xKTtcbn1cbi5zd2lwZXItY29udGFpbmVyLWhvcml6b250YWwgPiAuc3dpcGVyLXNjcm9sbGJhciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogMSU7XG4gIGJvdHRvbTogM3B4O1xuICB6LWluZGV4OiA1MDtcbiAgaGVpZ2h0OiA1cHg7XG4gIHdpZHRoOiA5OCU7XG59XG4uc3dpcGVyLWNvbnRhaW5lci12ZXJ0aWNhbCA+IC5zd2lwZXItc2Nyb2xsYmFyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogM3B4O1xuICB0b3A6IDElO1xuICB6LWluZGV4OiA1MDtcbiAgd2lkdGg6IDVweDtcbiAgaGVpZ2h0OiA5OCU7XG59XG4uc3dpcGVyLXNjcm9sbGJhci1kcmFnIHtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNSk7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gIGxlZnQ6IDA7XG4gIHRvcDogMDtcbn1cbi5zd2lwZXItc2Nyb2xsYmFyLWN1cnNvci1kcmFnIHtcbiAgY3Vyc29yOiBtb3ZlO1xufVxuLyogUHJlbG9hZGVyICovXG4uc3dpcGVyLWxhenktcHJlbG9hZGVyIHtcbiAgd2lkdGg6IDQycHg7XG4gIGhlaWdodDogNDJweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiA1MCU7XG4gIHRvcDogNTAlO1xuICBtYXJnaW4tbGVmdDogLTIxcHg7XG4gIG1hcmdpbi10b3A6IC0yMXB4O1xuICB6LWluZGV4OiAxMDtcbiAgLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luOiA1MCU7XG4gIC1tb3otdHJhbnNmb3JtLW9yaWdpbjogNTAlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiA1MCU7XG4gIC13ZWJraXQtYW5pbWF0aW9uOiBzd2lwZXItcHJlbG9hZGVyLXNwaW4gMXMgc3RlcHMoMTIsIGVuZCkgaW5maW5pdGU7XG4gIC1tb3otYW5pbWF0aW9uOiBzd2lwZXItcHJlbG9hZGVyLXNwaW4gMXMgc3RlcHMoMTIsIGVuZCkgaW5maW5pdGU7XG4gIGFuaW1hdGlvbjogc3dpcGVyLXByZWxvYWRlci1zcGluIDFzIHN0ZXBzKDEyLCBlbmQpIGluZmluaXRlO1xufVxuLnN3aXBlci1sYXp5LXByZWxvYWRlcjphZnRlciB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBjb250ZW50OiBcIlwiO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJkYXRhOmltYWdlL3N2Zyt4bWw7Y2hhcnNldD11dGYtOCwlM0NzdmclMjB2aWV3Qm94JTNEJzAlMjAwJTIwMTIwJTIwMTIwJyUyMHhtbG5zJTNEJ2h0dHAlM0ElMkYlMkZ3d3cudzMub3JnJTJGMjAwMCUyRnN2ZyclMjB4bWxucyUzQXhsaW5rJTNEJ2h0dHAlM0ElMkYlMkZ3d3cudzMub3JnJTJGMTk5OSUyRnhsaW5rJyUzRSUzQ2RlZnMlM0UlM0NsaW5lJTIwaWQlM0QnbCclMjB4MSUzRCc2MCclMjB4MiUzRCc2MCclMjB5MSUzRCc3JyUyMHkyJTNEJzI3JyUyMHN0cm9rZSUzRCclMjM2YzZjNmMnJTIwc3Ryb2tlLXdpZHRoJTNEJzExJyUyMHN0cm9rZS1saW5lY2FwJTNEJ3JvdW5kJyUyRiUzRSUzQyUyRmRlZnMlM0UlM0NnJTNFJTNDdXNlJTIweGxpbmslM0FocmVmJTNEJyUyM2wnJTIwb3BhY2l0eSUzRCcuMjcnJTJGJTNFJTNDdXNlJTIweGxpbmslM0FocmVmJTNEJyUyM2wnJTIwb3BhY2l0eSUzRCcuMjcnJTIwdHJhbnNmb3JtJTNEJ3JvdGF0ZSgzMCUyMDYwJTJDNjApJyUyRiUzRSUzQ3VzZSUyMHhsaW5rJTNBaHJlZiUzRCclMjNsJyUyMG9wYWNpdHklM0QnLjI3JyUyMHRyYW5zZm9ybSUzRCdyb3RhdGUoNjAlMjA2MCUyQzYwKSclMkYlM0UlM0N1c2UlMjB4bGluayUzQWhyZWYlM0QnJTIzbCclMjBvcGFjaXR5JTNEJy4yNyclMjB0cmFuc2Zvcm0lM0Qncm90YXRlKDkwJTIwNjAlMkM2MCknJTJGJTNFJTNDdXNlJTIweGxpbmslM0FocmVmJTNEJyUyM2wnJTIwb3BhY2l0eSUzRCcuMjcnJTIwdHJhbnNmb3JtJTNEJ3JvdGF0ZSgxMjAlMjA2MCUyQzYwKSclMkYlM0UlM0N1c2UlMjB4bGluayUzQWhyZWYlM0QnJTIzbCclMjBvcGFjaXR5JTNEJy4yNyclMjB0cmFuc2Zvcm0lM0Qncm90YXRlKDE1MCUyMDYwJTJDNjApJyUyRiUzRSUzQ3VzZSUyMHhsaW5rJTNBaHJlZiUzRCclMjNsJyUyMG9wYWNpdHklM0QnLjM3JyUyMHRyYW5zZm9ybSUzRCdyb3RhdGUoMTgwJTIwNjAlMkM2MCknJTJGJTNFJTNDdXNlJTIweGxpbmslM0FocmVmJTNEJyUyM2wnJTIwb3BhY2l0eSUzRCcuNDYnJTIwdHJhbnNmb3JtJTNEJ3JvdGF0ZSgyMTAlMjA2MCUyQzYwKSclMkYlM0UlM0N1c2UlMjB4bGluayUzQWhyZWYlM0QnJTIzbCclMjBvcGFjaXR5JTNEJy41NiclMjB0cmFuc2Zvcm0lM0Qncm90YXRlKDI0MCUyMDYwJTJDNjApJyUyRiUzRSUzQ3VzZSUyMHhsaW5rJTNBaHJlZiUzRCclMjNsJyUyMG9wYWNpdHklM0QnLjY2JyUyMHRyYW5zZm9ybSUzRCdyb3RhdGUoMjcwJTIwNjAlMkM2MCknJTJGJTNFJTNDdXNlJTIweGxpbmslM0FocmVmJTNEJyUyM2wnJTIwb3BhY2l0eSUzRCcuNzUnJTIwdHJhbnNmb3JtJTNEJ3JvdGF0ZSgzMDAlMjA2MCUyQzYwKSclMkYlM0UlM0N1c2UlMjB4bGluayUzQWhyZWYlM0QnJTIzbCclMjBvcGFjaXR5JTNEJy44NSclMjB0cmFuc2Zvcm0lM0Qncm90YXRlKDMzMCUyMDYwJTJDNjApJyUyRiUzRSUzQyUyRmclM0UlM0MlMkZzdmclM0VcIik7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IDUwJTtcbiAgLXdlYmtpdC1iYWNrZ3JvdW5kLXNpemU6IDEwMCU7XG4gIGJhY2tncm91bmQtc2l6ZTogMTAwJTtcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbn1cbi5zd2lwZXItbGF6eS1wcmVsb2FkZXItd2hpdGU6YWZ0ZXIge1xuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJkYXRhOmltYWdlL3N2Zyt4bWw7Y2hhcnNldD11dGYtOCwlM0NzdmclMjB2aWV3Qm94JTNEJzAlMjAwJTIwMTIwJTIwMTIwJyUyMHhtbG5zJTNEJ2h0dHAlM0ElMkYlMkZ3d3cudzMub3JnJTJGMjAwMCUyRnN2ZyclMjB4bWxucyUzQXhsaW5rJTNEJ2h0dHAlM0ElMkYlMkZ3d3cudzMub3JnJTJGMTk5OSUyRnhsaW5rJyUzRSUzQ2RlZnMlM0UlM0NsaW5lJTIwaWQlM0QnbCclMjB4MSUzRCc2MCclMjB4MiUzRCc2MCclMjB5MSUzRCc3JyUyMHkyJTNEJzI3JyUyMHN0cm9rZSUzRCclMjNmZmYnJTIwc3Ryb2tlLXdpZHRoJTNEJzExJyUyMHN0cm9rZS1saW5lY2FwJTNEJ3JvdW5kJyUyRiUzRSUzQyUyRmRlZnMlM0UlM0NnJTNFJTNDdXNlJTIweGxpbmslM0FocmVmJTNEJyUyM2wnJTIwb3BhY2l0eSUzRCcuMjcnJTJGJTNFJTNDdXNlJTIweGxpbmslM0FocmVmJTNEJyUyM2wnJTIwb3BhY2l0eSUzRCcuMjcnJTIwdHJhbnNmb3JtJTNEJ3JvdGF0ZSgzMCUyMDYwJTJDNjApJyUyRiUzRSUzQ3VzZSUyMHhsaW5rJTNBaHJlZiUzRCclMjNsJyUyMG9wYWNpdHklM0QnLjI3JyUyMHRyYW5zZm9ybSUzRCdyb3RhdGUoNjAlMjA2MCUyQzYwKSclMkYlM0UlM0N1c2UlMjB4bGluayUzQWhyZWYlM0QnJTIzbCclMjBvcGFjaXR5JTNEJy4yNyclMjB0cmFuc2Zvcm0lM0Qncm90YXRlKDkwJTIwNjAlMkM2MCknJTJGJTNFJTNDdXNlJTIweGxpbmslM0FocmVmJTNEJyUyM2wnJTIwb3BhY2l0eSUzRCcuMjcnJTIwdHJhbnNmb3JtJTNEJ3JvdGF0ZSgxMjAlMjA2MCUyQzYwKSclMkYlM0UlM0N1c2UlMjB4bGluayUzQWhyZWYlM0QnJTIzbCclMjBvcGFjaXR5JTNEJy4yNyclMjB0cmFuc2Zvcm0lM0Qncm90YXRlKDE1MCUyMDYwJTJDNjApJyUyRiUzRSUzQ3VzZSUyMHhsaW5rJTNBaHJlZiUzRCclMjNsJyUyMG9wYWNpdHklM0QnLjM3JyUyMHRyYW5zZm9ybSUzRCdyb3RhdGUoMTgwJTIwNjAlMkM2MCknJTJGJTNFJTNDdXNlJTIweGxpbmslM0FocmVmJTNEJyUyM2wnJTIwb3BhY2l0eSUzRCcuNDYnJTIwdHJhbnNmb3JtJTNEJ3JvdGF0ZSgyMTAlMjA2MCUyQzYwKSclMkYlM0UlM0N1c2UlMjB4bGluayUzQWhyZWYlM0QnJTIzbCclMjBvcGFjaXR5JTNEJy41NiclMjB0cmFuc2Zvcm0lM0Qncm90YXRlKDI0MCUyMDYwJTJDNjApJyUyRiUzRSUzQ3VzZSUyMHhsaW5rJTNBaHJlZiUzRCclMjNsJyUyMG9wYWNpdHklM0QnLjY2JyUyMHRyYW5zZm9ybSUzRCdyb3RhdGUoMjcwJTIwNjAlMkM2MCknJTJGJTNFJTNDdXNlJTIweGxpbmslM0FocmVmJTNEJyUyM2wnJTIwb3BhY2l0eSUzRCcuNzUnJTIwdHJhbnNmb3JtJTNEJ3JvdGF0ZSgzMDAlMjA2MCUyQzYwKSclMkYlM0UlM0N1c2UlMjB4bGluayUzQWhyZWYlM0QnJTIzbCclMjBvcGFjaXR5JTNEJy44NSclMjB0cmFuc2Zvcm0lM0Qncm90YXRlKDMzMCUyMDYwJTJDNjApJyUyRiUzRSUzQyUyRmclM0UlM0MlMkZzdmclM0VcIik7XG59XG5ALXdlYmtpdC1rZXlmcmFtZXMgc3dpcGVyLXByZWxvYWRlci1zcGluIHtcbiAgMTAwJSB7XG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG5Aa2V5ZnJhbWVzIHN3aXBlci1wcmVsb2FkZXItc3BpbiB7XG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gIH1cbn1cbiJdfQ== */

/**/
.ui-icon,
.ui-widget-content .ui-icon {
    background-image: url("../../JSEngine/build/images/ui-icons_444444_256x240.png");
}

.ui-widget-header .ui-icon {
    background-image: url("../../JSEngine/build/images/ui-icons_444444_256x240.png");
}

.ui-state-default .ui-icon {
    background-image: url("../../JSEngine/build/images/ui-icons_777777_256x240.png");
}

.ui-state-hover .ui-icon,
.ui-state-focus .ui-icon {
    background-image: url("../../JSEngine/build/images/ui-icons_555555_256x240.png");
}

.ui-state-active .ui-icon {
    background-image: url("../../JSEngine/build/images/ui-icons_ffffff_256x240.png");
}

.ui-state-highlight .ui-icon {
    background-image: url("../../JSEngine/build/images/ui-icons_777620_256x240.png");
}

.ui-state-error .ui-icon,
.ui-state-error-text .ui-icon {
    background-image: url("../../JSEngine/build/images/ui-icons_cc0000_256x240.png");
}

table.dataTable thead .sorting {
    background-image: url("../../JSEngine/build/images/sort_both.png");
}

table.dataTable thead .sorting_asc {
    background-image: url("../../JSEngine/build/images/sort_asc.png");
}

table.dataTable thead .sorting_desc {
    background-image: url("../../JSEngine/build/images/sort_desc.png");
}

table.dataTable thead .sorting_asc_disabled {
    background-image: url("../../JSEngine/build/images/sort_asc_disabled.png");
}

table.dataTable thead .sorting_desc_disabled {
    background-image: url("../../JSEngine/build/images/sort_desc_disabled.png");
}
/**/
/*div.gx-content-zone-row {*/
/*	display: inline-block;*/
/*	width: 100%;*/
/*}*/

/*div.gx-content-zone-col div.widget-content {*/
/*	margin-top: 5px;*/
/*	margin-bottom: 5px;*/
/*}*/

/*div.gx-content-zone-col div.widget-content a {*/
/*	display: inline-block;*/
/*}*/

/*!* Width out min width the product container always has 20% width in the outer container *!*/
/*.gx-content-zone-col .swiper-wrapper .product-container {*/
/*	min-width: 220px;*/
/*}*/
/**/
/* --------------------------------------------------------------
   singleSignOn.css 2018-10-12
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2017 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

.page-login .main-inside .ssoicon {
    font-size: 27px;
    vertical-align: middle;
    padding: 7px 0;
    width: 45px;
    background: rgba(0, 0, 0, 0.2);
    text-align: center;
    float: left;
}

.page-login .main-inside .ssolabel {
    text-transform: uppercase;
    text-align: center;
    font-weight: bold;
    display: inline-block;
    width: 8em;
}

p.sso-note {
    margin: 2em auto;
    max-width: 30em;
}

.page-login .main-inside .sso-logins {
    text-align: center;
    margin: 3em auto;
}


.page-login .main-inside .sso-logins h4 {
    font-weight: 700;
    text-transform: uppercase;
    font-size: inherit;
    color: inherit;
}

.page-login .main-inside a.sso-link {
    display: inline-block;
    margin: 5px 5px;
    text-align: left;
    height: 41px;
    line-height: 40px;
}

.dropdown-sso,
.box-sso {
    margin: 30px 0 0;
}

.dropdown-sso > .separator,
.box-sso > .separator {
    position: relative;
    border-top: 1px solid #ccc;
    margin-bottom: 20px;
}

.dropdown-sso > .separator > span,
.box-sso > .separator > span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-size: 12px;
    color: #999;
    white-space: nowrap;
    padding: 0 10px;
}

.box-sso > .separator > span {
    background-color: #fff;
}

.dropdown-sso > .row,
.box-sso > .row {
    margin-left: -5px;
    margin-right: -5px;
}

.dropdown-sso > .row > [class^="col"],
.box-sso > .row > [class^="col"] {
    padding: 0 5px;
}

.dropdown-sso a.sso-link,
.box-sso a.sso-link {
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: 18px;
    color: #fff;
    padding: 2px 0;
}

.box-sso a.sso-link:first-of-type,
.dropdown-sso a.sso-link:first-of-type {
    margin-left: 0;
}

.box-sso a.sso-link:last-of-type,
.dropdown-sso a.sso-link:last-of-type {
    margin-right: 0;
}

.dropdown-sso a.sso-link-facebook,
.box-sso a.sso-link-facebook,
.page-login .main-inside a.sso-link-facebook,
.sso-connection a.sso-link-facebook {
    background-color: #3B5998;
    color: #FFFFFF;
}

.dropdown-sso a:hover.sso-link-facebook,
.box-sso a:hover.sso-link-facebook,
.page-login .main-inside a:hover.sso-link-facebook,
.sso-connection a:hover.sso-link-facebook,
.dropdown-sso a:active.sso-link-facebook,
.box-sso a:active.sso-link-facebook,
.page-login .main-inside a:active.sso-link-facebook,
.sso-connection a:active.sso-link-facebook,
.dropdown-sso a:focus.sso-link-facebook,
.box-sso a:focus.sso-link-facebook,
.page-login .main-inside a:focus.sso-link-facebook,
.sso-connection a:focus.sso-link-facebook {
    background-color: #2D4373;
}

.dropdown-sso a.sso-link-google,
.box-sso a.sso-link-google,
.page-login .main-inside a.sso-link-google,
.sso-connection a.sso-link-google {
    background-color: #DD5044;
    color: #FFFFFF;
}

.dropdown-sso a:hover.sso-link-google,
.box-sso a:hover.sso-link-google,
.page-login .main-inside a:hover.sso-link-google,
.sso-connection a:hover.sso-link-google,
.dropdown-sso a:active.sso-link-google,
.box-sso a:active.sso-link-google,
.page-login .main-inside a:active.sso-link-google,
.sso-connection a:active.sso-link-google,
.dropdown-sso a:focus.sso-link-google,
.box-sso a:focus.sso-link-google,
.page-login .main-inside a:focus.sso-link-google,
.sso-connection a:focus.sso-link-google {
    background-color: #C93225;
}

.dropdown-sso a.sso-link-paypal,
.box-sso a.sso-link-paypal,
.page-login .main-inside a.sso-link-paypal,
.sso-connection a.sso-link-paypal {
    background-color: #00A1FF;
    color: #FFFFFF;
}

.dropdown-sso a:hover.sso-link-paypal,
.box-sso a:hover.sso-link-paypal,
.page-login .main-inside a:hover.sso-link-paypal,
.sso-connection a:hover.sso-link-paypal,
.dropdown-sso a:active.sso-link-paypal,
.box-sso a:active.sso-link-paypal,
.page-login .main-inside a:active.sso-link-paypal,
.sso-connection a:active.sso-link-paypal,
.dropdown-sso a:focus.sso-link-paypal,
.box-sso a:focus.sso-link-paypal,
.page-login .main-inside a:focus.sso-link-paypal,
.sso-connection a:focus.sso-link-paypal {
    background-color: #0081CC;
}

.dropdown-sso a.sso-link-amazon,
.box-sso a.sso-link-amazon,
.page-login .main-inside a.sso-link-amazon,
.sso-connection a.sso-link-amazon {
    background-color: #FF9900;
    color: #FFFFFF;
}

.dropdown-sso a:hover.sso-link-amazon,
.box-sso a:hover.sso-link-amazon,
.page-login .main-inside a:hover.sso-link-amazon,
.sso-connection a:hover.sso-link-amazon,
.dropdown-sso a:active.sso-link-amazon,
.box-sso a:active.sso-link-amazon,
.page-login .main-inside a:active.sso-link-amazon,
.sso-connection a:active.sso-link-amazon,
.dropdown-sso a:focus.sso-link-amazon,
.box-sso a:focus.sso-link-amazon,
.page-login .main-inside a:focus.sso-link-amazon,
.sso-connection a:focus.sso-link-amazon {
    background-color: #CC7A00;
}

form.sso-disconnect {
    display: inline;
}

p.account-connection a.sso-link {
    font-weight: normal;
    margin: 2px 15px;
}

.sso-connection {
    padding: 1px 0 3px;
    margin: 2px 0;
    border-bottom: 1px solid #EEEEEE;
    border-top: 1px transparent;
}

.sso-connection:first-of-type {
    border-top: 1px solid #EEEEEE;
    padding-top: 3px;
}

.sso-connection-status {
    font-size: 1.7em;
    display: inline-block;
    vertical-align: middle;
}

.sso-connection a.sso-link {
    display: inline-block;
    width: 12em;
    margin-right: 1em;
    text-align: center;
    height: 37px;
    line-height: 38px;
}

@media (min-width: 992px) {
    .sso-connection a.sso-link {
        margin-right: 3px;
    }
}

.sso-connection.disconnected a.sso-link {
    background-color: #E7E7E7;
    color: #a8a8a8;
}

.sso-connection.disconnected a.sso-link .ssoicon {
    color: #ffffff;
}

.sso-connection a.sso-link .ssoicon {
    font-size: 23px;
    vertical-align: middle;
    padding: 7px 0;
    width: 45px;
    background: rgba(0, 0, 0, 0.2);
    text-align: center;
    float: left;
}

.sso-connection a.sso-link .ssolabel {
    text-transform: uppercase;
    text-align: center;
    font-weight: bold;
    display: inline-block;
    width: 8em;
}

.btn-disconnect {
    background-color: #ffffff;
    border: 0;
    border-radius: 2px;
    color: #878787;
    height: 2em;
    margin: 2px 0;
    padding: 0;
    text-align: left;
    width: 15em;
}

.btn-disconnect i {
    font-size: 1.2em;
}

#amzInvalidCountry {
    display: none;
    background: #D50000;
    color: #ffffff;
    font-weight: bold;
    font-size: 1.1em;
    text-align: center;
    padding: 1em;
}

#addressBookWidgetDiv {
    height: 25em;
}

div.mandatory-unselected label {
    font-weight: bold;
}

.page-shopping-cart .sso-link.sso-link-amazon {
    margin: 0 !important;
}

@media (max-width: 767px) {
    .sso-link.sso-link-amazon {
        display: block;
    }
}

/**/
body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item {
	display: inherit;
}

body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus) {
	top: -31px;
}

body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item:not(.paypal3-plus).above {
	top: 23px;
}

body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.gambio_hub-PayPal2Hub pre {
	color: #333333;
}

body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.gambio_hub-PayPal2Hub .title.payment_item {
	padding: 0;
}

body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.gambio_hub-PayPal2Hub .title.payment_item label {
	padding:       0 7px 0 8px;
	margin-bottom: 4px;
	margin-top:    -21px;
}

body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.gambio_hub-PayPal2Hub .title.payment_item label .module-name {
	display: none;
}

body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.gambio_hub-PayPal2Hub .title.payment_item label .module-description {
	color:     transparent;
	font-size: 0;
}

body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.gambio_hub-PayPal2Hub .title.payment_item label .module-description img {
	display: none;
}

body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item.gambio_hub-SofortHub .title.payment_item label .module-description img {
	display: none;
}

body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item[class^='gambio_hub-Klarna'].active .payment_item label .module-icon,
body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item[class*=' gambio_hub-Klarna'].active .payment_item label .module-icon {
	margin-top: 2px;
}
body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item[class^='gambio_hub-Klarna'].active .payment_item label .module-info .module-description,
body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item[class*=' gambio_hub-Klarna'].active .payment_item label .module-info .module-description {
	margin-bottom: 5px;
}
body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item[class^='gambio_hub-Klarna'].active .payment_item label .module-info .module-description .hub-logo,
body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item[class*=' gambio_hub-Klarna'].active .payment_item label .module-info .module-description .hub-logo {
	display: none;
}
body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item[class^='gambio_hub-Klarna'].active .payment_item label .control,
body.page-checkout-payment .list-group.paypal3-plus-checkout .list-group-item[class*=' gambio_hub-Klarna'].active .payment_item label .control {
	margin-top: 2px;
	right: unset !important;
}

body.page-checkout-payment .list-group .list-group-item.gambio_hub-PayPal2Hub .title.payment_item label .payment-module-description img {
	display: none;
}

#paypal-button-container {
	text-align: center;
	width:      50%;
	min-width:  200px;
	margin:     auto;
}

#checkout_payment #paypal-button-container { width: 80%; }
div.ecs_intro { margin: 1ex 0; text-align: center; }
div.ecs_overlay { z-index: 10; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); }
div.ecs_main {
	position: absolute; top: 50%; left: 50%;
	margin-top: -10em; height: 20em;
	margin-left: -20em; width: 40em;
	background: #ffffff;
	display: grid;
	grid-template-columns: 100%;
	align-items: center;
}

div.shopping-cart-button.paypal-ecs-mode {
	margin-top: 0;
}
div.shopping-cart-button.paypal-ecs-mode a.button-submit,
div.shopping-cart-button.paypal-ecs-mode div.checkout-buttons,
div.shopping-cart-button.paypal-ecs-mode div.paypalinstallmentcontainer {
	display: none;
}

a.paypal-ecs-button:hover {
	text-decoration: none;
}

#paypal-newbutton {
	clear: both;
	text-align: center;
	padding: 1em 15px;
	margin: 10px auto 0px;
	max-width: 300px;
	width: 67.6667%;
	background-color: inherit;
}

#paypal-separator {
	margin: 0px auto 15px;
	position: relative;
	background-color: inherit;
	width: 100%;
}

#paypal-introlabel {
	display: block;
	position: absolute;
	top: 50%;
	left: 50%;
	min-width: 10em;
	transform: translateX(-50%) translateY(-50%);
	padding: 5px 15px;
}

#paypal-ecsbutton {
	display: block;
	padding: 6px 2em;
	margin: auto;
	width: 100%;
}

#paypal-nameimg {
	height: 22px;
}

#paypal-logoimg {
	height: 22px;
}

/**/
</style>
    </head>
    <body>
        <p>
	<font face="Arial" size="2">Unser Shop ist aufgrund von Wartungsarbeiten im Moment nicht erreichbar.</font><br />
	<font face="Arial" size="2">Bitte besuchen Sie uns zu einem sp&auml;teren Zeitpunkt noch einmal.</font><br />
	<br />
	<br />
	<br />
	<br />
	<br />
	<br />
	<br />
	<br />
	<a href="login_admin.php"><font color="#808080">Login</font></a>
</p>
    </body>
</html>
