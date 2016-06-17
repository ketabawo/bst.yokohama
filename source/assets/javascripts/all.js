//= require_tree .
/*
$(document).ready(function(){
    $('#js-test').customSelect();
    
});
*/
(function ($) {
  console.log("start");
  $('#js-test').easySelectBox();
  console.log("end");
})(jQuery);

$(function(){
  $('#imagepanel_top_inner').bxSlider({
    auto: true,
    pause: 7000,
    controls: false,
    pager: false,
    mode: "fade",
    speed: 1000
  });
});

$(function(){
  $("#interviews nav li").on("click", function(){
    $(this).parent().find("li").removeClass("active");
    $(this).addClass("active");
    var target = $(this).attr("id") + "_area";
    $(this).parents(".interview").find(".screen").removeClass("active");
    $(this).parents(".interview").find("."+target).addClass("active");
  });
});

