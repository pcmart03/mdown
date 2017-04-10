function splitInput(str) {
  // Convert all line breaks to \n, remove space characters from 
  let normalizedBreaks = str.replace(/(\r\n?)/g, '\n');
  let cleanedBlankLines = normalizedBreaks.replace(/(\n[ \t]+\n)/g, '\n\n');
  return cleanedBlankLines.split('\n\n');
}

function identifyBlockType(block) {
    // Checks for three or more * or - with or without spaces between
    let horizRule = block.match(/^((\*\*\*)(\**)?)|((\* \* \*)( \**)?)|((---)(-*)?)|((- - -)( -*)?)/);
    
    let unorderedList = block.match(/^( {0,3}[\*\+-] )/);
    let orderedList = block.match(/^( {0,3}\d+\. )/);
    let startChar = block.charAt(0);
    
    if(horizRule) {
      return 'hr'
    }
    if (unorderedList) {
      return 'ul';
    }
    if (orderedList) {
      return 'ol';
    }
    if (startChar === '#') {
      return 'h';
    }
    return 'p';
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

