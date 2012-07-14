jquery-collagePlus
==================

Create an image gallery like Google+ Albums


JSFiddle Example
----------------
http://jsfiddle.net/edlea/uZv3n/



Basic Usage
-----------


    $('.Collage').collagePlus();
    
    
    
Getting Started
---------------


    /* In your CSS */
    .Collage img{
    
        /* ensures padding at the bottom of the image is correct */
        vertical-align:bottom;
        
        /* hide the images until the plugin has run. the plugin will reveal the images*/
        opactiy:0;
        
        }
        

Ensure you have no whitespace between your image tags for a clean grid.

        
    <!-- In your HTML -->
    <div class="Collage">
    <img src="http://placehold.it/350x150"><img src="http://placehold.it/400x300"><img src="http://placehold.it/290x800">
    </div>
    

You may want to run the plugin with an image loader like https://github.com/desandro/imagesloaded, alternatively you can try it with


    $(window).load(function () {
        $('.Collage').collagePlus();
    });


