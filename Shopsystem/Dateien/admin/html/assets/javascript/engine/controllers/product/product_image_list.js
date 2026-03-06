'use strict';

/* --------------------------------------------------------------
 product_image_list.js 2021-09-02
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Product Images List Controller
 *
 * This controller handles the images sort
 *
 * @module Controllers/product_image_list
 */

gx.controllers.module(
// ------------------------------------------------------------------------
// CONTROLLER NAME
// ------------------------------------------------------------------------
'product_image_list',

// ------------------------------------------------------------------------
// CONTROLLER LIBRARIES
// ------------------------------------------------------------------------
[jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.css', jse.source + '/vendor/jquery-ui-dist/jquery-ui.js', 'loading_spinner'],

// ------------------------------------------------------------------------
// CONTROLLER BUSINESS LOGIC
// ------------------------------------------------------------------------
function (data) {
  'use strict';

  var _this = this;

  var module = {};

  /**
   * Edit modal element
   *
   * @type {jQuery|HTMLElement}
   */
  var $editModal = $('.edit-panel');

  /**
   * Edit collection modal element
   *
   * @type {jQuery|HTMLElement}
   */
  var $editCollectionModal = $('.edit-collection-panel');

  /**
   * Confirm modal element
   *
   * @type {jQuery|HTMLElement}
   */
  var $confirmModal = $('.confirm-modal-panel');

  /**
   * Toast message element
   *
   * @type {jQuery|HTMLElement}
   */
  var $toastMessage = $('.request-status-wrapper');

  /**
   * Selected image collection value
   */
  var initialSelectedList = data.selectedList;

  /**
   *
   * @type {*}
   */
  var appUrl = jse.core.config.get('appUrl');

  /**
   * Load spinner instance
   */
  var loadingSpinner = null;

  /**
   *
   */
  var toastTimeoutID = null;

  /**
   * Default options
   *
   * @type {{sortable: {cursor: string, containment: string, sortableList: string, handle: string, placeholder: string, axis: string, opacity: number, items: string}, filemanager: {subFolder: string, top: number, left: number, width: number, id: string, lang: string, height: number}}}
   */
  var defaults = {
    sortable: {
      items: 'li.row',
      axis: 'y',
      cursor: 'move',
      handle: '.sort-handle',
      containment: 'document',
      opacity: 0.75,
      placeholder: 'col-md-12 list-element sort-placeholder',
      sortableList: 'ul.configuration-image-list'
    },
    filemanager: {
      id: 'add-image-collection',
      subFolder: 'images/product_images/original_images',
      popup: 1,
      lang: 'de',
      width: 990,
      height: 600,
      top: 100,
      left: 100,
      useFileManager: false
    }

    /**
     * Sortable options
     */
  };var sortableOptions = $.extend(true, {}, defaults.sortable, data);

  /**
   * File manager options
   */
  var filemanagerOptions = $.extend(true, {}, defaults.filemanager, data);

  var fileManager = null;

  /**
   * Sortable list element.
   *
   * @type {jQuery}
   */
  var $sortableList = $(sortableOptions.sortableList);

  /**
   * Handler when updating the order of the image list
   */
  var handleOnSortUpdate = async function handleOnSortUpdate() {
    loading(true);

    try {
      var newOrder = $sortableList.sortable('toArray', { attribute: 'data-list-element-id' }).reduce(function (newValue, currentValue, currentIndex) {
        newValue.push({
          imageId: parseInt(currentValue),
          sortIndex: currentIndex
        });
        return newValue;
      }, []);

      var result = await updateImagesSort({ sort: JSON.stringify(newOrder) });

      if (result.success) {
        toastSuccess(result.message);
      } else {
        toastError(result.message);
      }
    } catch (e) {
      toastError(e.message);
    } finally {
      loading(false);
    }
  };

  /**
   * Event listener for add image button
   */
  var addImageButtonEventListener = function addImageButtonEventListener() {
    $('.add-image').click(function () {
      var id = filemanagerOptions.id,
          subFolder = filemanagerOptions.subFolder,
          lang = filemanagerOptions.lang,
          width = filemanagerOptions.width,
          height = filemanagerOptions.height,
          top = filemanagerOptions.top,
          left = filemanagerOptions.left,
          popup = filemanagerOptions.popup,
          useFileManager = filemanagerOptions.useFileManager;


      if (!useFileManager) {
        toastError(jse.core.lang.translate('RESPONSIVE_FILEMANAGER_REQUIRED', 'product_image_lists'));
        return;
      }

      var urlParams = ['field_id=' + id, 'crossdomain=1', 'sub_folder=' + subFolder, 'lang=' + lang, 'popup=' + popup].join('&');

      fileManager = parent.window.open(appUrl + '/ResponsiveFilemanager/filemanager/dialog.php?' + urlParams, 'ResponsiveFilemanager', 'scrollbars=1,width=' + width + ',height=' + height + ',top=' + top + ',left=' + left);
    });
  };

  var addResponsiveFileManagerEventListener = function addResponsiveFileManagerEventListener() {
    var onMessage = async function onMessage(event) {
      var data = event.data,
          sender = data.sender,
          url = data.url,
          field_id = data.field_id;


      if (sender !== 'responsivefilemanager' || field_id !== filemanagerOptions.id) {
        return;
      }

      var correctUrl = url.replace(/([^:]\/)\/+/g, '$1');

      await handleAddImageToCollection({
        url: correctUrl,
        localPath: normalizeLocalPath(correctUrl)
      });

      fileManager.close();
      fileManager = null;
    };

    window.addEventListener('message', onMessage, false);
  };

  /**
   * Removes the origin domain from the image path
   *
   * @param url
   * @returns {*}
   */
  var normalizeLocalPath = function normalizeLocalPath(url) {
    var regex = appUrl + '(/)?';

    return url.replace(new RegExp(regex, 'g'), '');
  };

  /**
   * Event listener for creating a new image collection
   */
  var createNewCollectionButtonEventListener = function createNewCollectionButtonEventListener() {
    $('#create-new-collection').on('click', function () {
      clearCreateNewCollectionInput();

      $('.selected-collection-wrapper').addClass('create-new-collection');
      $('.select-collection').hide();
      $('.create-collection').show();
      $('.create-collection input').focus();

      if (hasCollection()) {
        $('#select-collection').show();
      }

      $(this).hide();
    });
  };

  /**
   * Event listener for clicking on "Select collection" text/button
   */
  var selectCollectionButtonEventListener = function selectCollectionButtonEventListener() {
    $('#select-collection').on('click', function () {
      $('.selected-collection-wrapper').removeClass('create-new-collection');
      $('.create-collection').hide();
      $('.select-collection').show();
      $('#create-new-collection').show();
      $(this).hide();
    });
  };

  /**
   * Event listener for opening the Edit image modal
   */
  var openEditImageModalEventListener = function openEditImageModalEventListener() {
    $(document).on('click', '.edit-image', function () {
      var $parent = $(this).parents('.collection-image-wrapper'),
          data = $parent.data('image');

      handleEditImageModal({
        id: data.id,
        src: data.webFilePath,
        localPath: normalizeLocalPath(data.webFilePath),
        titles: data.titles,
        altTitles: data.altTitles
      });
    });
  };

  /**
   * Event listener for closing Edit image modal
   */
  var closeEditModalButtonEventListener = function closeEditModalButtonEventListener() {
    $('.edit-panel .edit-modal .close-btn').on('click', handleCloseEditImageModal);
  };

  /**
   * Event listener for canceling/closing the Edit image modal
   */
  var cancelEditModalEventListener = function cancelEditModalEventListener() {
    $(document).on('click', '.edit-modal-cancel', handleCloseEditImageModal);
  };

  /**
   * Event listener for hitting the save button inside Edit Image Modal
   */
  var saveEditModalEventListener = function saveEditModalEventListener() {
    $editModal.on('click', '.edit-modal-save', handleSaveImageModal);
  };

  /**
   * Event listener for closing Edit collection modal
   */
  var closeEditCollectionModalButtonEventListener = function closeEditCollectionModalButtonEventListener() {
    $('.edit-collection-panel .edit-modal .close-btn').on('click', handleCloseEditCollectionModal);
  };

  /**
   * Event listener for opening the Edit collection modal
   */
  var openEditCollectionModalEventListener = function openEditCollectionModalEventListener() {
    $(document).on('click', '.edit-collection', handleEditCollectionModal);
  };

  /**
   * Event listener for canceling/closing the Edit image modal
   */
  var cancelEditCollectionModalButtonEventListener = function cancelEditCollectionModalButtonEventListener() {
    $(document).on('click', '.edit-collection-modal-cancel', handleCloseEditCollectionModal);
  };

  /**
   * Listener for clicking on save button inside Edit Collection Modal
   */
  var updateEditCollectionModalButtonEventListener = function updateEditCollectionModalButtonEventListener() {
    $editCollectionModal.on('click', '.edit-collection-modal-save', handleUpdateCollectionModal);
  };

  /**
   * Handler for closing Edit Image Modal
   */
  var handleCloseEditCollectionModal = function handleCloseEditCollectionModal() {
    $editCollectionModal.fadeOut(function () {
      return clearModalInputs($editCollectionModal);
    });
  };

  /**
   * Event listener for deleting image button
   */
  var deleteImageButtonEventListener = function deleteImageButtonEventListener() {
    $(document).on('click', '.delete-image', function () {
      handleDeleteImage($(this).parents('.collection-image-wrapper'));
    });
  };

  /**
   * Event listener when changing the image collection dropdown
   */
  var imageCollectionOnChangeEventListener = function imageCollectionOnChangeEventListener() {
    $('#combi_image_collection').change(function () {
      var val = parseInt($(this).val());
      handleOnChangeImageCollection(val);
    });
  };

  /**
   * Event listener for creating new collection button
   */
  var createCollectionButtonEventListener = function createCollectionButtonEventListener() {
    $('button.create-new-collection').on('click', async function () {
      var $input = $('input[name=new-collection-name]'),
          name = $input.val();

      if (!name) {
        $input.addClass('error');

        return false;
      }

      await handleCreateNewCollection(name);
    });
  };

  /**
   * Event listener for deleting collection list button
   */
  var deleteCollectionButtonEventListener = function deleteCollectionButtonEventListener() {
    $('button.delete-collection').on('click', async function () {
      handleDeleteCollection($('#combi_image_collection option:selected').val());
    });
  };

  /**
   * Prevents submit the modal forms by pressing enter.
   * It triggers the save button instead of submitting it.
   *
   */
  var preventSubmitFormModals = function preventSubmitFormModals() {
    $editModal.find('#edit-image-form').submit(function (e) {
      $editModal.find('.edit-modal-save').trigger('click');
      return false;
    });
    $editCollectionModal.find('#edit-collection-form').submit(function (e) {
      $editCollectionModal.find('.edit-collection-modal-save').trigger('click');
      return false;
    });
  };

  /**
   * Handler for closing Edit Image Modal
   */
  var handleCloseEditImageModal = function handleCloseEditImageModal() {
    if ($editModal.find('input[name=id]').val() === '0') {
      removeLastImageElement();
    }

    $editModal.fadeOut(function () {
      return clearModalInputs($editModal);
    });
  };

  /**
   * Handler to add an image to a collection
   *
   * @returns {void}
   */
  var handleSaveImageModal = async function handleSaveImageModal() {
    if (!isValidEditModalData($editModal)) {
      return;
    }

    loading(true);

    try {
      var formData = parseEditModalData($('form#edit-image-form').serializeArray()),
          result = null;

      formData = removeRedundantPathFromImagePath(formData);

      if (formData.id !== '0') {
        formData.imageId = formData.id;
        delete formData.id;
        result = await updateImageTexts(formData);
      } else {
        delete formData.id;
        result = await addImageToCollection(formData);
      }

      resetImagesWrapper();
      loadImagesCollection(getSelectedList().id);
      $editModal.fadeOut(function () {
        return clearModalInputs($editModal);
      });

      var _result = result,
          success = _result.success,
          _result$message = _result.message,
          message = _result$message === undefined ? null : _result$message;


      if (success) {
        toastSuccess(message || jse.core.lang.translate('MODAL_SUCCESS_TEXT', 'product_image_lists'));
      } else {
        toastError(message || jse.core.lang.translate('MODAL_ERROR_TEXT', 'product_image_lists'));
      }
    } catch (e) {
      toastError(e.message);
    } finally {
      loading(false);
    }
  };

  /**
   * Removes 'images/product_images/original_images/' from the image path in the form data
   *
   * @param $formData
   * @returns {*}
   */
  var removeRedundantPathFromImagePath = function removeRedundantPathFromImagePath($formData) {
    var oldPath = 'images/product_images/original_images/';
    $formData['localPath'] = $formData['localPath'].replace(oldPath, "");

    return $formData;
  };

  /**
   * Handler to update the collection's name
   *
   * @returns {void}
   */
  var handleUpdateCollectionModal = async function handleUpdateCollectionModal() {
    if (!isValidEditModalData($editCollectionModal)) {
      return;
    }

    loading(true);
    try {
      var formData = parseEditModalData($('form#edit-collection-form').serializeArray());

      var id = formData.id,
          name = formData.name;

      var _ref = await updateCollectionName({ listId: id, listName: name }),
          success = _ref.success,
          message = _ref.message;

      if (success) {
        toastSuccess(message);
      } else {
        toastError(message);
      }

      loadCollections(id);
      $editCollectionModal.fadeOut();
    } catch (e) {
      toastError(e.message);
    } finally {
      loading(false);
    }
  };

  /**
   * Validates edit modals
   *
   * @param $modal
   * @returns {boolean}
   */
  var isValidEditModalData = function isValidEditModalData($modal) {
    $modal.find('form input').removeClass('error');

    var $form = $modal.find('form');
    var errors = 0;

    $form.find('[class*=required]').each(function (index, element) {
      if ($(element).val() === '') {
        $(element).addClass('error');
        errors++;
      }
    });

    return errors === 0;
  };

  /**
   * Clears the inputs for the given modal element
   *
   * @param $modal
   */
  var clearModalInputs = function clearModalInputs($modal) {
    $modal.find('input').each(function (index, element) {
      $(element).val('').removeClass('error');
    });
  };

  /**
   * Parse edit modal form data to send to back end
   *
   * @param formData
   * @returns {{*}}
   */
  var parseEditModalData = function parseEditModalData(formData) {
    var parsedData = { titles: [], altTitles: [] };

    formData.forEach(function (element) {
      if (/\[\w+\]/gi.test(element.name)) {
        var key = element.name.replace(/.*\[(\w+)\]/, '$1'),
            value = element.name.replace(/(.*)\[\w+\]/, '$1');

        parsedData[value].push({
          value: element.value,
          languageCode: key
        });
      } else {
        parsedData[element.name] = element.value;
      }
    });

    parsedData.titles = JSON.stringify(parsedData.titles);
    parsedData.altTitles = JSON.stringify(parsedData.altTitles);

    return parsedData;
  };

  var openConfirmModal = function openConfirmModal() {
    return new Promise(function (resolve) {
      $confirmModal.show();

      $confirmModal.on('click', '.confirm-modal-cancel, .confirm-modal .close-btn', function () {
        resolve(false);
        $confirmModal.hide();
      });
      $confirmModal.find('.confirm-modal-confirm').click(function () {
        resolve(true);
        $confirmModal.hide();
      });
    });
  };

  /**
   * Handler when deleting a image from the list
   * @param $imageWrapper
   */
  var handleDeleteImage = async function handleDeleteImage($imageWrapper) {
    var canProceed = await openConfirmModal();

    if (!canProceed) {
      return;
    }

    loading(true);

    try {
      var imageId = parseInt($imageWrapper.data('image').id),
          modifierId = $('input:hidden[name=modifierId]').val(),
          modifierType = $('input:hidden[name=modifierType]').val();
      var message = jse.core.lang.translate('MODAL_SUCCESS_TEXT', 'product_image_lists');

      if (imageId) {
        var params = {
          imageId: imageId,
          modifierId: modifierId,
          modifierType: modifierType
        };
        var result = await deleteImageById(params);
        message = result.message;
        if (false === result.success) {
          throw new Error(message);
        }
      }

      $imageWrapper.fadeOut(function () {
        $(this).remove();

        if (!hasImage()) {
          setToNoImagesDisplay();
        }
      });

      toastSuccess(message);
    } catch (e) {
      toastError(e.message);
    } finally {
      loading(false);
    }
  };

  /**
   * Clears the new collection input text
   *
   * @returns {void}
   */
  var clearCreateNewCollectionInput = function clearCreateNewCollectionInput() {
    $('input[name=new-collection-name]').removeClass('error').val('');
  };

  /**
   * Appends an image to the image wrapper
   *
   * @param $imageBlock
   */
  var appendImageToCollection = function appendImageToCollection($imageBlock) {
    $('.selected-collection-wrapper').removeClass('create-new-collection no-image-selected');
    $('.collection-images-wrapper').css('display', 'flex').append($imageBlock);
  };

  /**
   * Resets/clears the image wrapper
   *
   * @returns {jQuery}
   */
  var resetImagesWrapper = function resetImagesWrapper() {
    return $('.collection-images-wrapper').html('');
  };

  /**
   * Replaces the collection dropdown with new collection list
   *
   * @param collections
   * @param selected
   */
  var replaceCollections = function replaceCollections(collections) {
    var selected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var $collection = $('select#combi_image_collection');
    $collection.html('').append($('<option/>').val(0).html(''));

    collections.forEach(function (element) {
      var $option = $('<option/>').val(element.id).html(element.name);

      if (selected !== null && parseInt(selected) === element.id) {
        $option.prop('selected', true);
      }

      $collection.append($option);
    });
  };

  /**
   * Initialize the collections list
   *
   * @returns {void}
   */
  var loadCollections = async function loadCollections() {
    var selected = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var collections = await getCollection();

    replaceCollections(collections, selected);

    if (!collections.length) {
      setToNoImagesDisplay();
      setToNoCollectionsDisplay();
      return;
    }

    enableImageSelection();
  };

  /**
   * Initialize the images collection by a given collection ID
   *
   * @param collection_id
   * @returns {void}
   */
  var loadImagesCollection = async function loadImagesCollection(collection_id) {
    var images = await getImageCollection(collection_id);

    if (!images.length) {
      setToNoImagesDisplay();
      return;
    }
    // $('.selected-collection-wrapper').removeClass('disabled-image-selection')

    images.sort(function (a, b) {
      return a.sortOrder - b.sortOrder;
    }).forEach(function (element) {
      var $imageBlock = $(imageBlockTemplate({ id: element.id, src: element.webFilePath }));

      $imageBlock.data('image', element);
      appendImageToCollection($imageBlock);
    });
  };

  /**
   * Hides the collection image wrapper element
   */
  var setToNoImagesDisplay = function setToNoImagesDisplay() {
    $('.selected-collection-wrapper').addClass('no-image-selected');
    $('div.collection-images-wrapper').hide();
  };

  /**
   * Hide elements when we don't have collections
   */
  var setToNoCollectionsDisplay = function setToNoCollectionsDisplay() {
    $('button#select-collection').hide();
    $('button#create-new-collection').trigger('click');
  };

  /**
   * Disables the image placeholder and the edit/delete buttons of the image collection
   */
  var disableImageSelection = function disableImageSelection() {
    $('.selected-collection-wrapper').addClass('disabled-image-selection');
    $('button.edit-collection, button.delete-collection').attr('disabled', true);
  };

  /**
   * Enables the image placeholder and the edit/delete buttons of the image collection
   */
  var enableImageSelection = function enableImageSelection() {
    $('.selected-collection-wrapper').removeClass('disabled-image-selection');
    $('button.edit-collection, button.delete-collection').removeAttr('disabled');
  };

  /**
   * Returns true if there is at least one collection
   * We check if it is bigger than 1 because the first element it's a blank option
   *
   * @returns {boolean}
   */
  var hasCollection = function hasCollection() {
    return $('#combi_image_collection option').length > 1;
  };

  /**
   * Checks if the images wrapper has images
   *
   * @returns {boolean}
   */
  var hasImage = function hasImage() {
    return $('.collection-images-wrapper > .collection-image-wrapper').length > 0;
  };

  /**
   * Removes the last image element from the images container
   */
  var removeLastImageElement = function removeLastImageElement() {
    // remove last image
    var $lastImageElement = $('.collection-images-wrapper > .collection-image-wrapper:last-child');
    $lastImageElement.remove();

    if (!hasImage()) {
      setToNoImagesDisplay();
    }
  };

  /**
   * Request to get all the image collections
   *
   * @returns {Promise}
   */
  var getCollection = function getCollection() {
    var url = [appUrl, '/admin/admin.php?do=ProductImageListReadAjax'].join('');

    return $.get(url, function (response) {
      return response;
    });
  };

  /**
   * Get all images from a given collection
   *
   * @param collection_id
   * @returns {Promise}
   */
  var getImageCollection = function getImageCollection(collection_id) {
    var url = [appUrl, '/admin/admin.php?do=ProductImageListReadAjax/list', '&id=' + collection_id].join('');

    return $.get(url).then(function (response) {
      return response[0].images || [];
    });
  };

  /**
   * Request to create a new collection list
   *
   * @param listName
   */
  var createCollection = function createCollection(listName) {
    var url = [appUrl, '/admin/admin.php?do=ProductImageListCreateAjax/imageList'].join('');

    return $.post(url, { listName: listName }, function (response) {
      return response;
    });
  };

  /**
   * Request to delete a collection list
   *
   * @param id
   * @param modifierId
   * @param modifierType
   * @returns {Promise}
   */
  var deleteCollection = function deleteCollection(_ref2) {
    var id = _ref2.id,
        modifierId = _ref2.modifierId,
        modifierType = _ref2.modifierType;

    var url = [appUrl, '/admin/admin.php?do=ProductImageListDeleteAjax/deleteImageListById', '&id=' + id + '&modifierId=' + modifierId + '&modifierType=' + modifierType].join('');

    return $.ajax({
      url: url,
      type: 'DELETE'
    }).then(function (response) {
      return response;
    });
  };

  /**
   * Request to add an image to a collection list
   *
   * @param parsedData
   * @returns {*}
   */
  var addImageToCollection = function addImageToCollection(parsedData) {
    var url = [appUrl, '/admin/admin.php?do=ProductImageListCreateAjax/image'].join('');

    return $.post(url, parsedData, function (response) {
      return response;
    }, 'json');
  };

  /**
   * Updates the text and alt text for the image
   *
   * @param parsedData
   * @returns {*}
   */
  var updateImageTexts = function updateImageTexts(parsedData) {
    var url = [appUrl, '/admin/admin.php?do=ProductImageListUpdateAjax/updateImageText'].join('');

    return $.post(url, parsedData, function (response) {
      return response;
    }, 'json');
  };

  /**
   * Request to update a collection name
   *
   * @param parsedData
   * @returns {*}
   */
  var updateCollectionName = function updateCollectionName(parsedData) {
    var url = [appUrl, '/admin/admin.php?do=ProductImageListUpdateAjax/updateImageListName'].join('');

    return $.post(url, parsedData, function (response) {
      return response;
    }, 'json');
  };

  /**
   * Deletes an image from the current image collection
   *
   * @param imageId
   * @param modifierId
   * @param modifierType
   * @returns {Promise}
   */
  var deleteImageById = function deleteImageById(_ref3) {
    var imageId = _ref3.imageId,
        modifierId = _ref3.modifierId,
        modifierType = _ref3.modifierType;

    var url = [appUrl, '/admin/admin.php?do=ProductImageListDeleteAjax/deleteImageById&id=' + imageId + '&modifierId=' + modifierId + '&modifierType=' + modifierType].join('');

    return $.ajax({
      url: url,
      type: 'DELETE'
    }).then(function (response) {
      return response;
    });
  };

  /**
   * Updates the order of the images
   *
   * @param parsedData
   * @returns {*}
   */
  var updateImagesSort = function updateImagesSort(parsedData) {
    var url = [appUrl, '/admin/admin.php?do=ProductImageListUpdateAjax/updateImagesSort'].join('');

    return $.post(url, parsedData, function (response) {
      return response;
    }, 'json');
  };

  /**
   * Handler to create a new collection button event
   *
   * @param name
   * @returns {Promise<void>}
   */
  var handleCreateNewCollection = async function handleCreateNewCollection(name) {
    loading(true);
    try {
      // Ajax request to create a new
      var result = await createCollection(name);

      // Get image collection list
      resetImagesWrapper();
      await loadCollections();
      await loadImagesCollection($('select#combi_image_collection option:last-child').prop('selected', true).val());

      // Trigger "Select collection" button
      $('#select-collection').trigger('click');

      if (result.success) {
        toastSuccess(result.message);
      } else {
        toastError(result.message);
      }
    } catch (e) {
      toastError(e.message);
    } finally {
      loading(false);
    }
  };

  /**
   * Handler for deleting collection button
   *
   * @param id
   * @returns {void}
   */
  var handleDeleteCollection = async function handleDeleteCollection(id) {
    var canProceed = await openConfirmModal();

    if (!canProceed) {
      return;
    }

    loading(true);

    try {
      var modifierId = $('input:hidden[name=modifierId]').val(),
          modifierType = $('input:hidden[name=modifierType]').val();

      var params = {
        id: id,
        modifierId: modifierId,
        modifierType: modifierType
      };
      var deleteCollectionResult = await deleteCollection(params);

      if (!deleteCollectionResult.success) {
        loading(false);
        toastError(deleteCollectionResult.message);
        return;
      }

      await loadCollections();

      var $firstOption = $('select#combi_image_collection option:first-child'),
          firstOptionVal = parseInt($firstOption.val());

      resetImagesWrapper();

      if (!firstOptionVal) {
        disableImageSelection();
      } else {
        await loadImagesCollection($firstOption.val());
      }

      toastSuccess(deleteCollectionResult.message);
    } catch (e) {
      toastError(e.message);
    } finally {
      loading(false);
    }
  };

  /**
   * Handler for saving an image to a collection
   *
   * @param path
   * @returns {void}
   */
  var handleAddImageToCollection = async function handleAddImageToCollection(_ref4) {
    var url = _ref4.url,
        localPath = _ref4.localPath;

    var params = { id: 0, src: url, localPath: localPath };
    var $image = $(imageBlockTemplate(params));

    appendImageToCollection($image);
    handleEditImageModal(params);
  };

  /**
   * Handler for open the Edit image modal button
   *
   * @param id
   * @param src
   * @param localPath
   * @param titles
   * @param altTitles
   */
  var handleEditImageModal = function handleEditImageModal(_ref5) {
    var id = _ref5.id,
        src = _ref5.src,
        localPath = _ref5.localPath,
        _ref5$titles = _ref5.titles,
        titles = _ref5$titles === undefined ? [] : _ref5$titles,
        _ref5$altTitles = _ref5.altTitles,
        altTitles = _ref5$altTitles === undefined ? [] : _ref5$altTitles;

    $editModal.find('#collection-image-src').attr('src', src);
    $editModal.find('input[name=id]').val(id);
    $editModal.find('input[name=localPath]').val(localPath);
    $editModal.find('input[name=listId]').val(getSelectedList().id);

    titles.forEach(function (element) {
      $('#image-title-' + element.languageCode.toLowerCase()).val(element.value);
    });

    altTitles.forEach(function (element) {
      $('#image-alt-' + element.languageCode.toLowerCase()).val(element.value);
    });

    $editModal.fadeIn(function () {
      return focusFirstInputText($editModal);
    });
  };

  /**
   * Handler for open the Edit image modal button
   */
  var handleEditCollectionModal = function handleEditCollectionModal() {
    $editCollectionModal.find('input[name=name]').val(getSelectedList().name);
    $editCollectionModal.find('input[name=id]').val(getSelectedList().id);
    // Ajax request
    $editCollectionModal.fadeIn(function () {
      return focusFirstInputText($editCollectionModal);
    });
  };

  /**
   * Handles image list on change event
   *
   * @param val
   * @returns {Promise<void>}
   */
  var handleOnChangeImageCollection = async function handleOnChangeImageCollection(val) {
    loading(true);

    try {
      if (!val) {
        disableImageSelection();
        return;
      }

      enableImageSelection();
      resetImagesWrapper();
      await loadImagesCollection(val);
    } catch (e) {
      toastError(e.message);
    } finally {
      loading(false);
    }
  };

  var focusFirstInputText = function focusFirstInputText($element) {
    $element.find('input[type=text]:first').focus();
  };

  /**
   * Creates the single image wrapper
   *
   * @param data
   * @returns {string}
   */
  var imageBlockTemplate = function imageBlockTemplate(data) {
    var _data$src = data.src,
        src = _data$src === undefined ? '//placehold.it/100x100' : _data$src,
        id = data.id,
        mainImageText = jse.core.lang.translate('MAIN_IMAGE_LABEL', 'product_image_lists');


    return '<div class="collection-image-wrapper" data-list-element-id="' + id + '">\n' + '    <div class="actions">\n' + '        <a class="btn btn-primary move-image sort-handle" href="javascript:;">\n' + '            <i class="fa fa-arrows"></i>\n' + '        </a>\n' + '        <a class="btn btn-primary edit-image" href="javascript:;">\n' + '            <i class="fa fa-pencil"></i>\n' + '        </a>\n' + '        <a class="btn btn-danger delete-image" href="javascript:;">\n' + '            <i class="fa fa-trash"></i>\n' + '        </a>\n' + '    </div>\n' + ('    <span class="main-image">' + mainImageText + '</span>\n') + ('    <img alt="alt img" class="collection-image" src="' + src + '">\n') + '</div>';
  };

  /**
   * Gets the selected collection list
   *
   * @returns {{name: string, id: string}}
   */
  var getSelectedList = function getSelectedList() {
    var $selectedOption = $('#combi_image_collection option:selected');
    return {
      id: $selectedOption.val(),
      name: $selectedOption.html()
    };
  };

  /**
   * Bind events
   */
  var addEventListeners = function addEventListeners() {
    // Add event listeners
    addResponsiveFileManagerEventListener();

    createNewCollectionButtonEventListener();
    selectCollectionButtonEventListener();
    closeEditModalButtonEventListener();
    openEditImageModalEventListener();
    deleteImageButtonEventListener();
    imageCollectionOnChangeEventListener();
    addImageButtonEventListener();

    createCollectionButtonEventListener();
    deleteCollectionButtonEventListener();

    // Modal events
    preventSubmitFormModals();
    saveEditModalEventListener();
    cancelEditModalEventListener();

    closeEditCollectionModalButtonEventListener();
    openEditCollectionModalEventListener();
    cancelEditCollectionModalButtonEventListener();
    updateEditCollectionModalButtonEventListener();
  };

  /**
   * Toast "plugin"
   *
   * @param message
   * @param type
   */
  var toast = function toast(message, type) {
    var className = 'status-' + type;

    $toastMessage.html(message).removeClass(function (index, className) {
      return (className.match(/(^|\s)status-\S+/g) || []).join(' ');
    }).addClass(className).stop().fadeIn();

    clearTimeout(toastTimeoutID);

    toastTimeoutID = setTimeout(function () {
      $toastMessage.fadeOut(function () {
        $(_this).removeClass(className);
      });
    }, 3000);
  };

  /**
   * Shows success toast
   *
   * @param message
   */
  var toastSuccess = function toastSuccess(message) {
    return toast(message, 'success');
  };

  /**
   * Shows error toast
   *
   * @param message
   */
  var toastError = function toastError(message) {
    return toast(message, 'error');
  };

  /**
   * Handles loading spinner
   *
   * @param isLoading
   */
  var loading = function loading(isLoading) {
    if (isLoading) {
      loadingSpinner = jse.libs.loading_spinner.show($('#product-image-list-wrapper'), 9999);
      return;
    }

    jse.libs.loading_spinner.hide(loadingSpinner);
    loadingSpinner = null;
  };

  /**
   * Initialize the module
   *
   * @param done
   * @returns {void}
   */
  module.init = async function (done) {
    addEventListeners();

    $sortableList.sortable(sortableOptions).on('sortupdate', handleOnSortUpdate).disableSelection();

    loading(true);

    try {
      // Get image collections list
      await loadCollections(initialSelectedList);

      // Get images related with the current collection
      var selectedValue = initialSelectedList ? initialSelectedList : $('select#combi_image_collection option:selected').val();

      selectedValue = parseInt(selectedValue);

      if (!isNaN(selectedValue) && selectedValue > 0) {
        await loadImagesCollection(selectedValue);
      } else {
        disableImageSelection();
      }
    } catch (e) {
      toastError(e.message);
    } finally {
      loading(false);
      done();
    }
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2R1Y3QvcHJvZHVjdF9pbWFnZV9saXN0LmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJGVkaXRNb2RhbCIsIiQiLCIkZWRpdENvbGxlY3Rpb25Nb2RhbCIsIiRjb25maXJtTW9kYWwiLCIkdG9hc3RNZXNzYWdlIiwiaW5pdGlhbFNlbGVjdGVkTGlzdCIsInNlbGVjdGVkTGlzdCIsImFwcFVybCIsImNvcmUiLCJjb25maWciLCJnZXQiLCJsb2FkaW5nU3Bpbm5lciIsInRvYXN0VGltZW91dElEIiwiZGVmYXVsdHMiLCJzb3J0YWJsZSIsIml0ZW1zIiwiYXhpcyIsImN1cnNvciIsImhhbmRsZSIsImNvbnRhaW5tZW50Iiwib3BhY2l0eSIsInBsYWNlaG9sZGVyIiwic29ydGFibGVMaXN0IiwiZmlsZW1hbmFnZXIiLCJpZCIsInN1YkZvbGRlciIsInBvcHVwIiwibGFuZyIsIndpZHRoIiwiaGVpZ2h0IiwidG9wIiwibGVmdCIsInVzZUZpbGVNYW5hZ2VyIiwic29ydGFibGVPcHRpb25zIiwiZXh0ZW5kIiwiZmlsZW1hbmFnZXJPcHRpb25zIiwiZmlsZU1hbmFnZXIiLCIkc29ydGFibGVMaXN0IiwiaGFuZGxlT25Tb3J0VXBkYXRlIiwibG9hZGluZyIsIm5ld09yZGVyIiwiYXR0cmlidXRlIiwicmVkdWNlIiwibmV3VmFsdWUiLCJjdXJyZW50VmFsdWUiLCJjdXJyZW50SW5kZXgiLCJwdXNoIiwiaW1hZ2VJZCIsInBhcnNlSW50Iiwic29ydEluZGV4IiwicmVzdWx0IiwidXBkYXRlSW1hZ2VzU29ydCIsInNvcnQiLCJKU09OIiwic3RyaW5naWZ5Iiwic3VjY2VzcyIsInRvYXN0U3VjY2VzcyIsIm1lc3NhZ2UiLCJ0b2FzdEVycm9yIiwiZSIsImFkZEltYWdlQnV0dG9uRXZlbnRMaXN0ZW5lciIsImNsaWNrIiwidHJhbnNsYXRlIiwidXJsUGFyYW1zIiwiam9pbiIsInBhcmVudCIsIndpbmRvdyIsIm9wZW4iLCJhZGRSZXNwb25zaXZlRmlsZU1hbmFnZXJFdmVudExpc3RlbmVyIiwib25NZXNzYWdlIiwiZXZlbnQiLCJzZW5kZXIiLCJ1cmwiLCJmaWVsZF9pZCIsImNvcnJlY3RVcmwiLCJyZXBsYWNlIiwiaGFuZGxlQWRkSW1hZ2VUb0NvbGxlY3Rpb24iLCJsb2NhbFBhdGgiLCJub3JtYWxpemVMb2NhbFBhdGgiLCJjbG9zZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZWdleCIsIlJlZ0V4cCIsImNyZWF0ZU5ld0NvbGxlY3Rpb25CdXR0b25FdmVudExpc3RlbmVyIiwib24iLCJjbGVhckNyZWF0ZU5ld0NvbGxlY3Rpb25JbnB1dCIsImFkZENsYXNzIiwiaGlkZSIsInNob3ciLCJmb2N1cyIsImhhc0NvbGxlY3Rpb24iLCJzZWxlY3RDb2xsZWN0aW9uQnV0dG9uRXZlbnRMaXN0ZW5lciIsInJlbW92ZUNsYXNzIiwib3BlbkVkaXRJbWFnZU1vZGFsRXZlbnRMaXN0ZW5lciIsImRvY3VtZW50IiwiJHBhcmVudCIsInBhcmVudHMiLCJoYW5kbGVFZGl0SW1hZ2VNb2RhbCIsInNyYyIsIndlYkZpbGVQYXRoIiwidGl0bGVzIiwiYWx0VGl0bGVzIiwiY2xvc2VFZGl0TW9kYWxCdXR0b25FdmVudExpc3RlbmVyIiwiaGFuZGxlQ2xvc2VFZGl0SW1hZ2VNb2RhbCIsImNhbmNlbEVkaXRNb2RhbEV2ZW50TGlzdGVuZXIiLCJzYXZlRWRpdE1vZGFsRXZlbnRMaXN0ZW5lciIsImhhbmRsZVNhdmVJbWFnZU1vZGFsIiwiY2xvc2VFZGl0Q29sbGVjdGlvbk1vZGFsQnV0dG9uRXZlbnRMaXN0ZW5lciIsImhhbmRsZUNsb3NlRWRpdENvbGxlY3Rpb25Nb2RhbCIsIm9wZW5FZGl0Q29sbGVjdGlvbk1vZGFsRXZlbnRMaXN0ZW5lciIsImhhbmRsZUVkaXRDb2xsZWN0aW9uTW9kYWwiLCJjYW5jZWxFZGl0Q29sbGVjdGlvbk1vZGFsQnV0dG9uRXZlbnRMaXN0ZW5lciIsInVwZGF0ZUVkaXRDb2xsZWN0aW9uTW9kYWxCdXR0b25FdmVudExpc3RlbmVyIiwiaGFuZGxlVXBkYXRlQ29sbGVjdGlvbk1vZGFsIiwiZmFkZU91dCIsImNsZWFyTW9kYWxJbnB1dHMiLCJkZWxldGVJbWFnZUJ1dHRvbkV2ZW50TGlzdGVuZXIiLCJoYW5kbGVEZWxldGVJbWFnZSIsImltYWdlQ29sbGVjdGlvbk9uQ2hhbmdlRXZlbnRMaXN0ZW5lciIsImNoYW5nZSIsInZhbCIsImhhbmRsZU9uQ2hhbmdlSW1hZ2VDb2xsZWN0aW9uIiwiY3JlYXRlQ29sbGVjdGlvbkJ1dHRvbkV2ZW50TGlzdGVuZXIiLCIkaW5wdXQiLCJuYW1lIiwiaGFuZGxlQ3JlYXRlTmV3Q29sbGVjdGlvbiIsImRlbGV0ZUNvbGxlY3Rpb25CdXR0b25FdmVudExpc3RlbmVyIiwiaGFuZGxlRGVsZXRlQ29sbGVjdGlvbiIsInByZXZlbnRTdWJtaXRGb3JtTW9kYWxzIiwiZmluZCIsInN1Ym1pdCIsInRyaWdnZXIiLCJyZW1vdmVMYXN0SW1hZ2VFbGVtZW50IiwiaXNWYWxpZEVkaXRNb2RhbERhdGEiLCJmb3JtRGF0YSIsInBhcnNlRWRpdE1vZGFsRGF0YSIsInNlcmlhbGl6ZUFycmF5IiwicmVtb3ZlUmVkdW5kYW50UGF0aEZyb21JbWFnZVBhdGgiLCJ1cGRhdGVJbWFnZVRleHRzIiwiYWRkSW1hZ2VUb0NvbGxlY3Rpb24iLCJyZXNldEltYWdlc1dyYXBwZXIiLCJsb2FkSW1hZ2VzQ29sbGVjdGlvbiIsImdldFNlbGVjdGVkTGlzdCIsIm9sZFBhdGgiLCIkZm9ybURhdGEiLCJ1cGRhdGVDb2xsZWN0aW9uTmFtZSIsImxpc3RJZCIsImxpc3ROYW1lIiwibG9hZENvbGxlY3Rpb25zIiwiJG1vZGFsIiwiJGZvcm0iLCJlcnJvcnMiLCJlYWNoIiwiaW5kZXgiLCJlbGVtZW50IiwicGFyc2VkRGF0YSIsImZvckVhY2giLCJ0ZXN0Iiwia2V5IiwidmFsdWUiLCJsYW5ndWFnZUNvZGUiLCJvcGVuQ29uZmlybU1vZGFsIiwiUHJvbWlzZSIsInJlc29sdmUiLCIkaW1hZ2VXcmFwcGVyIiwiY2FuUHJvY2VlZCIsIm1vZGlmaWVySWQiLCJtb2RpZmllclR5cGUiLCJwYXJhbXMiLCJkZWxldGVJbWFnZUJ5SWQiLCJFcnJvciIsInJlbW92ZSIsImhhc0ltYWdlIiwic2V0VG9Ob0ltYWdlc0Rpc3BsYXkiLCJhcHBlbmRJbWFnZVRvQ29sbGVjdGlvbiIsImNzcyIsImFwcGVuZCIsIiRpbWFnZUJsb2NrIiwiaHRtbCIsInJlcGxhY2VDb2xsZWN0aW9ucyIsImNvbGxlY3Rpb25zIiwic2VsZWN0ZWQiLCIkY29sbGVjdGlvbiIsIiRvcHRpb24iLCJwcm9wIiwiZ2V0Q29sbGVjdGlvbiIsImxlbmd0aCIsInNldFRvTm9Db2xsZWN0aW9uc0Rpc3BsYXkiLCJlbmFibGVJbWFnZVNlbGVjdGlvbiIsImNvbGxlY3Rpb25faWQiLCJpbWFnZXMiLCJnZXRJbWFnZUNvbGxlY3Rpb24iLCJhIiwiYiIsInNvcnRPcmRlciIsImltYWdlQmxvY2tUZW1wbGF0ZSIsImRpc2FibGVJbWFnZVNlbGVjdGlvbiIsImF0dHIiLCJyZW1vdmVBdHRyIiwiJGxhc3RJbWFnZUVsZW1lbnQiLCJyZXNwb25zZSIsInRoZW4iLCJjcmVhdGVDb2xsZWN0aW9uIiwicG9zdCIsImRlbGV0ZUNvbGxlY3Rpb24iLCJhamF4IiwidHlwZSIsImRlbGV0ZUNvbGxlY3Rpb25SZXN1bHQiLCIkZmlyc3RPcHRpb24iLCJmaXJzdE9wdGlvblZhbCIsIiRpbWFnZSIsInRvTG93ZXJDYXNlIiwiZmFkZUluIiwiZm9jdXNGaXJzdElucHV0VGV4dCIsIiRlbGVtZW50IiwibWFpbkltYWdlVGV4dCIsIiRzZWxlY3RlZE9wdGlvbiIsImFkZEV2ZW50TGlzdGVuZXJzIiwidG9hc3QiLCJjbGFzc05hbWUiLCJtYXRjaCIsInN0b3AiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiaXNMb2FkaW5nIiwibGlicyIsImxvYWRpbmdfc3Bpbm5lciIsImluaXQiLCJkb25lIiwiZGlzYWJsZVNlbGVjdGlvbiIsInNlbGVjdGVkVmFsdWUiLCJpc05hTiJdLCJt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LFFBQUl5TCxTQUFKLEVBQWU7QUFDYnJOLHVCQUFpQmQsSUFBSW9PLElBQUosQ0FBU0MsZUFBVCxDQUF5QjFJLElBQXpCLENBQThCdkYsRUFBRSw2QkFBRixDQUE5QixFQUFnRSxJQUFoRSxDQUFqQjtBQUNBO0FBQ0Q7O0FBRURKLFFBQUlvTyxJQUFKLENBQVNDLGVBQVQsQ0FBeUIzSSxJQUF6QixDQUE4QjVFLGNBQTlCO0FBQ0FBLHFCQUFpQixJQUFqQjtBQUNELEdBUkQ7O0FBVUE7Ozs7OztBQU1BZixTQUFPdU8sSUFBUCxHQUFjLGdCQUFPQyxJQUFQLEVBQWdCO0FBQzVCWDs7QUFFQXBMLGtCQUNHdkIsUUFESCxDQUNZbUIsZUFEWixFQUVHbUQsRUFGSCxDQUVNLFlBRk4sRUFFb0I5QyxrQkFGcEIsRUFHRytMLGdCQUhIOztBQUtBOUwsWUFBUSxJQUFSOztBQUVBLFFBQUk7QUFDRjtBQUNBLFlBQU02RyxnQkFBZ0IvSSxtQkFBaEIsQ0FBTjs7QUFFQTtBQUNBLFVBQUlpTyxnQkFBZ0JqTyxzQkFDbEJBLG1CQURrQixHQUVsQkosRUFBRSwrQ0FBRixFQUFtRHVILEdBQW5ELEVBRkY7O0FBSUE4RyxzQkFBZ0J0TCxTQUFTc0wsYUFBVCxDQUFoQjs7QUFFQSxVQUFJLENBQUNDLE1BQU1ELGFBQU4sQ0FBRCxJQUF5QkEsZ0JBQWdCLENBQTdDLEVBQWdEO0FBQzlDLGNBQU16RixxQkFBcUJ5RixhQUFyQixDQUFOO0FBQ0QsT0FGRCxNQUVPO0FBQ0xsQztBQUNEO0FBQ0YsS0FoQkQsQ0FnQkUsT0FBT3pJLENBQVAsRUFBVTtBQUNWRCxpQkFBV0MsRUFBRUYsT0FBYjtBQUNELEtBbEJELFNBa0JVO0FBQ1JsQixjQUFRLEtBQVI7QUFDQTZMO0FBQ0Q7QUFDRixHQWhDRDs7QUFrQ0EsU0FBT3hPLE1BQVA7QUFDRCxDQXp2Q0giLCJmaWxlIjoicHJvZHVjdC9wcm9kdWN0X2ltYWdlX2xpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHByb2R1Y3RfaW1hZ2VfbGlzdC5qcyAyMDIxLTA5LTAyXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBQcm9kdWN0IEltYWdlcyBMaXN0IENvbnRyb2xsZXJcbiAqXG4gKiBUaGlzIGNvbnRyb2xsZXIgaGFuZGxlcyB0aGUgaW1hZ2VzIHNvcnRcbiAqXG4gKiBAbW9kdWxlIENvbnRyb2xsZXJzL3Byb2R1Y3RfaW1hZ2VfbGlzdFxuICovXG5cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENPTlRST0xMRVIgTkFNRVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgJ3Byb2R1Y3RfaW1hZ2VfbGlzdCcsXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENPTlRST0xMRVIgTElCUkFSSUVTXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBbXG4gICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2pxdWVyeS11aS1kaXN0L2pxdWVyeS11aS5taW4uY3NzYCxcbiAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvanF1ZXJ5LXVpLWRpc3QvanF1ZXJ5LXVpLmpzYCxcbiAgICAnbG9hZGluZ19zcGlubmVyJ1xuICBdLFxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDT05UUk9MTEVSIEJVU0lORVNTIExPR0lDXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICd1c2Ugc3RyaWN0J1xuXG4gICAgY29uc3QgbW9kdWxlID0ge31cblxuICAgIC8qKlxuICAgICAqIEVkaXQgbW9kYWwgZWxlbWVudFxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeXxIVE1MRWxlbWVudH1cbiAgICAgKi9cbiAgICBjb25zdCAkZWRpdE1vZGFsID0gJCgnLmVkaXQtcGFuZWwnKVxuXG4gICAgLyoqXG4gICAgICogRWRpdCBjb2xsZWN0aW9uIG1vZGFsIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl8SFRNTEVsZW1lbnR9XG4gICAgICovXG4gICAgY29uc3QgJGVkaXRDb2xsZWN0aW9uTW9kYWwgPSAkKCcuZWRpdC1jb2xsZWN0aW9uLXBhbmVsJylcblxuICAgIC8qKlxuICAgICAqIENvbmZpcm0gbW9kYWwgZWxlbWVudFxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeXxIVE1MRWxlbWVudH1cbiAgICAgKi9cbiAgICBjb25zdCAkY29uZmlybU1vZGFsID0gJCgnLmNvbmZpcm0tbW9kYWwtcGFuZWwnKVxuXG4gICAgLyoqXG4gICAgICogVG9hc3QgbWVzc2FnZSBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAdHlwZSB7alF1ZXJ5fEhUTUxFbGVtZW50fVxuICAgICAqL1xuICAgIGNvbnN0ICR0b2FzdE1lc3NhZ2UgPSAkKCcucmVxdWVzdC1zdGF0dXMtd3JhcHBlcicpXG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3RlZCBpbWFnZSBjb2xsZWN0aW9uIHZhbHVlXG4gICAgICovXG4gICAgY29uc3QgaW5pdGlhbFNlbGVjdGVkTGlzdCA9IGRhdGEuc2VsZWN0ZWRMaXN0XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEB0eXBlIHsqfVxuICAgICAqL1xuICAgIGNvbnN0IGFwcFVybCA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpXG5cbiAgICAvKipcbiAgICAgKiBMb2FkIHNwaW5uZXIgaW5zdGFuY2VcbiAgICAgKi9cbiAgICBsZXQgbG9hZGluZ1NwaW5uZXIgPSBudWxsXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGxldCB0b2FzdFRpbWVvdXRJRCA9IG51bGxcblxuICAgIC8qKlxuICAgICAqIERlZmF1bHQgb3B0aW9uc1xuICAgICAqXG4gICAgICogQHR5cGUge3tzb3J0YWJsZToge2N1cnNvcjogc3RyaW5nLCBjb250YWlubWVudDogc3RyaW5nLCBzb3J0YWJsZUxpc3Q6IHN0cmluZywgaGFuZGxlOiBzdHJpbmcsIHBsYWNlaG9sZGVyOiBzdHJpbmcsIGF4aXM6IHN0cmluZywgb3BhY2l0eTogbnVtYmVyLCBpdGVtczogc3RyaW5nfSwgZmlsZW1hbmFnZXI6IHtzdWJGb2xkZXI6IHN0cmluZywgdG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaWQ6IHN0cmluZywgbGFuZzogc3RyaW5nLCBoZWlnaHQ6IG51bWJlcn19fVxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgc29ydGFibGU6IHtcbiAgICAgICAgaXRlbXM6ICdsaS5yb3cnLFxuICAgICAgICBheGlzOiAneScsXG4gICAgICAgIGN1cnNvcjogJ21vdmUnLFxuICAgICAgICBoYW5kbGU6ICcuc29ydC1oYW5kbGUnLFxuICAgICAgICBjb250YWlubWVudDogJ2RvY3VtZW50JyxcbiAgICAgICAgb3BhY2l0eTogMC43NSxcbiAgICAgICAgcGxhY2Vob2xkZXI6ICdjb2wtbWQtMTIgbGlzdC1lbGVtZW50IHNvcnQtcGxhY2Vob2xkZXInLFxuICAgICAgICBzb3J0YWJsZUxpc3Q6ICd1bC5jb25maWd1cmF0aW9uLWltYWdlLWxpc3QnXG4gICAgICB9LFxuICAgICAgZmlsZW1hbmFnZXI6IHtcbiAgICAgICAgaWQ6ICdhZGQtaW1hZ2UtY29sbGVjdGlvbicsXG4gICAgICAgIHN1YkZvbGRlcjogJ2ltYWdlcy9wcm9kdWN0X2ltYWdlcy9vcmlnaW5hbF9pbWFnZXMnLFxuICAgICAgICBwb3B1cDogMSxcbiAgICAgICAgbGFuZzogJ2RlJyxcbiAgICAgICAgd2lkdGg6IDk5MCxcbiAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgIHRvcDogMTAwLFxuICAgICAgICBsZWZ0OiAxMDAsXG4gICAgICAgIHVzZUZpbGVNYW5hZ2VyOiBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNvcnRhYmxlIG9wdGlvbnNcbiAgICAgKi9cbiAgICBjb25zdCBzb3J0YWJsZU9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMuc29ydGFibGUsIGRhdGEpXG5cbiAgICAvKipcbiAgICAgKiBGaWxlIG1hbmFnZXIgb3B0aW9uc1xuICAgICAqL1xuICAgIGNvbnN0IGZpbGVtYW5hZ2VyT3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cy5maWxlbWFuYWdlciwgZGF0YSlcblxuICAgIGxldCBmaWxlTWFuYWdlciA9IG51bGxcblxuICAgIC8qKlxuICAgICAqIFNvcnRhYmxlIGxpc3QgZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICovXG4gICAgY29uc3QgJHNvcnRhYmxlTGlzdCA9ICQoc29ydGFibGVPcHRpb25zLnNvcnRhYmxlTGlzdClcblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXIgd2hlbiB1cGRhdGluZyB0aGUgb3JkZXIgb2YgdGhlIGltYWdlIGxpc3RcbiAgICAgKi9cbiAgICBjb25zdCBoYW5kbGVPblNvcnRVcGRhdGUgPSBhc3luYyAoKSA9PiB7XG4gICAgICBsb2FkaW5nKHRydWUpXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG5ld09yZGVyID0gJHNvcnRhYmxlTGlzdFxuICAgICAgICAgIC5zb3J0YWJsZSgndG9BcnJheScsIHsgYXR0cmlidXRlOiAnZGF0YS1saXN0LWVsZW1lbnQtaWQnIH0pXG4gICAgICAgICAgLnJlZHVjZSgobmV3VmFsdWUsIGN1cnJlbnRWYWx1ZSwgY3VycmVudEluZGV4KSA9PiB7XG4gICAgICAgICAgICBuZXdWYWx1ZS5wdXNoKHtcbiAgICAgICAgICAgICAgaW1hZ2VJZDogcGFyc2VJbnQoY3VycmVudFZhbHVlKSxcbiAgICAgICAgICAgICAgc29ydEluZGV4OiBjdXJyZW50SW5kZXhcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gbmV3VmFsdWVcbiAgICAgICAgICB9LCBbXSlcblxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB1cGRhdGVJbWFnZXNTb3J0KHsgc29ydDogSlNPTi5zdHJpbmdpZnkobmV3T3JkZXIpIH0pXG5cbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgdG9hc3RTdWNjZXNzKHJlc3VsdC5tZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRvYXN0RXJyb3IocmVzdWx0Lm1lc3NhZ2UpXG4gICAgICAgIH1cblxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0b2FzdEVycm9yKGUubWVzc2FnZSlcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGxvYWRpbmcoZmFsc2UpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgbGlzdGVuZXIgZm9yIGFkZCBpbWFnZSBidXR0b25cbiAgICAgKi9cbiAgICBjb25zdCBhZGRJbWFnZUJ1dHRvbkV2ZW50TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAkKCcuYWRkLWltYWdlJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCB7IGlkLCBzdWJGb2xkZXIsIGxhbmcsIHdpZHRoLCBoZWlnaHQsIHRvcCwgbGVmdCwgcG9wdXAsIHVzZUZpbGVNYW5hZ2VyIH0gPSBmaWxlbWFuYWdlck9wdGlvbnNcblxuICAgICAgICBpZiAoIXVzZUZpbGVNYW5hZ2VyKSB7XG4gICAgICAgICAgdG9hc3RFcnJvcihqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnUkVTUE9OU0lWRV9GSUxFTUFOQUdFUl9SRVFVSVJFRCcsICdwcm9kdWN0X2ltYWdlX2xpc3RzJykpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXJsUGFyYW1zID0gW1xuICAgICAgICAgIGBmaWVsZF9pZD0ke2lkfWAsXG4gICAgICAgICAgYGNyb3NzZG9tYWluPTFgLFxuICAgICAgICAgIGBzdWJfZm9sZGVyPSR7c3ViRm9sZGVyfWAsXG4gICAgICAgICAgYGxhbmc9JHtsYW5nfWAsXG4gICAgICAgICAgYHBvcHVwPSR7cG9wdXB9YFxuICAgICAgICBdLmpvaW4oJyYnKTtcblxuICAgICAgICBmaWxlTWFuYWdlciA9IHBhcmVudC53aW5kb3cub3BlbihcbiAgICAgICAgICBgJHthcHBVcmx9L1Jlc3BvbnNpdmVGaWxlbWFuYWdlci9maWxlbWFuYWdlci9kaWFsb2cucGhwPyR7dXJsUGFyYW1zfWAsXG4gICAgICAgICAgJ1Jlc3BvbnNpdmVGaWxlbWFuYWdlcicsXG4gICAgICAgICAgYHNjcm9sbGJhcnM9MSx3aWR0aD0ke3dpZHRofSxoZWlnaHQ9JHtoZWlnaHR9LHRvcD0ke3RvcH0sbGVmdD0ke2xlZnR9YFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IGFkZFJlc3BvbnNpdmVGaWxlTWFuYWdlckV2ZW50TGlzdGVuZXIgPSAoKSA9PntcbiAgICAgIGNvbnN0IG9uTWVzc2FnZSA9IGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBldmVudCxcbiAgICAgICAgICB7IHNlbmRlciwgdXJsLCBmaWVsZF9pZCB9ID0gZGF0YVxuXG4gICAgICAgIGlmIChzZW5kZXIgIT09ICdyZXNwb25zaXZlZmlsZW1hbmFnZXInIHx8IGZpZWxkX2lkICE9PSBmaWxlbWFuYWdlck9wdGlvbnMuaWQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvcnJlY3RVcmwgPSB1cmwucmVwbGFjZSgvKFteOl1cXC8pXFwvKy9nLCAnJDEnKVxuXG4gICAgICAgIGF3YWl0IGhhbmRsZUFkZEltYWdlVG9Db2xsZWN0aW9uKHtcbiAgICAgICAgICB1cmw6IGNvcnJlY3RVcmwsXG4gICAgICAgICAgbG9jYWxQYXRoOiBub3JtYWxpemVMb2NhbFBhdGgoY29ycmVjdFVybClcbiAgICAgICAgfSlcblxuICAgICAgICBmaWxlTWFuYWdlci5jbG9zZSgpXG4gICAgICAgIGZpbGVNYW5hZ2VyID0gbnVsbFxuICAgICAgfVxuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIG9uTWVzc2FnZSwgZmFsc2UpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgb3JpZ2luIGRvbWFpbiBmcm9tIHRoZSBpbWFnZSBwYXRoXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdXJsXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgY29uc3Qgbm9ybWFsaXplTG9jYWxQYXRoID0gdXJsID0+IHtcbiAgICAgIGNvbnN0IHJlZ2V4ID0gYCR7YXBwVXJsfShcXC8pP2BcblxuICAgICAgcmV0dXJuIHVybC5yZXBsYWNlKG5ldyBSZWdFeHAocmVnZXgsICdnJyksICcnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGxpc3RlbmVyIGZvciBjcmVhdGluZyBhIG5ldyBpbWFnZSBjb2xsZWN0aW9uXG4gICAgICovXG4gICAgY29uc3QgY3JlYXRlTmV3Q29sbGVjdGlvbkJ1dHRvbkV2ZW50TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAkKCcjY3JlYXRlLW5ldy1jb2xsZWN0aW9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjbGVhckNyZWF0ZU5ld0NvbGxlY3Rpb25JbnB1dCgpXG5cbiAgICAgICAgJCgnLnNlbGVjdGVkLWNvbGxlY3Rpb24td3JhcHBlcicpLmFkZENsYXNzKCdjcmVhdGUtbmV3LWNvbGxlY3Rpb24nKVxuICAgICAgICAkKCcuc2VsZWN0LWNvbGxlY3Rpb24nKS5oaWRlKClcbiAgICAgICAgJCgnLmNyZWF0ZS1jb2xsZWN0aW9uJykuc2hvdygpXG4gICAgICAgICQoJy5jcmVhdGUtY29sbGVjdGlvbiBpbnB1dCcpLmZvY3VzKClcblxuICAgICAgICBpZiAoaGFzQ29sbGVjdGlvbigpKSB7XG4gICAgICAgICAgJCgnI3NlbGVjdC1jb2xsZWN0aW9uJykuc2hvdygpXG4gICAgICAgIH1cblxuICAgICAgICAkKHRoaXMpLmhpZGUoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBsaXN0ZW5lciBmb3IgY2xpY2tpbmcgb24gXCJTZWxlY3QgY29sbGVjdGlvblwiIHRleHQvYnV0dG9uXG4gICAgICovXG4gICAgY29uc3Qgc2VsZWN0Q29sbGVjdGlvbkJ1dHRvbkV2ZW50TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAkKCcjc2VsZWN0LWNvbGxlY3Rpb24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJy5zZWxlY3RlZC1jb2xsZWN0aW9uLXdyYXBwZXInKS5yZW1vdmVDbGFzcygnY3JlYXRlLW5ldy1jb2xsZWN0aW9uJylcbiAgICAgICAgJCgnLmNyZWF0ZS1jb2xsZWN0aW9uJykuaGlkZSgpXG4gICAgICAgICQoJy5zZWxlY3QtY29sbGVjdGlvbicpLnNob3coKVxuICAgICAgICAkKCcjY3JlYXRlLW5ldy1jb2xsZWN0aW9uJykuc2hvdygpXG4gICAgICAgICQodGhpcykuaGlkZSgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGxpc3RlbmVyIGZvciBvcGVuaW5nIHRoZSBFZGl0IGltYWdlIG1vZGFsXG4gICAgICovXG4gICAgY29uc3Qgb3BlbkVkaXRJbWFnZU1vZGFsRXZlbnRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuZWRpdC1pbWFnZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgJHBhcmVudCA9ICQodGhpcykucGFyZW50cygnLmNvbGxlY3Rpb24taW1hZ2Utd3JhcHBlcicpLFxuICAgICAgICAgICAgICBkYXRhID0gJHBhcmVudC5kYXRhKCdpbWFnZScpXG5cbiAgICAgICAgaGFuZGxlRWRpdEltYWdlTW9kYWwoe1xuICAgICAgICAgIGlkOiBkYXRhLmlkLFxuICAgICAgICAgIHNyYzogZGF0YS53ZWJGaWxlUGF0aCxcbiAgICAgICAgICBsb2NhbFBhdGg6IG5vcm1hbGl6ZUxvY2FsUGF0aChkYXRhLndlYkZpbGVQYXRoKSxcbiAgICAgICAgICB0aXRsZXM6IGRhdGEudGl0bGVzLFxuICAgICAgICAgIGFsdFRpdGxlczogZGF0YS5hbHRUaXRsZXNcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgbGlzdGVuZXIgZm9yIGNsb3NpbmcgRWRpdCBpbWFnZSBtb2RhbFxuICAgICAqL1xuICAgIGNvbnN0IGNsb3NlRWRpdE1vZGFsQnV0dG9uRXZlbnRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICQoJy5lZGl0LXBhbmVsIC5lZGl0LW1vZGFsIC5jbG9zZS1idG4nKS5vbignY2xpY2snLCBoYW5kbGVDbG9zZUVkaXRJbWFnZU1vZGFsKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGxpc3RlbmVyIGZvciBjYW5jZWxpbmcvY2xvc2luZyB0aGUgRWRpdCBpbWFnZSBtb2RhbFxuICAgICAqL1xuICAgIGNvbnN0IGNhbmNlbEVkaXRNb2RhbEV2ZW50TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmVkaXQtbW9kYWwtY2FuY2VsJywgaGFuZGxlQ2xvc2VFZGl0SW1hZ2VNb2RhbClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBsaXN0ZW5lciBmb3IgaGl0dGluZyB0aGUgc2F2ZSBidXR0b24gaW5zaWRlIEVkaXQgSW1hZ2UgTW9kYWxcbiAgICAgKi9cbiAgICBjb25zdCBzYXZlRWRpdE1vZGFsRXZlbnRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICRlZGl0TW9kYWwub24oJ2NsaWNrJywgJy5lZGl0LW1vZGFsLXNhdmUnLCBoYW5kbGVTYXZlSW1hZ2VNb2RhbClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBsaXN0ZW5lciBmb3IgY2xvc2luZyBFZGl0IGNvbGxlY3Rpb24gbW9kYWxcbiAgICAgKi9cbiAgICBjb25zdCBjbG9zZUVkaXRDb2xsZWN0aW9uTW9kYWxCdXR0b25FdmVudExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgJCgnLmVkaXQtY29sbGVjdGlvbi1wYW5lbCAuZWRpdC1tb2RhbCAuY2xvc2UtYnRuJykub24oJ2NsaWNrJywgaGFuZGxlQ2xvc2VFZGl0Q29sbGVjdGlvbk1vZGFsKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGxpc3RlbmVyIGZvciBvcGVuaW5nIHRoZSBFZGl0IGNvbGxlY3Rpb24gbW9kYWxcbiAgICAgKi9cbiAgICBjb25zdCBvcGVuRWRpdENvbGxlY3Rpb25Nb2RhbEV2ZW50TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmVkaXQtY29sbGVjdGlvbicsIGhhbmRsZUVkaXRDb2xsZWN0aW9uTW9kYWwpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgbGlzdGVuZXIgZm9yIGNhbmNlbGluZy9jbG9zaW5nIHRoZSBFZGl0IGltYWdlIG1vZGFsXG4gICAgICovXG4gICAgY29uc3QgY2FuY2VsRWRpdENvbGxlY3Rpb25Nb2RhbEJ1dHRvbkV2ZW50TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmVkaXQtY29sbGVjdGlvbi1tb2RhbC1jYW5jZWwnLCBoYW5kbGVDbG9zZUVkaXRDb2xsZWN0aW9uTW9kYWwpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGlzdGVuZXIgZm9yIGNsaWNraW5nIG9uIHNhdmUgYnV0dG9uIGluc2lkZSBFZGl0IENvbGxlY3Rpb24gTW9kYWxcbiAgICAgKi9cbiAgICBjb25zdCB1cGRhdGVFZGl0Q29sbGVjdGlvbk1vZGFsQnV0dG9uRXZlbnRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICRlZGl0Q29sbGVjdGlvbk1vZGFsLm9uKCdjbGljaycsICcuZWRpdC1jb2xsZWN0aW9uLW1vZGFsLXNhdmUnLCBoYW5kbGVVcGRhdGVDb2xsZWN0aW9uTW9kYWwpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlciBmb3IgY2xvc2luZyBFZGl0IEltYWdlIE1vZGFsXG4gICAgICovXG4gICAgY29uc3QgaGFuZGxlQ2xvc2VFZGl0Q29sbGVjdGlvbk1vZGFsID0gKCkgPT4ge1xuICAgICAgJGVkaXRDb2xsZWN0aW9uTW9kYWwuZmFkZU91dCgoKSA9PiBjbGVhck1vZGFsSW5wdXRzKCRlZGl0Q29sbGVjdGlvbk1vZGFsKSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBsaXN0ZW5lciBmb3IgZGVsZXRpbmcgaW1hZ2UgYnV0dG9uXG4gICAgICovXG4gICAgY29uc3QgZGVsZXRlSW1hZ2VCdXR0b25FdmVudExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5kZWxldGUtaW1hZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGhhbmRsZURlbGV0ZUltYWdlKCQodGhpcykucGFyZW50cygnLmNvbGxlY3Rpb24taW1hZ2Utd3JhcHBlcicpKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBsaXN0ZW5lciB3aGVuIGNoYW5naW5nIHRoZSBpbWFnZSBjb2xsZWN0aW9uIGRyb3Bkb3duXG4gICAgICovXG4gICAgY29uc3QgaW1hZ2VDb2xsZWN0aW9uT25DaGFuZ2VFdmVudExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgJCgnI2NvbWJpX2ltYWdlX2NvbGxlY3Rpb24nKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCB2YWwgPSBwYXJzZUludCgkKHRoaXMpLnZhbCgpKVxuICAgICAgICBoYW5kbGVPbkNoYW5nZUltYWdlQ29sbGVjdGlvbih2YWwpXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGxpc3RlbmVyIGZvciBjcmVhdGluZyBuZXcgY29sbGVjdGlvbiBidXR0b25cbiAgICAgKi9cbiAgICBjb25zdCBjcmVhdGVDb2xsZWN0aW9uQnV0dG9uRXZlbnRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICQoJ2J1dHRvbi5jcmVhdGUtbmV3LWNvbGxlY3Rpb24nKS5vbignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0ICRpbnB1dCA9ICQoJ2lucHV0W25hbWU9bmV3LWNvbGxlY3Rpb24tbmFtZV0nKSxcbiAgICAgICAgICBuYW1lID0gJGlucHV0LnZhbCgpXG5cbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgJGlucHV0LmFkZENsYXNzKCdlcnJvcicpXG5cbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IGhhbmRsZUNyZWF0ZU5ld0NvbGxlY3Rpb24obmFtZSlcblxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBsaXN0ZW5lciBmb3IgZGVsZXRpbmcgY29sbGVjdGlvbiBsaXN0IGJ1dHRvblxuICAgICAqL1xuICAgIGNvbnN0IGRlbGV0ZUNvbGxlY3Rpb25CdXR0b25FdmVudExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgJCgnYnV0dG9uLmRlbGV0ZS1jb2xsZWN0aW9uJykub24oJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBoYW5kbGVEZWxldGVDb2xsZWN0aW9uKCQoJyNjb21iaV9pbWFnZV9jb2xsZWN0aW9uIG9wdGlvbjpzZWxlY3RlZCcpLnZhbCgpKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcmV2ZW50cyBzdWJtaXQgdGhlIG1vZGFsIGZvcm1zIGJ5IHByZXNzaW5nIGVudGVyLlxuICAgICAqIEl0IHRyaWdnZXJzIHRoZSBzYXZlIGJ1dHRvbiBpbnN0ZWFkIG9mIHN1Ym1pdHRpbmcgaXQuXG4gICAgICpcbiAgICAgKi9cbiAgICBjb25zdCBwcmV2ZW50U3VibWl0Rm9ybU1vZGFscyA9ICgpID0+IHtcbiAgICAgICRlZGl0TW9kYWwuZmluZCgnI2VkaXQtaW1hZ2UtZm9ybScpLnN1Ym1pdChlID0+IHtcbiAgICAgICAgJGVkaXRNb2RhbC5maW5kKCcuZWRpdC1tb2RhbC1zYXZlJykudHJpZ2dlcignY2xpY2snKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH0pXG4gICAgICAkZWRpdENvbGxlY3Rpb25Nb2RhbC5maW5kKCcjZWRpdC1jb2xsZWN0aW9uLWZvcm0nKS5zdWJtaXQoZSA9PiB7XG4gICAgICAgICRlZGl0Q29sbGVjdGlvbk1vZGFsLmZpbmQoJy5lZGl0LWNvbGxlY3Rpb24tbW9kYWwtc2F2ZScpLnRyaWdnZXIoJ2NsaWNrJylcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXIgZm9yIGNsb3NpbmcgRWRpdCBJbWFnZSBNb2RhbFxuICAgICAqL1xuICAgIGNvbnN0IGhhbmRsZUNsb3NlRWRpdEltYWdlTW9kYWwgPSAoKSA9PiB7XG4gICAgICBpZiAoJGVkaXRNb2RhbC5maW5kKCdpbnB1dFtuYW1lPWlkXScpLnZhbCgpID09PSAnMCcpIHtcbiAgICAgICAgcmVtb3ZlTGFzdEltYWdlRWxlbWVudCgpXG4gICAgICB9XG5cbiAgICAgICRlZGl0TW9kYWwuZmFkZU91dCgoKSA9PiBjbGVhck1vZGFsSW5wdXRzKCRlZGl0TW9kYWwpKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXIgdG8gYWRkIGFuIGltYWdlIHRvIGEgY29sbGVjdGlvblxuICAgICAqXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgY29uc3QgaGFuZGxlU2F2ZUltYWdlTW9kYWwgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoIWlzVmFsaWRFZGl0TW9kYWxEYXRhKCRlZGl0TW9kYWwpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBsb2FkaW5nKHRydWUpXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBmb3JtRGF0YSA9IHBhcnNlRWRpdE1vZGFsRGF0YSgkKCdmb3JtI2VkaXQtaW1hZ2UtZm9ybScpLnNlcmlhbGl6ZUFycmF5KCkpLFxuICAgICAgICAgICAgcmVzdWx0ID0gbnVsbFxuICAgICAgICAgIFxuICAgICAgICAgIGZvcm1EYXRhID0gcmVtb3ZlUmVkdW5kYW50UGF0aEZyb21JbWFnZVBhdGgoZm9ybURhdGEpO1xuXG4gICAgICAgIGlmIChmb3JtRGF0YS5pZCAhPT0gJzAnKSB7XG4gICAgICAgICAgZm9ybURhdGEuaW1hZ2VJZCA9IGZvcm1EYXRhLmlkXG4gICAgICAgICAgZGVsZXRlIGZvcm1EYXRhLmlkXG4gICAgICAgICAgcmVzdWx0ID0gYXdhaXQgdXBkYXRlSW1hZ2VUZXh0cyhmb3JtRGF0YSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgZm9ybURhdGEuaWRcbiAgICAgICAgICByZXN1bHQgPSBhd2FpdCBhZGRJbWFnZVRvQ29sbGVjdGlvbihmb3JtRGF0YSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0SW1hZ2VzV3JhcHBlcigpXG4gICAgICAgIGxvYWRJbWFnZXNDb2xsZWN0aW9uKGdldFNlbGVjdGVkTGlzdCgpLmlkKVxuICAgICAgICAkZWRpdE1vZGFsLmZhZGVPdXQoKCkgPT4gY2xlYXJNb2RhbElucHV0cygkZWRpdE1vZGFsKSlcblxuICAgICAgICBjb25zdCB7c3VjY2VzcywgbWVzc2FnZSA9IG51bGx9ID0gcmVzdWx0XG5cbiAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgICB0b2FzdFN1Y2Nlc3MobWVzc2FnZSB8fCBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnTU9EQUxfU1VDQ0VTU19URVhUJywgJ3Byb2R1Y3RfaW1hZ2VfbGlzdHMnKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0b2FzdEVycm9yKG1lc3NhZ2UgfHwganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ01PREFMX0VSUk9SX1RFWFQnLCAncHJvZHVjdF9pbWFnZV9saXN0cycpKVxuICAgICAgICB9XG5cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdG9hc3RFcnJvcihlLm1lc3NhZ2UpXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBsb2FkaW5nKGZhbHNlKVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlcyAnaW1hZ2VzL3Byb2R1Y3RfaW1hZ2VzL29yaWdpbmFsX2ltYWdlcy8nIGZyb20gdGhlIGltYWdlIHBhdGggaW4gdGhlIGZvcm0gZGF0YVxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAkZm9ybURhdGFcbiAgICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAgICovXG4gICAgY29uc3QgcmVtb3ZlUmVkdW5kYW50UGF0aEZyb21JbWFnZVBhdGggPSAkZm9ybURhdGEgPT4ge1xuICAgICAgICBsZXQgb2xkUGF0aCA9ICdpbWFnZXMvcHJvZHVjdF9pbWFnZXMvb3JpZ2luYWxfaW1hZ2VzLydcbiAgICAgICAgJGZvcm1EYXRhWydsb2NhbFBhdGgnXSA9ICRmb3JtRGF0YVsnbG9jYWxQYXRoJ10ucmVwbGFjZShvbGRQYXRoLCBcIlwiKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuICRmb3JtRGF0YVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXIgdG8gdXBkYXRlIHRoZSBjb2xsZWN0aW9uJ3MgbmFtZVxuICAgICAqXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgY29uc3QgaGFuZGxlVXBkYXRlQ29sbGVjdGlvbk1vZGFsID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCFpc1ZhbGlkRWRpdE1vZGFsRGF0YSgkZWRpdENvbGxlY3Rpb25Nb2RhbCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGxvYWRpbmcodHJ1ZSlcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBmb3JtRGF0YSA9IHBhcnNlRWRpdE1vZGFsRGF0YSgkKCdmb3JtI2VkaXQtY29sbGVjdGlvbi1mb3JtJykuc2VyaWFsaXplQXJyYXkoKSlcblxuICAgICAgICBjb25zdCB7IGlkLCBuYW1lIH0gPSBmb3JtRGF0YVxuICAgICAgICBjb25zdCB7c3VjY2VzcywgbWVzc2FnZX0gPSBhd2FpdCB1cGRhdGVDb2xsZWN0aW9uTmFtZSh7IGxpc3RJZDogaWQsIGxpc3ROYW1lOiBuYW1lIH0pXG5cbiAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgICB0b2FzdFN1Y2Nlc3MobWVzc2FnZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0b2FzdEVycm9yKG1lc3NhZ2UpXG4gICAgICAgIH1cblxuICAgICAgICBsb2FkQ29sbGVjdGlvbnMoaWQpXG4gICAgICAgICRlZGl0Q29sbGVjdGlvbk1vZGFsLmZhZGVPdXQoKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0b2FzdEVycm9yKGUubWVzc2FnZSlcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGxvYWRpbmcoZmFsc2UpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGVzIGVkaXQgbW9kYWxzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJG1vZGFsXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgY29uc3QgaXNWYWxpZEVkaXRNb2RhbERhdGEgPSAkbW9kYWwgPT4ge1xuICAgICAgJG1vZGFsLmZpbmQoJ2Zvcm0gaW5wdXQnKS5yZW1vdmVDbGFzcygnZXJyb3InKVxuXG4gICAgICBjb25zdCAkZm9ybSA9ICRtb2RhbC5maW5kKCdmb3JtJylcbiAgICAgIGxldCBlcnJvcnMgPSAwXG5cbiAgICAgICRmb3JtXG4gICAgICAgIC5maW5kKCdbY2xhc3MqPXJlcXVpcmVkXScpXG4gICAgICAgIC5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgIGlmICgkKGVsZW1lbnQpLnZhbCgpID09PSAnJykge1xuICAgICAgICAgICAgJChlbGVtZW50KS5hZGRDbGFzcygnZXJyb3InKVxuICAgICAgICAgICAgZXJyb3JzKytcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgIHJldHVybiBlcnJvcnMgPT09IDBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhcnMgdGhlIGlucHV0cyBmb3IgdGhlIGdpdmVuIG1vZGFsIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkbW9kYWxcbiAgICAgKi9cbiAgICBjb25zdCBjbGVhck1vZGFsSW5wdXRzID0gJG1vZGFsID0+IHtcbiAgICAgICRtb2RhbC5maW5kKCdpbnB1dCcpLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XG4gICAgICAgICQoZWxlbWVudClcbiAgICAgICAgICAudmFsKCcnKVxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnZXJyb3InKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSBlZGl0IG1vZGFsIGZvcm0gZGF0YSB0byBzZW5kIHRvIGJhY2sgZW5kXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZm9ybURhdGFcbiAgICAgKiBAcmV0dXJucyB7eyp9fVxuICAgICAqL1xuICAgIGNvbnN0IHBhcnNlRWRpdE1vZGFsRGF0YSA9IGZvcm1EYXRhID0+IHtcbiAgICAgIGNvbnN0IHBhcnNlZERhdGEgPSB7IHRpdGxlczogW10sIGFsdFRpdGxlczogW10gfVxuXG4gICAgICBmb3JtRGF0YS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICBpZiAoL1xcW1xcdytcXF0vZ2kudGVzdChlbGVtZW50Lm5hbWUpKSB7XG4gICAgICAgICAgY29uc3Qga2V5ID0gZWxlbWVudC5uYW1lLnJlcGxhY2UoLy4qXFxbKFxcdyspXFxdLywgJyQxJyksXG4gICAgICAgICAgICB2YWx1ZSA9IGVsZW1lbnQubmFtZS5yZXBsYWNlKC8oLiopXFxbXFx3K1xcXS8sICckMScpXG5cbiAgICAgICAgICBwYXJzZWREYXRhW3ZhbHVlXS5wdXNoKHtcbiAgICAgICAgICAgIHZhbHVlOiBlbGVtZW50LnZhbHVlLFxuICAgICAgICAgICAgbGFuZ3VhZ2VDb2RlOiBrZXlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcnNlZERhdGFbZWxlbWVudC5uYW1lXSA9IGVsZW1lbnQudmFsdWVcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgcGFyc2VkRGF0YS50aXRsZXMgPSBKU09OLnN0cmluZ2lmeShwYXJzZWREYXRhLnRpdGxlcylcbiAgICAgIHBhcnNlZERhdGEuYWx0VGl0bGVzID0gSlNPTi5zdHJpbmdpZnkocGFyc2VkRGF0YS5hbHRUaXRsZXMpXG5cbiAgICAgIHJldHVybiBwYXJzZWREYXRhXG4gICAgfVxuXG4gICAgY29uc3Qgb3BlbkNvbmZpcm1Nb2RhbCA9ICgpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgJGNvbmZpcm1Nb2RhbC5zaG93KClcblxuICAgICAgICAkY29uZmlybU1vZGFsLm9uKCdjbGljaycsICcuY29uZmlybS1tb2RhbC1jYW5jZWwsIC5jb25maXJtLW1vZGFsIC5jbG9zZS1idG4nLCAoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShmYWxzZSlcbiAgICAgICAgICAkY29uZmlybU1vZGFsLmhpZGUoKVxuICAgICAgICB9KVxuICAgICAgICAkY29uZmlybU1vZGFsLmZpbmQoJy5jb25maXJtLW1vZGFsLWNvbmZpcm0nKS5jbGljaygoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKVxuICAgICAgICAgICRjb25maXJtTW9kYWwuaGlkZSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXIgd2hlbiBkZWxldGluZyBhIGltYWdlIGZyb20gdGhlIGxpc3RcbiAgICAgKiBAcGFyYW0gJGltYWdlV3JhcHBlclxuICAgICAqL1xuICAgIGNvbnN0IGhhbmRsZURlbGV0ZUltYWdlID0gYXN5bmMgJGltYWdlV3JhcHBlciA9PiB7XG4gICAgICBjb25zdCBjYW5Qcm9jZWVkID0gYXdhaXQgb3BlbkNvbmZpcm1Nb2RhbCgpXG5cbiAgICAgIGlmICghY2FuUHJvY2VlZCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgbG9hZGluZyh0cnVlKVxuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBpbWFnZUlkID0gcGFyc2VJbnQoJGltYWdlV3JhcHBlci5kYXRhKCdpbWFnZScpLmlkKSxcbiAgICAgICAgICAgIG1vZGlmaWVySWQgPSAkKCdpbnB1dDpoaWRkZW5bbmFtZT1tb2RpZmllcklkXScpLnZhbCgpLFxuICAgICAgICAgICAgbW9kaWZpZXJUeXBlID0gJCgnaW5wdXQ6aGlkZGVuW25hbWU9bW9kaWZpZXJUeXBlXScpLnZhbCgpXG4gICAgICAgIGxldCBtZXNzYWdlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ01PREFMX1NVQ0NFU1NfVEVYVCcsICdwcm9kdWN0X2ltYWdlX2xpc3RzJylcblxuICAgICAgICBpZiAoaW1hZ2VJZCkge1xuICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgICAgIGltYWdlSWQsXG4gICAgICAgICAgICBtb2RpZmllcklkLFxuICAgICAgICAgICAgbW9kaWZpZXJUeXBlXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRlbGV0ZUltYWdlQnlJZChwYXJhbXMpXG4gICAgICAgICAgbWVzc2FnZSA9IHJlc3VsdC5tZXNzYWdlXG4gICAgICAgICAgaWYoZmFsc2UgPT09IHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJGltYWdlV3JhcHBlci5mYWRlT3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpXG5cbiAgICAgICAgICBpZiAoIWhhc0ltYWdlKCkpIHtcbiAgICAgICAgICAgIHNldFRvTm9JbWFnZXNEaXNwbGF5KClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgdG9hc3RTdWNjZXNzKG1lc3NhZ2UpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRvYXN0RXJyb3IoZS5tZXNzYWdlKVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgbG9hZGluZyhmYWxzZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhcnMgdGhlIG5ldyBjb2xsZWN0aW9uIGlucHV0IHRleHRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIGNvbnN0IGNsZWFyQ3JlYXRlTmV3Q29sbGVjdGlvbklucHV0ID0gKCkgPT4ge1xuICAgICAgJCgnaW5wdXRbbmFtZT1uZXctY29sbGVjdGlvbi1uYW1lXScpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnZXJyb3InKVxuICAgICAgICAudmFsKCcnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGVuZHMgYW4gaW1hZ2UgdG8gdGhlIGltYWdlIHdyYXBwZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkaW1hZ2VCbG9ja1xuICAgICAqL1xuICAgIGNvbnN0IGFwcGVuZEltYWdlVG9Db2xsZWN0aW9uID0gJGltYWdlQmxvY2sgPT4ge1xuICAgICAgJCgnLnNlbGVjdGVkLWNvbGxlY3Rpb24td3JhcHBlcicpLnJlbW92ZUNsYXNzKCdjcmVhdGUtbmV3LWNvbGxlY3Rpb24gbm8taW1hZ2Utc2VsZWN0ZWQnKVxuICAgICAgJCgnLmNvbGxlY3Rpb24taW1hZ2VzLXdyYXBwZXInKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpLmFwcGVuZCgkaW1hZ2VCbG9jaylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMvY2xlYXJzIHRoZSBpbWFnZSB3cmFwcGVyXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7alF1ZXJ5fVxuICAgICAqL1xuICAgIGNvbnN0IHJlc2V0SW1hZ2VzV3JhcHBlciA9ICgpID0+ICQoJy5jb2xsZWN0aW9uLWltYWdlcy13cmFwcGVyJykuaHRtbCgnJylcblxuICAgIC8qKlxuICAgICAqIFJlcGxhY2VzIHRoZSBjb2xsZWN0aW9uIGRyb3Bkb3duIHdpdGggbmV3IGNvbGxlY3Rpb24gbGlzdFxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHNlbGVjdGVkXG4gICAgICovXG4gICAgY29uc3QgcmVwbGFjZUNvbGxlY3Rpb25zID0gKGNvbGxlY3Rpb25zLCBzZWxlY3RlZCA9IG51bGwpID0+IHtcbiAgICAgIGNvbnN0ICRjb2xsZWN0aW9uID0gJCgnc2VsZWN0I2NvbWJpX2ltYWdlX2NvbGxlY3Rpb24nKVxuICAgICAgJGNvbGxlY3Rpb24uaHRtbCgnJylcbiAgICAgICAgLmFwcGVuZCgkKCc8b3B0aW9uLz4nKS52YWwoMCkuaHRtbCgnJykpXG5cbiAgICAgIGNvbGxlY3Rpb25zLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgIGNvbnN0ICRvcHRpb24gPSAkKCc8b3B0aW9uLz4nKS52YWwoZWxlbWVudC5pZCkuaHRtbChlbGVtZW50Lm5hbWUpXG5cbiAgICAgICAgaWYgKHNlbGVjdGVkICE9PSBudWxsICYmIHBhcnNlSW50KHNlbGVjdGVkKSA9PT0gZWxlbWVudC5pZCkge1xuICAgICAgICAgICRvcHRpb24ucHJvcCgnc2VsZWN0ZWQnLCB0cnVlKVxuICAgICAgICB9XG5cbiAgICAgICAgJGNvbGxlY3Rpb24uYXBwZW5kKCRvcHRpb24pXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgdGhlIGNvbGxlY3Rpb25zIGxpc3RcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIGNvbnN0IGxvYWRDb2xsZWN0aW9ucyA9IGFzeW5jIChzZWxlY3RlZCA9IG51bGwpID0+IHtcbiAgICAgIGNvbnN0IGNvbGxlY3Rpb25zID0gYXdhaXQgZ2V0Q29sbGVjdGlvbigpXG5cbiAgICAgIHJlcGxhY2VDb2xsZWN0aW9ucyhjb2xsZWN0aW9ucywgc2VsZWN0ZWQpXG5cbiAgICAgIGlmICghY29sbGVjdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHNldFRvTm9JbWFnZXNEaXNwbGF5KClcbiAgICAgICAgc2V0VG9Ob0NvbGxlY3Rpb25zRGlzcGxheSgpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBlbmFibGVJbWFnZVNlbGVjdGlvbigpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgaW1hZ2VzIGNvbGxlY3Rpb24gYnkgYSBnaXZlbiBjb2xsZWN0aW9uIElEXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29sbGVjdGlvbl9pZFxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIGNvbnN0IGxvYWRJbWFnZXNDb2xsZWN0aW9uID0gYXN5bmMgY29sbGVjdGlvbl9pZCA9PiB7XG4gICAgICBjb25zdCBpbWFnZXMgPSBhd2FpdCBnZXRJbWFnZUNvbGxlY3Rpb24oY29sbGVjdGlvbl9pZClcblxuICAgICAgaWYgKCFpbWFnZXMubGVuZ3RoKSB7XG4gICAgICAgIHNldFRvTm9JbWFnZXNEaXNwbGF5KClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyAkKCcuc2VsZWN0ZWQtY29sbGVjdGlvbi13cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkLWltYWdlLXNlbGVjdGlvbicpXG5cbiAgICAgIGltYWdlc1xuICAgICAgICAuc29ydCgoYSwgYikgPT4gYS5zb3J0T3JkZXIgLSBiLnNvcnRPcmRlcilcbiAgICAgICAgLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgY29uc3QgJGltYWdlQmxvY2sgPSAkKGltYWdlQmxvY2tUZW1wbGF0ZSh7IGlkOiBlbGVtZW50LmlkLCBzcmM6IGVsZW1lbnQud2ViRmlsZVBhdGggfSkpXG5cbiAgICAgICAgICAkaW1hZ2VCbG9jay5kYXRhKCdpbWFnZScsIGVsZW1lbnQpXG4gICAgICAgICAgYXBwZW5kSW1hZ2VUb0NvbGxlY3Rpb24oJGltYWdlQmxvY2spXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGlkZXMgdGhlIGNvbGxlY3Rpb24gaW1hZ2Ugd3JhcHBlciBlbGVtZW50XG4gICAgICovXG4gICAgY29uc3Qgc2V0VG9Ob0ltYWdlc0Rpc3BsYXkgPSAoKSA9PiAge1xuICAgICAgJCgnLnNlbGVjdGVkLWNvbGxlY3Rpb24td3JhcHBlcicpLmFkZENsYXNzKCduby1pbWFnZS1zZWxlY3RlZCcpXG4gICAgICAkKCdkaXYuY29sbGVjdGlvbi1pbWFnZXMtd3JhcHBlcicpLmhpZGUoKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhpZGUgZWxlbWVudHMgd2hlbiB3ZSBkb24ndCBoYXZlIGNvbGxlY3Rpb25zXG4gICAgICovXG4gICAgY29uc3Qgc2V0VG9Ob0NvbGxlY3Rpb25zRGlzcGxheSA9ICgpID0+IHtcbiAgICAgICQoJ2J1dHRvbiNzZWxlY3QtY29sbGVjdGlvbicpLmhpZGUoKVxuICAgICAgJCgnYnV0dG9uI2NyZWF0ZS1uZXctY29sbGVjdGlvbicpLnRyaWdnZXIoJ2NsaWNrJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXNhYmxlcyB0aGUgaW1hZ2UgcGxhY2Vob2xkZXIgYW5kIHRoZSBlZGl0L2RlbGV0ZSBidXR0b25zIG9mIHRoZSBpbWFnZSBjb2xsZWN0aW9uXG4gICAgICovXG4gICAgY29uc3QgZGlzYWJsZUltYWdlU2VsZWN0aW9uID0gKCkgPT4ge1xuICAgICAgJCgnLnNlbGVjdGVkLWNvbGxlY3Rpb24td3JhcHBlcicpLmFkZENsYXNzKCdkaXNhYmxlZC1pbWFnZS1zZWxlY3Rpb24nKVxuICAgICAgJCgnYnV0dG9uLmVkaXQtY29sbGVjdGlvbiwgYnV0dG9uLmRlbGV0ZS1jb2xsZWN0aW9uJykuYXR0cignZGlzYWJsZWQnLCB0cnVlKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVuYWJsZXMgdGhlIGltYWdlIHBsYWNlaG9sZGVyIGFuZCB0aGUgZWRpdC9kZWxldGUgYnV0dG9ucyBvZiB0aGUgaW1hZ2UgY29sbGVjdGlvblxuICAgICAqL1xuICAgIGNvbnN0IGVuYWJsZUltYWdlU2VsZWN0aW9uID0gKCkgPT4ge1xuICAgICAgJCgnLnNlbGVjdGVkLWNvbGxlY3Rpb24td3JhcHBlcicpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZC1pbWFnZS1zZWxlY3Rpb24nKVxuICAgICAgJCgnYnV0dG9uLmVkaXQtY29sbGVjdGlvbiwgYnV0dG9uLmRlbGV0ZS1jb2xsZWN0aW9uJykucmVtb3ZlQXR0cignZGlzYWJsZWQnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGVyZSBpcyBhdCBsZWFzdCBvbmUgY29sbGVjdGlvblxuICAgICAqIFdlIGNoZWNrIGlmIGl0IGlzIGJpZ2dlciB0aGFuIDEgYmVjYXVzZSB0aGUgZmlyc3QgZWxlbWVudCBpdCdzIGEgYmxhbmsgb3B0aW9uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBjb25zdCBoYXNDb2xsZWN0aW9uID0gKCkgPT4gJCgnI2NvbWJpX2ltYWdlX2NvbGxlY3Rpb24gb3B0aW9uJykubGVuZ3RoID4gMVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBpbWFnZXMgd3JhcHBlciBoYXMgaW1hZ2VzXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBjb25zdCBoYXNJbWFnZSA9ICgpID0+ICQoJy5jb2xsZWN0aW9uLWltYWdlcy13cmFwcGVyID4gLmNvbGxlY3Rpb24taW1hZ2Utd3JhcHBlcicpLmxlbmd0aCA+IDBcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIGxhc3QgaW1hZ2UgZWxlbWVudCBmcm9tIHRoZSBpbWFnZXMgY29udGFpbmVyXG4gICAgICovXG4gICAgY29uc3QgcmVtb3ZlTGFzdEltYWdlRWxlbWVudCA9ICgpID0+IHtcbiAgICAgIC8vIHJlbW92ZSBsYXN0IGltYWdlXG4gICAgICBjb25zdCAkbGFzdEltYWdlRWxlbWVudCA9ICQoJy5jb2xsZWN0aW9uLWltYWdlcy13cmFwcGVyID4gLmNvbGxlY3Rpb24taW1hZ2Utd3JhcHBlcjpsYXN0LWNoaWxkJylcbiAgICAgICRsYXN0SW1hZ2VFbGVtZW50LnJlbW92ZSgpXG5cbiAgICAgIGlmICghaGFzSW1hZ2UoKSkge1xuICAgICAgICBzZXRUb05vSW1hZ2VzRGlzcGxheSgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVxdWVzdCB0byBnZXQgYWxsIHRoZSBpbWFnZSBjb2xsZWN0aW9uc1xuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgICovXG4gICAgY29uc3QgZ2V0Q29sbGVjdGlvbiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHVybCA9IFtcbiAgICAgICAgYXBwVXJsLFxuICAgICAgICAnL2FkbWluL2FkbWluLnBocD9kbz1Qcm9kdWN0SW1hZ2VMaXN0UmVhZEFqYXgnXG4gICAgICBdLmpvaW4oJycpXG5cbiAgICAgIHJldHVybiAkLmdldCh1cmwsIHJlc3BvbnNlID0+IHJlc3BvbnNlKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhbGwgaW1hZ2VzIGZyb20gYSBnaXZlbiBjb2xsZWN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29sbGVjdGlvbl9pZFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqL1xuICAgIGNvbnN0IGdldEltYWdlQ29sbGVjdGlvbiA9IGNvbGxlY3Rpb25faWQgPT4ge1xuICAgICAgY29uc3QgdXJsID0gW1xuICAgICAgICBhcHBVcmwsXG4gICAgICAgICcvYWRtaW4vYWRtaW4ucGhwP2RvPVByb2R1Y3RJbWFnZUxpc3RSZWFkQWpheC9saXN0JyxcbiAgICAgICAgYCZpZD0ke2NvbGxlY3Rpb25faWR9YFxuICAgICAgXS5qb2luKCcnKVxuXG4gICAgICByZXR1cm4gJC5nZXQodXJsKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZVswXS5pbWFnZXMgfHwgW10pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVxdWVzdCB0byBjcmVhdGUgYSBuZXcgY29sbGVjdGlvbiBsaXN0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gbGlzdE5hbWVcbiAgICAgKi9cbiAgICBjb25zdCBjcmVhdGVDb2xsZWN0aW9uID0gbGlzdE5hbWUgPT4ge1xuICAgICAgY29uc3QgdXJsID0gW1xuICAgICAgICBhcHBVcmwsXG4gICAgICAgICcvYWRtaW4vYWRtaW4ucGhwP2RvPVByb2R1Y3RJbWFnZUxpc3RDcmVhdGVBamF4L2ltYWdlTGlzdCdcbiAgICAgIF0uam9pbignJylcblxuICAgICAgcmV0dXJuICQucG9zdChcbiAgICAgICAgdXJsLFxuICAgICAgICB7IGxpc3ROYW1lIH0sXG4gICAgICAgIHJlc3BvbnNlID0+IHJlc3BvbnNlXG4gICAgICApXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVxdWVzdCB0byBkZWxldGUgYSBjb2xsZWN0aW9uIGxpc3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZFxuICAgICAqIEBwYXJhbSBtb2RpZmllcklkXG4gICAgICogQHBhcmFtIG1vZGlmaWVyVHlwZVxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqL1xuICAgIGNvbnN0IGRlbGV0ZUNvbGxlY3Rpb24gPSAoe2lkLCBtb2RpZmllcklkLCBtb2RpZmllclR5cGV9KSA9PiB7XG4gICAgICBjb25zdCB1cmwgPSBbXG4gICAgICAgIGFwcFVybCxcbiAgICAgICAgJy9hZG1pbi9hZG1pbi5waHA/ZG89UHJvZHVjdEltYWdlTGlzdERlbGV0ZUFqYXgvZGVsZXRlSW1hZ2VMaXN0QnlJZCcsXG4gICAgICAgIGAmaWQ9JHtpZH0mbW9kaWZpZXJJZD0ke21vZGlmaWVySWR9Jm1vZGlmaWVyVHlwZT0ke21vZGlmaWVyVHlwZX1gXG4gICAgICBdLmpvaW4oJycpXG5cbiAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgdHlwZTogJ0RFTEVURSdcbiAgICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVxdWVzdCB0byBhZGQgYW4gaW1hZ2UgdG8gYSBjb2xsZWN0aW9uIGxpc3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJzZWREYXRhXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgY29uc3QgYWRkSW1hZ2VUb0NvbGxlY3Rpb24gPSBwYXJzZWREYXRhID0+IHtcbiAgICAgIGNvbnN0IHVybCA9IFtcbiAgICAgICAgYXBwVXJsLFxuICAgICAgICAnL2FkbWluL2FkbWluLnBocD9kbz1Qcm9kdWN0SW1hZ2VMaXN0Q3JlYXRlQWpheC9pbWFnZSdcbiAgICAgIF0uam9pbignJylcblxuICAgICAgcmV0dXJuICQucG9zdChcbiAgICAgICAgdXJsLFxuICAgICAgICBwYXJzZWREYXRhLFxuICAgICAgICByZXNwb25zZSA9PiByZXNwb25zZSxcbiAgICAgICAgJ2pzb24nXG4gICAgICApXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgdGV4dCBhbmQgYWx0IHRleHQgZm9yIHRoZSBpbWFnZVxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcnNlZERhdGFcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBjb25zdCB1cGRhdGVJbWFnZVRleHRzID0gcGFyc2VkRGF0YSA9PiB7XG4gICAgICBjb25zdCB1cmwgPSBbXG4gICAgICAgIGFwcFVybCxcbiAgICAgICAgJy9hZG1pbi9hZG1pbi5waHA/ZG89UHJvZHVjdEltYWdlTGlzdFVwZGF0ZUFqYXgvdXBkYXRlSW1hZ2VUZXh0J1xuICAgICAgXS5qb2luKCcnKVxuXG4gICAgICByZXR1cm4gJC5wb3N0KFxuICAgICAgICB1cmwsXG4gICAgICAgIHBhcnNlZERhdGEsXG4gICAgICAgIHJlc3BvbnNlID0+IHJlc3BvbnNlLFxuICAgICAgICAnanNvbidcbiAgICAgIClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXF1ZXN0IHRvIHVwZGF0ZSBhIGNvbGxlY3Rpb24gbmFtZVxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcnNlZERhdGFcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBjb25zdCB1cGRhdGVDb2xsZWN0aW9uTmFtZSA9IHBhcnNlZERhdGEgPT4ge1xuICAgICAgY29uc3QgdXJsID0gW1xuICAgICAgICBhcHBVcmwsXG4gICAgICAgICcvYWRtaW4vYWRtaW4ucGhwP2RvPVByb2R1Y3RJbWFnZUxpc3RVcGRhdGVBamF4L3VwZGF0ZUltYWdlTGlzdE5hbWUnXG4gICAgICBdLmpvaW4oJycpXG5cbiAgICAgIHJldHVybiAkLnBvc3QoXG4gICAgICAgIHVybCxcbiAgICAgICAgcGFyc2VkRGF0YSxcbiAgICAgICAgcmVzcG9uc2UgPT4gcmVzcG9uc2UsXG4gICAgICAgICdqc29uJ1xuICAgICAgKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlbGV0ZXMgYW4gaW1hZ2UgZnJvbSB0aGUgY3VycmVudCBpbWFnZSBjb2xsZWN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW1hZ2VJZFxuICAgICAqIEBwYXJhbSBtb2RpZmllcklkXG4gICAgICogQHBhcmFtIG1vZGlmaWVyVHlwZVxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqL1xuICAgIGNvbnN0IGRlbGV0ZUltYWdlQnlJZCA9ICh7aW1hZ2VJZCwgbW9kaWZpZXJJZCwgbW9kaWZpZXJUeXBlfSkgPT4ge1xuICAgICAgY29uc3QgdXJsID0gW1xuICAgICAgICBhcHBVcmwsXG4gICAgICAgIGAvYWRtaW4vYWRtaW4ucGhwP2RvPVByb2R1Y3RJbWFnZUxpc3REZWxldGVBamF4L2RlbGV0ZUltYWdlQnlJZCZpZD0ke2ltYWdlSWR9Jm1vZGlmaWVySWQ9JHttb2RpZmllcklkfSZtb2RpZmllclR5cGU9JHttb2RpZmllclR5cGV9YFxuICAgICAgXS5qb2luKCcnKVxuXG4gICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIHR5cGU6ICdERUxFVEUnXG4gICAgICB9KS50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIG9yZGVyIG9mIHRoZSBpbWFnZXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJzZWREYXRhXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgY29uc3QgdXBkYXRlSW1hZ2VzU29ydCA9IHBhcnNlZERhdGEgPT4ge1xuICAgICAgY29uc3QgdXJsID0gW1xuICAgICAgICBhcHBVcmwsXG4gICAgICAgICcvYWRtaW4vYWRtaW4ucGhwP2RvPVByb2R1Y3RJbWFnZUxpc3RVcGRhdGVBamF4L3VwZGF0ZUltYWdlc1NvcnQnXG4gICAgICBdLmpvaW4oJycpXG5cbiAgICAgIHJldHVybiAkLnBvc3QoXG4gICAgICAgIHVybCxcbiAgICAgICAgcGFyc2VkRGF0YSxcbiAgICAgICAgcmVzcG9uc2UgPT4gcmVzcG9uc2UsXG4gICAgICAgICdqc29uJ1xuICAgICAgKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXIgdG8gY3JlYXRlIGEgbmV3IGNvbGxlY3Rpb24gYnV0dG9uIGV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgICAqL1xuICAgIGNvbnN0IGhhbmRsZUNyZWF0ZU5ld0NvbGxlY3Rpb24gPSBhc3luYyBuYW1lID0+IHtcbiAgICAgIGxvYWRpbmcodHJ1ZSlcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIEFqYXggcmVxdWVzdCB0byBjcmVhdGUgYSBuZXdcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY3JlYXRlQ29sbGVjdGlvbihuYW1lKVxuXG4gICAgICAgIC8vIEdldCBpbWFnZSBjb2xsZWN0aW9uIGxpc3RcbiAgICAgICAgcmVzZXRJbWFnZXNXcmFwcGVyKClcbiAgICAgICAgYXdhaXQgbG9hZENvbGxlY3Rpb25zKClcbiAgICAgICAgYXdhaXQgbG9hZEltYWdlc0NvbGxlY3Rpb24oXG4gICAgICAgICAgJCgnc2VsZWN0I2NvbWJpX2ltYWdlX2NvbGxlY3Rpb24gb3B0aW9uOmxhc3QtY2hpbGQnKVxuICAgICAgICAgICAgLnByb3AoJ3NlbGVjdGVkJywgdHJ1ZSlcbiAgICAgICAgICAgIC52YWwoKVxuICAgICAgICApXG5cbiAgICAgICAgLy8gVHJpZ2dlciBcIlNlbGVjdCBjb2xsZWN0aW9uXCIgYnV0dG9uXG4gICAgICAgICQoJyNzZWxlY3QtY29sbGVjdGlvbicpLnRyaWdnZXIoJ2NsaWNrJylcblxuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICB0b2FzdFN1Y2Nlc3MocmVzdWx0Lm1lc3NhZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG9hc3RFcnJvcihyZXN1bHQubWVzc2FnZSlcbiAgICAgICAgfVxuXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRvYXN0RXJyb3IoZS5tZXNzYWdlKVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgbG9hZGluZyhmYWxzZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVyIGZvciBkZWxldGluZyBjb2xsZWN0aW9uIGJ1dHRvblxuICAgICAqXG4gICAgICogQHBhcmFtIGlkXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgY29uc3QgaGFuZGxlRGVsZXRlQ29sbGVjdGlvbiA9IGFzeW5jIGlkID0+IHtcbiAgICAgIGNvbnN0IGNhblByb2NlZWQgPSBhd2FpdCBvcGVuQ29uZmlybU1vZGFsKClcblxuICAgICAgaWYgKCFjYW5Qcm9jZWVkKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBsb2FkaW5nKHRydWUpXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG1vZGlmaWVySWQgPSAkKCdpbnB1dDpoaWRkZW5bbmFtZT1tb2RpZmllcklkXScpLnZhbCgpLFxuICAgICAgICAgICAgICBtb2RpZmllclR5cGUgPSAkKCdpbnB1dDpoaWRkZW5bbmFtZT1tb2RpZmllclR5cGVdJykudmFsKClcblxuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgbW9kaWZpZXJJZCxcbiAgICAgICAgICBtb2RpZmllclR5cGVcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWxldGVDb2xsZWN0aW9uUmVzdWx0ID0gYXdhaXQgZGVsZXRlQ29sbGVjdGlvbihwYXJhbXMpXG5cbiAgICAgICAgaWYgKCFkZWxldGVDb2xsZWN0aW9uUmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBsb2FkaW5nKGZhbHNlKVxuICAgICAgICAgIHRvYXN0RXJyb3IoZGVsZXRlQ29sbGVjdGlvblJlc3VsdC5tZXNzYWdlKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgbG9hZENvbGxlY3Rpb25zKClcblxuICAgICAgICBjb25zdCAkZmlyc3RPcHRpb24gPSAkKCdzZWxlY3QjY29tYmlfaW1hZ2VfY29sbGVjdGlvbiBvcHRpb246Zmlyc3QtY2hpbGQnKSxcbiAgICAgICAgICBmaXJzdE9wdGlvblZhbCA9IHBhcnNlSW50KCRmaXJzdE9wdGlvbi52YWwoKSlcblxuICAgICAgICByZXNldEltYWdlc1dyYXBwZXIoKVxuXG4gICAgICAgIGlmICghZmlyc3RPcHRpb25WYWwpIHtcbiAgICAgICAgICBkaXNhYmxlSW1hZ2VTZWxlY3Rpb24oKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF3YWl0IGxvYWRJbWFnZXNDb2xsZWN0aW9uKCRmaXJzdE9wdGlvbi52YWwoKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHRvYXN0U3VjY2VzcyhkZWxldGVDb2xsZWN0aW9uUmVzdWx0Lm1lc3NhZ2UpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRvYXN0RXJyb3IoZS5tZXNzYWdlKVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgbG9hZGluZyhmYWxzZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVyIGZvciBzYXZpbmcgYW4gaW1hZ2UgdG8gYSBjb2xsZWN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGF0aFxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIGNvbnN0IGhhbmRsZUFkZEltYWdlVG9Db2xsZWN0aW9uID0gYXN5bmMgKHsgdXJsLCBsb2NhbFBhdGggfSkgPT4ge1xuICAgICAgY29uc3QgcGFyYW1zID0geyBpZDogMCwgc3JjOiB1cmwsIGxvY2FsUGF0aCB9XG4gICAgICBjb25zdCAkaW1hZ2UgPSAkKGltYWdlQmxvY2tUZW1wbGF0ZShwYXJhbXMpKVxuXG4gICAgICBhcHBlbmRJbWFnZVRvQ29sbGVjdGlvbigkaW1hZ2UpXG4gICAgICBoYW5kbGVFZGl0SW1hZ2VNb2RhbChwYXJhbXMpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlciBmb3Igb3BlbiB0aGUgRWRpdCBpbWFnZSBtb2RhbCBidXR0b25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZFxuICAgICAqIEBwYXJhbSBzcmNcbiAgICAgKiBAcGFyYW0gbG9jYWxQYXRoXG4gICAgICogQHBhcmFtIHRpdGxlc1xuICAgICAqIEBwYXJhbSBhbHRUaXRsZXNcbiAgICAgKi9cbiAgICBjb25zdCBoYW5kbGVFZGl0SW1hZ2VNb2RhbCA9ICh7IGlkLCBzcmMsIGxvY2FsUGF0aCwgdGl0bGVzID0gW10sIGFsdFRpdGxlcyA9IFtdIH0pID0+IHtcbiAgICAgICRlZGl0TW9kYWwuZmluZCgnI2NvbGxlY3Rpb24taW1hZ2Utc3JjJykuYXR0cignc3JjJywgc3JjKVxuICAgICAgJGVkaXRNb2RhbC5maW5kKCdpbnB1dFtuYW1lPWlkXScpLnZhbChpZClcbiAgICAgICRlZGl0TW9kYWwuZmluZCgnaW5wdXRbbmFtZT1sb2NhbFBhdGhdJykudmFsKGxvY2FsUGF0aClcbiAgICAgICRlZGl0TW9kYWwuZmluZCgnaW5wdXRbbmFtZT1saXN0SWRdJykudmFsKGdldFNlbGVjdGVkTGlzdCgpLmlkKVxuXG4gICAgICB0aXRsZXMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgJChgI2ltYWdlLXRpdGxlLSR7ZWxlbWVudC5sYW5ndWFnZUNvZGUudG9Mb3dlckNhc2UoKX1gKS52YWwoZWxlbWVudC52YWx1ZSlcbiAgICAgIH0pXG5cbiAgICAgIGFsdFRpdGxlcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAkKGAjaW1hZ2UtYWx0LSR7ZWxlbWVudC5sYW5ndWFnZUNvZGUudG9Mb3dlckNhc2UoKX1gKS52YWwoZWxlbWVudC52YWx1ZSlcbiAgICAgIH0pXG5cbiAgICAgICRlZGl0TW9kYWwuZmFkZUluKCgpID0+IGZvY3VzRmlyc3RJbnB1dFRleHQoJGVkaXRNb2RhbCkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlciBmb3Igb3BlbiB0aGUgRWRpdCBpbWFnZSBtb2RhbCBidXR0b25cbiAgICAgKi9cbiAgICBjb25zdCBoYW5kbGVFZGl0Q29sbGVjdGlvbk1vZGFsID0gKCkgPT4ge1xuICAgICAgJGVkaXRDb2xsZWN0aW9uTW9kYWwuZmluZCgnaW5wdXRbbmFtZT1uYW1lXScpLnZhbChnZXRTZWxlY3RlZExpc3QoKS5uYW1lKVxuICAgICAgJGVkaXRDb2xsZWN0aW9uTW9kYWwuZmluZCgnaW5wdXRbbmFtZT1pZF0nKS52YWwoZ2V0U2VsZWN0ZWRMaXN0KCkuaWQpXG4gICAgICAvLyBBamF4IHJlcXVlc3RcbiAgICAgICRlZGl0Q29sbGVjdGlvbk1vZGFsLmZhZGVJbigoKSA9PiBmb2N1c0ZpcnN0SW5wdXRUZXh0KCRlZGl0Q29sbGVjdGlvbk1vZGFsKSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGltYWdlIGxpc3Qgb24gY2hhbmdlIGV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAgICovXG4gICAgY29uc3QgaGFuZGxlT25DaGFuZ2VJbWFnZUNvbGxlY3Rpb24gPSBhc3luYyB2YWwgPT4ge1xuICAgICAgbG9hZGluZyh0cnVlKVxuXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIXZhbCkge1xuICAgICAgICAgIGRpc2FibGVJbWFnZVNlbGVjdGlvbigpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBlbmFibGVJbWFnZVNlbGVjdGlvbigpXG4gICAgICAgIHJlc2V0SW1hZ2VzV3JhcHBlcigpXG4gICAgICAgIGF3YWl0IGxvYWRJbWFnZXNDb2xsZWN0aW9uKHZhbClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdG9hc3RFcnJvcihlLm1lc3NhZ2UpXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBsb2FkaW5nKGZhbHNlKVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGZvY3VzRmlyc3RJbnB1dFRleHQgPSAkZWxlbWVudCA9PiB7XG4gICAgICAkZWxlbWVudC5maW5kKCdpbnB1dFt0eXBlPXRleHRdOmZpcnN0JykuZm9jdXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIHRoZSBzaW5nbGUgaW1hZ2Ugd3JhcHBlclxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGNvbnN0IGltYWdlQmxvY2tUZW1wbGF0ZSA9IGRhdGEgPT4ge1xuICAgICAgY29uc3QgeyBzcmMgPSAnLy9wbGFjZWhvbGQuaXQvMTAweDEwMCcsIGlkIH0gPSBkYXRhLFxuICAgICAgICAgICAgbWFpbkltYWdlVGV4dCA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdNQUlOX0lNQUdFX0xBQkVMJywgJ3Byb2R1Y3RfaW1hZ2VfbGlzdHMnKVxuXG4gICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJjb2xsZWN0aW9uLWltYWdlLXdyYXBwZXJcIiBkYXRhLWxpc3QtZWxlbWVudC1pZD1cIiR7aWR9XCI+XFxuYCArXG4gICAgICAgICcgICAgPGRpdiBjbGFzcz1cImFjdGlvbnNcIj5cXG4nICtcbiAgICAgICAgJyAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgbW92ZS1pbWFnZSBzb3J0LWhhbmRsZVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj5cXG4nICtcbiAgICAgICAgJyAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtYXJyb3dzXCI+PC9pPlxcbicgK1xuICAgICAgICAnICAgICAgICA8L2E+XFxuJyArXG4gICAgICAgICcgICAgICAgIDxhIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGVkaXQtaW1hZ2VcIiBocmVmPVwiamF2YXNjcmlwdDo7XCI+XFxuJyArXG4gICAgICAgICcgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXBlbmNpbFwiPjwvaT5cXG4nICtcbiAgICAgICAgJyAgICAgICAgPC9hPlxcbicgK1xuICAgICAgICAnICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGRlbGV0ZS1pbWFnZVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj5cXG4nICtcbiAgICAgICAgJyAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L2k+XFxuJyArXG4gICAgICAgICcgICAgICAgIDwvYT5cXG4nICtcbiAgICAgICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgYCAgICA8c3BhbiBjbGFzcz1cIm1haW4taW1hZ2VcIj4ke21haW5JbWFnZVRleHR9PC9zcGFuPlxcbmAgK1xuICAgICAgICBgICAgIDxpbWcgYWx0PVwiYWx0IGltZ1wiIGNsYXNzPVwiY29sbGVjdGlvbi1pbWFnZVwiIHNyYz1cIiR7c3JjfVwiPlxcbmAgK1xuICAgICAgICAnPC9kaXY+J1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHNlbGVjdGVkIGNvbGxlY3Rpb24gbGlzdFxuICAgICAqXG4gICAgICogQHJldHVybnMge3tuYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmd9fVxuICAgICAqL1xuICAgIGNvbnN0IGdldFNlbGVjdGVkTGlzdCA9ICgpID0+IHtcbiAgICAgIGNvbnN0ICRzZWxlY3RlZE9wdGlvbiA9ICQoJyNjb21iaV9pbWFnZV9jb2xsZWN0aW9uIG9wdGlvbjpzZWxlY3RlZCcpXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogJHNlbGVjdGVkT3B0aW9uLnZhbCgpLFxuICAgICAgICBuYW1lOiAkc2VsZWN0ZWRPcHRpb24uaHRtbCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmluZCBldmVudHNcbiAgICAgKi9cbiAgICBjb25zdCBhZGRFdmVudExpc3RlbmVycyA9ICgpID0+IHtcbiAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lcnNcbiAgICAgIGFkZFJlc3BvbnNpdmVGaWxlTWFuYWdlckV2ZW50TGlzdGVuZXIoKVxuXG4gICAgICBjcmVhdGVOZXdDb2xsZWN0aW9uQnV0dG9uRXZlbnRMaXN0ZW5lcigpXG4gICAgICBzZWxlY3RDb2xsZWN0aW9uQnV0dG9uRXZlbnRMaXN0ZW5lcigpXG4gICAgICBjbG9zZUVkaXRNb2RhbEJ1dHRvbkV2ZW50TGlzdGVuZXIoKVxuICAgICAgb3BlbkVkaXRJbWFnZU1vZGFsRXZlbnRMaXN0ZW5lcigpXG4gICAgICBkZWxldGVJbWFnZUJ1dHRvbkV2ZW50TGlzdGVuZXIoKVxuICAgICAgaW1hZ2VDb2xsZWN0aW9uT25DaGFuZ2VFdmVudExpc3RlbmVyKClcbiAgICAgIGFkZEltYWdlQnV0dG9uRXZlbnRMaXN0ZW5lcigpXG5cbiAgICAgIGNyZWF0ZUNvbGxlY3Rpb25CdXR0b25FdmVudExpc3RlbmVyKClcbiAgICAgIGRlbGV0ZUNvbGxlY3Rpb25CdXR0b25FdmVudExpc3RlbmVyKClcblxuICAgICAgLy8gTW9kYWwgZXZlbnRzXG4gICAgICBwcmV2ZW50U3VibWl0Rm9ybU1vZGFscygpXG4gICAgICBzYXZlRWRpdE1vZGFsRXZlbnRMaXN0ZW5lcigpXG4gICAgICBjYW5jZWxFZGl0TW9kYWxFdmVudExpc3RlbmVyKClcblxuICAgICAgY2xvc2VFZGl0Q29sbGVjdGlvbk1vZGFsQnV0dG9uRXZlbnRMaXN0ZW5lcigpXG4gICAgICBvcGVuRWRpdENvbGxlY3Rpb25Nb2RhbEV2ZW50TGlzdGVuZXIoKVxuICAgICAgY2FuY2VsRWRpdENvbGxlY3Rpb25Nb2RhbEJ1dHRvbkV2ZW50TGlzdGVuZXIoKVxuICAgICAgdXBkYXRlRWRpdENvbGxlY3Rpb25Nb2RhbEJ1dHRvbkV2ZW50TGlzdGVuZXIoKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRvYXN0IFwicGx1Z2luXCJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKi9cbiAgICBjb25zdCB0b2FzdCA9IChtZXNzYWdlLCB0eXBlKSA9PiB7XG4gICAgICBjb25zdCBjbGFzc05hbWUgPSBgc3RhdHVzLSR7dHlwZX1gXG5cbiAgICAgICR0b2FzdE1lc3NhZ2VcbiAgICAgICAgLmh0bWwobWVzc2FnZSlcbiAgICAgICAgLnJlbW92ZUNsYXNzKChpbmRleCwgY2xhc3NOYW1lKSA9PiAoY2xhc3NOYW1lLm1hdGNoKC8oXnxcXHMpc3RhdHVzLVxcUysvZykgfHwgW10pLmpvaW4oJyAnKSlcbiAgICAgICAgLmFkZENsYXNzKGNsYXNzTmFtZSlcbiAgICAgICAgLnN0b3AoKVxuICAgICAgICAuZmFkZUluKClcblxuICAgICAgY2xlYXJUaW1lb3V0KHRvYXN0VGltZW91dElEKVxuXG4gICAgICB0b2FzdFRpbWVvdXRJRCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAkdG9hc3RNZXNzYWdlLmZhZGVPdXQoKCkgPT4ge1xuICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKVxuICAgICAgICB9KVxuICAgICAgfSwgMzAwMClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93cyBzdWNjZXNzIHRvYXN0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAqL1xuICAgIGNvbnN0IHRvYXN0U3VjY2VzcyA9IG1lc3NhZ2UgPT4gdG9hc3QobWVzc2FnZSwgJ3N1Y2Nlc3MnKVxuXG4gICAgLyoqXG4gICAgICogU2hvd3MgZXJyb3IgdG9hc3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICovXG4gICAgY29uc3QgdG9hc3RFcnJvciA9IG1lc3NhZ2UgPT4gdG9hc3QobWVzc2FnZSwgJ2Vycm9yJylcblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgbG9hZGluZyBzcGlubmVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaXNMb2FkaW5nXG4gICAgICovXG4gICAgY29uc3QgbG9hZGluZyA9IGlzTG9hZGluZyA9PiB7XG4gICAgICBpZiAoaXNMb2FkaW5nKSB7XG4gICAgICAgIGxvYWRpbmdTcGlubmVyID0ganNlLmxpYnMubG9hZGluZ19zcGlubmVyLnNob3coJCgnI3Byb2R1Y3QtaW1hZ2UtbGlzdC13cmFwcGVyJyksIDk5OTkpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuaGlkZShsb2FkaW5nU3Bpbm5lcilcbiAgICAgIGxvYWRpbmdTcGlubmVyID0gbnVsbFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgdGhlIG1vZHVsZVxuICAgICAqXG4gICAgICogQHBhcmFtIGRvbmVcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cbiAgICBtb2R1bGUuaW5pdCA9IGFzeW5jIChkb25lKSA9PiB7XG4gICAgICBhZGRFdmVudExpc3RlbmVycygpXG5cbiAgICAgICRzb3J0YWJsZUxpc3RcbiAgICAgICAgLnNvcnRhYmxlKHNvcnRhYmxlT3B0aW9ucylcbiAgICAgICAgLm9uKCdzb3J0dXBkYXRlJywgaGFuZGxlT25Tb3J0VXBkYXRlKVxuICAgICAgICAuZGlzYWJsZVNlbGVjdGlvbigpXG5cbiAgICAgIGxvYWRpbmcodHJ1ZSlcblxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gR2V0IGltYWdlIGNvbGxlY3Rpb25zIGxpc3RcbiAgICAgICAgYXdhaXQgbG9hZENvbGxlY3Rpb25zKGluaXRpYWxTZWxlY3RlZExpc3QpXG5cbiAgICAgICAgLy8gR2V0IGltYWdlcyByZWxhdGVkIHdpdGggdGhlIGN1cnJlbnQgY29sbGVjdGlvblxuICAgICAgICBsZXQgc2VsZWN0ZWRWYWx1ZSA9IGluaXRpYWxTZWxlY3RlZExpc3QgP1xuICAgICAgICAgIGluaXRpYWxTZWxlY3RlZExpc3QgOlxuICAgICAgICAgICQoJ3NlbGVjdCNjb21iaV9pbWFnZV9jb2xsZWN0aW9uIG9wdGlvbjpzZWxlY3RlZCcpLnZhbCgpXG5cbiAgICAgICAgc2VsZWN0ZWRWYWx1ZSA9IHBhcnNlSW50KHNlbGVjdGVkVmFsdWUpXG5cbiAgICAgICAgaWYgKCFpc05hTihzZWxlY3RlZFZhbHVlKSAmJiBzZWxlY3RlZFZhbHVlID4gMCkge1xuICAgICAgICAgIGF3YWl0IGxvYWRJbWFnZXNDb2xsZWN0aW9uKHNlbGVjdGVkVmFsdWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGlzYWJsZUltYWdlU2VsZWN0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0b2FzdEVycm9yKGUubWVzc2FnZSlcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGxvYWRpbmcoZmFsc2UpXG4gICAgICAgIGRvbmUoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb2R1bGVcbiAgfVxuKSJdfQ==
