import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

class GmarketCrawler {
    constructor() {
        axios.defaults.timeout = 5000;
        try {
            this.presetFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../preset.json'), 'utf-8'));
        } catch (e) {
            console.error(e);
            throw 'preset.json is not vaild.';
        }

        this.MODE = this.presetFile.MODE;
        this.DEALERS = this.presetFile.DELLERS;
        this.ONLY_POWERDEALER = this.presetFile.ONLY_POWERDEALER;
        this.OUTDIR = this.presetFile.OUTDIR;
        this.FILENAME = this.presetFile.FILENAME;

    }

    private presetFile: any;

    private MODE: string;

    private DEALERS: number;

    private ONLY_POWERDEALER: boolean;

    private OUTDIR: string;

    private FILENAME: string;

    private URL: string = '';

    private DESCRIPT: string = '';

    private PAGE: number = 1;

    private makeFolder(_dir: string) {
        if (!fs.existsSync(_dir)) fs.mkdirSync(_dir);
    }

    public async reqGet(_url: string = this.URL): Promise < any > {
        let _res: any;
        try {
            console.log('request get...');
            _res = await axios.get(_url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36'
                }
            });
            console.log('request get...Success!');
            return _res;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    public async reqPost(_url: string, _data: any): Promise < any > {
        let _res: any;
        try {
            console.log('request post...');
            _res = await axios.post(_url, _data, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36'
                }
            });
            console.log('request post...Success!');
            return _res;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    public init(): void {
        console.log('initialize Gmarket Dealer info Crawler...');

        if (!this.MODE) throw 'Can not found for MODE field of preset.json.';
        if (!this.presetFile.LARGE_CATEGORY_CODE) throw 'Can not found for LARGE_CATEGORY_CODE field of preset.json';
        if (typeof this.presetFile.LARGE_CATEGORY_CODE !== 'string') throw 'LARGE_CATEGORY_CODE field type of preset.json must be type "string".';
        if (this.MODE === 'default') {
            this.URL += `http://browse.gmarket.co.kr/list?category=${this.presetFile.LARGE_CATEGORY_CODE}`;
        } /*else if (this.MODE === 'best') {
            this.URL += `http://corners.gmarket.co.kr/Bestsellers?viewType=C&largeCategoryCode=${this.presetFile.LARGE_CATEGORY_CODE}`;
            if (this.presetFile.MEDIUM_CATEGORY_CODE) {
                if (typeof this.presetFile.MEDIUM_CATEGORY_CODE !== 'string') throw 'MEDIUM_CATEGORY_CODE field type of preset.json must be type "string".';
                this.URL += `&mediumCategoryCode=${this.presetFile.MEDIUM_CATEGORY_CODE}`;
                if (this.presetFile.SMALL_CATEGORY_CODE) {
                    if (typeof this.presetFile.SMALL_CATEGORY_CODE !== 'string') throw 'SMALL_CATEGORY_CODE field type of preset.json must be type "string".';
                    this.URL += `&smallCategoryCode=${this.presetFile.SMALL_CATEGORY_CODE}`;
                }
            }
        }*/ else if (typeof this.MODE !== 'string') throw 'MODE field type of preset.json must be type "string".';
        else throw 'MODE field of preset.json is not vaild.';

        if (!this.DEALERS && this.MODE === 'default') throw 'Can not found for DEALERS field of preset.json.';
        if (typeof this.DEALERS !== 'number' && this.MODE === 'default') throw 'DEALERS field type of preset.json must be type "number".';
        if (this.DEALERS % 1 !== 0 && this.MODE === 'default') throw 'DEALERS field of preset.json must be integer.';
        if (this.MODE === 'default' && !(this.DEALERS >= 0)) throw 'DEALERS field of preset.json must be bigger than 0 in MODE "default".';

        if ((this.ONLY_POWERDEALER || this.ONLY_POWERDEALER === false) && typeof this.ONLY_POWERDEALER !== 'boolean') throw 'ONLY_POWERDEALERE field of preset.json is not vaild.';

        if (!this.OUTDIR) throw 'Can not found for OUTDIR field of preset.json.';
        if (typeof this.OUTDIR !== 'string') throw 'OUTDIR field type of preset.json must be type "string".';

        if (!this.FILENAME) throw 'Can not found for FILENAME field of preset.json.';
        if (typeof this.FILENAME !== 'string') throw 'FILENAME field type of preset.json must be type "string".';

        console.log(`crawling mode: ${this.MODE}`);
        console.log(`crawling dellers: ${this.DEALERS}`);
        console.log(`only powerdealer: ${this.ONLY_POWERDEALER}`);
        console.log(`crawling url: ${this.URL}`);
        console.log('===============================================================================================');
    }

