const canvas = document.querySelector("#simscreen");
const ctx = canvas.getContext("2d");
const btnStart = document.querySelector(".btn-start");
const btnReset = document.querySelector(".btn-reset");
const voltageButtons = document.querySelectorAll(".voltage");
const vfspinner = document.querySelector("#vfspinner");
const temperature1 = document.querySelector("#temp1");
const temperature2 = document.querySelector("#temp2");
const temperature3 = document.querySelector("#temp3");
const temperature4 = document.querySelector("#temp4");
const temperature5 = document.querySelector("#temp5");
const temperature6 = document.querySelector("#temp6");
const temperature7 = document.querySelector("#temp7");
const btnCheck1 = document.querySelector(".btn-check1");
const btnCheck2 = document.querySelector(".btn-check2");
const btnCheck3 = document.querySelector(".btn-check3");
const btnCheck4 = document.querySelector(".btn-check4");
const btnCheck5 = document.querySelector(".btn-check5");
const btnCheck6 = document.querySelector(".btn-check6");
const btnCheck7 = document.querySelector(".btn-check7");
const btnCheck8 = document.querySelector(".btn-check8");

btnStart.addEventListener("click", initiateProcess);
btnReset.addEventListener("click", resetAll);
voltageButtons.forEach((voltage) =>
  voltage.addEventListener("click", () => setVoltage(voltage)
  
)
);

let steadyState = 0;
let currentVoltage = 0;
//controls section
let v = 0;
let vf = 0;

//timing section
let simTimeId = setInterval("", "1000");
let TimeInterval = setInterval("", "1000");
let TimeInterval1 = setInterval("", "1000");
let time = 0;
let time1 = 0;
let time2 = 0;

//point tracing section and initial(atmospheric section)
let t1 = [26, 26, 27, 27.5, 26.5, 27, 28];
// let th = [45,45,45,45, 45, 45];
var off = [0, 0, 0, 0, 0, 0, 0, 0];
// let slope = [-282.86, -315.71, -354.29];
// let k = [40.83, 37.99, 37.61];
var heat = 0, r = 0, k =0, a3=0, data=[];

//temporary or dummy variables for locking buttons
let temp = 0;
let temp1 = 2;
let temp2 = 0;
let tempslope = 0;
let tempk = 0;

function displayDiv(ele) {
  const taskScreen = document.querySelectorAll(".task-screen");
  taskScreen.forEach((task) => {
    task.classList.add("hide");
  });
  if (ele.classList.contains("tool-objective")) {
    document.querySelector(".objective").classList.remove("hide");
  }
  if (ele.classList.contains("tool-description")) {
    document.querySelector(".description").classList.remove("hide");
  }
  if (ele.classList.contains("tool-explore")) {
    document.querySelector(".explore").classList.remove("hide");
    if (temp2 !== 1) {
      drawModel();
      startsim();
      varinit();
    }
  }
  if (ele.classList.contains("tool-practice")) {
    document.querySelector(".practice").classList.remove("hide");
    if (temp2 == 1) {
      temp1 = 1;
      validation();
      document.querySelector("#info").innerHTML = "";
    } else {
      document.querySelector("#info").innerHTML =
        "Perform the experiment to solve the questions";
      document.querySelector(".graph-div").classList.add("hide");
      document.querySelector(".questions").classList.add("hide");
    }
  }
}


