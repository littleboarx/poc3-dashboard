#!/bin/bash

rsync -auvx --progress ./build/ h4x@poc3a-1.phala.network:/var/www/score_dashboard/
