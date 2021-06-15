var page_count;
var resetButton, addButton;
var pagesInputField = [];
var selectedOpts;
var number_of_frames;
var validation = true;
var algoName;

var toastElList = [].slice.call(document.querySelectorAll('.toast'))
var toastList = toastElList.map(function(toastEl) {
  return new bootstrap.Toast(toastEl, toastOption)
})

var toastOption = {
  animation: true,
  delay: 2000
}

function see() {
  for (let i = 0; i < toastList.length; i++) {
    toastList[i].hide();
  }
  if (validation == false)
    toastList[0].show();
  else
    toastList[1].show();
}

function checkIfArrayIsUnique(myArray) {
  return myArray.length === new Set(myArray).size;
}

function addData() {
  removeData(); //Reset everything
  let pagesInputField = document.getElementsByName('page-input');
  let pageValues = [];
  let pageValuesContainer = [];
  validation = true;

  for (let i = 0; i < page_count; i++) {
    if (pagesInputField[i].value == "") {
      validation = false;
      see();
      break;
    }
    pageValues.push(pagesInputField[i].value);
  }

  if (number_of_frames == undefined) {
    validation = false;
    see();
  }

  if (validation == true) {
    createTable();

    var table = document.getElementById("main-table");
    for (let i = 0; i < number_of_frames; i++) {
      var row = table.insertRow(0);
      for (let j = 0; j < page_count; j++) {
        var cell1 = row.insertCell(0);
      }
    }

    var tableString = document.getElementById("table-string");
    var row = tableString.insertRow(0);
    for (let j = 0; j < page_count; j++) {
      var cell1 = row.insertCell(0);
    }

    var tableFault = document.getElementById("table-fault");
    var row = tableFault.insertRow(0);
    for (let j = 0; j < page_count; j++) {
      var cell1 = row.insertCell(0);
    }

    let temp = [];
    let memory = [];
    let time = [];
    let faults = new Array(page_count);
    let page_found = 0;
    let flag1;
    let flag2;
    let flag3;
    let pos = 0;
    let max = 0;
    let min = 0;
    let fault_count = 0;
    let hit_count = 0;
    let counter = 0;

    if (selectedOpts == "lru") {
      //main algorithm
      algoName = "Least Recently Used";
      for (let i = 0; i < page_count; ++i) {
        flag1 = flag2 = false;

        for (let j = 0; j < number_of_frames; ++j) {
          if (memory[j] == pageValues[i]) {
            faults[i] = "HIT";
            hit_count++;
            counter++;
            time[j] = counter;
            flag1 = flag2 = true;
            break;
          }
        }

        if (!flag1) {
          for (let j = 0; j < number_of_frames; ++j) {
            if (memory[j] == undefined) {
              counter++;
              faults[i] = "MISS";
              fault_count++;
              memory[j] = pageValues[i];
              time[j] = counter;
              flag2 = true;
              break;
            }
          }
        }

        if (!flag2) {
          min = time[0];
          pos = 0;
          for (let k = 1; k < number_of_frames; ++k) {
            if (time[k] < min) {
              min = time[k];
              pos = k;
            }
          }
          counter++;
          faults[i] = "MISS";
          fault_count++;
          memory[pos] = pageValues[i];
          time[pos] = counter;
        }

        // Print the current Memory snap
        for (let j = 0; j < memory.length; j++) {
          document.getElementById("main-table").rows[j].cells[i].innerHTML = memory[j];
        }
      }

    } else if (selectedOpts == "optimal") {
      algoName = "Optimal Page Replacement";
      for (i = 0; i < pageValues.length; i++) {
        flag1 = flag2 = false;
        let page_found = 0;
        for (j = 0; j < number_of_frames; j++) {
          if (memory[j] == pageValues[i]) {
            flag1 = flag2 = true;
            faults[i] = "HIT";
            hit_count++;
            break;
          }
        }
        if (!flag1) {
          for (j = 0; j < number_of_frames; j++) {
            if (memory[j] == undefined) {
              faults[i] = "MISS";
              fault_count++;
              memory[j] = pageValues[i];
              flag2 = 1;
              break;
            }
          }
        }
        if (!flag2) {
          flag3 = false;
          for (j = 0; j < number_of_frames; j++) {
            temp[j] = undefined;

            for (k = i + 1; k < pageValues.length; k++) {
              if (memory[j] == pageValues[k]) {
                temp[j] = k;
                break;
              }
            }
          }
          for (j = 0; j < number_of_frames; j++) {
            if (temp[j] == undefined) {
              pos = j;
              flag3 = true;
              break;
            }
          }

          if (!flag3) {
            max = temp[0];
            pos = 0;

            for (j = 1; j < number_of_frames; j++) {
              if (temp[j] > max) {
                max = temp[j];
                pos = j;
              }
            }
          }
          memory[pos] = pageValues[i];
          faults[i] = "MISS";
          fault_count++;
        }
        for (let j = 0; j < memory.length; j++) {
          document.getElementById("main-table").rows[j].cells[i].innerHTML = memory[j];
        }
      }
    }

    document.getElementById("algo-label").innerHTML = "Algorithm: " + algoName;
    document.getElementById("fault-label").innerHTML = "Total Page Faults: " + fault_count;
    document.getElementById("hit-label").innerHTML = "Total Page Hits: " + hit_count;
    let h_percentage = (hit_count / page_count) * 100;
    let f_percentage = (fault_count / page_count) * 100;
    document.getElementById("fault-ratio-label").innerHTML = "Page Fault Ratio: " + fault_count + ":" + page_count + " (" + f_percentage.toFixed(2) + "%)";
    document.getElementById("hit-ratio-label").innerHTML = "Page Hit Ratio: " + hit_count + ":" + page_count + " (" + h_percentage.toFixed(2) + "%)";

    for (let j = 0; j < pageValues.length; j++) {
      document.getElementById("table-string").rows[0].cells[j].innerHTML = pageValues[j];
    }
    for (let j = 0; j < pageValues.length; j++) {
      document.getElementById("table-fault").rows[0].cells[j].innerHTML = faults[j];
    }
    document.getElementById("table-section").scrollIntoView();
  }
}

