/*
  Landscape/Portrait issue: need to measure aspect ratio;
  if landscape, fix the height; portrait then fix the height
  Largely because we're using background-images.
*/

$(document).ready(function(){
  if ( $( ".artwork" ).length ) {
    //initial adjustArtworkLayout
    adjustArtworkLayout(function(){
      //set the slider width/height
      //Using another workaround for safari mobile
      var adjustment_interval = setInterval(function() {
        if($('.slider img:last-child')[0].complete){
          clearInterval(adjustment_interval);
          adjustSlider();
        }
      },200);
    });
  }

  if(mobileAndTabletcheck()){
    if (window.innerHeight > window.innerWidth){
      //unlock the header(?)
      $('#header').css('position', 'absolute');
    } else {
      $('#header').css('position', 'fixed');
    }
  } else {
    $('#header').css('position', 'fixed');
  }

  //lightbox
  $('.artwork').click(function(e){
    if($('.artwork-lightbox').css('display') == 'none'){
      //Set it up
      adjustLightboxLayout();
      carouselButtons();
      //display the lightbox
      $('.artwork-lightbox').css({
        display:'block'
      });
    } else {
      //hide the lightbox
      $('.artwork-lightbox').css({
        display:'none'
      });
    }
  });
  //Set up the carousel
  $('.slider img').click(function(){
    if (!$(this).hasClass('selected')){
      $('.slider img').each(function(){
        $(this).removeClass('selected');
      });
      $(this).addClass('selected');

      $slider = $(this);
        //AJAX call
        $.ajax({
          method: "POST",
          url: "assets/php/artwork.php",
          data: { artwork_id: $slider.attr('data-img') }
        })
        .done(function( response ) {
          $('figcaption.description').fadeOut(200);

          $('.artwork').fadeOut(200, function(){
            art_data = JSON.parse(response);
            $(this).css({backgroundImage: 'url("assets/img_demo/artwork/'+art_data.path+'")'});
            $(this).siblings('figcaption').children('.artwork-title').html(art_data.title);
            $(this).siblings('figcaption').children('p:nth-child(2)').html(art_data.materials+'. '+art_data.dimensions+'.');
            $(this).siblings('figcaption').children('p:nth-child(3)').html(art_data.print_materials+'. '+art_data.print_run+'.');
            var $art = $(this);
            //slightly hacky way of waiting for images to load...
            $(this).backgroundImage({callBack: function(e){
              adjustArtworkLayout(function(){
                //Move the slider to the correct position
                //Vertical slide in landscape mode
                adjustLightboxLayout();
                //Add or remove the arrows
                carouselButtons();
                if (!$art.parent().hasClass('artwork-container')){
                  adjustSlider();
                }
                //Fade in the elements
                $('.artwork, figcaption.description').fadeIn(200);
              });
            }});
          });
        });
      }
    });
    //Set up the keypress events
    $(document).keyup(function(k){
      if ( k.which == 39 || k.which == 40 ) {
        //Right/down
        //check if currently selected image is not the last image
        if (!$('.slider img.selected').is(':last-child')){
          //identify the next image
          $('.slider img.selected').next().click();
        }
      } else if ( k.which == 37 || k.which == 38 ) {
        //Left/up
        if (!$('.slider img.selected').is(':first-child')){
          //identify the previous image
          $('.slider img.selected').prev().click();
        }
      } else if ( k.which == 27 ){
        //escape from lightbox
        if($('.artwork-lightbox').css('display') == 'block'){
          //hide the lightbox
          $('.artwork-lightbox').css({
            display:'none'
          });
        }
      }
    });
    //Set up the lb arrows
    $('.carousel-button').click(function(e){
      e.stopPropagation();
      if($(this).hasClass('left')){
        if (!$('.slider img.selected').is(':first-child')){
          //identify the previous image
          $('.slider img.selected').prev().click();
        }
      } else {
        if (!$('.slider img.selected').is(':last-child')){
          //identify the next image
          $('.slider img.selected').next().click();
        }
      }
    });

  //Set the initial window width (for mobile, cf below)
  window.oldwidth = window.innerWidth;
});