//Change in Variables with respect to time
function varinit() {
  // varchange();
  //Variable r1 slider and number input types
  // $("#vslider").slider("value", v);
  // $("#vspinner").spinner("value", v);

  // //$('#vfslider').slider("value", vf);
  // $("#vfspinner").spinner("value", vf);
  $('#vslider').slider("value", v);	
	$('#vspinner').spinner("value", v);
  console.log(currentVoltage, vf);
  if (time2 > 0) { t1[0] += off[0]; };
  if (time2 > 0) { t1[1] += off[1]; };
  if (time2 > 0) { t1[2] += off[2]; };
  // console.log("Hi "+t1[2]);
  if (time2 > 0) { t1[3] += off[3]; };
  if (time2 > 0) { t1[4] += off[4]; };
  if (time2 > 0) { t1[5] += off[5]; };
  if (time2 > 0) { t1[6] += off[6]; };

  if(v == "10"){
    heat = 19.6;
    r = 0.4235;
    k = 1.73;
   
    data = [40.75, 36.95, 32.45];
  }
  else if(v == "20"){
    heat = 31.95;
    r = 0.3521;
    k = 2.09;
 
    data = [44.95, 38.55, 33.7];
  }
  else if(v == "30"){
    heat = 47.85;
    r = 0.3103;
    k = 2.37;
   
    data = [49.7, 42.3, 34.85];
  }
  else{
    heat = 0;
    r = 0;
    k = 0;
  
    data = [0,0,0];
  }

  vfspinner.textContent = vf;
  temperature1.textContent = t1[0].toFixed(2);
  temperature2.textContent = t1[1].toFixed(2);
  
  temperature3.textContent = t1[2].toFixed(2);
  console.log(temperature2.textContent);
  temperature4.textContent = t1[3].toFixed(2);
  temperature5.textContent = t1[4].toFixed(2);
  temperature6.textContent = t1[5].toFixed(2);
  temperature7.textContent = t1[6].toFixed(2);

  

}

//water temperature changes
function watertemp() {
  switch (vf) {
    case 19.6:
      t1[6] += 2.2;
      break;
    case 31.95:
      t1[6] += 1.2;
      break;
    case 60:
      t1[6] += 1.2;
      break;
  }
}

//stops simulations
function simperiod() {
  if (time1 >= 5.0) {
    clearInterval(TimeInterval);
    clearInterval(TimeInterval1);
    time1 = 0;
    time2 = 0;
    temp1 = 0;
    temp2 = 1;
    watertemp();
    //printcomment("Click forward button for calculations", 1);
    //printcomment("Click restart button for doing experienment again", 2);

    ctx.clearRect(620, 485, 100, 50);
    t1[6] = t1[6].toFixed(1);
    ctx.font = "15px Comic Sans MS";
    //ctx.fillText(t1[5]+" \u00B0C", 470, 170);
    ctx.fillText(t1[6] + " \u00B0C", 650, 500);
    // printcomment("", 2);
  } else {
    drawGradient();
    draw_array();
    steadyState = 5 - Math.round(time1);
    if (steadyState > 0) {
      document.querySelector(".comment").innerHTML = `Wait for ${steadyState} seconds for steady state`;
      btnReset.setAttribute("disabled", true);
    } else {
      document.querySelector(".comment").innerHTML = "Steady state achieved";
      btnReset.removeAttribute("disabled");
    }
    if (steadyState === 0) {
      temp2 = 0;

    
    }
    // printcomment(
    //   "Wait for " + (5 - Math.round(time1)) + " seconds for steady state",
    //   2
    // );
  }
}
//draw gradient w.r.t. time in thermometer water flow and heater
function drawGradient() {
//heater simulation
var h = 500 * time1;
//create gradient
var grd1 = ctx.createLinearGradient(0, 0, 0, h)
grd1.addColorStop(0, "red");
grd1.addColorStop(1, "white");
// Fill with gradient
ctx.fillStyle = grd1;
ctx.fillRect(320, 216.5, 340, 7.5);
   

  //outer parallel tube simulation
  var t1 = 70 * time1;
  //create gradient
  var grd2 = ctx.createLinearGradient(0, 0, 0, t1)
  // grd2.addColorStop(0, "#FF0000");
  grd2.addColorStop(0, "#FF0000");
  grd2.addColorStop(1, "white");
  // Fill with gradient
  ctx.fillStyle = grd2;
  // ctx.fillRect(320, 180, 340, 33.5);
  ctx.fillRect(320, 225, 340, 40)



  //left part


  var t6 = 70 * time1;
  var y6 = 420 - t6;

  //create gradient
  var grd3 = ctx.createLinearGradient(0, 420, 0, y6)
  grd3.addColorStop(0, "#FF0000");
  // grd3.addColorStop(0, "blue");
  grd3.addColorStop(1, "white");
  //Fill with gradient
  ctx.fillStyle = grd3;
  // ctx.fillRect(320, 225, 340, 40);
  ctx.fillRect(320, 180, 340, 33.5);



}

