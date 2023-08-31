'use strict';
var Category = function (category, dataList) {
  this.text = ko.observable(category.text);
  this.id = ko.observable(category.id);
  this.dataList = ko.observable(dataList);
  this.catIsOpen = ko.observable(false);
  this.switchVisibility = () => {
    this.catIsOpen(!this.catIsOpen());
  };
};

var ItemModel = function () {
  var self = this;
  self.mouseDragging = false;
  var elementList = [
    { id: 4, text: 'ИНН', categoryId: 1 },
    { id: 5, text: 'Паспорт', categoryId: 1 },
    { id: 6, text: 'ИНН', categoryId: 1 },
    { id: 6, text: 'Трудовая книжка', categoryId: 2 },
    { id: 6, text: 'Диплом о высшем образовании', categoryId: 3 },
  ];

  var categoryList = [
    { id: 1, text: 'Обязательные для всех' },
    { id: 2, text: 'Обязательные для трудоустройства' },
    { id: 3, text: 'Специальные' },
    { id: 4, text: 'Категория 4' },
    { id: 5, text: 'Категория 5' },
    { id: 6, text: 'Категория 6' },
  ];
  self.dragEnabled = ko.observable();
  self.dragCategoryId = ko.observable();
  self.overedCategoryId = ko.observable();
  self.drag_start_index = ko.observable();
  self.drag_target_index = ko.observable();
  self.dragging = ko.computed(function () {
    return self.drag_start_index() >= 0;
  });
  let categories = categoryList.map((cat) => {
    let dataList =
      elementList.filter((elem) => elem.categoryId === cat.id) || [];
    return new Category(cat, dataList);
  });
  self.items = ko.observableArray(categories);

  var getParentDraggable = function (event) {
    let target = null;
    if (event.target) {
      target = event.target.closest('.dropzone');
    }
    return target;
  };
  var getTarget = function (event) {
    return event.target.classList.contains('dropzone')
      ? event.target
      : getParentDraggable(event);
  };
  self.ondragstart = function (data, event) {
    let image = event.target;
    event.dataTransfer.setDragImage(image, 100, 22);
    self.dragCategoryId(data.id());
    return self.dragEnabled();
  };
  self.ondragenter = function (data) {
    if (self.dragEnabled()) {
      self.overedCategoryId(data.id());
    }
  };

  self.ondragend = function (data, event) {
    self.dragEnabled(false);
    if (self.overedCategoryId() == self.dragCategoryId()) {
      self.dragCategoryId(0);

      self.disableDrag();
      return;
    }
    let dragItem = ko.utils.arrayFirst(self.items(), (item) => {
      return item.id() == self.dragCategoryId();
    });

    self.items.remove(dragItem);

    setTimeout(() => {
      let targetItemIndex = self.items().findIndex((item) => {
        return item.id() == self.overedCategoryId();
      });
      self.items.splice(targetItemIndex + 1, 0, dragItem);

      setTimeout(() => {
        self.dragCategoryId(0);

        self.disableDrag();
      }, 100);
    }, 100);
  };
  self.onhoverdragbtn = function () {
    if (self.dragEnabled() == false) {
      self.dragEnabled(true);
    }
  };
  self.disableDrag = function () {
    if (self.dragCategoryId() > 0) {
      return;
    }
    self.overedCategoryId(0);
    self.dragEnabled(false);
  };
};
ko.applyBindings(new ItemModel());
