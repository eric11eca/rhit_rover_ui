cd ../../../rhit-rover


ssh rover
pass: rover02

roslaunch rover_control rover.drive
roslaunch rover_control rover.teleop