// initial model
function drawModel() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set styles for drawing
  ctx.strokeStyle = "black";
  ctx.font = "bold 22px Nunito";
  ctx.fillStyle = "black";

  // Draw specific texts
  ctx.fillText("Copper", 670, 212.5);
  ctx.fillText("tube", 670, 235.5);
  ctx.fillText("blower", 120, 325);
  ctx.fillText("G.I. pipe dia(dp)", 430, 400);
  ctx.fillText("Orifice dia(do)", 260, 90);
  
  ctx.fillText("1", 200, 180);
  ctx.fillText("2", 403, 282);
  ctx.fillText("3", 456.5, 282);
  ctx.fillText("4", 510, 282);
  ctx.fillText("5", 563, 282);
  ctx.fillText("6", 616.5, 282);
  ctx.fillText("7", 700, 112.5);

  // Draw other shapes or elements
  ctx.fillStyle = "black";
  ctx.lineJoin = "round";
  ctx.beginPath();

  ctx.rect(320, 180, 340, 85); // Enlarged rectangle dimensions
  ctx.rect(320, 215, 340, 10);

  ctx.rect(130, 150, 40, 150); // Blower
  ctx.rect(171, 170, 10, 100);

  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(220, 20); // Adjusted lines
  ctx.lineTo(220, 110);
  ctx.lineTo(680, 110);
  ctx.lineTo(680, 20);

  ctx.moveTo(220, 445);
  ctx.lineTo(220, 345);
  ctx.lineTo(680, 345);
  ctx.lineTo(680, 445);

  ctx.moveTo(250, 100);
  ctx.lineTo(250, 160);

  ctx.moveTo(250, 355);
  ctx.lineTo(250, 295);

  ctx.stroke();

  // Additional functions if needed
  drawGradient();
}


// The rest of your code remains unchanged
// ...


