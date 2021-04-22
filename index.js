const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const presetFile = JSON.parse(fs.readFileSync('./preset.json', 'utf-8'));
const MODE = presetFile.MODE;
const SELLERS = (presetFile.SELLERS <= 0 ?
    1 :
    (presetFile.SELLERS % 1 === 0 ?
        presetFile.SELLERS :
        Math.ceil(presetFile.SELLERS)
    )
);
const ONLY_POWERDEALER = presetFile.ONLY_POWERDEALER;
var URL = '';

const makeFolder = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};

const getHtml = async (url_) => {
    try {
        return await axios.get(url_);
    } catch (err) {
        console.error(err);
    }
};

if(MODE === 'default') {
    throw 'default mode is not supported yet';
}
else if(MODE === 'best') {
    URL += 'http://corners.gmarket.co.kr/Bestsellers?viewType=C';
    if(presetFile.LARGE_CATEGORY_CODE) {
        if(typeof presetFile.LARGE_CATEGORY_CODE !== 'string') throw 'LARGE_CATEGORY_CODE\'s datatype is not \'string\' in preset.json';
        URL += `&largeCategoryCode=${presetFile.LARGE_CATEGORY_CODE}`;
        if(presetFile.MEDIUM_CATEGORY_CODE) {
            if(typeof presetFile.MEDIUM_CATEGORY_CODE !== 'string') throw 'MEDIUM_CATEGORY_CODE\'s datatype is not \'string\' in preset.json';
            URL += `&mediumCategoryCode=${presetFile.MEDIUM_CATEGORY_CODE}`;
            if(presetFile.SMALL_CATEGORY_CODE) {
                if(typeof presetFile.SMALL_CATEGORY_CODE !== 'string') throw 'SMALL_CATEGORY_CODE\'s datatype is not \'string\' in preset.json';
                URL += `&smallCategoryCode=${presetFile.SMALL_CATEGORY_CODE}`;
            }
        }
    }
    else throw 'can not found LARGE_CATEGORY_CODE in preset.json';
}
else throw 'MODE of preset.json is not vaild';

if(!(SELLERS >= 0 && SELLERS <= 80 && SELLERS % 1 === 0 )) throw 'SELLERS of preset.json is not vaild.';
if(typeof ONLY_POWERDEALER !== 'boolean') throw 'ONLY_POWERDEALER of preset.json is not vaild.';

console.log(`crawling mode: ${MODE}`);
console.log(`crawling sellers: ${SELLERS}`);
console.log(`only powerdealer: ${ONLY_POWERDEALER}`);
console.log(`crawling url: ${URL}`);

getHtml(URL).then(html => {
        let list = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $('div.best-list ul li');

        console.log('please waiting for crawling datas...');

        $bodyList.each(function (i, elem) {
            list[i] = $(elem).find('a.itemname').attr('href');
        });
        console.log(list);

        return list.filter(n => n);
    })
    .then(async urls => {
        let seller_list = [];
        let ext_idx = 0;

        for (i = 0; i < ((urls.length >= SELLERS + ext_idx) ? SELLERS + ext_idx : urls.length); i++) {
            seller_list.push(await getHtml(urls[i]).then(async html => {
                console.log(`crawling ${i}: ${urls[i]}`);
                fs.writeFileSync('./log/log.html', html.data);
                
                var substring_data = html.data.substring(html.data.indexOf('var goods = ')+12, html.data.length);
                console.log(substring_data.substring(0, substring_data.indexOf(';')));
                var shopinfo_req = await axios.default.post('http://item.gmarket.co.kr/Shop/ShopInfo', JSON.parse(substring_data.substring(0, substring_data.indexOf(';'))));
                const $shopinfo = cheerio.load(shopinfo_req.data);
                const $ = cheerio.load(html.data);

                const url = $('span.text__seller a').attr('href');
                const data = await getHtml(url).then(html => {
                    if (html.data.indexOf('파워딜러') != -1 || $shopinfo('span.power-dealer').length || !ONLY_POWERDEALER) {
                        const $ = cheerio.load(html.data);
                        const $bodyList = $('div.seller_info_box dl').children();
                        let data = {
                            name: '',
                            ceo: '',
                            tel: '',
                            worktime: '',
                            fax: '',
                            email: '',
                            addr: ''
                        };

                        $bodyList.each(function (i, elem) {
                            console.log($(elem).text().trim());
                            switch ($(elem).text().trim()) {
                                case '상호':
                                    data.name = $(elem).next().text().trim();
                                    break;
                                case '대표자':
                                    data.ceo = $(elem).next().text().trim();
                                    break;
                                case '전화번호':
                                    data.tel = $(elem).next().text().trim();
                                    break;
                                case '응대시간':
                                    data.worktime = $(elem).next().text().trim();
                                    break;
                                case '팩스번호':
                                    data.fax = $(elem).next().text().trim();
                                    break;
                                case '이메일':
                                    data.email = $(elem).next().text().trim();
                                    break;
                                case '영업소재지':
                                    data.addr = $(elem).next().text().trim();
                                    break;
                                default:
                                    console.log('field skip');
                                    break;
                            }
                        });

                        return data;
                    } else {
                        console.log(`this(index: ${i}) dealer is not power dealer(url: ${urls[i]})... skip`);
                        ext_idx += 1;
                        return null;
                    }
                });

                if(data === null) {
                    return null;
                }
                else {
                    return {
                        '순위': i - ext_idx + 1,
                        '상호명': data.name,
                        '온라인매장 주소': url,
                        '대표자명': data.ceo,
                        '전화번호': data.tel,
                        '응대가능시간': data.worktime,
                        '팩스번호': data.fax,
                        '이메일': data.email,
                        '소재지': data.addr
                    }
                }
            }));
        }

        return seller_list.filter(n => n);
    })
    .then(seller_list => {
        const date = new Date().toString();
        makeFolder('./data');
        fs.writeFileSync('./data/shoplab_' + date + '.json', JSON.stringify(seller_list, null, 4));
    })