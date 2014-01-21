var fs = require('fs');
var Buffer = require('buffer').Buffer;
var watchr = require('watchr');

var cachedir = process.argv[2];
var writedir = process.argv[3];
var fileIndex = 0;

watchr.watch({
  paths: [cachedir],
  listeners: {
    error: function(err){
            console.log('A watchr error occured: ', err);
          },
    change: function(changeType,filePath,fileCurrentStat,filePreviousStat){
        if( changeType == "create" || changeType == "update" ){
          console.log(filePath);
          fs.open(filePath, 'r', function(err, fd){
            if (err) return err;
            var buffer = new Buffer(8);
            fs.read(fd, buffer, 0, 8, 0, function(err, num){
              var ident = buffer.toString('hex', 0, num);
              console.log("Eight bytes " + ident );
              if(ident.match("000000[0-9]{2}66747970")){
                console.log("BIG WIN!!!");
                fs.createReadStream(filePath).pipe(fs.createWriteStream(writedir + fileIndex + ".mp4"));
                fileIndex = fileIndex + 1;
              }
            });
          });
        }
      //console.log('a change event occured:',arguments);
    }
  }
});
