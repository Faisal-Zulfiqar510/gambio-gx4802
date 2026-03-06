<?php
/* --------------------------------------------------------------
   product_images.inc.php 2023-01-26
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2023 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

// REQUIREMENTS
// ============

$productReadService = StaticGXCoreLoader::getService('ProductRead');
$productObjectService = StaticGXCoreLoader::getService('ProductObject');
if(isset($pInfo->products_id) && $pInfo->products_id > 0)
{
	$product = $productReadService->getProductById(new IdType((int)$pInfo->products_id));
}
else
{
	$product = $productObjectService->createProductObject();
}
$imageContainer = $product->getImageContainer();

$languageProvider = MainFactory::create('LanguageProvider', StaticGXCoreLoader::getDatabaseQueryBuilder());
$languageCodes = $languageProvider->getCodes();

// PRIMARY IMAGE
// =============

$primaryImage = $imageContainer->getPrimary();
if($primaryImage->getFilename() === '')
{
	$primaryImage = MainFactory::create('EmptyProductImage');
}

// Determine if the primary image is empty.
$emptyPrimaryImage = is_a($primaryImage, 'EmptyProductImage');

// ADDITIONAL IMAGES
// =================

// Fetch images.
$additionalImages = $imageContainer->getAdditionals();

// Determine if the additional images are empty.
$emptyAdditionalImages = $additionalImages->isEmpty();

?>

<style>
    .button-margin-fix a.btn.responsive-file-manager {
        margin-bottom: 0;
    }
</style>

<!-- IMAGE CONTAINER TEMPLATE -->
<!-- ======================== -->
<script type="text/template" id="image-container-template">
	<div class="product-image-wrapper new-product-image" data-gx-compatibility="products/image_change">
		<a href="javascript:;" class="btn sort-handler"><i class="fa fa-arrows" aria-hidden="true"></i></a>
		<!-- IMAGE (LEFT COLUMN) -->
		<!-- =================== -->
		<div class="product-preview-image">
			<img class="preview-image" style="max-width: 150px; max-height: 150px;" src="" data-image>
		</div>

		<!-- DATA (RIGHT COLUMN) -->
		<!-- =================== -->
		<div class="product-image-data">

			<!-- CHANGE IMAGE -->
			<!-- ============ -->
			<div class="grid control-group input-row">
				<!-- LABEL -->
				<div class="span6">
					<label><?php echo TXT_NEW_IMAGE; ?></label>
				</div>

				<!-- BUTTON -->
				<?php if($useFileManager): ?>
                <div class="span4">
                    <div data-gx-widget="filemanager"
                         class="button-margin-fix filemanager-fix"
                         data-filemanager-name="image_file[]"
                         data-filemanager-type="images"
                         data-filemanager-content-directory="images/product_images/original_images"
                         data-file-input-name
                         data-filemanager-page-active="<?php echo $useFileManager; ?>">
                    </div>
                </div>
				<?php else: ?>
				<div class="span6">
					<div style="width: 50%;">
						<label for="{{randomId}}" class="btn cursor-pointer">
							<i class="fa fa-fw fa-plus"></i>
							<?php echo TXT_PIC_ADD; ?>
						</label>
						
						<!-- INPUT FIELD -->
						<input style="display:none;"
						       id="{{randomId}}"
						       type="file"
						       name="image_file[]"
						       accept="image/gif,image/png,image/x-png,image/jpg,image/jpeg,image/gif,image/pjpeg"
						       data-file-input-name>
					</div>
					<input type="hidden" name="image_original[]" value="" data-original-image>
				</div>
				<?php endif; ?>
			</div>
			
			<?php if(!$useFileManager): ?>
			<!-- IMAGE FILE NAME -->
			<!-- =============== -->
			<div class="grid control-group">
				<!-- LABEL -->
				<div class="span6">
					<label><?php echo TEXT_CATEGORIES_FILE_LABEL; ?></label>
				</div>
				
				<!-- INPUT FIELD -->
				<div class="span4">
					<input type="text" name="image_name[]" value="" data-filename-input>
				</div>
				<div class="span2 text-center">
					&nbsp;
				</div>
			</div>
			<?php endif; ?>
			
			<!-- ALTERNATIVE TEXTS -->
			<!-- ================= -->
			<!-- Iterate over each image and generate the respective input field. -->
			<?php foreach($languageCodes as $languageCode): ?>
				<div class="grid control-group">
					<!-- LABEL -->
					<div class="span6">
						<label><?php echo GM_PRODUCTS_ALT_TEXT; ?></label>
					</div>

					<!-- INPUT FIELD -->
					<div class="span4">
						<input type="text"
						       data-language-id="<?php echo $languageProvider->getIdByCode($languageCode); ?>"
						       name="image_alt_text[<?php echo $languageCode->asString(); ?>][]"
						       value="">
					</div>

					<!-- FLAG ICON -->
					<div class="span2 text-center">
						<span class="flag-icon flag-icon-<?= strtolower($languageCode) ?>"></span>
					</div>
				</div>
			<?php endforeach; ?>

			<!-- USE AS PRODUCT IMAGE -->
			<!-- ==================== -->
			<div class="grid control-group">
				<!-- LABEL -->
				<div class="span6">
					<label><?php echo GM_USE_AS_PRODUCT_IMAGE_TEXT; ?></label>
				</div>

				<!-- CHECKBOX -->
				<div class="span6">
					<div data-gx-widget="checkbox">
						<input type="checkbox" name="image_show[]" <?php echo !$useFileManager ? 'value="1"' : ''; ?> checked data-show-image>
					</div>
				</div>
			</div>
		</div>
	</div>
</script>

<div class="span12">

	<!-- IMAGE LIST -->
	<!-- ========== -->
	<div data-gx-compatibility="products/new_image" 
		data-gx-extension="sortable" 
		data-sortable-axis="y" 
		data-sortable-cursor="grabbing" 
		data-sortable-tolerance="pointer"
		data-sortable-handle=".sort-handler">
		
		<!-- PRIMARY IMAGE CONTAINER -->
		<!-- ======================= -->
		<div class="product-image-wrapper" data-gx-compatibility="products/image_change">
		        <a href="javascript:;" class="btn sort-handler"><i class="fa fa-arrows" aria-hidden="true"></i></a>
				<!-- IMAGE (LEFT COLUMN) -->
				<!-- =================== -->
				<div class="product-preview-image">
					<img
						 data-image
					     style="max-width: 150px; max-height: 150px;"
					     src="<?php echo !$emptyPrimaryImage ? DIR_WS_CATALOG_THUMBNAIL_IMAGES
					                                          . $primaryImage->getFilename() : ''; ?>"
					>
				</div>

				<!-- DATA (RIGHT COLUMN) -->
				<!-- =================== -->
				<div class="product-image-data">

					<!-- IMAGE FILE NAME -->
					<!-- =============== -->
					<div class="grid control-group" data-filename-container>

						<!-- LABEL -->
						<div class="span6">
							<label class="bold"><?php echo TEXT_PRODUCTS_IMAGE; ?></label>
						</div>

						<!-- VALUE -->
						<?php if($useFileManager): ?>
                        <div class="span4">
                            <div data-gx-widget="filemanager"
                                 class="button-margin-fix filemanager-fix"
                                 data-filemanager-name="image_file[]"
                                 data-filemanager-type="images"
                                 data-filemanager-content-directory="images/product_images/original_images"
                                 data-filemanager-previous-file="<?php echo !$emptyPrimaryImage ? $primaryImage->getFilename() : ''; ?>"
                                 data-file-input-name
                                 data-filemanager-page-active="<?php echo $useFileManager; ?>">
                            </div>
                        </div>
						<?php else: ?>
						<div class="span4">
							<label class="bold file-name" data-filename-label><?php echo !$emptyPrimaryImage ? $primaryImage->getFilename() : ''; ?></label>
						</div>
						<?php endif; ?>
						
						<!-- DELETE ICON -->
						<div class="span2 delete-image text-center" data-gx-widget="checkbox" data-delete-checkbox>
							<div class="js-delete-checkbox">
								<input class="data-gx-widget" type="checkbox" name="image_delete[]"
									   value="<?php echo !$emptyPrimaryImage ? $primaryImage->getFilename() : ''; ?>" data-single_checkbox>
								<?php echo TEXT_DELETE; ?>
								<?php if(!$useFileManager): ?>
								<input type="hidden" name="image_original[]" value="<?php echo $primaryImage->getFilename(); ?>" data-original-image>
								<?php endif; ?>
							</div>
						</div>
					</div>
					
					<?php if(!$useFileManager): ?>
					<!-- CHANGE IMAGE -->
					<!-- ============ -->
					<div class="grid control-group">
						
						<!-- LABEL -->
						<div class="span6">
							<label><?php echo TXT_NEW_IMAGE; ?></label>
						</div>
						
						<!-- BUTTON -->
						<div class="span6">
							<div style="width: 50%;">
								<label for="change-primary-image" class="btn cursor-pointer">
									<i class="fa fa-fw fa-plus"></i>
									<?php echo TXT_PIC_ADD; ?>
								</label>
								<input id="change-primary-image"
								       style="display:none;"
								       type="file"
								       name="image_file[<?php echo !$emptyPrimaryImage ? $primaryImage->getFilename() : ''; ?>]"
								       accept="image/gif,image/png,image/x-png,image/jpg,image/jpeg,image/gif,image/pjpeg"
								       data-file-input-name>
							</div>
						</div>
					</div>
					
					<!-- CHANGE IMAGE FILE NAME -->
					<!-- ====================== -->
					<div class="grid control-group">
						
						<!-- LABEL -->
						<div class="span6">
							<label><?php echo TEXT_CATEGORIES_FILE_LABEL; ?></label>
						</div>
						
						<!-- INPUT FIELD -->
						<div class="span4">
							<input type="text" name="image_name[]" value="<?php echo !$emptyPrimaryImage ? $primaryImage->getFilename() : ''; ?>" data-filename-input>
						</div>
						
						<div class="span2 text-center">
							&nbsp;
						</div>
					</div>
					<?php endif; ?>
					
					<!-- ALTERNATIVE TEXTS -->
					<!-- ================= -->
					<!-- Iterate over each image and generate the respective input field. -->
					<?php foreach($languageCodes as $languageCode): ?>
						<div class="grid control-group">

							<!-- LABEL -->
							<div class="span6">
								<label><?php echo GM_PRODUCTS_ALT_TEXT; ?></label>
							</div>

							<!-- INPUT FIELD -->
							<div class="span4">
								<input type="text"
								       name="image_alt_text[<?php echo $languageCode->asString(); ?>][]"
								       value="<?php echo $emptyPrimaryImage ? '' : htmlspecialchars($primaryImage->getAltText($languageCode)); ?>">
							</div>

							<!-- ICON -->
							<div class="span2 text-center">
								<span class="flag-icon flag-icon-<?= strtolower($languageCode) ?>"></span>
							</div>
						</div>
					<?php endforeach; ?>

					<!-- USE AS PRODUCT IMAGE -->
					<!-- ==================== -->
					<div class="grid control-group">

						<!-- LABEL -->
						<div class="span6">
							<label><?php echo GM_USE_AS_PRODUCT_IMAGE_TEXT; ?></label>
						</div>

						<!-- CHECKBOX -->
						<div class="span6">
							<div data-gx-widget="checkbox">
								<input type="checkbox"
								       name="image_show[<?php echo $useFileManager ? $primaryImage->getFilename() : ''; ?>]"
									   data-show-image
									   <?php echo !$useFileManager ? 'value="' . $primaryImage->getFilename() . '"' : ''; ?> 
									   <?php echo ($primaryImage->isVisible() || $primaryImage instanceof EmptyProductImage) ? 'checked=""' : ''; ?>>
							</div>
						</div>
					</div>
				</div>
			</div>

		<!-- ADDITIONAL IMAGES -->
		<!-- ================= -->
		<!-- Iterate over additional image (if set) and render. -->
		<?php if(!$emptyAdditionalImages)
		{ ?>
				<?php foreach($additionalImages as $image): ?>
					<div class="product-image-wrapper" data-gx-compatibility="products/image_change">
                        <a href="javascript:;" class="btn sort-handler"><i class="fa fa-arrows" aria-hidden="true"></i></a>
						<!-- IMAGE (LEFT COLUMN) -->
						<!-- =================== -->
						<div class="product-preview-image">
							<img
								 data-image
							     style="max-width: 150px; max-height: 150px;"
							     src="<?php echo DIR_WS_CATALOG_THUMBNAIL_IMAGES . $image->getFilename(); ?>"
							>
						</div>

						<!-- DATA (RIGHT COLUMN) -->
						<!-- =================== -->
						<div class="product-image-data">

							<!-- IMAGE FILE NAME -->
							<!-- =============== -->
							<div class="grid control-group">

								<!-- LABEL -->
								<div class="span6">
									<label class="bold"><?php echo TEXT_PRODUCTS_IMAGE; ?></label>
								</div>

								<!-- VALUE -->
								<?php if($useFileManager): ?>
                                <div class="span4">
                                    <div data-gx-widget="filemanager"
                                         class="button-margin-fix filemanager-fix"
                                         data-filemanager-name="image_file[]"
                                         data-filemanager-type="images"
                                         data-filemanager-content-directory="images/product_images/original_images"
                                         data-filemanager-previous-file="<?php echo $image->getFilename(); ?>"
                                         data-filemanager-page-active="<?php echo $useFileManager; ?>"
                                         data-file-input-name>
                                    </div>
                                </div>
								<?php else: ?>
								<div class="span4">
									<label class="bold file-name" data-filename-label><?php echo $image->getFilename(); ?></label>
								</div>
								<?php endif; ?>
								
								<!-- DELETE ICON -->
								<div class="span2 delete-image text-center" data-gx-widget="checkbox" data-delete-checkbox>
									<input class="data-gx-widget"
									       type="checkbox"
									       name="image_delete[]"
									       value="<?php echo $image->getFilename(); ?>"
									       data-single_checkbox>
									<?php echo TEXT_DELETE; ?>
									<?php if(!$useFileManager): ?>
									<input type="hidden" name="image_original[]" value="<?php echo $image->getFilename(); ?>" data-original-image>
									<?php endif; ?>
								</div>
							</div>
			
							<?php if(!$useFileManager): ?>
							<!-- CHANGE IMAGE -->
							<!-- ============ -->
							<div class="grid control-group">
								
								<!-- LABEL -->
								<div class="span6">
									<label><?php echo TXT_NEW_IMAGE; ?></label>
								</div>
								
								<!-- BUTTON -->
								<div class="span6">
									<div style="width: 50%;">
										<label for="file_input_<?php echo $image->getFilename(); ?>"
										       class="btn cursor-pointer">
											<i class="fa fa-fw fa-plus"></i>
											<?php echo TXT_PIC_ADD; ?>
										</label>
										<input style="display:none;"
										       type="file"
										       id="file_input_<?php echo $image->getFilename(); ?>"
										       name="image_file[<?php echo $image->getFilename(); ?>]"
										       accept="image/gif,image/png,image/x-png,image/jpg,image/jpeg,image/gif,image/pjpeg"
										       data-file-input-name>
									</div>
								</div>
							</div>
							
							<!-- CHANGE IMAGE FILE NAME -->
							<!-- ====================== -->
							<div class="grid control-group">
								
								<!-- LABEL -->
								<div class="span6">
									<label><?php echo TEXT_CATEGORIES_FILE_LABEL; ?></label>
								</div>
								
								<!-- INPUT FIELD -->
								<div class="span4">
									<input type="text"
									       name="image_name[]"
									       value="<?php echo $image->getFilename(); ?>"
									       data-filename-input>
								</div>
								<div class="span2 text-center">
									&nbsp;
								</div>
							</div>
							<?php endif; ?>
							
							<!-- ALTERNATIVE TEXTS -->
							<!-- ================= -->
							<!-- Iterate over each image and generate the respective input field. -->
							<?php foreach($languageCodes as $languageCode): ?>
								<div class="grid control-group">

									<!-- LABEL -->
									<div class="span6">
										<label><?php echo GM_PRODUCTS_ALT_TEXT; ?></label>
									</div>

									<!-- INPUT FIELD -->
									<div class="span4">
										<input type="text"
										       name="image_alt_text[<?php echo $languageCode->asString(); ?>][]"
										       value="<?php echo htmlspecialchars($image->getAltText($languageCode)); ?>">
									</div>

									<!-- ICON -->
									<div class="span2 text-center">
										<span class="flag-icon flag-icon-<?= strtolower($languageCode) ?>"></span>
									</div>
								</div>
							<?php endforeach; ?>


							<!-- USE AS PRODUCT IMAGE -->
							<!-- ==================== -->
							<div class="grid control-group">

								<!-- LABEL -->
								<div class="span6">
									<label><?php echo GM_USE_AS_PRODUCT_IMAGE_TEXT; ?></label>
								</div>

								<!-- CHECKBOX -->
								<div class="span6">
									<div data-gx-widget="checkbox">
										<input type="checkbox"
										       name="image_show[<?php echo $useFileManager ? $image->getFilename() : ''; ?>]"
											   data-show-image
											   <?php echo !$useFileManager ? 'value="' . $image->getFilename() . '"' : ''; ?> 
											   <?php echo $image->isVisible() ? 'checked=""' : ''; ?>>
									</div>
								</div>
							</div>
						</div>
					</div>
				<?php endforeach; ?>
		<?php } ?>

		<!-- NEW ADDITIONAL IMAGES CONTAINER-->
		<!-- =============================== -->
		<div data-newimages-list></div>

		<!-- ADD IMAGE BUTTON -->
		<!-- ================ -->
		<button type="button" class="btn cursor-pointer product-image-uploader" data-addimage-button>
			<i class="fa fa-fw fa-cloud-upload"></i>
			<?php echo TXT_MO_PICS_ADD; ?>
		</button>
	</div>

</div>
