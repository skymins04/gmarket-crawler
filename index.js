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
const OUTPUTDIR = presetFile.OUTPUTDIR;
const FILENAME = presetFile.FILENAME;
var URL = '';
var DESCRIPT = '';

const makeFolder = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};

const getHtml = async (url_) => {
    try {
        return await axios.get(url_, {headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36' }});
    } catch (err) {
        console.error(err);
    }
};

if ((!(SELLERS >= 0 && SELLERS <= 80 && SELLERS % 1 === 0) && MODE === 'best') || SELLERS < 0) throw 'SELLERS of preset.json is not vaild.';
if ((ONLY_POWERDEALER || ONLY_POWERDEALER === false) && typeof ONLY_POWERDEALER !== 'boolean') throw 'ONLY_POWERDEALER of preset.json is not vaild.';
if (!OUTPUTDIR || typeof OUTPUTDIR !== 'string') throw 'OUTPUTDIR of preset.json is not vaild';
if (!FILENAME || typeof FILENAME !== 'string') throw 'FILENAME of preset.json is not vaild';
if (MODE === 'default') {
    if (!presetFile.LARGE_CATEGORY_CODE) throw 'can not found LARGE_CATEGORY_CODE in preset.json';
    if (typeof presetFile.LARGE_CATEGORY_CODE !== 'string') throw 'LARGE_CATEGORY_CODE\'s datatype is not \'string\' in preset.json';
    URL += `http://browse.gmarket.co.kr/list?category=${presetFile.LARGE_CATEGORY_CODE}`;
} else if (MODE === 'best') {
    URL += 'http://corners.gmarket.co.kr/Bestsellers?viewType=C';
    if (presetFile.LARGE_CATEGORY_CODE) {
        if (typeof presetFile.LARGE_CATEGORY_CODE !== 'string') throw 'LARGE_CATEGORY_CODE\'s datatype is not \'string\' in preset.json';
        URL += `&largeCategoryCode=${presetFile.LARGE_CATEGORY_CODE}`;
        if (presetFile.MEDIUM_CATEGORY_CODE) {
            if (typeof presetFile.MEDIUM_CATEGORY_CODE !== 'string') throw 'MEDIUM_CATEGORY_CODE\'s datatype is not \'string\' in preset.json';
            URL += `&mediumCategoryCode=${presetFile.MEDIUM_CATEGORY_CODE}`;
            if (presetFile.SMALL_CATEGORY_CODE) {
                if (typeof presetFile.SMALL_CATEGORY_CODE !== 'string') throw 'SMALL_CATEGORY_CODE\'s datatype is not \'string\' in preset.json';
                URL += `&smallCategoryCode=${presetFile.SMALL_CATEGORY_CODE}`;
            }
        }
    } else throw 'can not found LARGE_CATEGORY_CODE in preset.json';
} else throw 'MODE of preset.json is not vaild';

console.log(`crawling mode: ${MODE}`);
console.log(`crawling sellers: ${SELLERS}`);
console.log(`only powerdealer: ${ONLY_POWERDEALER}`);
console.log(`crawling url: ${URL}`);

getHtml(URL).then(async html => {
        let list = [];
        let page = 1;
        let url = URL;

        let $ = cheerio.load(html.data);
        let $bodyList = $(MODE === 'default' ? 'div.box__component-itemcard--general' : 'div.best-list ul li');

        console.log('finding for datas...');

        if(MODE === 'default') DESCRIPT = $('a.link--active .text').text().trim();

        $bodyList.each(function (i, elem) {
            if(MODE === 'default') {
                list[i] = $(elem).find('a.link__item').attr('href');
            }
            else {
                list[i] = $(elem).find('a.itemname').attr('href');
            }
        });

        list = list.filter(n => n);

        while (list.length < SELLERS*2 && MODE === 'default') {
            console.log('loading more datas...');
            page += 1;
            URL = url + `&p=${page}`;
            console.log(URL);
            list.push(...await getHtml(URL).then(html => {
                let _l = [];
                let $ = cheerio.load(html.data);
                let $bodyList = $('div.box__component-itemcard--general');
                $bodyList.each(function (i, elem) {
                    _l[i] = $(elem).find('a.link__item').attr('href');
                });
                _l = _l.filter(n => n);
                $ = null;
                $bodyList = null;
                return _l;
            }));
        }

        list = list.filter(n => n);

        console.log(list);
        console.log(`found datas... ${list.length}`);

        $ = null;
        $bodyList = null;
        html = null;

        return list;
    })
    .then(async urls => {
        let seller_list = [];
        let ext_idx = 0;

        console.log('please waiting for crawling datas...');

        for (i = 0; seller_list.length != SELLERS; i++) {
            seller_list.push(await getHtml(urls[i]).then(async html => {
                console.log(`crawling ${i}: ${urls[i]}`);

                let substring_data = html.data.substring(html.data.indexOf('var goods = ') + 12, html.data.length);
                console.log(substring_data.substring(0, substring_data.indexOf(';')));
                let shopinfo_req = await axios.default.post('http://item.gmarket.co.kr/Shop/ShopInfo', JSON.parse(substring_data.substring(0, substring_data.indexOf(';'))));
                let $shopinfo = cheerio.load(shopinfo_req.data);
                substring_data = null;
                shopinfo_req = null;
                let $ = cheerio.load(html.data);

                let url = $('span.text__seller a').attr('href');
                const data = await getHtml(url).then(html => {
                    if (html.data.indexOf('파워딜러') != -1 || $shopinfo('span.power-dealer').length || !ONLY_POWERDEALER) {
                        let $ = cheerio.load(html.data);
                        let data = {
                            name: '',
                            ceo: '',
                            tel: '',
                            worktime: '',
                            fax: '',
                            email: '',
                            addr: '',
                            products: 0
                        };

                        $('span.data_num').each(function (i, elem) {
                            data.products += Number($(elem).text().trim().replace(/[^0-9]/g, ''));
                        });
                        if(data.products === 0) {
                            console.log(`can not load this(index: ${i}) dealer's number of products (url: ${urls[i]})... skip`);
                            ext_idx += 1;

                            $ = null;
                            html = null;
                            return null;
                        }

                        $('div.seller_info_box dl').children().each(function (i, elem) {
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
                                default: break;
                            }
                        });

                        $ = null;
                        html = null;
                        return data;
                    } else {
                        console.log(`this(index: ${i}) dealer is not power dealer(url: ${urls[i]})... skip`);
                        ext_idx += 1;

                        $ = null;
                        html = null;
                        return null;
                    }
                });

                if (data === null) {
                    $ = null;
                    $shopinfo = null;
                    html = null;
                    return null;
                } else {
                    if(MODE === 'default') {
                        $ = null;
                        $shopinfo = null;
                        html = null;
                        return {
                            '순번': i - ext_idx + 1,
                            '상호명': data.name,
                            '온라인매장 주소': url,
                            '대표자명': data.ceo,
                            '전화번호': data.tel,
                            '응대가능시간': data.worktime,
                            '팩스번호': data.fax,
                            '이메일': data.email,
                            '소재지': data.addr,
                            '등록상품수': data.products
                        }
                    }
                    else {
                        $ = null;
                        $shopinfo = null;
                        url = null;
                        html = null;
                        return {
                            '순위': i - ext_idx + 1,
                            '상호명': data.name,
                            '온라인매장 주소': url,
                            '대표자명': data.ceo,
                            '전화번호': data.tel,
                            '응대가능시간': data.worktime,
                            '팩스번호': data.fax,
                            '이메일': data.email,
                            '소재지': data.addr,
                            '등록상품수': data.products
                        }
                    }
                }
            }));
            if(seller_list[seller_list.length-1] === null) {
                seller_list.pop();
            }
            else if(seller_list[seller_list.length-1]['상호명'] === '') {
                seller_list.pop();
                ext_idx += 1;
            }
            else {
                for(var j = 0; j < seller_list.length-1; j++) {
                    if(seller_list[j]['상호명'] === seller_list[seller_list.length-1]['상호명']) {
                        seller_list.pop();
                        ext_idx += 1;
                        break;
                    }
                }
            }
            console.log(`seller list: ${seller_list.length}`);
        }

        return seller_list.filter(n => n);
    })
    .then(seller_list => {
        const date = new Date().toString();
        makeFolder(OUTPUTDIR);
        fs.writeFileSync(`${OUTPUTDIR}/${FILENAME}${DESCRIPT}_${MODE}${SELLERS}_${date}.json`, JSON.stringify(seller_list, null, 4));
        console.log('complete crawling');
    });