<?php
/* --------------------------------------------------------------
   GaOptOutController.inc.php 2018-08-24
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

class GaOptOutController extends HttpViewController
{
    /**
     * Notification about analytics opt put.
     *
     * @return RedirectHttpControllerResponse|HttpControllerResponse|HttpControllerResponseInterface
     */
    public function actionDefault()
    {
        $layoutContentControl = MainFactory::create_object('LayoutContentControl');
        $layoutContentControl->set_data('GET', $this->_getQueryParametersCollection()->getArray());
        $layoutContentControl->set_data('POST', $this->_getPostDataCollection()->getArray());
        $layoutContentControl->set_('coo_breadcrumb', $GLOBALS['breadcrumb']);
        $layoutContentControl->set_('coo_product', $GLOBALS['product']);
        $layoutContentControl->set_('coo_xtc_price', $GLOBALS['xtPrice']);
        $layoutContentControl->set_('c_path', $GLOBALS['cPath']);
        $layoutContentControl->set_('main_content', $this->_getGaOptOutLayout());
        $layoutContentControl->set_('request_type', $GLOBALS['request_type']);
        $layoutContentControl->proceed();
        
        $redirectUrl = $layoutContentControl->get_redirect_url();
        if (!empty($redirectUrl)) {
            return MainFactory::create('RedirectHttpControllerResponse', $redirectUrl);
        }
        
        return MainFactory::create('HttpControllerResponse', $layoutContentControl->get_response());
    }
    
    
    /**
     * Returns the ga opt out layout to be rendered.
     *
     * @return string
     */
    protected function _getGaOptOutLayout()
    {
        $languageTextManager = MainFactory::create('LanguageTextManager', 'google_analytics');
        $infoText            = $languageTextManager->get_text('gx_ga_analytics_disabled_txt');
        $btnText             = $languageTextManager->get_text('continue', 'buttons');
        
        return <<<OPTOUT
<div class="modal fade" id="ga-opt-out-modal" tabindex="-1" role="dialog" aria-labelledby="ga-opt-out-label">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title" id="ga-opt-out-label">Google-Analytics</h4>
      </div>
      <div class="modal-body">
        $infoText
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">$btnText</button>
      </div>
    </div>
  </div>
</div>

<script type="application/javascript">

	window.addEventListener('DOMContentLoaded', function() {
		
		$('#ga-opt-out-modal').on('hidden.bs.modal', function() {
			window.location.href = './';
		});
		
		$('#ga-opt-out-modal').modal('show');
	});
	
	
	gaOptOut();
</script>
OPTOUT;
    }
}
