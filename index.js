const fs = require('fs');
const http = require('http');
const path = require('path');
const { pid } = require('process');
const url = require('url');

// const data = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(data);

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1)  => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             fs.writeFile('./txt/final.txt', `${data2} ${data3}`, 'utf-8', err => {
//                 console.log("written");
//             })
//         })
//     });
// });
const replaceTemplate = (temp, product) => {
    // console.log(temp);
    // console.log(product);
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)
    if(!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    return output
}
const tempOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const tempProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');


const data = fs.readFileSync('./data.json', 'utf-8');
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true)
    // Overview
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{
            'content-type' : 'text/html'
        })
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);
    }
    // Product page
    else if(pathname === '/product'){
        res.writeHead(200,{
            'content-type' : 'text/html'
        })
        const p_id = dataObj[query.id];
        // console.log(p_id);
        const output = replaceTemplate(tempProduct,p_id)
        res.end(output);
    }
    // API
    else if(pathname === '/api'){
        res.writeHead(200, 
            {
                'content-type' : 'application/json'
            });
            res.end(data)
    }
    // OTHERWISE
    else{
        res.end("ERROR");
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening from server");
});