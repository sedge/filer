var Filer = require('../../..');
var util = require('../../lib/test-utils.js');
var expect = require('chai').expect;

describe('FileSystemShell.du', function() {
  beforeEach(util.setup);
  afterEach(util.cleanup);

  it('should be a function', function(done){
    var fs = util.fs();
    var shell = fs.Shell();

    expect(typeof shell.du).to.equal('function');

    done();
  })

  it('should return the current directory properly if run without the first argument', function(done){
    var fs = util.fs();
    var shell = fs.Shell();

    // Step 1: Run the du command without the first argument,
    //         expecting a report on `/`
    shell.du(function(err, data) {
      if(err) throw err;

      expect(data).to.exist;
      expect(data.total).to.exist;
      expect(typeof data.total).to.equal('number');
      expect(data.total).to.equal(0);

      expect(data.entries).to.exist;
      expect(data.entries.length).to.equal(1);
      expect(data.entries[0]['/']).to.equal(0);

      done();
    });
  });

  it('should return properly if run on an empty directory', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    // Step 1: Make a directory to test in
    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      // Step 2: Run the du command
      shell.du('/dir', function(err, data) {
        if(err) throw err;

        expect(data).to.exist;
        expect(data.total).to.exist;
        expect(typeof data.total).to.equal('number');
        expect(data.total).to.equal(0);

        expect(data.entries).to.exist;
        expect(data.entries.length).to.equal(1);
        expect(data.entries[0]['/dir']).to.equal(0);

        done();
      });
    });
  });

  it('should return properly if run inside an empty directory', function(done) {
    var fs = util.fs();
    var shell = fs.Shell();

    // Step 1: Make a directory to test in
    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      // Step 2: Checkout to the directory
      shell.cd('/dir', function(err) {
        if(err) throw err;

        // Step 2: Run the du command
        shell.du(function(err, data) {
          if(err) throw err;

          expect(data).to.exist;
          expect(data.total).to.exist;
          expect(typeof data.total).to.equal('number');
          expect(data.total).to.equal(0);

          expect(data.entries).to.exist;
          expect(data.entries.length).to.equal(1);
          expect(data.entries[0]['/dir']).to.exist;
          expect(data.entries[0]['/dir']).to.equal(0);

          done();
        });
      })
    });
  });

  it('should return properly if run on a specific file', function(done){
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "hello world";

    // Step 1: Create file
    fs.writeFile('/testFile', contents, function(err) {
      if(err) throw err;

      // Step 2: Run `du` on file
      shell.du('/testFile', function(err, data) {
        if(err) throw err;

        expect(data).to.exist;
        expect(data.total).to.exist;
        expect(typeof data.total).to.equal('number');
        expect(data.total).to.equal(11);

        expect(data.entries).to.exist;
        expect(data.entries.length).to.equal(1);
        expect(data.entries[0]['/testFile']).to.exist;
        expect(data.entries[0]['/testFile']).to.equal(11);

        done();
      });
    });
  });

  it('should return properly if run on a directory containing a single file', function(done){
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "hello world";

    // Step 1: Create directory
    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      // Step 2: Create file inside directory
      fs.writeFile('/dir/testFile', contents, function(err) {
        if(err) throw err;

        // Step 2: Run `du` on file
        shell.du('/dir', function(err, data) {
          if(err) throw err;

          expect(data).to.exist;
          expect(data.total).to.exist;
          expect(typeof data.total).to.equal('number');
          expect(data.total).to.equal(11);

          expect(data.entries).to.exist;
          expect(data.entries.length).to.equal(2);
          expect(data.entries[0]['/dir']).to.exist;
          expect(data.entries[0]['/dir']).to.equal(11);
          expect(data.entries[1]['/dir/testFile']).to.exist;
          expect(data.entries[1]['/dir/testFile']).to.equal(11);

          done();
        });
      });
    });
  });

  it('should return properly if run inside a directory containing a single file', function(done){
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "hello world";

    // Step 1: Create directory
    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      // Step 2: Create file inside directory
      fs.writeFile('/dir/testFile', contents, function(err) {
        if(err) throw err;

        // Step 3: Change to the new directory
        shell.cd('/dir', function(err){
          if(err) throw err;

          // Step 4: Run `du`
          shell.du(function(err, data) {
            if(err) throw err;

            expect(data).to.exist;
            expect(data.total).to.exist;
            expect(typeof data.total).to.equal('number');
            expect(data.total).to.equal(11);

            expect(data.entries).to.exist;
            expect(data.entries.length).to.equal(2);
            expect(data.entries[0]['/dir']).to.exist;
            expect(data.entries[0]['/dir']).to.equal(11);
            expect(data.entries[1]['/dir/testFile']).to.exist;
            expect(data.entries[1]['/dir/testFile']).to.equal(11);

            done();
          });
        });
      });
    });
  })

  it('should return properly if run on a directory containing multiple files', function(done){
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "hello world";
    var contents2 = "hello Kieran";

    // Step 1: Create directory
    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      // Step 2: Create file inside directory
      fs.writeFile('/dir/testFile', contents, function(err) {
        if(err) throw err;

        fs.writeFile('/dir/testFile2', contents2, function(err){
          if(err) throw err;

          // Step 3: Run `du`
          shell.du('/dir', function(err, data) {
            if(err) throw err;

            expect(data).to.exist;
            expect(data.total).to.exist;
            expect(typeof data.total).to.equal('number');
            expect(data.total).to.equal(11 + 12);

            expect(data.entries).to.exist;
            expect(data.entries.length).to.equal(3);
            expect(data.entries[0]['/dir']).to.exist;
            expect(data.entries[0]['/dir']).to.equal(11 + 12);
            expect(data.entries[1]['/dir/testFile']).to.exist;
            expect(data.entries[1]['/dir/testFile']).to.equal(11);
            expect(data.entries[2]['/dir/testFile2']).to.exist;
            expect(data.entries[2]['/dir/testFile2']).to.equal(12);

            done();
          });
        });
      });
    });
  });

  it('should return properly if run inside a directory containing multiple files', function(done){
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "hello world";
    var contents2 = "hello Kieran";

    // Step 1: Create directory
    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      // Step 2: Create file inside directory
      fs.writeFile('/dir/testFile', contents, function(err) {
        if(err) throw err;

        fs.writeFile('/dir/testFile2', contents2, function(err){
          if(err) throw err;

          // Step 3: Run `du`
          shell.cd('/dir', function(err){
            if (err) throw err;
            // Step 3: Run `du`
            shell.du(function(err, data) {
              if(err) throw err;

              expect(data).to.exist;
              expect(data.total).to.exist;
              expect(typeof data.total).to.equal('number');
              expect(data.total).to.equal(11 + 12);

              expect(data.entries).to.exist;
              expect(data.entries.length).to.equal(3);
              expect(data.entries[0]['/dir']).to.exist;
              expect(data.entries[0]['/dir']).to.equal(11 + 12);
              expect(data.entries[1]['/dir/testFile']).to.exist;
              expect(data.entries[1]['/dir/testFile']).to.equal(11);
              expect(data.entries[2]['/dir/testFile2']).to.exist;
              expect(data.entries[2]['/dir/testFile2']).to.equal(12);

              done();
            });
          });
        });
      });
    });
  });

  it('should return properly if run on a directory containing multiple files and another directory containing multiple files', function(done){
    var fs = util.fs();
    var shell = fs.Shell();
    var contents = "hello world";
    var contents2 = "hello Kieran";

    // Step 1: Create directory
    fs.mkdir('/dir', function(err) {
      if(err) throw err;

      // Step 2: Create files inside directory
      fs.writeFile('/dir/testFile', contents, function(err) {
        if(err) throw err;

        fs.writeFile('/dir/testFile2', contents2, function(err){
          if(err) throw err;


          fs.mkdir('/dir/dir2', function(err) {
            if(err) throw err;

            fs.writeFile('/dir/dir2/testFile', contents, function(err) {
              if(err) throw err;

              fs.writeFile('/dir/dir2/testFile2', contents2, function(err) {
                if(err) throw err;

                // Step 3: Run `du`
                shell.du('/dir', function(err, data) {
                  if(err) throw err;

                  expect(data).to.exist;
                  expect(data.total).to.exist;
                  expect(typeof data.total).to.equal('number');
                  expect(data.total).to.equal(11 + 12 + 11 + 12);

                  expect(data.entries).to.exist;
                  expect(data.entries.length).to.equal(6);
                  expect(data.entries[0]['/dir']).to.exist;
                  expect(data.entries[0]['/dir']).to.equal(11 + 12 + 11 + 12);
                  expect(data.entries[1]['/dir/testFile']).to.exist;
                  expect(data.entries[1]['/dir/testFile']).to.equal(11);
                  expect(data.entries[2]['/dir/testFile2']).to.exist;
                  expect(data.entries[2]['/dir/testFile2']).to.equal(12);
                  expect(data.entries[3]['/dir/dir2']).to.exist;
                  expect(data.entries[3]['/dir/dir2']).to.equal(11 + 12);
                  expect(data.entries[4]['/dir/dir2/testFile']).to.exist;
                  expect(data.entries[4]['/dir/dir2/testFile']).to.equal(11);
                  expect(data.entries[5]['/dir/dir2/testFile2']).to.exist;
                  expect(data.entries[5]['/dir/dir2/testFile2']).to.equal(12);

                  done();
                });
              });
            });
          });
        });
      });
    });
  });
});

