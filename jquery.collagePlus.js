/*!
 *
 * jQuery collagePlus Plugin v0.2.0
 * https://github.com/ed-lea/jquery-collagePlus
 *
 * Copyright 2012, Ed Lea twitter.com/ed_lea
 *
 * built for http://qiip.me
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 *
 */





;(function( $ ) {


    $.fn.collagePlus = function( options ) {

        // Defaults
        var settings = $.extend( {
            // the ideal height you want your images to be
            'targetHeight'    : 400,
            // width of the area the collage will be in
            'albumWidth'      : this.width(),
            // padding between the images. Using padding left as we assume padding is even all the way round
            'padding'         : parseFloat( this.css('padding-left') ),
            // object that contains the images to collage
            'images'          : this.children(),
            // how quickly you want images to fade in once ready can be in ms, "slow" or "fast"
            'fadeSpeed'       : "fast",
            // how the resized block should be displayed. inline-block by default so that it doesn't break the row
            'display'         : "inline-block"
        }, options);

        return this.each(function() {

            /*
             *
             * set up vars
             *
             */

                // track row width by adding images, padding and css borders etc
            var row         = 0,
                // collect elements to be re-sized in current row
                elements    = [];


            settings.images.each(
                function(index){

                    /*
                     *
                     * Cache selector
                     * Even if first child is not an image the whole sizing is based on images
                     * so where we take measurements, we take them on the images
                     *
                     */
                    var $this = $(this),
                        $img  = ($this.is("img")) ? $this : $(this).find("img");



                    /*
                     *
                     * get the current image size
                     *
                     */
                    var w = (typeof $img.data("width") != 'undefined') ? $img.data("width") : $img.width(),
                        h = (typeof $img.data("height") != 'undefined') ? $img.data("height") : $img.height();



                    /*
                     *
                     * Get any current additional properties that may affect the width or height
                     * like css borders for example
                     *
                     */
                    var imgParams = getImgProperty($img);


                    /*
                     *
                     * store the original size for resize events
                     *
                     */
                    $img.data("width", w);
                    $img.data("height", h);



                    /*
                     *
                     * calculate the w/h based on target height
                     * this is our ideal size, but later we'll resize to make it fit
                     *
                     */
                    var nw = Math.ceil(w/h*settings.targetHeight),
                        nh = Math.ceil(settings.targetHeight);

                    /*
                     *
                     * Keep track of which images are in our row so far
                     *
                     */
                    elements.push([this, nw, nh, imgParams['w'], imgParams['h']]);

                    /*
                     *
                     * calculate the width of the element including extra properties
                     * like css borders
                     *
                     */
                    var nwFull = nw + imgParams['w'];


                    /*
                     *
                     * what is the total width of our row so far
                     * including padding, borders etc
                     *
                     */
                    row += (( index < elements.length - 1 ) ? nwFull + settings.padding : nwFull);


                    /*
                     *
                     * if the current row width is wider than the parent container
                     * it's time to make a row out of our images
                     *
                     */
                    if( row > settings.albumWidth && elements.length != 0 ){

                        // call the method that calculates the final image sizes
                        resizeRow(elements, row, settings);

                        // reset our row
                        delete row;
                        delete elements;
                        row         = 0;
                        elements    = [];
                    }


                    /*
                     *
                     * if the images left are not enough to make a row
                     * then we'll force them to make one anyway
                     *
                     */
                    if ( settings.images.length-1 == index && elements.length != 0){
                        resizeRow(elements, row, settings);

                        // reset our row
                        delete row;
                        delete elements;
                        row         = 0;
                        elements    = [];
                    }
                }
            );

        });

        function resizeRow( obj, row, settings ) {

            /*
             *
             * How much bigger is this row than the available space?
             * At this point we have adjusted the images height to fit our target height
             * so the image size will already be different from the original.
             * The resizing we're doing here is to adjust it to the album width.
             *
             * We also need to change the album width (basically available space) by
             * the amount of padding and css borders for the images otherwise
             * this will skew the result.
             *
             * This is because padding and borders remain at a fixed size and we only
             * need to scale the images.
             *
             */
            var albumWidthAdjusted  = settings.albumWidth - (settings.padding * (obj.length - 1)) - (obj.length * obj[0][3]),
                overPercent         = albumWidthAdjusted / row;



            /*
             * Resize the images by the above % so that they'll fit in the album space
             */
            for (var i = 0; i < obj.length; i++) {

                var fw      = Math.floor(obj[i][1] * overPercent),
                    fh      = Math.floor(obj[i][2] * overPercent),
                // if the element is the last in the row,
                // don't apply right hand padding (this is our flag for later)
                    isLast  = !!(( i < obj.length - 1 ));


                /*
                 * cache selector
                 */
                var $obj = $(obj[i][0]);


                /*
                 *
                 * Set the width of the image and parent element
                 * if the resized element is not an image, we apply it to the child image also
                 *
                 */
                $obj.width(fw);
                if( $obj.not("img") ){
                    $obj.find("img").width(fw);
                }


                /*
                 *
                 * Set the height of the image
                 * if the resized element is not an image, we apply it to the child image also
                 *
                 */
                $obj.height(fh);
                if( $obj.not("img") ){
                    $obj.find("img").height(fh);
                }


                /*
                 *
                 * Apply the css extras like padding
                 *
                 */
                applyModifications($obj, isLast, settings);


                /*
                 *
                 * Fade the image in
                 *
                 */
                $obj.animate({opacity: '1'},{duration: settings.fadeSpeed});
            }







        }

        /*
         *
         * This private function applies the required css to space the image gallery
         * It applies it to the parent element so if an image is wrapped in a <div> then
         * the css is applied to the <div>
         *
         */
        function applyModifications($obj, isLast, settings) {
            var css = {
                    // Applying padding to element for the grid gap effect
                    'margin-bottom'     : settings.padding + "px",
                    'margin-right'      : (isLast) ? settings.padding + "px" : "0px",
                    // Set it to an inline-block by default so that it doesn't break the row
                    'display'           : settings.display,
                    // Set vertical alignment otherwise you get 4px extra padding
                    'vertical-align'    : "bottom",
                    // Hide the overflow to hide the caption
                    'overflow'          : "hidden"
                };

            return $obj.css(css);
        }


        /*
         *
         * This private function calculates any extras like padding, border associated
         * with the image that will impact on the width calculations
         *
         */
        function getImgProperty( img )
        {
            $img = $(img);
            var params =  new Array();
            params["w"] = (parseFloat($img.css("border-left-width")) + parseFloat($img.css("border-right-width")));
            params["h"] = (parseFloat($img.css("border-top-width")) + parseFloat($img.css("border-bottom-width")));
            return params;
        }

    };
})( jQuery );