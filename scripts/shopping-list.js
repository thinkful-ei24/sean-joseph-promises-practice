/* global store, api */

// eslint-disable-next-line no-unused-vars
const shoppingList = (function(){

  function generateError(err) {
    let message = '';
    if (err.responseJSON && err.responseJSON.message) {
      message = err.responseJSON.message;
    } else {
      message = `${err.code} Server Error`;
    }

    return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
  }

  function generateItemElement(item) {
    let itemTitle = `<span class="shopping-item shopping-item__checked">${item.name}</span>`;
    if (!item.checked) {
      itemTitle = `
        <form class="js-edit-item">
          <input class="shopping-item type="text" value="${item.name}" />
        </form>
      `;
    }
  
    return `
      <li class="js-item-element" data-item-id="${item.id}">
        ${itemTitle}
        <div class="shopping-item-controls">
          <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
          </button>
        </div>
      </li>`;
  }
  
  
  function generateShoppingItemsString(shoppingList) {
    const items = shoppingList.map((item) => generateItemElement(item));
    return items.join('');
  }
  
  
  function render() {
    if (store.error) {
      const el = generateError(store.error);
      $('.error-container').html(el);
    } else {
      $('.error-container').empty();
    }

    // Filter item list if store prop is true by item.checked === false
    let items = store.items;
    if (store.hideCheckedItems) {
      items = store.items.filter(item => !item.checked);
    }
  
    // Filter item list if store prop `searchTerm` is not empty
    if (store.searchTerm) {
      items = store.items.filter(item => item.name.includes(store.searchTerm));
    }
  
    // render the shopping list in the DOM
    console.log('`render` ran');
    const shoppingListItemsString = generateShoppingItemsString(items);
  
    // insert that HTML into the DOM
    $('.js-shopping-list').html(shoppingListItemsString);
  }
  
  
  function handleNewItemSubmit() {
    $('#js-shopping-list-form').submit(function (event) {
      event.preventDefault();
      const newItemName = $('.js-shopping-list-entry').val();
      $('.js-shopping-list-entry').val('');
      api.createItem(newItemName)
        .then((newItem) => {
          store.addItem(newItem);
          render();
        })
        .catch(
          (err) => {
            store.setError(err);
            render();
          });
    
    });
  }
  
  function getItemIdFromElement(item) {
    return $(item)
      .closest('.js-item-element')
      .data('item-id');
  }
  
  function handleItemCheckClicked() {
    $('.js-shopping-list').on('click', '.js-item-toggle', event => {
      const id = getItemIdFromElement(event.currentTarget);
      const item = store.findById(id);
      api.updateItem(id, { checked: !item.checked })
        .then(() => {
          store.findAndUpdate(id, { checked: !item.checked });
          render();
        })
        .catch((err) => {
          console.log('error hit');
          console.log(err.responseJSON.message);
          store.setError(err);
          render();
        });
    });
  }
  
  function handleDeleteItemClicked() {
    $('.js-shopping-list').on('click', '.js-item-delete', event => {
      const id = getItemIdFromElement(event.currentTarget);

      api.deleteItem(id)
        .then( () => {
          store.findAndDelete(id);
          render();
        })
        .catch( (e) => {
          store.setError(e);
          console.log(e);
          render();
        });
    });
  }


  
  function handleEditShoppingItemSubmit() {
    $('.js-shopping-list').on('submit', '.js-edit-item', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      const itemName = $(event.currentTarget).find('.shopping-item').val();
      api.updateItem(id, { name: itemName })
        .then(() => {
          store.findAndUpdate(id, { name: itemName });
          render();
        })
        .catch((err) => {
          store.setError(err);
          render();
        });
    });
  }
  
  function handleToggleFilterClick() {
    $('.js-filter-checked').click(() => {
      store.toggleCheckedFilter();
      render();
    });
  }
  
  function handleShoppingListSearch() {
    $('.js-shopping-list-search-entry').on('keyup', event => {
      const val = $(event.currentTarget).val();
      store.setSearchTerm(val);
      render();
    });
  }

  function handleCloseError() {
    $('.error-container').on('click', '#cancel-error', () => {
      store.setError(null);
      render();
    });
  }
  
  function bindEventListeners() {
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleEditShoppingItemSubmit();
    handleToggleFilterClick();
    handleShoppingListSearch();
    handleCloseError();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());
