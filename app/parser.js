function splitInput(str) {
  // Convert all line breaks to \n
  let normalizedBreaks = str.replace(/\r\n?/g, "\n")
  return normalizedBreaks.split("\n\n");
}

// Checks first character and determins what block type should be applied
function identifyBlockType(block) {
    let startChar = block.charAt(0);
    if (startChar === "#") {
      return "h";
    }
    return "p";
}

module.exports.parseBlocks = function(inputStr) {
  let unprocessedBlocks = splitInput(inputStr);
  let outputArray = [];
  
  unprocessedBlocks.forEach((content) => {
    if (content.length > 0) {
     outputArray.push({ type: identifyBlockType(content), content });
    }
  });
  return outputArray; 
}

