// text = text.replace(/<wiki>(.+?)<\/wiki>/g, function(match, contents, offset, input_string)
//     {
//         return "<a href='wiki/"+contents.replace(/ /g, '_')+"'>"+contents+"</a>";
//     }
// );

// var result = fileAsString.replace(/string to be replaced/g, 'replacement');
// So...

var fs = require('fs')
fs.readFile(someFile, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  // var result = data.replace(/string to be replaced/g, 'replacement');
  var result = data.replace(
    /string to be replaced/g, 
    function (match, contents, offset, input_string) {
      //... get activity foldername
      //... search curriculum json config for foldername 
      //... return day activity folder belongs to
      //... create day specific url to class activity
    }
  );

  fs.writeFile(someFile, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});