$( window ).resize(function() {
  /*should only be done if not mobile; they can't resize except when they rotate;
    checking if the width changes avoids the window jumping when safari and other
    browsers auto-hide their menus*/
  if(window.mobileAndTabletcheck()){
    if (window.innerWidth != window.oldwidth){
      adjustArtworkLayout(function(){
        adjustSlider();
      });
      if($('.artwork-lightbox').css('display') == 'block'){
        setTimeout(function(){
          adjustLightboxLayout();
        },100);
      }
    }
  } else {
    adjustArtworkLayout(function(){
      adjustSlider();
    });
    if($('.artwork-lightbox').css('display') == 'block'){
      setTimeout(function(){
        adjustLightboxLayout();
      },100);
    }
  }
  if (window.innerHeight > window.innerWidth){
    //unlock the header(?)
    $('#header').css('position', 'absolute');
  } else {
    $('#header').css('position', 'fixed');
  }
  window.oldwidth = window.innerWidth;
});

function adjustArtworkLayout(artworkCallBack){
  artworkCallBack = artworkCallBack || function(){};
  var padding = 10;
  if (window.innerHeight < window.innerWidth){
    //landscape
    //arrange the artwork
    var left_position = window.innerWidth > 1024 ? $('#header').offset().left : '50px';
    var top_position =  padding + parseFloat($('#header').height()) + parseFloat($('#header').css('padding-top'));
    $('.artwork-container').css({left: left_position, top: top_position});
    //work out what width the container can occupy (abutting the thumbnails)
    var max_right = $('#header > hr').offset().left;
    var max_width = max_right - parseFloat(left_position);
    $('.artwork-container').width(max_width);
    //set the maximum height so that it's within visible window
    var max_height = window.innerHeight - top_position - parseFloat($('#footer').height());
    $('.artwork-container').height(max_height);
    //retrieve background-image aspect ratio using the jquery plugin
    $('.artwork').backgroundImage({
      callBack: function(e){
        //calculate the aspect of the parent bounding box
        var bounding_ratio = max_height/max_width;
        var actual_background_height;
        //if the bounding ratio is smaller...
        if (bounding_ratio <= e.aspect){
          //this means that the image is constrained by the vertical height of
          //the container, not the max_width
          actual_background_height = max_height;
        } else {
          //horizontal constraint
          actual_background_height = max_width*e.aspect;
        }
        //calculate the actual required height
        actual_background_height = (actual_background_height + parseFloat($('.artwork-container > figcaption').height()) + parseFloat($('.artwork-container > figcaption').css('bottom'))) > max_height ? max_height - parseFloat($('.artwork-container > figcaption').height()) - parseFloat($('.artwork-container > figcaption').css('bottom')) - padding : actual_background_height;
        //from that, find the width
        $('.artwork').height(actual_background_height);
        $('.artwork').width(Math.round(actual_background_height/e.aspect));
        if (e.aspect <= 1){
          //landscape image
          $('.artwork').css('margin', '0');
        } else {
          //center the image
          $('.artwork').css('margin', '0 auto');
        }
        //Call the callBack [slightly hacky timeout delay]
        setTimeout(function(){
          artworkCallBack.call();
        }, 100);
      }
    });
    //hide the global footer & show the local (most elegant solution)
    $('#footer').css({display: 'none'});
    $('p.copyright-notice').css({display: 'block'});
  } else {
    //portrait
    //artwork arrangement is considerably more straightforward: we just center
    //below the header
    $('.artwork-container').css({
      top: $('#header').height()+padding,
      width: '80%',
      left: '10%',
      margin: 0
    });
    $('.artwork').backgroundImage({
      callBack: function(e){
        //retrieve dimensions
        //check if portrait image aspect is going to take us beyond window bounds
        var max_portrait_height = $('.thumbnails').offset().top - $('.artwork-container').offset().top - padding;
        var max_portrait_width = $('.artwork-container').width();
        var bounding_portrait_ratio = max_portrait_height/max_portrait_width;
        //set the container to the maximum permitted height to create the sticky
        //figcaption which always remains at the lowest point available
        $('.artwork-container').height(max_portrait_height);

        //as above, calculate the actual height the image will have
        var image_height;
        if (bounding_portrait_ratio <= e.aspect){
          //this means that the image is constrained by the vertical height
          var image_height = max_portrait_height - parseFloat($('.artwork-container > figcaption').height()) - window.innerHeight/50;
        } else {
          var image_height = $('.artwork-container').width()*e.aspect;
        }
        image_height = max_portrait_height < parseFloat(image_height) ? max_portrait_height : image_height;
        image_width = image_height/e.aspect;
        //set style details
        $('.artwork').css({height: image_height, width: image_width});
        if (e.aspect <= 1){
          //landscape image
          $('.artwork').css('margin', '0');
        } else {
          //center the image
          $('.artwork').css('margin', '0 auto');
        }
        $('.artwork > figcaption').css('top', max_portrait_height < image_height ? max_portrait_height : image_height + padding);
        //Call the callBack
        setTimeout(function(){
          artworkCallBack.call();
        }, 100);
      }
    });
    //hide the local footer & show the global
    $('#footer').css({display: 'block', position: 'absolute'});
    $('p.copyright-notice').css({display: 'none'});
  }
  //adjust location of the slider if in landscape mode
  if (window.innerHeight < window.innerWidth){
    var slider_position = parseFloat($('.social > ul').offset().left) + parseFloat($('.social > ul').width()/2) - parseFloat($('.slider').parent().offset().left);
    $('.slider').css('left', slider_position);
  }

}

