const fs = require('fs');
const path = require("path");
const express = require("express");

const PORT = process.env.PORT || 8080;
const html = fs.readFileSync('dist/index.html')
const distPath = path.resolve(__dirname, '../dist');

const app = express();

// Static server path
app.use(express.static(distPath));

app.get('/', function(req,res){
  res.sendFile(path.join(distPath, 'index.html'));
});
  
app.listen(PORT, function () {
  console.log('Server running on: ', PORT);
});