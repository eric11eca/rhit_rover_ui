#!/bin/bash


cd ../rover

gnome-terminal -e 'sh -c "echo pass=rover02 ; ssh rover && roslaunch rover_slam depth_tracking_camera.launch ; exec bash"'
roslaunch rover_slam vslam.launch

exec bash
