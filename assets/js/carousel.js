$(document).ready(function(){
  $('.slider img').click(function(){
    $('.artwork').css('assets/img_demo/'+$(this).attr('data-img'));
  });
});
