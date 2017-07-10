// NOTES


// - sredi mobile verziju da bude bas sredina;



function setPortfolioWidth(){  
    var portfoliowidth = $(".img-container > img").css("width");
    $(".overlay").css("width", portfoliowidth);
};

$(document).ready(setPortfolioWidth);
$(window).resize(setPortfolioWidth);


// Change class of active navigation link
$(document).ready(function () {
    $('.nav li a').click(function(e) {

        $('.nav li').removeClass('active');

        var $parent = $(this).parent();
        if (!$parent.hasClass('active')) {
            $parent.addClass('active');
        }
        // e.preventDefault();
    });
  
});