function adjustLightboxLayout(){
  //calculate screen bounding_ratio
  s_bounding_ratio = window.innerHeight/window.innerWidth;
  a_aspect = $('.artwork').height()/$('.artwork').width();
  if (s_bounding_ratio < a_aspect){
    //image is constrained by the vertical height of the screen
    $('.artwork-lightbox > .artwork').css({
      height: '70%',
      width:'100%',
      backgroundPosition:'center center',
      top:'5%',
      left:0,
      border: '0px'
    });
  } else {
    //landscape
    $('.artwork-lightbox > .artwork').css({
      position:'absolute',
      top:0,
      left:'5%',
      width: '90%',
      height:'100%',
      border: '0px'
    });
  }
}

function adjustSlider(){
  if (window.innerHeight < window.innerWidth){
    //set the height of the slider
    $('.slider').height(Math.round(($('.slider img').height() + parseInt($('.slider img').css('margin-top'))*2)*($('.slider img').length+1)));
    $('.slider').css('width', '');

    var newpos = $('html').scrollTop() + $('img.selected').offset().top - $('.artwork-container .artwork').offset().top + ($('img.selected').height() - $('.artwork-container .artwork').height())/2;
    newpos = newpos > 0 ? newpos : 0;
    setTimeout(function(){
      $('html').animate({ scrollTop: newpos});
    },200);


  } else {
    //set the width of the slider
    $('.slider').width(Math.round(($('.slider img').width() + parseInt($('.slider img').css('margin-left'))*2)*($('.slider img').length+1)));
    $('.slider').css('height', '');
    //position the slider

    var newpos = $('.thumbnails').scrollLeft() + parseInt($('.slider img.selected').offset().left) - parseInt($('.artwork-container  .artwork').offset().left) + ($('.slider img.selected').width() - $('.artwork-container .artwork').width())/2;
    $('.thumbnails').animate({scrollLeft: newpos});
  }
}

function carouselButtons(){
  if($('.slider img.selected').is(':first-child')){
    $('.carousel-button.left').hide();
    $('.carousel-button.right').show();
  } else if ($('.slider img.selected').is(':last-child')){
    $('.carousel-button.left').show();
    $('.carousel-button.right').hide();
  } else {
    $('.carousel-button.left, .carousel-button.right').show();
  }
}

window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

//(my) jQuery plugin extension for dealing with background-images
(function ( $ ) {
    $.fn.backgroundImage = function(options) {
      var settings = $.extend({
                  // This is the default empty callback
                  callBack: function () {}
              }, options );
      var return_values;
      //retrieve aspect
      var imageString = this.css('background-image');
      if (imageString.length){
        //find the src
        var src = imageString.replace('url(','').replace(')','').replace(/\"/gi, "");
        //Safari seems to prefer it if we specify dimensions for the Image object?
        var image = new Image(100,100);
        //This is a hacky way to get around the fact that Safari doesn't seem to recognise the load
        var interval = setInterval(function() {
          if(image.complete){
            //return the details & exit the interval timer
            return_values = {height: image.naturalHeight, width: image.naturalWidth, aspect: image.naturalHeight/image.naturalWidth};
            settings.callBack.call(null, return_values);
            clearInterval(interval);
          }
        }, 100);
        //set the image source, which when loaded will fire the interval timer
        image.src = src;
        //for plugin chaining
        return this;
      } else {
        return this;
      }
    };
}( jQuery ));
