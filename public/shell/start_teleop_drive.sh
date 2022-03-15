cd ../rover

gnome-terminal -e 'sh -c "echo pass=rover02 ; ssh rover && roslaunch rover_control drive.launch ; exec bash"'
gnome-terminal -e 'sh -c "roslaunch rover_control teleop.launch ; exec bash"'
roslaunch rover_control arm_teleop.launch

exec bash
