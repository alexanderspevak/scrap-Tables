import config from "../config";

export function load(callback) {
  window.gapi.client.load("sheets", "v4", () => {
    window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: config.spreadsheetId,
        range: "Sheet2!A1:AA8000"
      })
      .then(
        response => {
          const data = response.result.values;
          callback(data);
        },
        response => {
          callback(false, response.result.error);
        }
      );
  });
}
export function write(range, values) {
  console.log('prislo sem', range,values)
  window.gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: config.spreadsheetId,
    range,
    valueInputOption: 'RAW',
    resource: { values: [[values]] }
  }).then((response) => {

    var result = response.result;
    console.log(`${result.updatedCells} cells updated.`);
  });
}

export function writeMultipleRanges(range, values, size, fillType) {
  var multipliedValues = values.map((item) => { return Array(size).fill(item) })
  var data = []
  data.push({ range, values: multipliedValues, majorDimension: fillType })
  var body = {
    data: data,
    valueInputOption: 'RAW',
  };
  console.log('body',body)
  window.gapi.client.sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: config.spreadsheetId,
    resource: body
  }).then((response) => {
    var result = response.result;
    console.log(`${result.totalUpdatedCells} cells updated.`);
  })
    .catch(({ result }) => {
      console.log('error', result)
    });
}