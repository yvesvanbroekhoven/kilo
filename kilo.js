var db;

var JQT = $.jQTouch({
  icon: 'icon.png',
  statusBar: 'black'
});

$(function(){
  
  $("#createEntry form").submit(createEntry);
  $("#settings form").submit(saveSettings);
  $("#settings").bind("pageAnimationStart", loadSettings);
  $("#dates li a").click(function(){
    var dayOffset = this.id;
    var date = new Date();
    date.setDate(date.getDate() - dayOffset);
    sessionStorage.currentDate = date.getMonth() + 1 + '/' +
                                 date.getDate() + '/' +
                                 date.getFullYear();
    refreshEntries();
  });
  
  var shortName = "Kilo";
  var version = "1.0";
  var displayName = "Kilo";
  var maxSize = 65536;
  db = openDatabase(shortName, version, displayName, maxSize);
  db.transaction(
    function(transaction){
      transaction.executeSql(
        "CREATE TABLE IF NOT EXISTS entries " +
        " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
        "  date DATE NOT NULL, food TEXT NOT NULL, " + 
        "  calories INTEGER NOT NULL);"
      );
    }
  );
  
});

var loadSettings = function(){
  $("#age").val(localStorage.age);
  $("#budget").val(localStorage.budget);
  $("#weight").val(localStorage.weight);
};

var saveSettings = function(){
  localStorage.age = $("#age").val();
  localStorage.budget = $("#budget").val();
  localStorage.weight = $("#weight").val();
  JQT.goBack();
  return false;
};

var refreshEntries = function(){
  var currentDate = sessionStorage.currentDate;
  $("#date h1").text(currentDate);
  $("#date ul li:gt(0)").remove();
  db.transaction(
    function(transaction){
      transaction.executeSql(
        "SELECT * FROM entries WHERE date = ? ORDER BY food;",
        [currentDate],
        function(transaction, result){
          for (var i=0; i < result.rows.length; i++){
            var row = result.rows.item(i);
            var newEntryRow = $("#entryTemplate").clone();
            newEntryRow.removeAttr("id");
            newEntryRow.removeAttr("style");
            newEntryRow.data("entryId", row.id);
            newEntryRow.appendTo("#date ul");
            newEntryRow.find(".label").text(row.food);
            newEntryRow.find(".calories").text(row.calories);
          }
        },
        errorHandler
      );
    }
  );
};

var createEntry = function(){
  var date = sessionStorage.currentDate;
  var calories = $("#calories").val();
  var food = $("#food").val();
  db.transaction(
    function(transaction) {
      transaction.executeSql(
        "INSERT INTO entries (date, calories, food) VALUES (?, ?, ?);",
        [date, calories, food],
        function(){
          refreshEntries();
          JQT.goBack();
        },
        errorHandler
      );
    }
  );
  return false;
};

var errorHandler = function(transaction, error){
  console.log(error.message);
  //transaction.executeSql("INSERT INTO errors (code, message) VALUES (?, ?);", [error.code, error.message]);
  return false;
};

