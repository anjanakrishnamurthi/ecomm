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
  host     : 'edisassignmentone.cvoay42puhxi.us-east-1.rds.amazonaws.com',
  user     : 'admin',
  password : '98944svk',
  database : 'edisecommerce',
  multipleStatements: 'true'
});

var sql = wrapper(connection);

var values = ""; //The records read from the file.
var numRecords = 0; //The current number of records read from the file.
var recordBlock = 511; //The number of records to write at once.

lineReader.eachLine('projectRecordsJSON.json', function(line, last) {
  execute = false;
  currentLine = line.toString().replace(/'/g, "\"", "g");
  try{
    jsonRecord = JSON.parse(currentLine);


    if (numRecords) {
      values += ', ';
    }
    if(jsonRecord.description == null){
      jsonRecord.description = "";
    }
    values += `('${jsonRecord.title}', '${jsonRecord.categories[0]}', '${jsonRecord.description} ', '${jsonRecord.asin}')`;
    numRecords++;

//Change the query to align with your schema
    if (numRecords == recordBlock) {
      query = `INSERT INTO products (productName, groups, productDescription, asin) VALUES ${values};`; //Template, replaces ${values} with the value of values.
      values = "";
      numRecords = 0;
      execute = true;
      //console.log(query);
    }
  }catch(err) {
    execute = false;//there was a quote in the text and the parse failed ... skip insert
    console.log(err);
  }
  if(execute){
    co(function* () {
      console.log("****************************************************in execute**************************************************************************************");
        var resp = yield sql.query(query);
        console.log("resp = " + resp);
        totalRecords += recordBlock;
        console.log(totalRecords + " records inserted.");
    });
  }//if(execute)
});//lineReader.eachLine
