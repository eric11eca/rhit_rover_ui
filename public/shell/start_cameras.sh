#!/bin/bash


cd ../rover

gnome-terminal -e 'sh -c "echo pass=rover02 ; ssh rover && roslaunch rover_control drive_cam.launch ; exec bash"'
gnome-terminal -e 'sh -c "echo pass=rover02 ; ssh rover && roslaunch rover_control arm_cam.launch ; exec bash"'
gnome-terminal -e 'sh -c "echo pass=rover02 ; ssh rover && roslaunch depth_tracking_camera.launch ; exec bash"'

