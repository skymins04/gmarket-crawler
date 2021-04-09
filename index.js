const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const getHtml = async (url_) => {
    try {
        return await axios.get(url_);
    } catch (err) {
        console.error(err);
    }
};

const URL = 'http://corners.gmarket.co.kr/BestSellers?viewType=C&largeCategoryCode=100000003';
const RANK = 30;

getHtml(URL).then(html => {
    let list = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $('div.best-list ul li');

    $bodyList.each(function(i, elem) {
        list[i] = {
            title: $(this).find('a.itemname').attr('href')
        };
    });

    const data = list.filter(n => n.title);
    return data;
})
.then(async res => {
    let seller_list = [];
    for(i = 0; i < RANK; i++) {
        seller_list.push(await getHtml(res[i].title).then(async html => {
            const $ = cheerio.load(html.data);
            const rank = i+1;
            const url = $('span.text__seller a').attr('href');
            const res = await getHtml(url).then(html => {
                const $ = cheerio.load(html.data);
                const name = $('div.seller_info_box dl dd:nth-of-type(1)').text().trim();
                const ceo = $('div.seller_info_box dl dd:nth-of-type(2)').text().trim();
                const tel = $('div.seller_info_box dl dd:nth-of-type(3)').text().trim();
                const worktime = $('div.seller_info_box dl dd:nth-of-type(4)').text().trim();
                const fax = $('div.seller_info_box dl dd:nth-of-type(5)').text().trim();
                const email = $('div.seller_info_box dl dd:nth-of-type(6) a').text().trim();
                const businessnum = $('div.seller_info_box dl dd:nth-of-type(7)').text().trim();
                const addr = $('div.seller_info_box dl dd:nth-of-type(8)').text().trim();

                return {name, ceo, tel, worktime, fax, email, businessnum, addr}
            });

            return {
                rank: rank,
                name: res.name,
                url: url,
                ceo: res.ceo,
                tel: res.tel,
                worktime: res.worktime,
                fax: res.fax,
                email: res.email,
                businessnum: res.businessnum,
                addr: res.addr
            }
        }));
    }
    return seller_list;
})
.then(res => {
    const date = new Date().toString();
    fs.writeFileSync('./data/shoplab_'+date+'.json', JSON.stringify(res,null,4));
})