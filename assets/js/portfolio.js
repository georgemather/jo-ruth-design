/*
  One-page scrolling for
  design and illustration
  portfolio
*/
$(document).ready(function(){
  window.section_height = window.innerHeight - $('#header').height();
  $('.page-section').height(window.section_height);
  $('.project h1').css('padding', Math.round(window.section_height/9)+'px 0');
  $('.page-section').each(function(){
    $(this).css('top', $('.page-section').index(this)*section_height);
  });
  $('.counter li').click(function(){
    //change scrolltop
    changeSection($('.counter li').index(this));
  });
  $(window).on('hashchange', function(e){
    e.preventDefault();
    changeSection($('.page-section').index($('#'+window.location.hash.replace('#',''))));
  });
  //change pips on scroll
  $(window).scroll(function(){
    //check whether we have exceeded
    checkSection();
  });
  //check the url
  if(location.hash!=''){
    //sometimes location.hash seems to retrieve a hash character... and sometimes it doesn't?
    changeSection($('.page-section').index($('#'+window.location.hash.replace('#',''))));
  }
  checkSection();

  //Set up click events
  $('.gallery img').click(function(){
    if(!$(this).hasClass('selected')){
      $thumb = $(this);
      $.ajax({
        method: "POST",
        url: "assets/php/artwork.php",
        data: { artwork_id: $thumb.attr('data-src') }
      })
      .done(function( response ) {
        art_data = JSON.parse(response);
        $thumb.parent().parent().find('.description').animate({opacity: 0}, 100);
        $thumb.parent().parent().find('.project-samples').animate({opacity: 0}, 100, function(){
          $thumb.parent().parent().find('.project-samples').css({backgroundImage: 'url("assets/img_demo/artwork/'+art_data.path+'")'});

          $thumb.parent().parent().find('.project-samples').backgroundImage({callBack: function(e){
            //on load!
            $thumb.parent().parent().find('.description').html(art_data.caption);
            $thumb.parent().find('img').removeClass('selected');
            $thumb.parent().parent().find('.project-samples').animate({opacity: 1},100);
            $thumb.parent().parent().find('.description').animate({opacity: 1}, 100);
            $thumb.addClass('selected');
          }});

        });
      });
    }
  });
  //do the initial setup
  $('.gallery img.selected').click();
});
$(window).resize(function(){
  window.section_height = window.innerHeight - $('#header').height();
  $('#body').css('padding-top', $('#header').height() + parseInt($('#header').css('padding-top')));
  $('.page-section').height(window.section_height);
  $('.project h1').css('padding', Math.round(window.section_height/9)+'px 0');
  console.log('!');

  changeSection($('.counter li').index($('.counter li.current')));
});
function checkSection(){
  var current_section = $('.counter li').index('.current');
  var section = Math.floor($('html').scrollTop()/window.section_height);
  if(section != current_section){
    $('.counter li.current').removeClass('current');
    $('.counter li:eq('+section+')').addClass('current');
  }
}
function changeSection(n){
  $('html').stop().animate({scrollTop: n*$('.page-section').height()});
}
