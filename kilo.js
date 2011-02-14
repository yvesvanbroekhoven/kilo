var JQT = $.jQTouch({
  icon: 'kilo.png',
  statusBar: 'black'
});

$(function(){
  
  $("#settings form").submit(saveSettings);
  $("#settings").bind("pageAnimationStart", loadSettings);
  
});

var saveSettings = function(){
  localStorage.age = $("#age").val();
  localStorage.budget = $("#budget").val();
  localStorage.weight = $("#weight").val();
  JQT.goBack();
  return false;
};

var loadSettings = function(){
  $("#age").val(localStorage.age);
  $("#budget").val(localStorage.budget);
  $("#weight").val(localStorage.weight);
};