    public async getURLs(_html: any, _refill: boolean = false): Promise < string[] > {
        let _urls: any = [];
        let _shopNames: string[] = [];

        if (!_refill) {
            const _body = this.MODE === 'default' ?
                'div.box__component-itemcard--general' :
                'div.best-list ul li';
            let _$: cheerio.Root = cheerio.load(_html.data);

            console.log('finding for targets...');

            if (this.MODE === 'default') this.DESCRIPT = _$('a.link--active span.text').text().trim();
            _$(_body).each((i, elem) => {
                if (this.MODE === 'default') {
                    if (this.ONLY_POWERDEALER) {
                        if (_$(elem).find('ul.list__seller-information span.text').text().trim() === '파워딜러') {
                            let _shopName: string = _$(elem).find('a.link__shop span.text__seller').text().trim();
                            if (_shopNames.indexOf(_shopName) === -1) {
                                _shopNames.push(_shopName);
                                _urls[i] = _$(elem).find('a.link__shop').attr('href');
                            }
                        }
                    } else {
                        let _shopName: string = _$(elem).find('a.link__shop span.text__seller').text().trim();
                        if (_shopNames.indexOf(_shopName) === -1) {
                            _shopNames.push(_shopName);
                            _urls[i] = _$(elem).find('a.link__shop').attr('href');
                        }
                    }
                } else _urls[i] = _$(elem).find('a.itemname').attr('href');
            });
            _urls = _urls.filter((n: any) => n);
        }

        while (_urls.length < (this.DEALERS * 1.5) && this.MODE === 'default') {
            let flag = false;
            console.log('loading more targets...');
            this.PAGE += 1;
            console.log(this.URL + `&p=${this.PAGE}`);
            _urls.push(...await this.reqGet(this.URL + `&p=${this.PAGE}`).then((_html: any): any => {
                if (_html === null) return null;
                let _l: any = [];
                let _$ = cheerio.load(_html.data);
                if (_$('div.box__component-itemcard--general').length === 0) flag = true;
                _$('div.box__component-itemcard--general').each((i, elem) => {
                    if (this.ONLY_POWERDEALER) {
                        if (_$(elem).find('ul.list__seller-information span.text').text().trim() === '파워딜러') {
                            let _shopName: string = _$(elem).find('a.link__shop span.text__seller').text().trim();
                            if (_shopNames.indexOf(_shopName) === -1) {
                                _shopNames.push(_shopName);
                                _l[i] = _$(elem).find('a.link__shop').attr('href');
                            }
                        }
                    } else {
                        let _shopName: string = _$(elem).find('a.link__shop span.text__seller').text().trim();
                        if (_shopNames.indexOf(_shopName) === -1) {
                            _shopNames.push(_shopName);
                            _l[i] = _$(elem).find('a.link__shop').attr('href');
                        }
                    }
                });
                return _l;
            }));
            if (flag) break;
            if (_urls[_urls.length - 1] === null) _urls.pop();
            _urls = _urls.filter((n: any) => n);
            console.log(_urls.length);
        }

        _urls = _urls.filter((n: any) => n);

        console.log(_urls);
        console.log(`found targets... ${_urls.length}`);

        return _urls;
    }

    public async start(_urls: string[]): Promise < void > {
        const _date = new Date().toString();
        let _dealer_list: any = [];

        console.log('start crawling dealer informations!')
        console.log('please waiting for crawling results...');

        for (let i = 0; _dealer_list.length != this.DEALERS; i++) {
            if (i === _urls.length) {
                console.log('please waiting for load more crawling targets...');
                _urls = await this.getURLs(this.URL, true);
                i = 0;
            }
            _dealer_list.push(await this.reqGet(_urls[i]).then(async (html: any): Promise < any > => {
                if (html === null) return null;
                console.log(`crawling ${i}: ${_urls[i]}`);

                let _data: any = {
                    name: '',
                    ceo: '',
                    tel: '',
                    worktime: '',
                    fax: '',
                    email: '',
                    addr: '',
                    products: 0
                };
                let _$: cheerio.Root = cheerio.load(html.data);

                _$('span.data_num').each((i, elem) => {
                    _data.products += Number(_$(elem).text().trim().replace(/[^0-9]/g, ''));
                });
                console.log(_data.products);
                if (_data.products === 0) {
                    console.log(`Can not load this(index: ${i}) dealer's number of products. (url: ${_urls[i]})... skip`);
                    return null;
                }

                _$('div.seller_info_box dl').children().each(function (i, elem) {
                    switch (_$(elem).text().trim()) {
                        case '상호':
                            _data.name = _$(elem).next().text().trim();
                            break;
                        case '대표자':
                            _data.ceo = _$(elem).next().text().trim();
                            break;
                        case '전화번호':
                            _data.tel = _$(elem).next().text().trim();
                            break;
                        case '응대시간':
                            _data.worktime = _$(elem).next().text().trim();
                            break;
                        case '팩스번호':
                            _data.fax = _$(elem).next().text().trim();
                            break;
                        case '이메일':
                            _data.email = _$(elem).next().text().trim();
                            break;
                        case '영업소재지':
                            _data.addr = _$(elem).next().text().trim();
                            break;
                        default:
                            break;
                    }
                });

                return {
                    '순번': _dealer_list.length + 1,
                    '상호명': _data.name,
                    '온라인매장 주소': _urls[i],
                    '대표자명': _data.ceo,
                    '전화번호': _data.tel,
                    '응대가능시간': _data.worktime,
                    '팩스번호': _data.fax,
                    '이메일': _data.email,
                    '소재지': _data.addr,
                    '등록상품수': _data.products
                }
            }));
            if (_dealer_list[_dealer_list.length - 1] === null) _dealer_list.pop();
            else if (_dealer_list[_dealer_list.length - 1]['상호명'] === '') {
                console.log('this dealer\'s info is not vaild... skip');
                _dealer_list.pop();
            }
            console.log(`dealer list: ${_dealer_list.length}`);
        }

        _dealer_list.filter((n: any) => n);
        this.makeFolder(this.OUTDIR);

        fs.writeFileSync(path.resolve(__dirname, '../' + `${this.OUTDIR}/${this.FILENAME}${this.DESCRIPT.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi,'')}_${this.MODE}${this.MODE === 'default' ? this.DEALERS : ''}_${_date}.json`), JSON.stringify(_dealer_list, null, 4));
        console.log('complete crawling');
    }
}

const crawler = new GmarketCrawler();

crawler.init();
crawler.reqGet().then(async (html: any) => {
    let urls: string[] = await crawler.getURLs(html);

    console.log('start crawling dealer info!');
    console.log('please waiting for crawling results...');

    await crawler.start(urls);    
})