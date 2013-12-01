$(function() {

  // Sample usage
  var drWr = $('.draggable-wrapper'),
      rsWr = $('.resizable-wrapper'),
      elem = $('.elem-wrapper');
  
  elem.resizable({
    aspectRatio: true,
    handles:     'ne, nw, se, sw'
  });
  
  drWr.draggable();
  
  elem.each(function(){
    $(this).parent().rotatable({
      autoHide: false
    });
  })

});
