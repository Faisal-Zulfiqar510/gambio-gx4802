<?php
/*--------------------------------------------------------------
   set_product_image_data.inc.php 2022-09-14
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

$fileManagerConfiguration = MainFactory::create('ResponsiveFileManagerConfigurationStorage');
$useFileManager           = $fileManagerConfiguration->isInstalled()
                            && $fileManagerConfiguration->get('use_in_product_and_category_pages');
if($useFileManager)
{
	/**
	 * @var LanguageProvider $languageProvider
	 * @var ProductWriteService $productWriteService
	 * @var ProductImage $additionalImage
	 */
	
	$languageProvider    = MainFactory::create('LanguageProvider', StaticGXCoreLoader::getDatabaseQueryBuilder());
	$productWriteService = StaticGXCoreLoader::getService('ProductWrite');
	
	$languageCodes  = $languageProvider->getAdminCodes();
	$imageContainer = $product->getImageContainer();
	
	$imagesToDeleteArray = $_POST['image_delete'] ?? null;
	$imagesToSetArray    = $_POST['image_file'];
	$imagesToShowArray   = $_POST['image_show'];
	$imagesAltTextArray  = $_POST['image_alt_text'];
	
	function performImageProcessing($fileName)
	{
		if(file_exists(DIR_FS_CATALOG_ORIGINAL_IMAGES . $fileName))
		{
			$products_image_name = $fileName;
			$image_error         = false;
			
			if(!file_exists(DIR_FS_CATALOG_POPUP_IMAGES . $products_image_name))
			{
				include(DIR_WS_INCLUDES . 'product_popup_images.php');
			}
			if(!file_exists(DIR_FS_CATALOG_INFO_IMAGES . $products_image_name))
			{
				include(DIR_WS_INCLUDES . 'product_info_images.php');
			}
			if(!file_exists(DIR_FS_CATALOG_THUMBNAIL_IMAGES . $products_image_name))
			{
				include(DIR_WS_INCLUDES . 'product_thumbnail_images.php');
			}
			if(!file_exists(DIR_FS_CATALOG . 'images/product_images/gallery_images/' . $products_image_name))
			{
				include(DIR_WS_INCLUDES . 'product_gallery_images.php');
			}
		}
	}
	
	// Delete images.
	if(is_array($imagesToDeleteArray))
	{
		foreach($imagesToDeleteArray as $imageToDelete)
		{
			$fileName = new RelativeFilePathStringType(xtc_db_prepare_input($imageToDelete));
			
			$productWriteService->deleteProductImage($fileName);
			$imageContainer->delete($fileName);
		}
	}
	
	// Delete additional images.
	foreach($imageContainer->getAdditionals() as $additionalImage)
	{
		$imageContainer->delete(new RelativeFilePathStringType($additionalImage->getFilename()));
	}
	
	// Set image files.
	if(is_array($imagesToSetArray))
	{
		$isPrimary = true;
		
		foreach($imagesToSetArray as $index => $imageName)
		{
			// Skips the current image if the image is deleted and no new image is uploaded instead.
			if(is_array($imagesToDeleteArray) && in_array($imageName, $imagesToDeleteArray))
			{
				continue;
			}
			
			// Skip if the current image if name is empty.
			if(trim($imageName) === '') {
				continue;
			}
			
			$image          = MainFactory::create('ProductImage', new RelativeFilePathStringType($imageName));
			$isImageVisible = is_array($imagesToShowArray) && isset($imagesToShowArray[$index]) && $imagesToShowArray[$index] === 'on';
			
			$image->setVisible(new BoolType($isImageVisible));
			
			foreach($languageCodes as $languageCode)
			{
				$altText = new StringType(xtc_db_prepare_input($imagesAltTextArray[$languageCode->asString()][$index]));
				
				$image->setAltText($altText, $languageCode);
			}
			
			if($isPrimary)
			{
				$isPrimary = false;
				$imageContainer->setPrimary($image);
			}
			else
			{
				$imageContainer->addAdditional($image);
			}
		}
	}
	
	// Set image container to product.
	$product->setImageContainer($imageContainer);
	
	// Execute image processing for primary image.
	performImageProcessing($imageContainer->getPrimary()->getFilename());
	
	// Execute image processing for additional images.
	foreach($imageContainer->getAdditionals()->getArray() as $additionalImage)
	{
		performImageProcessing($additionalImage->getFilename());
	}
}
else
{
	/** @var LanguageProvider $languageProvider */
	$languageProvider = MainFactory::create('LanguageProvider', StaticGXCoreLoader::getDatabaseQueryBuilder());
	$languageCodes    = $languageProvider->getCodes();
	$imageContainer   = $product->getImageContainer();
	/** @var ProductWriteService $productWriteService */
	$productWriteService = StaticGXCoreLoader::getService('ProductWrite');
	$uploadedImages      = array();
	
	// Delete images
	if(is_array($_POST['image_delete']))
	{
		foreach($_POST['image_delete'] as $imageToDelete)
		{
			$filename = new RelativeFilePathStringType(xtc_db_prepare_input($imageToDelete));
			$productWriteService->deleteProductImage($filename);
			$imageContainer->delete($filename);
		}
	}
	
	// Image upload
	if(isset($_FILES['image_file']) && is_array($_FILES['image_file']))
	{
		foreach($_FILES['image_file']['tmp_name'] as $filename => $imageFile)
		{
			try
			{
				$savedAsFilename = $productWriteService->importProductImageFile(new ExistingFile(new NonEmptyStringType($imageFile)),
				                                                                new RelativeFilePathStringType($filename));
				
				if(!empty($savedAsFilename))
				{
					$uploadedImages[$filename] = $savedAsFilename;
				}
			}
			catch(InvalidArgumentException $e)
			{
				$languageTextManager = MainFactory::create('LanguageTextManager', 'gm_product_images',
				                                           $_SESSION['languages_id']);
				$GLOBALS['messageStack']->add_session(sprintf($languageTextManager->get_text('GM_UPLOAD_IMAGE_INVALID_FILE_FORMAT'),
				                                              $filename), 'error');
			}
		}
	}
	
	$additionalImages = $imageContainer->getAdditionals();
	foreach($additionalImages as $additionalImage)
	{
		$imageContainer->delete(new RelativeFilePathStringType($additionalImage->getFilename()));
	}
	
	if(isset($_POST['image_name']) && is_array($_POST['image_name']))
	{
		$isPrimary = true;
		
		foreach($_POST['image_name'] as $index => $imageNameFromInput)
		{
			// Skips the current image if the image is deleted and no new image is uploaded instead
			if(is_array($_POST['image_delete']) && in_array($_POST['image_original'][$index], $_POST['image_delete']) && !isset($uploadedImages[$imageNameFromInput]))
			{
				continue;
			}
			
			// Skip if the current image if name is empty.
			if(trim($imageNameFromInput) === '') {
				continue;
			}
			
			// Save imageNameFromInput before it will be changed
			$imageNameFromInputBackup = $imageNameFromInput;
			
			// If there is no filetype in the new name, then the old filetype should be added.
			if(strrchr($imageNameFromInput, '.') === false)
			{
				$imageNameFromInput .= strrchr($_POST['image_original'][$index], '.');
			}
			
            $filePathInfo = pathinfo($imageNameFromInput);
            $dirname = $filePathInfo['dirname'] === '.' ? '' : "{$filePathInfo['dirname']}/";
			// Replace some specialchars. Still allowed are these chars: . - _
			$imageNameFromInput = preg_replace('/[\s!$§%#^&*()+|~=`´{}\[\]:";\\\'<>?,\\\\\/]+/u', '-', $filePathInfo['basename']);
			
			$imageName = "{$dirname}{$imageNameFromInput}";
			
			if(isset($uploadedImages[$imageNameFromInput]))
			{
				$imageName = $uploadedImages[$imageNameFromInput];
			}
			elseif(trim($imageNameFromInput) === '')
			{
				$imageName = $_POST['image_original'][$index];
			}
			elseif($imageName !== $_POST['image_original'][$index])
			{
				try
				{
					$productWriteService->renameProductImage(new RelativeFilePathStringType($_POST['image_original'][$index]),
					                                         new RelativeFilePathStringType($imageName));
				}
				catch(InvalidArgumentException $e)
				{
					$languageTextManager = MainFactory::create('LanguageTextManager', 'gm_product_images', $_SESSION['languages_id']);
					$GLOBALS['messageStack']->add_session(sprintf($languageTextManager->get_text('GM_RENAME_IMAGE_INVALID_FILE_FORMAT'),
					                                              $imageName), 'error');
					unset($_POST['image_original'][$index]);
					unset($_POST['image_name'][$index]);
					continue;
				}
			}
			
			$image = MainFactory::create('ProductImage', new RelativeFilePathStringType($imageName));
			$isImageVisible = (isset($_POST['image_show'])
			                   && (in_array($imageNameFromInput, $_POST['image_show'])
			                       || in_array($imageNameFromInputBackup, $_POST['image_show'])
			                       || in_array($_POST['image_original'][$index], $_POST['image_show'])));
			$image->setVisible(new BoolType($isImageVisible));
			foreach($languageCodes as $languageCode)
			{
				$image->setAltText(new StringType(xtc_db_prepare_input($_POST['image_alt_text'][$languageCode->asString()][$index])),
				                   $languageCode);
			}
			
			if($isPrimary)
			{
				$isPrimary = false;
				$imageContainer->setPrimary($image);
			}
			else
			{
				$imageContainer->addAdditional($image);
			}
		}
	}
	
	// If an image file was replaced make sure that the old file is removed from the server.
	if (isset($_POST['image_original']) && isset($_POST['image_name'])) {
		foreach($_POST['image_original'] as $index => $imageOriginalName) {
			$imageNewName = $_POST['image_name'][$index];
            
            $filePathInfo = pathinfo($imageNewName);
            $dirname = $filePathInfo['dirname'] === '.' ? '' : "{$filePathInfo['dirname']}/";
			// Replace some specialchars. Still allowed are these chars: . - _
			$imageNewName = preg_replace(
                '/[\s!$§%#^&*()+|~=`´{}\[\]:";\\\'<>?,\\\\\/]+/u',
                '-',
                $filePathInfo['basename']
            );
            $imageNewName = "{$dirname}{$imageNewName}";
			
			if ($imageOriginalName !== $imageNewName) {
				$productWriteService->deleteProductImage(new RelativeFilePathStringType($imageOriginalName));
			}
		}
	}
	
	$product->setImageContainer($imageContainer);
}
