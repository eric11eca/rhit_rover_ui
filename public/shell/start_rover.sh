#!/bin/bash


cd ../rhit-rover/rover

gnome-terminal -e 'sh -c "echo pass=rover02 ; ssh rover && roslaunch rover_bringup bringup.launch ; exec bash"'
roslaunch rover_bringup bringup_client.launch

exec bash
