const parser = require("../app/parser.js");
const expect = require("chai").expect;

// Assumes expectedOutput has the format [{ type, content}]
function testBlocks(input, expectedOutput) {
  let output = parser.parseBlocks(input)
  expect(output).to.have.lengthOf(expectedOutput.length);
  output.forEach(function(obj, index) {
    expect(obj.type).to.equal(expectedOutput[index].type);
    expect(obj.content).to.equal(expectedOutput[index].content);
  }, this);
}

describe("Convert input string into objects", function(){
  describe("Recognize normalized paragraphs", function(){
    it("Should recognize paragraphs with \\n line breaks", function() {
      let input = "Paragraph 1\n\nParagraph 2\n\n"
      let expectedOutput = [{type: "p", content: "Paragraph 1"}, {type: "p", content: "Paragraph 2"}]
      testBlocks(input, expectedOutput);
    });
  });

  describe("Recognize non-normalized paragraphs", function(){
    it("Should recognize paragraphs with \\r or \\r\\n linebreaks", function() {
      let input = "Paragraph 1\r\rParagraph 2\r\n\r\n"
      let expectedOutput = [{type: "p", content: "Paragraph 1"}, {type: "p", content: "Paragraph 2"}]
      testBlocks(input, expectedOutput);
    });
  });

  describe("Recognize headers", function(){
    describe("Identify just headers", function(){
      it("Should recognize lines starting with a # are headers", function(){
        let input = "# Header 1\n\n# Header 2\n\n";
        let expectedOutput = [{type: "h", content: "# Header 1"}, {type: "h", content: "# Header 2"}];
        testBlocks(input, expectedOutput);
      })
    })
  })
})
