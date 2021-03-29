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

// Getting and setting a param value
// -----------------
// ros.getParams(function(params) {
//     console.log(params);
// });

// var velPctg = new ROSLIB.Param({
//     ros : ros,
//     name : 'vel_pctg'
// });

var velPctg = 100.0;
var velFraction = 1.0;
// velPctg.get(function(value) {
//     console.log('Vel Percentage: ' + value);
// });

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
    name : '/turtle1/cmd_vel', // /turtle1/cmd_vel /cmd_vel
    messageType : 'geometry_msgs/Twist'
});

function get_twist(vx, wz) {
    var twist = new ROSLIB.Message({
        linear  : {x : velFraction * vx , y : 0.0, z : 0.0},
        angular : {x : 0.0, y : 0.0, z : velFraction * wz }
    });

    return twist
}

var twist = new ROSLIB.Message({
    linear  : {x : 0.0, y : 0.0, z : 0.0},
    angular : {x : 0.0, y : 0.0, z : 0.0}
});

// Button functions //
function forward_left(){
    twist = get_twist(1.0, 1.0);
    cmdVel.publish(twist);
}

function forward_right(){
    twist = get_twist(1.0, -1.0);
    cmdVel.publish(twist);
}

function forward(){
    twist = get_twist(1.0, 0.0);
    cmdVel.publish(twist);
}

function turnright(){
    twist = get_twist(0.0, -1.0);
    cmdVel.publish(twist);
}

function turnleft(){
    twist = get_twist(0.0, 1.0);
    cmdVel.publish(twist);
}

function stop() {
    twist = get_twist(0.0, 0.0);
    cmdVel.publish(twist);
}

function backward_left(){
    twist = get_twist(-1.0, -1.0);
    cmdVel.publish(twist);
}

function backward_right(){
    twist = get_twist(-1.0, 1.0);
    cmdVel.publish(twist);
}

function backward(){
    twist = get_twist(-1.0, 0.0);
    cmdVel.publish(twist);
}

function move(){
    cmdVel.publish(twist);
}

// TODO: Solve the problem with continous publishing
window.setInterval(move(), 1000);


// Subscribing to a Topic (Example)
// ----------------------

var listener = new ROSLIB.Topic({
    ros : ros,
    name : '/listener',
    messageType : 'std_msgs/String'
});

listener.subscribe(function(message) {
    console.log('Received message on ' + listener.name + ': ' + message.data);
    listener.unsubscribe();
});

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