function draw_array() {
  ctx.beginPath();
  let y = time1 * 100;
  console.log(y);
  console.log(time2);

  // Clear previous drawings


  // Draw red rectangles
  ctx.fillStyle = '#fff';
  ctx.fillRect(188, 150, 550, 10);
  ctx.fillRect(188, 290, 550, 10);

  if (time1 <= 0.1 || (time1 > 2.0 && time1 <= 2.1)) {
    // ctx.clearRect(134, 134, 37, 97);
    // ctx.fillStyle = 'red';
    // ctx.fillRect(274, 164, 37, 97); //large box
    ctx.beginPath();
    ctx.moveTo(230, 200);  // x moved from 210 to 230
    ctx.lineTo(260, 200);  // x moved from 240 to 260
    ctx.lineTo(255, 196);  // x moved from 235 to 255
    ctx.moveTo(260, 200);  // x moved from 240 to 260
    ctx.lineTo(255, 203);  // x moved from 235 to 255
    
    ctx.moveTo(230, 225);  // x moved from 210 to 230
    ctx.lineTo(260, 225);  // x moved from 240 to 260
    ctx.lineTo(255, 221);  // x moved from 235 to 255
    ctx.moveTo(260, 225);  // x moved from 240 to 260
    ctx.lineTo(255, 228);  // x moved from 235 to 255
    ctx.stroke();
    
    
  } else if ((time1 > 0.1 && time1 <= 0.2) || (time1 > 2.1 && time1 <= 2.2)) {
    // ctx.clearRect(88, 165, 33, 34);
    ctx.fillStyle = 'white';
    ctx.fillRect(230, 195, 33, 34); // small redbox

   
    ctx.beginPath();
ctx.moveTo(275, 190); // Moved up by 10 units and right by 30 units
ctx.lineTo(310, 165);
ctx.lineTo(302, 166);
ctx.moveTo(310, 165);
ctx.lineTo(307, 172);
ctx.stroke();

ctx.moveTo(275, 225); // Moved down by 10 units and right by 30 units
ctx.lineTo(310, 250);
ctx.lineTo(302, 249);
ctx.moveTo(310, 250);
ctx.lineTo(307, 242);
ctx.stroke();
  
    
  } else {
    // ctx.clearRect(230, 195, 33, 34);
    // ctx.clearRect(134, 134, 37, 97);
    ctx.fillStyle = 'white';
    ctx.fillRect(230, 195, 33, 34);
    ctx.fillRect(274, 164, 37, 97);

    if (time1 <= 2.3) {
      ctx.beginPath();
      let arrowX1 = 310 + (time1 - 0.3) * 200; // Increased by 20 units
      ctx.strokeStyle = 'purple'; 
      
      // Top arrow inside red rectangle
      ctx.moveTo(arrowX1, 155);
      ctx.lineTo(arrowX1 + 30, 155);
      ctx.lineTo(arrowX1 + 25, 151);
      ctx.moveTo(arrowX1 + 30, 155);
      ctx.lineTo(arrowX1 + 25, 158);
    
      // Bottom arrow inside red rectangle
      ctx.moveTo(arrowX1, 295);
      ctx.lineTo(arrowX1 + 30, 295);
      ctx.lineTo(arrowX1 + 25, 291);
      ctx.moveTo(arrowX1 + 30, 295);
      ctx.lineTo(arrowX1 + 25, 298);
      ctx.stroke();
    }
    
    if (time1 > 2.3) {
      ctx.clearRect(188, 150, 550, 10);
      ctx.clearRect(188, 290, 550, 10);
    }
    
  }
}





function comment1() {
  if (currentVoltage != 0) {
    time = 0;
    temp = 1;
    // $("#vspinner").spinner({disabled : true});
    // //$("#vfspinner").spinner({disabled : true});
    // $("#vslider").slider({disabled : true});
    // $("#vfslider").slider({disabled : true});
    clearInterval(simTimeId);
    //printcomment("start simulation", 0);
    if (currentVoltage == 10) {
      vf = 26.66;
    } else if (currentVoltage == 20) {
      vf = 33.6;
    } else if (currentVoltage == 30) {
      vf = 47.85;
    }
    offset();
  }
}
//offset for thermometer and temp change
function offset() {
  if (currentVoltage == 10) {
    //path = "./images//currentVoltage1.jpg";
    off[0] = 4.2;
    off[1] = 4.6;
    off[2] = 4.4;
    off[3] = 4.5;
    off[4] = 4.7;
    off[5] = 4.6;
    off[6] = 4.6;
  } else if (currentVoltage == 20) {
    //path = "./images//currentVoltage2.jpg";
    off[0] = 4.4;
    off[1] = 4.8;
    off[2] = 4.6;
    off[3] = 4.5;
    off[4] = 4.7;
    off[5] = 4.6;
    off[6] = 4.6;
  } else if (currentVoltage == 30) {
    //path = "./images//currentVoltage3.jpg";
   off[0] = 4.72;
    off[1] = 4.76;
    off[2] = 3.5;
    off[3] = 3.75;
    off[4] = 2.466;
    off[5] = 2.933;
    off[6] = 1.06;
  }
  // temp1 = 0;
  // temp2 = 1;
}
function setVoltage(ele) {
  currentVoltage = Number(ele.value);
  btnStart.removeAttribute("disabled");
}

function startsim() {
  simTimeId = setInterval("time=time+0.1; comment1(); ", "100");
}
function initiateProcess() {
  if (currentVoltage === 0) return;
  btnStart.setAttribute("disabled", true);
  voltageButtons.forEach((voltage) => voltage.setAttribute("disabled", true));
  simstate();
}

