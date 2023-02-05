#!/bin/sh

# Generate numbered images
convert figure/grid.png -crop 5x6@\! +repage +adjoin figure/extracted/%d.png
convert outline/grid.png -crop 5x6@\! +repage +adjoin outline/extracted/%d.png
convert outline+figure/grid.png -crop 5x6@\! +repage +adjoin outline+figure/extracted/%d.png

# Synced named aliases (naming numbered images) from figure/named
cp -r figure/named outline
cp -r figure/named outline+figure