function createTable() {
  var tableSection = document.createElement("section");
  tableSection.setAttribute("id", "table-section");
  tableSection.setAttribute("class", "container");
  document.body.appendChild(tableSection);

  let tableSec = document.getElementById("table-section");

  var tableDiv = document.createElement("div");
  tableDiv.setAttribute("id", "table-container");
  tableDiv.setAttribute("class", "jumbotron");
  tableSec.appendChild(tableDiv);

  let tableContainer = document.getElementById("table-container");

  var labelContainers = document.createElement("div");
  labelContainers.setAttribute("id", "lbl-container");
  tableContainer.appendChild(labelContainers);

  var tableString = document.createElement("TABLE");
  tableString.setAttribute("id", "table-string");
  tableString.setAttribute("align", "center");
  tableString.setAttribute("width", "80%");
  tableContainer.appendChild(tableString);

  var table = document.createElement("TABLE");
  table.setAttribute("id", "main-table");
  table.setAttribute("align", "center");
  table.setAttribute("width", "80%");
  tableContainer.appendChild(table);

  var tableFault = document.createElement("TABLE");
  tableFault.setAttribute("id", "table-fault");
  tableFault.setAttribute("align", "center");
  tableFault.setAttribute("width", "80%");
  tableContainer.appendChild(tableFault);

  var div_f = document.createElement("div");
  div_f.setAttribute("id", "cont1");
  labelContainers.appendChild(div_f);

  var div_s = document.createElement("div");
  div_s.setAttribute("id", "cont2");
  tableContainer.appendChild(div_s);

  var label = document.createElement("h6");
  label.setAttribute("id", "algo-label");
  div_f.appendChild(label);

  var faultsContainer = document.createElement("div");
  faultsContainer.setAttribute("id", "faults-container");
  div_s.appendChild(faultsContainer);

  var hitContainer = document.createElement("div");
  hitContainer.setAttribute("id", "hit-container");
  div_s.appendChild(hitContainer);

  var label = document.createElement("h6");
  label.setAttribute("id", "fault-label");
  faultsContainer.appendChild(label);

  var label = document.createElement("h6");
  label.setAttribute("id", "hit-label");
  hitContainer.appendChild(label);

  var label = document.createElement("h6");
  label.setAttribute("id", "fault-ratio-label");
  faultsContainer.appendChild(label);

  var label = document.createElement("h6");
  label.setAttribute("id", "hit-ratio-label");
  hitContainer.appendChild(label);
}

