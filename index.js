var fs = require('fs');
const http = require("http");
var pdf = require('html-pdf');
const ejs = require('ejs');
const express = require('express');
var md5 = require('md5');
const app = express();

app.get('/',function(req,res){
  ejs.renderFile('./template/print.ejs', {user:{name:'King of Hyderabad'}}, {}, function(err, str){
    // str => Rendered HTML string
    const htmlFilePath = './data'+ md5(new Date()+makeid(5))+'.html';
    const pdfFilePath = './businesscard'+ md5(new Date()+makeid(5))+'.pdf';
    writeFile(str,htmlFilePath).then((data)=>{
       return createPdf(htmlFilePath,pdfFilePath);   
    }).then((data)=>{
      // fs.readFile(pdfFilePath , function (err,data){
      //     res.contentType("application/pdf");
      //     setTimeout(deleteFile,2000,htmlFilePath);
      //     setTimeout(deleteFile,2000,pdfFilePath);
      //     res.send(data);
      // });
      setTimeout(deleteFile,2000,htmlFilePath);
      setTimeout(deleteFile,2000,pdfFilePath);      
      res.download(pdfFilePath);
    })
  });
})

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function deleteFile(filePath){
  fs.unlinkSync(filePath);
}

app.listen('8000',function(){
  console.log('Listen 8000');
})


function writeFile(str,htmlFilePath){
  return new Promise((resolve, reject) => {
    fs.writeFile(htmlFilePath, str, function(err,data) {
      if (err) reject(err)
      else resolve(data)
    });
  });
}


function createPdf(htmlFilePath,pdfFilePath){
  const html = fs.readFileSync(htmlFilePath, 'utf8');
  const options = { format: 'Letter' };
  return new Promise((resolve, reject) => {
    pdf.create(html, options).toFile(pdfFilePath, function(err, res) {
      if (err) reject(err)
      else resolve(res)
    });
  });
}


