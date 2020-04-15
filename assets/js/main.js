// Options
var options = [
  'fillColor',
  'fillOpacity',
  'strokeColor',
  'strokeOpacity',
  'strokeWidth',
  'states'
]

// Defaults
var map;
var isMapLoadedId;
var fillColor = 'dadada';
var fillSelected = 'ff0000';
var fillOpacity = '1';
var strokeColor = '333333';
var strokeOpacity = '1';
var strokeWidth = '100';

var selects = [];

function hasAnyProperty(select) {
  for (option of options) {
    if (select.hasOwnProperty(option)) return true;
  }
  return false;
}

function organizeSelects() {
  for (parameter of new URLSearchParams(window.location.search)) {
    var selectKey = parameter[0];
    var selectFullValue = parameter[1];

    if (selectKey !== 'select') break;
    
    var selectValues = selectFullValue.split(';');
    
    var select = {};
    for (selectValue of selectValues) {
      var key = selectValue.split('=')[0];
      var value = selectValue.split('=')[1];

      if (value && options.includes(key)) {
        if (key === 'states') {
          select.states = value.split(',');
        } else {
          select[key] = value;
        }
      } else {
        selects.push({ states: [key] });
      }
    }

    if (hasAnyProperty(select)) {
      selects.push(select);
    }
  }
}

function selectOnMap() {
  for (path of map.getElementsByTagName('path')) {
    var selectedPath = selects.find(select => select.states && select.states.includes(path.id));

    path.style.fill = selectedPath ? (selectedPath.fillColor || fillSelected ) : fillColor;
    path.style.fillOpacity = selectedPath ? selectedPath.fillOpacity : fillOpacity || fillOpacity;
    path.style.stroke = selectedPath ? selectedPath.strokeColor : strokeColor || strokeColor;
    path.style.strokeOpacity = selectedPath ? selectedPath.strokeOpacity : strokeOpacity || strokeOpacity;
    path.style.strokeWidth = selectedPath ? selectedPath.strokeWidth : strokeWidth || strokeWidth;
  }
}

function loadMap() {
  isMapLoadedId = setInterval(function() {
    map = document.querySelector('#map').contentDocument.querySelector('svg');
    if (map) {
      clearInterval(isMapLoadedId);
      selectOnMap();
    } 
  }, 400);
}

function printMap() {
  organizeSelects();
  loadMap();
}

printMap();