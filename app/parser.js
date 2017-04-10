function splitInput(str) {
  // Convert all line breaks to \n, remove space characters from 
  let normalizedBreaks = str.replace(/(\r\n?)/g, '\n');
  let cleanedBlankLines = normalizedBreaks.replace(/(\n[ \t]+\n)/g, '\n\n');
  return cleanedBlankLines.split('\n\n');
}

function identifyBlockType(block) {
    // Checks for three or more * or - with or without spaces between
    let horizRule = block.match(/^((\*\*\*)(\**)?)|((\* \* \*)( \**)?)|((---)(-*)?)|((- - -)( -*)?)/);
    // Checks for blocks begining with up to three spaces and *, +, or -
    let unorderedList = block.match(/^( {0,3}[\*\+-] )/);
    // checks for blocks begining with up to three spaces, 1 or more digits, a period and a trailing space
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
  let contentFlags = {list: false, code: false};
  let blockType;
  
  unprocessedBlocks.forEach((content) => {
    if (content.length > 0) {
     blockType = identifyBlockType(content);
     outputArray.push({ type: blockType, content });
    }
  });
  return outputArray; 
}

