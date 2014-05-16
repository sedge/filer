define(["Filer"], function(Filer) {

  describe("Filer", function() {
    it("is defined", function() {
      expect(typeof Filer).not.to.equal(undefined);
    });

    it("has FileSystem constructor", function() {
      expect(typeof Filer.FileSystem).to.equal('function');
    });

    it("can be required", function() {
      var testFil = require("../../filer"),
          trueFil = require("dist/filer.js");

      expect(testFil.toString()).to.equal(trueFil.toString());
    });
  });
});
