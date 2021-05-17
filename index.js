var ctx = document.getElementById('lineChart');
var addNum;
var addLabel = "edi wow";
var track_handler;

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
       borderColor: "rgba(255, 192, 192, 1)",
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
          count: 5,
          stepSize: 1,
          maxTicksLimit: 200
        }
      }
    }
  }
});

function addData(){
  addNum = document.getElementById('addText').value;
  data.data.labels.push("April");
  data.data.datasets.forEach((dataset) => {
      dataset.data.push(addNum);
  });
  data.update();
}

function removeData() {
  data.data.labels.pop();
  data.data.datasets.forEach((dataset) => {
      dataset.data.pop();
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
}

function check(opts){
  var numTracksCheck = document.getElementsByName('tracks');
  var directionCheck = document.getElementsByName('direction');
  var tracksInputField = document.getElementsByName('track-input');

  if(numTracksCheck[0].disabled == true){
    numTracksCheck[0].checked = true;
  }

  if(opts.value == 'sstf' || opts.value == 'look'){
    for(var i=0; i < tracksInputField.length; i++){
      tracksInputField[i].disabled = false;
    }
  }

  if(opts.value =='sstf'){
    for (i = 0; i < numTracksCheck.length; i++){
      numTracksCheck[i].disabled = false;
    }
    for (i = 0; i < directionCheck.length; i++){
      directionCheck[i].disabled = true;
      directionCheck[i].checked = false;
    }
  } else if (opts.value == 'look'){
    for (i = 0; i < numTracksCheck.length; i++){
      numTracksCheck[i].disabled = false;
    }
    for (i = 0; i < directionCheck.length; i++){
      directionCheck[i].disabled = false;
    }
    directionCheck[0].checked = true;
  } else {
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
  var textFields = document.getElementsByName('track-input');
  if (track_handler.value == 5){
    textFields[5].style.display = "none";
    textFields[6].style.display = "none";
  } else if (track_handler.value == 6){
    textFields[5].style.display = "inline";
    textFields[6].style.display = "none";
  } else {
    textFields[5].style.display = "inline";
    textFields[6].style.display = "inline";
  }
}

function start_body(){
  track_handler = 0;
  var textFields = document.getElementsByName('track-input');
  textFields[5].style.display = "none";
  textFields[6].style.display = "none";
}
