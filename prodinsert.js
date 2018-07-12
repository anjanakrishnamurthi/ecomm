var mysql      = require('mysql'),
    co         = require('co'),
    wrapper    = require('co-mysql');
var query;
var jsonRecord;
var execute = true;
var query;
var totalRecords = 0;

var lineReader = require('line-reader');


//You need to change this to be appropriate for your system
var connection = mysql.createConnection({
  host     : 'localhost',
  port: '3306',
  user     : 'root',
  password : 'admin',
  database : 'edisecommerce'
});

var sql = wrapper(connection);

var values = ""; //The records read from the file.
var numRecords = 0; //The current number of records read from the file.
var recordBlock = 100; //The number of records to write at once.
lineReader.eachLine('ProductRecords.json', function(line, last) {
  execute = false;
  currentLine = line.toString().replace(/'/g, "\"", "g");
  try{
    jsonRecord = JSON.parse(currentLine);


    if (numRecords) {
      values += ', ';
    }

    values += `('${jsonRecord.title}', '${jsonRecord.description}', '${jsonRecord.asin}','${jsonRecord.categories}')`;
    numRecords++;
    //console.log('the values are:',values);

//Change the query to align with your schema
    if (numRecords == recordBlock) {
      query = `INSERT INTO product_table (name, productDescription, asin, pgroup) VALUES ${values};`; //Template, replaces ${values} with the value of values.
     // console.log(query);
      values = "";
      numRecords = 0;
      execute = true;
    }
  }catch(err) {
    execute = false;//there was a quote in the text and the parse failed ... skip insert
  }
  if(execute){
    co(function* () {
        var resp = yield sql.query(query);
        totalRecords += recordBlock;
        console.log(totalRecords + " records inserted.");
    });
  }
  else{
   // console.log("error");
  }//if(execute)
});//lineReader.eachLine
