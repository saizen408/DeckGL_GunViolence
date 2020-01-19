// const csvToJson = require("convert-csv-to-json");

const input = "./globalterrorismdb_0718dist.csv";
const output = "./public/globalTerrorism.json";

// csvToJson
//   .fieldDelimiter(",")
//   .formatValueByType()
//   .generateJsonFileFromCsv(input, output);

var csv2json = require("csv2json");
var fs = require("fs");

fs.createReadStream(input)
  .pipe(
    csv2json({
      // Defaults to comma.
      // separator: ';'
    })
  )
  .pipe(fs.createWriteStream(output));
