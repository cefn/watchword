This folder contains a structure of image grids used to generate individual Minifig images. These are generated using imagemagick from raster exports of `src/vector/minifigs.svg`

The `extracted` folders contain individual numbered grid squares from an extraction performed like `convert figure/grid.png -crop 5x6@\! +repage +adjoin figure/extracted/%d.png`.

The `named` folders are full of relative symlinks to give names to the numbered images in the sibling `extracted` folder. The links in `figure/named` should be edited, and then the `extract_grids.sh` script should be run to synchronize them.

There is a repeated folder structure `outline` `figure` and `outline+figure` for differently configured renderings from the original vector art, in which different layers are exported.