function simstate() {
  if (temp == 1) {
    temp = 0;
    temp1 = 1;
    TimeInterval = setInterval("time1=time1+.1; simperiod();", "100");
    TimeInterval1 = setInterval("time2=time2+1; varinit()", "1000");
    // document.getElementById("formula").style.visibility="visible";
  }
}

//Calculations of the experienment
function validation() {
  // datapoints = [
  //   { x: 25, y: t1[0] },
  //   { x: 37, y: t1[1] },
  //   { x: 52, y: t1[2] },  
  //   // { x: 0.28, y: t1[3] },
  //   // { x: 0.35, y: t1[4] },
  // ];
  // document.querySelector(".graph-div").classList.remove("hide");
  // document.querySelector(".questions").classList.remove("hide");
  // drawgraph("graph", datapoints, "Length from heater", "Average Temperatures");
  // if (currentVoltage == 10) {
  //   tempslope = slope[0];
  //   tempk = k[0];
  // } else if (currentVoltage == 20) {
  //   tempslope = slope[1];
  //   tempk = k[1];
  // } else if (currentVoltage == 30) {
  //   tempslope = slope[2];
  //   tempk = k[2];
  // }
  // btnCheck1.addEventListener("click", () => validateAnswer1());
  // btnCheck2.addEventListener("click", () => validateAnswer2());
  if (currentVoltage == 10) {
    t1 = [40.75, 36.95, 32.45];
    
    r = 1.1652;
    k = 46.88;
    a3=291.79;
    a4=30;
    a5=4.42;
    a6=107.5;
    a7=118.51;
    a8=54.72;

  } else if (currentVoltage == 20) {
    t1 = [44.95, 38.55, 33.7];
    r = 1.1652;
    k = 46.88;
    a3=291.79;
    a4=30;
    a5=4.42;
    a6=107.5;
    a7=118.51;
    a8=54.72;

  } else if (currentVoltage == 30) {
    t1 = [49.7, 42.3, 34.85];
    r = 0.3103;
    k = 2.37;
  }
  var datapoints = [
    { x: 25, y: t1[0] },
    { x: 37, y: t1[1] },
    { x: 52, y: t1[2] }
  ];

  document.querySelector(".graph-div").classList.remove("hide");
  document.querySelector(".questions").classList.remove("hide");
  drawgraph("graph", datapoints, "Length from heater", "Average Temperatures");

  btnCheck1.addEventListener("click", () => validateAnswer1());
  btnCheck2.addEventListener("click", () => validateAnswer2());
  btnCheck3.addEventListener("click", () => validateAnswer3());
  btnCheck4.addEventListener("click", () => validateAnswer4());
  btnCheck5.addEventListener("click", () => validateAnswer5());
  btnCheck6.addEventListener("click", () => validateAnswer6());
  btnCheck7.addEventListener("click", () => validateAnswer7());
  btnCheck8.addEventListener("click", () => validateAnswer8());
}

function validateAnswer1() {
  const correctAnswer = document.querySelector(".correct-answer1");
  const unit = document.querySelector(".question-unit1");
  unit.innerHTML = `<sup></sup>kg/m<sup>3`;
  let userEnteredValue = Number(
    document.querySelector(".question-input1").value
  );
  let answer = userEnteredValue === r ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = '<p><span style="color: #028102;">Correct answer</span> <span style="color: #e7722b;">&rho;<sub>a</sub> = '+r+' <sup></sup>kg/m<sup>3</span>';
    console.log("hi " +r);
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}
function validateAnswer2() {
  const correctAnswer = document.querySelector(".correct-answer2");
  const unit = document.querySelector(".question-unit2");
  unit.innerHTML = `m/s`;
  let userEnteredValue = Number(
    document.querySelector(".question-input2").value
  );
  let answer = userEnteredValue === k ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = '<p><span style=" color: #028102;">Correct answer</span> <span style="color: #e7722b;"> V<sub>o</sub> = '+k+' m/s</span> ';
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}

