function change_cover(index) {
	$('.cover_image').eq(0).addClass('cover_fade');
	$('.cover_image').eq(index).removeClass('cover_fade');
}

function reset_cover(index) {
	$('.cover_image').eq(0).removeClass('cover_fade');
	$('.cover_image').eq(index).addClass('cover_fade');
}

function cover_i(){
  document.getElementById('index').style.backgroundImage = "url('" + './p_image/cover.jpg' + "')";
}
function cover_d(){
  document.getElementById('index').style.backgroundImage = "url('" + './p_image/cover_d.jpg' + "')";
}
function cover_m(){
  document.getElementById('index').style.backgroundImage = "url('" + './p_image/cover_m.jpg' + "')";
}
function cover_g(){
  document.getElementById('index').style.backgroundImage = "url('" + './p_image/cover_p.jpg' + "')";
}
function cover_a(){
  document.getElementById('index').style.backgroundImage = "url('" + './p_image/cover_a.jpg' + "')";
}
function show_nav(){
  $('#full').fadeIn('fast');
}
function show_page(){
  $('#full').fadeOut('fast');
}
