// Control script

// Connecting to ROS
// -----------------
/*
    launch roscore and rosbridge
 */
var ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

ros.on('connection', function() {
    console.log('Connected to websocket server.');
});

ros.on('error', function(error) {
    console.log('Connection to websocket server closed.');
});

var velPctg = 100.0;
var velFraction = 1.0;

function get_pctg() {
  velPctg = document.getElementById("vel_pctg").value;
  velFraction = velPctg / 100.0;
  document.getElementById("pctg_label").innerHTML = velPctg + " %";
  // console.log('Vel percentage: ' + velFraction);
}


// Publishing a Topic
// ------------------

var cmdVel = new ROSLIB.Topic({
    ros : ros,
    name : 'turtle1/cmd_vel',
    // name : '/cmd_vel_mux/input/teleop', 
    messageType : 'geometry_msgs/Twist'
});

function get_twist(vx, wz) {
    var twist = new ROSLIB.Message({
        linear  : {x : velFraction * vx , y : 0.0, z : 0.0},
        angular : {x : 0.0, y : 0.0, z : velFraction * wz }
    });

    return twist
}

// Initial twist: STOP //
var twist = new ROSLIB.Message({
    linear  : {x : 0.0, y : 0.0, z : 0.0},
    angular : {x : 0.0, y : 0.0, z : 0.0}
});

var last_twist = twist;

function publishOnTopic() {
    if (last_twist != twist) {
        last_twist = twist;
    }
    cmdVel.publish(last_twist);
}

window.setInterval(publishOnTopic, 1000);

// Button functions //
// TODO: adjust velocity limits
function forward_left(){
    twist = get_twist(0.5, 1.4);
    cmdVel.publish(twist);
}

function forward_right(){
    twist = get_twist(0.5, -1.4);
    cmdVel.publish(twist);
}

function forward(){
    twist = get_twist(0.5, 0.0);
    cmdVel.publish(twist);
}

function turnright(){
    twist = get_twist(0.0, -1.4);
    cmdVel.publish(twist);
}

function turnleft(){
    twist = get_twist(0.0, 1.4);
    cmdVel.publish(twist);
}

function stop() {
    twist = get_twist(0.0, 0.0);
    cmdVel.publish(twist);
}

function backward_left(){
    twist = get_twist(-0.5, -1.4);
    cmdVel.publish(twist);
}

function backward_right(){
    twist = get_twist(-0.5, 1.4);
    cmdVel.publish(twist);
}

function backward(){
    twist = get_twist(-0.5, 0.0);
    cmdVel.publish(twist);
}

function move(){
    cmdVel.publish(twist);
}

// console.log($('#dropdown').find('option:selected').attr('value'));
var quality = 5;
var topic = $('#dropdown').find('option:selected').attr('value');

function setQuality(val) {
    quality = val;
    // console.log("http:0.0.0.0:8080/stream?topic=" + topic + "&quality=" + quality);
    document.getElementById("cam").src = "http:0.0.0.0:8080/stream?topic=" + topic + "&quality=" + quality;

    var all = document.getElementsByClassName("col-3");
    for (var i = 0; i < all.length; i++) {
        all[i].style.color = "black";
        all[i].style.fontWeight = "normal";
    }

    var act;
    if (val == 5)
        act = 0;
    else if (val == 50)
        act = 1;
    else 
        act = 2;

    document.getElementsByClassName("col-3")[act].style.color = "rgb(49, 100, 125)";
    document.getElementsByClassName("col-3")[act].style.fontWeight = "bold";
}

// Dropdown list to select the camera topic to show
$('#dropdown').change(function(){
    topic = $(this).find('option:selected').attr('value');
    // console.log("http:0.0.0.0:8080/stream?topic=" + topic + "&quality=" + quality);
    document.getElementById("cam").src = "http:0.0.0.0:8080/stream?topic=" + topic + "&quality=" + quality;
})


// -  Some help  - // 
// Get the modal
var info = document.getElementById("info");

// Get the button that opens the modal
var btn = document.getElementById("open_info");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the info image, open the modal
btn.onclick = function() {
    info.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    info.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == info) {
        info.style.display = "none";
    }
}


