//= require_tree .

$(function(){
  $('#imagepanel_top_inner').bxSlider({
    auto: true,
    pause: 5000,
    controls: false
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
/*
$(function(){
  $("#image_gallery li img").each(function(){
    $(this).next("span").html($(this).attr("alt"));
  })
});
*/

