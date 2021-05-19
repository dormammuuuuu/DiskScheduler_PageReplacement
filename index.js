var ctx = document.getElementById('lineChart');
var addNum;
var addLabel = "edi wow";
var track_count;
var resetButton, addButton;
var tracksInputField = [];
var direction;
var selectedOpts;

var data = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
     {
       label: "",
       fill: false,
       lineTension: 0.1,
       backgroundColor: "rgba(75, 192, 192, 0.4)",
       borderColor: "rgba(88,166,255, 1)",
       borderCapStyle: 'butt',
       borderDash: [],
       borderDashOffset: 0.0,
       borderJoinStyle: 'miter',
       pointBorderColor: "rgba(75,192,192,1)",
       pointBackgroundColor: "#fff",
       pointBorderWidth: 1,
       pointHoverRadius: 5,
       pointHitRadius: 10,
       data: [],
     }
  ]},
  options: {
    indexAxis: 'y',
    offset: true,
    scales: {
      x : {
        suggestedMin: 0,
        suggestedMax: 199,
        ticks: {
          count: 2,
          stepSize: 1,
          maxTicksLimit: 200
        }
      }
    }
  }
});

function addData(){
  let tracksInputField = document.getElementsByName('track-input');
  let trackValues = [];
  let headValue;
  removeData();

  for (let i = 0; i <= track_count; i++){
    trackValues.push(parseInt(tracksInputField[i].value));
  }

  if(selectedOpts == 'look'){
    headValue = trackValues.shift();
    trackValues.sort((a, b) => b - a); // For descending sort
    var lowerThanHead = [];
    var higherThanHead = [];
    for (let i = 0; i < trackValues.length; i++){
      if (trackValues[i] < headValue)
        lowerThanHead.push(trackValues[i]);
      else
        higherThanHead.push(trackValues[i]);

      lowerThanHead.sort((a, b) => a - b); // For ascending sort
      higherThanHead.sort((a, b) => b - a); // For descending sort
    }
    trackValues.length = 0;
    if (direction == 't_low'){
      while (lowerThanHead.length != 0){
        trackValues.push(lowerThanHead.pop());
      }
      while (higherThanHead.length != 0){
        trackValues.push(higherThanHead.pop());
      }
    } else if (direction == 't_high') {
      while (higherThanHead.length != 0){
        trackValues.push(higherThanHead.pop());
      }
      while (lowerThanHead.length != 0){
        trackValues.push(lowerThanHead.pop());
      }
    }
    trackValues.unshift(headValue);
  } else {
    headValue = trackValues.shift();
    trackValues.sort((a, b) => a - b); // For descending sort
    trackValues.unshift(headValue);
    let sstfSet = [];
    let previous = headValue;
    let previousIndex;
    let lowest = 0;
    let temp;
    let i = 0;
    let index;

    while (trackValues.length != 0){
      for (let j = 0; j < trackValues.length; j++){
        temp = Math.abs(trackValues[0] - trackValues[j+1]);
        if (lowest == 0 || lowest > temp){
          index = j;
          lowest = temp;
          previous = trackValues[j];
        }
      }

      sstfSet.push(previous);
      trackValues = trackValues.filter(function(item) {
        return item != previous;
      })
      lowest = 0;
    }
    alert(headValue);
    sstfSet = sstfSet.filter(function(item) {
      return item != headValue;
    })
    sstfSet.unshift(headValue)
    alert(sstfSet);
    sstfSet.reverse();
    while (sstfSet.length != 0){
      trackValues.push(sstfSet.pop());
    }

  }

  for (let i = 0; i <= track_count; i++){
    data.data.labels.push(trackValues[i]);
    data.data.datasets.forEach((dataset) => {
        dataset.data.push(trackValues[i]);
    });
  }
  data.update();
}

function removeData() {
  data.data.labels.length = 0;
  data.data.datasets.forEach((dataset) => {
      dataset.data.length = 0;
  });
  data.update();
}

function resetData(){
  var tracksInputField = document.getElementsByName('track-input');
  for (let i = 0; i < tracksInputField.length; i++){
    tracksInputField[i].value = "";
  }
  data.data.labels.length = 0;
  data.data.datasets.forEach((dataset) => {
      dataset.data.length = 0;
  });
  data.update();
  $('#exampleModal').modal('hide')
}

function clearInput(tracksInputField){
    tracksInputField.value = "";
}

function lengthInput(trackInputField){
  if (trackInputField.value.length > trackInputField.maxLength)
    trackInputField.value = trackInputField.value.slice(0, trackInputField.maxLength);
}

function numTracks(opts){
  selectedOpts = opts.value;
  var numTracksCheck = document.getElementsByName('tracks');
  var directionCheck = document.getElementsByName('direction');
  var tracksInputField = document.getElementsByName('track-input');
  addButton.disabled = false;
  resetButton.disabled = false;

  if(numTracksCheck[0].disabled == true){
    numTracksCheck[0].checked = true;
  }

  if(selectedOpts == 'sstf' || selectedOpts == 'look'){
    for(let i=0; i < tracksInputField.length; i++){
      tracksInputField[i].disabled = false;
    }
  }

  switch (selectedOpts){
    case "sstf":
      for (i = 0; i < numTracksCheck.length; i++){
        numTracksCheck[i].disabled = false;
      }
      for (i = 0; i < directionCheck.length; i++){
        directionCheck[i].disabled = true;
        directionCheck[i].checked = false;
      }
      break;
    case "look":
      direction = 't_low';
      for (i = 0; i < numTracksCheck.length; i++){
        numTracksCheck[i].disabled = false;
      }
      for (i = 0; i < directionCheck.length; i++){
        directionCheck[i].disabled = false;
      }
      directionCheck[0].checked = true;
      break;
    default:
      for (i = 0; i < numTracksCheck.length; i++){
        numTracksCheck[i].disabled = true;
        numTracksCheck[i].checked = false;
      }
      for (i = 0; i < directionCheck.length; i++){
        directionCheck[i].disabled = true;
        directionCheck[i].checked = false;
      }
  }
}

function track_controller(track_handler){
  track_count = parseInt(track_handler.value);
  var textFields = document.getElementsByName('track-input');
  switch (track_count){
    case 5:
      textFields[6].style.display = "none";
      textFields[7].style.display = "none";
      break;
    case 6:
      textFields[6].style.display = "inline";
      textFields[7].style.display = "none";
      break;
    default:
      textFields[7].style.display = "inline";
      textFields[6].style.display = "inline";
  }
}

function track_direction(track_handler){
  direction = track_handler.value;
}

function start_body(){
  resetButton = document.getElementById('resetButton');
  addButton = document.getElementById('addButton');
  addButton.disabled = true;
  resetButton.disabled = true;
  var textFields = document.getElementsByName('track-input');
  track_count = 5;
  direction = 't_low';
  textFields[6].style.display = "none";
  textFields[7].style.display = "none";
}
