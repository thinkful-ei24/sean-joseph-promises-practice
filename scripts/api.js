
/* global $ */

const api = (function(){
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/sean-joseph';

  const getItems = function() {
    return $.getJSON(BASE_URL + '/items');
  };

  const createItem = function(name) {
    const newItem = JSON.stringify({ name });
    return $.ajax({
      url: BASE_URL + '/items',
      method: 'POST',
      contentType: 'application/json',
      data: newItem
    });
  };

  const updateItem = function(id, updateData) {
    return $.ajax({
      url: BASE_URL + '/items/' + id,
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify(updateData),
    });
  };

  const deleteItem = function(id) {
    return $.ajax({
      url: BASE_URL + '/items/' + id,
      method: 'DELETE',
    });
  };

  return {
    getItems,
    createItem,
    updateItem,
    deleteItem,
  };
}());