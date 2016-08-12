//= require_tree .
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

