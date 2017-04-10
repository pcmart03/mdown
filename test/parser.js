const parser = require('../app/parser.js');
const expect = require('chai').expect;

// Assumes expectedOutput has the format [{ type, content}]
function testBlocks(input, expectedOutput) {
  let output = parser.parseBlocks(input)
  expect(output).to.have.lengthOf(expectedOutput.length);
  output.forEach(function(obj, index) {
    expect(obj.type).to.equal(expectedOutput[index].type);
    expect(obj.content).to.equal(expectedOutput[index].content);
  }, this);
}

describe('Split input string into blocks and output as objects {type, content}', function(){
  describe('Recognize paragraphs', function(){
    it('Should recognize paragraphs with \\n line breaks', function() {
      let input = 'Paragraph 1\n\nParagraph 2\n\n'
      let expectedOutput = [{type: 'p', content: 'Paragraph 1'}, {type: 'p', content: 'Paragraph 2'}]
      testBlocks(input, expectedOutput);
    });

    it('Should recognize paragraphs with \\r or \\r\\n linebreaks', function() {
      let input = 'Paragraph 1\r\rParagraph 2\r\n\r\n'
      let expectedOutput = [{type: 'p', content: 'Paragraph 1'}, {type: 'p', content: 'Paragraph 2'}]
      testBlocks(input, expectedOutput);
    });

    it('Should treat lines containing only tabs and spaces as blank', function(){
      let input = 'Paragraph 1\n\t\nParagraph 2\r\n\r\nParagraph 3\n \nParagraph 4';
      let expectedOutput = [{type: 'p', content: 'Paragraph 1'}, 
                            {type: 'p', content: 'Paragraph 2'},
                            {type: 'p', content: 'Paragraph 3'},
                            {type: 'p', content: 'Paragraph 4'}]
      testBlocks(input, expectedOutput);
    });
  });

  describe('Recognize headers', function(){
    describe('Identify just headers', function(){
      it('Should recognize blocks starting with a # are headers', function(){
        let input = '# Header 1\n\n# Header 2\n\n';
        let expectedOutput = [{type: 'h', content: '# Header 1'}, {type: 'h', content: '# Header 2'}];
        testBlocks(input, expectedOutput);
      });
    });
  });

 describe('Recognize lists', function() {
    describe('Recognize unordered and ordered lists', function(){
      it('Should recognize blocks starting with /([\*\+-] )/ as an unordered lists', function(){
        let input = 'Paragraph 1\n\n* list 1 item 1\n* list 1 item 2\n\n+ list 2 item 1\n+ list 2 item 2\n\n- list 3 item 1';
        let expectedOutput = [{type: 'p', content: 'Paragraph 1'}, 
                              {type: 'ul', content: '* list 1 item 1\n* list 1 item 2'},
                              {type: 'ul', content: '+ list 2 item 1\n+ list 2 item 2'},
                              {type: 'ul', content: '- list 3 item 1'}];
        testBlocks(input, expectedOutput); 
      });

      it('Should recognize blocks beginning with /(\d+\. )/ as ordered lists.', function(){
        let input = 'Paragraph 1\n\n1. item 1\n2. item 3';
        let expectedOutput = [{type: 'p', content: 'Paragraph 1'},
                              {type: 'ol', content: '1. item 1\n2. item 3'}];
        testBlocks(input, expectedOutput); 
      });
      
      it('Should allow unordered lists to start with up to three spaces', function() {
        let input = 'Paragraph 1\n\n * list 1 item 1\n * list 1 item 2\n\n  + list 2 item 1\n  + list 2 item 2\n\n   - list 3 item 1';
        let expectedOutput = [{type: 'p', content: 'Paragraph 1'}, 
                              {type: 'ul', content: ' * list 1 item 1\n * list 1 item 2'},
                              {type: 'ul', content: '  + list 2 item 1\n  + list 2 item 2'},
                              {type: 'ul', content: '   - list 3 item 1'}];
        testBlocks(input, expectedOutput);
      });

      it('Should allow ordered lists to start with up to three spaces', function() {
        let input = 'Paragraph 1\n\n 1. list 1 item 1\n 2. list 1 item 2\n\n  1. list 2 item 1\n  1. list 2 item 2\n\n   1. list 3 item 1';
        let expectedOutput = [{type: 'p', content: 'Paragraph 1'}, 
                              {type: 'ol', content: ' 1. list 1 item 1\n 2. list 1 item 2'},
                              {type: 'ol', content: '  1. list 2 item 1\n  1. list 2 item 2'},
                              {type: 'ol', content: '   1. list 3 item 1'}];
        testBlocks(input, expectedOutput);
      });
    });
  });

  describe("Recognize horizontal rule", function(){
    it('Should recognize *** as a horizontal rule', function() {
      let input = 'Paragraph 1\n\n***';
      let expectedOutput = [{type: 'p', content: 'Paragraph 1'},
                            {type: 'hr', content: '***'}];
      testBlocks(input, expectedOutput); 
    });

    it('Should recognize * * * as a horizontal rule', function() {
      let input = 'Paragraph 1\n\n* * *';
      let expectedOutput = [{type: 'p', content: 'Paragraph 1'},
                            {type: 'hr', content: '* * *'}];
      testBlocks(input, expectedOutput); 
    });

    it('Should recognize --- as a horizontal rule', function() {
      let input = 'Paragraph 1\n\n---';
      let expectedOutput = [{type: 'p', content: 'Paragraph 1'},
                            {type: 'hr', content: '---'}];
      testBlocks(input, expectedOutput); 
    });

    it('Should recognize - - - as a horizontal rule', function() {
      let input = 'Paragraph 1\n\n- - -';
      let expectedOutput = [{type: 'p', content: 'Paragraph 1'},
                            {type: 'hr', content: '- - -'}];
      testBlocks(input, expectedOutput); 
    });

    it('Should recognize more than three * or - without spaces as a horizontal rule', function() {
      let input = 'Paragraph 1\n\n****\n\n-----';
      let expectedOutput = [{type: 'p', content: 'Paragraph 1'},
                            {type: 'hr', content: '****'},
                            {type: 'hr', content: '-----'}];
      testBlocks(input, expectedOutput); 
    });
    
    it('Should recognize more than three * or - with spaces as a horizontal rule', function() {
      let input = 'Paragraph 1\n\n* * * *\n\n- - - - -';
      let expectedOutput = [{type: 'p', content: 'Paragraph 1'},
                            {type: 'hr', content: '* * * *'},
                            {type: 'hr', content: '- - - - -'}];
      testBlocks(input, expectedOutput); 
    });
  });

}); // end Convert tests 
