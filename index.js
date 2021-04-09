const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const URL = 'http://corners.gmarket.co.kr/BestSellers?viewType=C&largeCategoryCode=100000003';
const SELLERS = 30;

const makeFolder = (dir) => {
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};

const getHtml = async (url_) => {
    try { return await axios.get(url_); }
    catch (err) { console.error(err); }
};

getHtml(URL).then(html => {
    let list = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $('div.best-list ul li');

    console.log('please waiting for crawling datas...');

    $bodyList.each(function(i, elem) {
        list[i] = $(elem).find('a.itemname').attr('href');
    });
    console.log(list);

    return list.filter(n => n);
})
.then(async urls => {
    let seller_list = [];

    for(i = 0; i < ((urls.length >= SELLERS) ? SELLERS : urls.length); i++) {
        seller_list.push(await getHtml(urls[i]).then(async html => {

            const $ = cheerio.load(html.data);
            const url = $('span.text__seller a').attr('href');
            const data = await getHtml(url).then(html => {

                const $ = cheerio.load(html.data);
                const $bodyList = $('div.seller_info_box dl').children();
                let data = {
                    name: NaN,
                    ceo: NaN,
                    tel: NaN,
                    worktime: NaN,
                    fax: NaN,
                    email: NaN,
                    addr: NaN
                };

                $bodyList.each(function(i, elem) {
                    console.log($(elem).text().trim());
                    switch($(elem).text().trim()) {
                        case '상호':
                            data.name = $(elem).next().text().trim(); break;
                        case '대표자':
                            data.ceo = $(elem).next().text().trim(); break;
                        case '전화번호':
                            data.tel = $(elem).next().text().trim(); break;
                        case '응대시간':
                            data.worktime = $(elem).next().text().trim(); break;
                        case '팩스번호':
                            data.fax = $(elem).next().text().trim(); break;
                        case '이메일':
                            data.email = $(elem).next().text().trim(); break;
                        case '영업소재지':
                            data.addr = $(elem).next().text().trim(); break;
                        default: console.log('skip'); break;
                    }
                });

                return data;
            });

            return {
                rank: i + 1,
                name: data.name,
                url: url,
                ceo: data.ceo,
                tel: data.tel,
                worktime: data.worktime,
                fax: data.fax,
                email: data.email,
                addr: data.addr
            }
        }));
    }

    return seller_list;
})
.then(seller_list => {
    const date = new Date().toString();
    makeFolder('./data');
    fs.writeFileSync('./data/shoplab_'+date+'.json', JSON.stringify(seller_list,null,4));
})