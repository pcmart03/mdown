module.exports.skipSpaces = function(str) {
  let first = str.search(/\S/);
  if (first === -1) {
    return '';
  }
  return str.slice(first);
}

// Accepts a string and a regex expression and trims the lead from the string
module.exports.skipLead = function(str, lead) {
  return str.replace(lead, '');
}