var ctx = document.getElementById('lineChart');
var addNum;
var addLabel = "edi wow";
var track_count;
var resetButton, addButton;
var tracksInputField = [];
var direction;
var selectedOpts;
var validation = true;

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
       pointStyle: 'triangle',
       pointRotation: 60,
       pointRadius: 5,
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
          autoSkip: false,
          count: 2,
          stepSize: 1,
          maxTicksLimit: 200
        }
      }
    },
    showAllTooltips: true,
    plugins: {
      legend: {
        title: {
          display: true,
          text: 'Disk Scheduler Chart',
        }
      }
    }
  }
});

var toastElList = [].slice.call(document.querySelectorAll('.toast'))
var toastList = toastElList.map(function (toastEl) {
  return new bootstrap.Toast(toastEl, toastOption)
})

var toastOption = {
  animation:  true,
  delay: 2000
}

function see(){
  for (let i = 0; i < toastList.length; i++){
    toastList[i].hide();
  }
  if(validation == false)
    toastList[0].show();
  else
    toastList[1].show();
}

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};


function addData(){
  let tracksInputField = document.getElementsByName('track-input');
  let trackValues = [];
  let headValue;
  let seekTime = 0;
  let lowest;
  let highest;
  validation = true;
  removeData();

  for (let i = 0; i <= track_count; i++){
    if (tracksInputField[i].value == "" || tracksInputField[i].value > 200 || tracksInputField[i].value < 0){
      validation = false;
      see();
      break;
    }
    trackValues.push(parseInt(tracksInputField[i].value));
  }

  if (validation != false){
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
      lowest = lowerThanHead.min();     //get the lowest number
      highest = higherThanHead.max();   //get the highest number

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
      if (direction == 't_high')
        seekTime = (highest-headValue)+(highest-lowest);
      else
        seekTime = Math.abs(lowest-headValue)+(highest-lowest);
    } else {

      headValue = trackValues.shift();
      trackValues.sort((a, b) => a - b); // For descending sort
      trackValues.unshift(headValue);

      let sstfSet = [];
      let lowest = 0;
      let temp;
      let previous;
      let tempCompare = trackValues.shift();
      while (trackValues.length != 0){
        for (let j = 0; j < trackValues.length; j++){
          temp = Math.abs(tempCompare - trackValues[j]);
          if (lowest == 0 || lowest > temp){
            lowest = temp;
            previous = trackValues[j];
          }
        }
        tempCompare = previous;
        sstfSet.push(previous);
        trackValues = trackValues.filter(function(item) {
          return item != previous;
        })
        lowest = 0;
      }

      sstfSet = sstfSet.filter(function(item) {
        return item != headValue;
      })
      sstfSet.unshift(headValue)
      sstfSet.reverse();
      while (sstfSet.length != 0){
        trackValues.push(sstfSet.pop());
      }

      for (let i = 1; i < trackValues.length; i++){
        seekTime += Math.abs(trackValues[i-1]-trackValues[i]);
      }
    }

    for (let i = 0; i <= track_count; i++){
      data.data.labels.push(trackValues[i]);
      data.data.datasets.forEach((dataset) => {
          dataset.data.push(trackValues[i]);
      });
    }
    data.update();
    document.getElementById('seekTime').innerHTML = "Total Seek time = <strong>" + seekTime + "</strong>";
    see();
  }
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
