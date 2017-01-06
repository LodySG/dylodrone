$(function(){

    function is_touch_device() {
        return 'ontouchstart' in window  || navigator.maxTouchPoints;
    }

    if(is_touch_device())
        $(".pr").remove();

});