function validateAnswer3() {
  const correctAnswer = document.querySelector(".correct-answer3");
  const unit = document.querySelector(".question-unit3");
  unit.innerHTML = `m`;
  let userEnteredValue = Number(
    document.querySelector(".question-input3").value
  );
  let answer = userEnteredValue === a3 ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = '<p><span style=" color: #028102;">Correct answer</span> <span style="color: #e7722b;"> h<sub>a</sub> = '+a3+' m</span> ';
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}

function validateAnswer4() {
  const correctAnswer = document.querySelector(".correct-answer4");
  const unit = document.querySelector(".question-unit4");
  unit.innerHTML = `m/s`;
  let userEnteredValue = Number(
    document.querySelector(".question-input4").value
  );
  let answer = userEnteredValue === a4 ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = '<p><span style=" color: #028102;">Correct answer</span> <span style="color: #e7722b;">V<sub>a</sub> = '+a4+' m/s</span> ';
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}

function validateAnswer5() {
  const correctAnswer = document.querySelector(".correct-answer5");
  const unit = document.querySelector(".question-unit5");
  unit.innerHTML = ``;
  let userEnteredValue = Number(
    document.querySelector(".question-input5").value
  );
  let answer = userEnteredValue === a5 ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = '<p><span style=" color: #028102;">Correct answer</span> <span style="color: #e7722b;"> Re = '+a5+'</span> ';
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}

function validateAnswer6() {
  const correctAnswer = document.querySelector(".correct-answer6");
  const unit = document.querySelector(".question-unit6");
  unit.innerHTML = ``;
  let userEnteredValue = Number(
    document.querySelector(".question-input6").value
  );
  let answer = userEnteredValue === a6 ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = '<p><span style=" color: #028102;">Correct answer</span> <span style="color: #e7722b;"> Nu = '+a6+'</span> ';
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}

function validateAnswer7() {
  const correctAnswer = document.querySelector(".correct-answer7");
  const unit = document.querySelector(".question-unit7");
  unit.innerHTML = `W/m<sup>2</sup>K`;
  let userEnteredValue = Number(
    document.querySelector(".question-input7").value
  );
  let answer = userEnteredValue === a7 ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = '<p><span style=" color: #028102;">Correct answer</span> <span style="color: #e7722b;"> h = '+a7+' W/m<sup>2</sup>K</span> ';
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}

function validateAnswer8() {
  const correctAnswer = document.querySelector(".correct-answer8");
  const unit = document.querySelector(".question-unit8");
  unit.innerHTML = `W`;
  let userEnteredValue = Number(
    document.querySelector(".question-input8").value
  );
  let answer = userEnteredValue === a8 ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = '<p><span style=" color: #028102;">Correct answer</span> <span style="color: #e7722b;"> Qc = '+a8+' W</span> ';
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}


function resetAll() {
  btnStart.setAttribute("disabled", true); // Disable start button or adjust as needed
  voltageButtons.forEach((voltage) => {
    voltage.removeAttribute("disabled"); // Enable voltage buttons
    voltage.checked = false; // Uncheck voltage buttons if they are checkboxes
  });

  // Clear any HTML content or form inputs
  document.querySelector(".comment").innerHTML = "";
  document.querySelector(".correct-answer1").innerHTML = "";
  document.querySelector(".question-unit1").innerHTML = `<sup>&deg;</sup>C/m`;
  document.querySelector(".question-input1").value = "";
  document.querySelector(".correct-answer2").innerHTML = "";
  document.querySelector(".question-unit2").innerHTML = `W/m.K`;
  document.querySelector(".question-input2").value = "";
  // document.getElementById("formula").style.visibility = "hidden";

  // Reset any variables or arrays
  temp2 = 0;
  temp1 = 2;
  t1 = [26, 26, 27, 27.5, 26.5, 27, 28]; // Reset array values as needed
  currentVoltage = 0;
  vf = 0;

  // Do not clear the canvas unnecessarily
  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Reinitialize variables or start simulation
  varinit();
  startsim();

  // Redraw the entire model including text
  drawModel();
}


function movetoTop() {
  practiceDiv.scrollIntoView();
}