function removeData() {
  let table = document.getElementById('main-table');
  if (table != null) { //tanggalin kung present sa website yung table output.
    $("#table-section").remove();
  }
}

function resetData() {
  var pagesInputField = document.getElementsByName('page-input');
  for (let i = 0; i < pagesInputField.length; i++) {
    pagesInputField[i].value = "";
  }
  removeData();
  $('#exampleModal').modal('hide');
}

function clearInput(pagesInputField) {
  pagesInputField.value = "";
}

function lengthInput(pageInputField) {
  if (pageInputField.value.length > pageInputField.maxLength)
    pageInputField.value = pageInputField.value.slice(0, pageInputField.maxLength);
}

function numPages(opts) {
  selectedOpts = opts.value;
  var numPagesCheck = document.getElementsByName('pages');
  var framesCheck = document.getElementsByName('frames');
  var pagesInputField = document.getElementsByName('page-input');
  addButton.disabled = false;
  resetButton.disabled = false;

  if (numPagesCheck[0].disabled == true) {
    numPagesCheck[0].checked = true;
  }

  if (framesCheck[0].disabled == true) {
    framesCheck[0].checked = true;
  }

  switch (selectedOpts) {
    case "lru":
    case "optimal":
      for (let i = 0; i < pagesInputField.length; i++) {
        pagesInputField[i].disabled = false;
      }
      for (i = 0; i < numPagesCheck.length; i++) {
        numPagesCheck[i].disabled = false;
      }
      for (i = 0; i < framesCheck.length; i++) {
        framesCheck[i].disabled = false;
      }
      break;
  }
}

function page_controller(page_handler) {
  page_count = parseInt(page_handler.value);
  var textFields = document.getElementsByName('page-input');
  switch (page_count) {
    case 6:
      textFields[6].style.display = "none";
      textFields[7].style.display = "none";
      textFields[8].style.display = "none";
      textFields[9].style.display = "none";
      break;
    case 7:
      textFields[6].style.display = "inline";
      textFields[7].style.display = "none";
      textFields[8].style.display = "none";
      textFields[9].style.display = "none";
      break;
    case 8:
      textFields[6].style.display = "inline";
      textFields[7].style.display = "inline";
      textFields[8].style.display = "none";
      textFields[9].style.display = "none";
      break;
    case 9:
      textFields[6].style.display = "inline";
      textFields[7].style.display = "inline";
      textFields[8].style.display = "inline";
      textFields[9].style.display = "none";
      break;

    default:
      textFields[6].style.display = "inline";
      textFields[7].style.display = "inline";
      textFields[8].style.display = "inline";
      textFields[9].style.display = "inline";
  }
}

function frame_controller(opts) {
  number_of_frames = parseInt(opts.value);
}

function start_body() {
  resetButton = document.getElementById('resetButton');
  addButton = document.getElementById('addButton');
  addButton.disabled = true;
  resetButton.disabled = true;
  var textFields = document.getElementsByName('page-input');
  page_count = 6;
  number_of_frames = 4;
  textFields[6].style.display = "none";
  textFields[7].style.display = "none";
  textFields[8].style.display = "none";
  textFields[9].style.display = "none";
}

function getValue() {
  for (i = 0; i < pages; i++) {
    for (j = 0; j < frames; j++) {
      tmpPages = document.getElementById("main-table").rows[j].getElementsByTagName('frames').cells[i].getElementsByTagName('page-input')[0].value;
      if (j == frames) {
        tmpPageFault = document.getElementById("main-table").rows[j].getElementByTageName('pageFault').value;
      }
    }
  }
}
