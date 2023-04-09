const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const fs = require('fs');
/*Req to webscrapping link*/
router.get('/', function(req,res){
    res.render('scr', { title: 'Game search' });
})

router.post('/', (req, res) => {
    let gameName = req.body.game;
    console.log(gameName);
    const searchList = fetchGame(gameName).then((searchList)=>{
        console.log("Finished !")
        console.log(searchList.length)
        res.render('scr', { gameName: gameName, searchList: searchList });
    });


    // Do something with the submitted data
});

async function fetchGame(gameName){
    let arr1 = [];

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({width: 1080, height: 1024});
        await page.goto('https://www.allkeyshop.com/blog/catalogue/category-pc-games-all/');
        await page.type('#search-form-keywords',gameName);

        await page.keyboard.down("Enter");
        await page.waitForTimeout(5000);
        const searchList = await page.$$('body > div.container.content.search > div > div.col-xl-9 > div > ul > li')
        for (const element of searchList) {
            const gameName = await element.evaluate(element => {
                const h2 = element.querySelector('h2');
                return h2 ? h2.textContent : '';
            });
            const lowestPrice = await element.evaluate(element => {
                const price = element.querySelector('body > div.container.content.search > div > div.col-xl-9 > div > ul > li > a > div.search-results-row-price').textContent
                const trimmedStr = price.replace(/\s/g, '');
                return trimmedStr;
            });

            const logo = await element.evaluate(element =>{
                const image = element.querySelector('body > div.container.content.search > div > div.col-xl-9 > div > ul > li > a > div.search-results-row-image > div.search-results-row-image-ratio')
                const url = image.getAttribute('style').match(/url\((.*?)\)/)[1];
                return url;
            })

            arr1.push({name:gameName,price: lowestPrice ,logo: logo });
            console.log(arr1)
        }
        //console.log(arr1);
        //const screenshotBuffer = await page.screenshot({ fullPage: true });
        //await fs.promises.writeFile('screenshot.png', screenshotBuffer);
        await browser.close();
        return arr1;

}

//faz com que o ficheiro fique acessivel a todos os ficheiros
module.exports = router;