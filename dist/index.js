"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var cheerio = __importStar(require("cheerio"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var GmarketCrawler = /** @class */ (function () {
    function GmarketCrawler() {
        this.URL = '';
        this.DESCRIPT = '';
        this.PAGE = 1;
        axios_1.default.defaults.timeout = 5000;
        try {
            this.presetFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../preset.json'), 'utf-8'));
        }
        catch (e) {
            console.error(e);
            throw 'preset.json is not vaild.';
        }
        this.MODE = this.presetFile.MODE;
        this.DEALERS = this.presetFile.DELLERS;
        this.ONLY_POWERDEALER = this.presetFile.ONLY_POWERDEALER;
        this.OUTDIR = this.presetFile.OUTDIR;
        this.FILENAME = this.presetFile.FILENAME;
    }
    GmarketCrawler.prototype.makeFolder = function (_dir) {
        if (!fs.existsSync(_dir))
            fs.mkdirSync(_dir);
    };
    GmarketCrawler.prototype.reqGet = function (_url) {
        if (_url === void 0) { _url = this.URL; }
        return __awaiter(this, void 0, void 0, function () {
            var _res, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('request get...');
                        return [4 /*yield*/, axios_1.default.get(_url, {
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36'
                                }
                            })];
                    case 1:
                        _res = _a.sent();
                        console.log('request get...Success!');
                        return [2 /*return*/, _res];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GmarketCrawler.prototype.reqPost = function (_url, _data) {
        return __awaiter(this, void 0, void 0, function () {
            var _res, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('request post...');
                        return [4 /*yield*/, axios_1.default.post(_url, _data, {
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36'
                                }
                            })];
                    case 1:
                        _res = _a.sent();
                        console.log('request post...Success!');
                        return [2 /*return*/, _res];
                    case 2:
                        e_2 = _a.sent();
                        console.error(e_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GmarketCrawler.prototype.init = function () {
        console.log('initialize Gmarket Dealer info Crawler...');
        if (!this.MODE)
            throw 'Can not found for MODE field of preset.json.';
        if (!this.presetFile.LARGE_CATEGORY_CODE)
            throw 'Can not found for LARGE_CATEGORY_CODE field of preset.json';
        if (typeof this.presetFile.LARGE_CATEGORY_CODE !== 'string')
            throw 'LARGE_CATEGORY_CODE field type of preset.json must be type "string".';
        if (this.MODE === 'default') {
            this.URL += "http://browse.gmarket.co.kr/list?category=" + this.presetFile.LARGE_CATEGORY_CODE;
        }
        else if (this.MODE === 'best') {
            this.URL += "http://corners.gmarket.co.kr/Bestsellers?viewType=C&largeCategoryCode=" + this.presetFile.LARGE_CATEGORY_CODE;
            if (this.presetFile.MEDIUM_CATEGORY_CODE) {
                if (typeof this.presetFile.MEDIUM_CATEGORY_CODE !== 'string')
                    throw 'MEDIUM_CATEGORY_CODE field type of preset.json must be type "string".';
                this.URL += "&mediumCategoryCode=" + this.presetFile.MEDIUM_CATEGORY_CODE;
                if (this.presetFile.SMALL_CATEGORY_CODE) {
                    if (typeof this.presetFile.SMALL_CATEGORY_CODE !== 'string')
                        throw 'SMALL_CATEGORY_CODE field type of preset.json must be type "string".';
                    this.URL += "&smallCategoryCode=" + this.presetFile.SMALL_CATEGORY_CODE;
                }
            }
        }
        else if (typeof this.MODE !== 'string')
            throw 'MODE field type of preset.json must be type "string".';
        else
            throw 'MODE field of preset.json is not vaild.';
        if (!this.DEALERS && this.MODE === 'default')
            throw 'Can not found for DEALERS field of preset.json.';
        if (typeof this.DEALERS !== 'number' && this.MODE === 'default')
            throw 'DEALERS field type of preset.json must be type "number".';
        if (this.DEALERS % 1 !== 0 && this.MODE === 'default')
            throw 'DEALERS field of preset.json must be integer.';
        if (this.MODE === 'default' && !(this.DEALERS >= 0))
            throw 'DEALERS field of preset.json must be bigger than 0 in MODE "default".';
        if ((this.ONLY_POWERDEALER || this.ONLY_POWERDEALER === false) && typeof this.ONLY_POWERDEALER !== 'boolean')
            throw 'ONLY_POWERDEALERE field of preset.json is not vaild.';
        if (!this.OUTDIR)
            throw 'Can not found for OUTDIR field of preset.json.';
        if (typeof this.OUTDIR !== 'string')
            throw 'OUTDIR field type of preset.json must be type "string".';
        if (!this.FILENAME)
            throw 'Can not found for FILENAME field of preset.json.';
        if (typeof this.FILENAME !== 'string')
            throw 'FILENAME field type of preset.json must be type "string".';
        console.log("crawling mode: " + this.MODE);
        console.log("crawling dellers: " + this.DEALERS);
        console.log("only powerdealer: " + this.ONLY_POWERDEALER);
        console.log("crawling url: " + this.URL);
        console.log('===============================================================================================');
    };
    GmarketCrawler.prototype.getURLs = function (_html, _refill) {
        if (_refill === void 0) { _refill = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _urls, _shopNames, _body, _$_1, _loop_1, this_1, state_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _urls = [];
                        _shopNames = [];
                        if (!_refill) {
                            _body = this.MODE === 'default' ?
                                'div.box__component-itemcard--general' :
                                'div.best-list ul li';
                            _$_1 = cheerio.load(_html.data);
                            console.log('finding for targets...');
                            if (this.MODE === 'default')
                                this.DESCRIPT = _$_1('a.link--active span.text').text().trim();
                            _$_1(_body).each(function (i, elem) {
                                if (_this.MODE === 'default') {
                                    if (_this.ONLY_POWERDEALER) {
                                        if (_$_1(elem).find('ul.list__seller-information span.text').text().trim() === '파워딜러') {
                                            var _shopName = _$_1(elem).find('a.link__shop span.text__seller').text().trim();
                                            if (_shopNames.indexOf(_shopName) === -1) {
                                                _shopNames.push(_shopName);
                                                _urls[i] = _$_1(elem).find('a.link__shop').attr('href');
                                            }
                                        }
                                    }
                                    else {
                                        var _shopName = _$_1(elem).find('a.link__shop span.text__seller').text().trim();
                                        if (_shopNames.indexOf(_shopName) === -1) {
                                            _shopNames.push(_shopName);
                                            _urls[i] = _$_1(elem).find('a.link__shop').attr('href');
                                        }
                                    }
                                }
                                else
                                    _urls[i] = _$_1(elem).find('a.itemname').attr('href');
                            });
                            _urls = _urls.filter(function (n) { return n; });
                        }
                        _loop_1 = function () {
                            var flag, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        flag = false;
                                        console.log('loading more targets...');
                                        this_1.PAGE += 1;
                                        console.log(this_1.URL + ("&p=" + this_1.PAGE));
                                        _c = (_b = _urls.push).apply;
                                        _d = [_urls];
                                        return [4 /*yield*/, this_1.reqGet(this_1.URL + ("&p=" + this_1.PAGE)).then(function (_html) {
                                                if (_html === null)
                                                    return null;
                                                var _l = [];
                                                var _$ = cheerio.load(_html.data);
                                                if (_$('div.box__component-itemcard--general').length === 0)
                                                    flag = true;
                                                _$('div.box__component-itemcard--general').each(function (i, elem) {
                                                    if (_this.ONLY_POWERDEALER) {
                                                        if (_$(elem).find('ul.list__seller-information span.text').text().trim() === '파워딜러') {
                                                            var _shopName = _$(elem).find('a.link__shop span.text__seller').text().trim();
                                                            if (_shopNames.indexOf(_shopName) === -1) {
                                                                _shopNames.push(_shopName);
                                                                _l[i] = _$(elem).find('a.link__shop').attr('href');
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        var _shopName = _$(elem).find('a.link__shop span.text__seller').text().trim();
                                                        if (_shopNames.indexOf(_shopName) === -1) {
                                                            _shopNames.push(_shopName);
                                                            _l[i] = _$(elem).find('a.link__shop').attr('href');
                                                        }
                                                    }
                                                });
                                                return _l;
                                            })];
                                    case 1:
                                        _c.apply(_b, _d.concat([_e.sent()]));
                                        if (flag)
                                            return [2 /*return*/, "break"];
                                        if (_urls[_urls.length - 1] === null)
                                            _urls.pop();
                                        _urls = _urls.filter(function (n) { return n; });
                                        console.log(_urls.length);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a.label = 1;
                    case 1:
                        if (!(_urls.length < (this.DEALERS * 1.5) && this.MODE === 'default')) return [3 /*break*/, 3];
                        return [5 /*yield**/, _loop_1()];
                    case 2:
                        state_1 = _a.sent();
                        if (state_1 === "break")
                            return [3 /*break*/, 3];
                        return [3 /*break*/, 1];
                    case 3:
                        _urls = _urls.filter(function (n) { return n; });
                        console.log(_urls);
                        console.log("found targets... " + _urls.length);
                        return [2 /*return*/, _urls];
                }
            });
        });
    };
    GmarketCrawler.prototype.start = function (_urls) {
        return __awaiter(this, void 0, void 0, function () {
            var _date, _dealer_list, _loop_2, this_2, out_i_1, i, _dealer_list_1, _loop_3, this_3, out_i_2, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _date = new Date().toString();
                        _dealer_list = [];
                        console.log('start crawling dealer informations!');
                        console.log('please waiting for crawling results...');
                        if (!(this.MODE === 'default')) return [3 /*break*/, 5];
                        _loop_2 = function (i) {
                            var _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        if (!(i === _urls.length)) return [3 /*break*/, 2];
                                        console.log('please waiting for load more crawling targets...');
                                        return [4 /*yield*/, this_2.getURLs(this_2.URL, true)];
                                    case 1:
                                        _urls = _d.sent();
                                        i = 0;
                                        _d.label = 2;
                                    case 2:
                                        _c = (_b = _dealer_list).push;
                                        return [4 /*yield*/, this_2.reqGet(_urls[i]).then(function (html) { return __awaiter(_this, void 0, void 0, function () {
                                                var _data, _$;
                                                return __generator(this, function (_a) {
                                                    if (html === null)
                                                        return [2 /*return*/, null];
                                                    console.log("crawling " + i + ": " + _urls[i]);
                                                    _data = {
                                                        name: '',
                                                        ceo: '',
                                                        tel: '',
                                                        worktime: '',
                                                        fax: '',
                                                        email: '',
                                                        addr: '',
                                                        products: 0
                                                    };
                                                    _$ = cheerio.load(html.data);
                                                    _$('span.data_num').each(function (i, elem) {
                                                        _data.products += Number(_$(elem).text().trim().replace(/[^0-9]/g, ''));
                                                    });
                                                    console.log(_data.products);
                                                    if (_data.products === 0) {
                                                        console.log("Can not load this(index: " + i + ") dealer's number of products. (url: " + _urls[i] + ")... skip");
                                                        return [2 /*return*/, null];
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
                                                    return [2 /*return*/, {
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
                                                        }];
                                                });
                                            }); })];
                                    case 3:
                                        _c.apply(_b, [_d.sent()]);
                                        if (_dealer_list[_dealer_list.length - 1] === null)
                                            _dealer_list.pop();
                                        else if (_dealer_list[_dealer_list.length - 1]['상호명'] === '') {
                                            console.log('this dealer\'s info is not vaild... skip');
                                            _dealer_list.pop();
                                        }
                                        console.log("dealer list: " + _dealer_list.length);
                                        out_i_1 = i;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(_dealer_list.length != this.DEALERS)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_2(i)];
                    case 2:
                        _a.sent();
                        i = out_i_1;
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 9];
                    case 5:
                        _dealer_list_1 = [];
                        console.log('please waiting for crawling datas...');
                        _loop_3 = function (i) {
                            var _e, _f, j;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        if (!(i == _urls.length)) return [3 /*break*/, 2];
                                        console.log('please waiting for loading more crawling datas...');
                                        return [4 /*yield*/, this_3.getURLs(this_3.URL, true)];
                                    case 1:
                                        _urls = _g.sent();
                                        i = 0;
                                        _g.label = 2;
                                    case 2:
                                        _f = (_e = _dealer_list_1).push;
                                        return [4 /*yield*/, this_3.reqGet(_urls[i]).then(function (html) { return __awaiter(_this, void 0, void 0, function () {
                                                var substring_data, shopinfo_req, flag, error_1, $shopinfo, $, url, data;
                                                var _this = this;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            if (html === null) {
                                                                return [2 /*return*/, null];
                                                            }
                                                            console.log("crawling " + i + ": " + _urls[i]);
                                                            substring_data = html.data.substring(html.data.indexOf('var goods = ') + 12, html.data.length);
                                                            console.log(substring_data.substring(0, substring_data.indexOf(';')));
                                                            flag = false;
                                                            _a.label = 1;
                                                        case 1:
                                                            _a.trys.push([1, 3, , 4]);
                                                            return [4 /*yield*/, axios_1.default.post('http://item.gmarket.co.kr/Shop/ShopInfo', JSON.parse(substring_data.substring(0, substring_data.indexOf(';'))))];
                                                        case 2:
                                                            shopinfo_req = _a.sent();
                                                            return [3 /*break*/, 4];
                                                        case 3:
                                                            error_1 = _a.sent();
                                                            console.error(error_1);
                                                            console.log("this(index: " + i + ") dealer is not vaild(url: " + _urls[i] + ")... skip");
                                                            flag = true;
                                                            return [3 /*break*/, 4];
                                                        case 4:
                                                            if (flag)
                                                                return [2 /*return*/, null];
                                                            $shopinfo = cheerio.load(shopinfo_req.data);
                                                            $ = cheerio.load(html.data);
                                                            url = $('span.text__seller a').attr('href');
                                                            return [4 /*yield*/, this.reqGet(url).then(function (html) {
                                                                    if (html === null)
                                                                        return null;
                                                                    if (html.data.indexOf('파워딜러') != -1 || $shopinfo('span.power-dealer').length || !_this.ONLY_POWERDEALER) {
                                                                        var $_1 = cheerio.load(html.data);
                                                                        var data_1 = {
                                                                            name: '',
                                                                            ceo: '',
                                                                            tel: '',
                                                                            worktime: '',
                                                                            fax: '',
                                                                            email: '',
                                                                            addr: '',
                                                                            products: 0
                                                                        };
                                                                        $_1('span.data_num').each(function (i, elem) {
                                                                            data_1.products += Number($_1(elem).text().trim().replace(/[^0-9]/g, ''));
                                                                        });
                                                                        console.log(data_1.products);
                                                                        if (data_1.products === 0) {
                                                                            console.log("can not load this(index: " + i + ") dealer's number of products (url: " + _urls[i] + ")... skip");
                                                                            return null;
                                                                        }
                                                                        $_1('div.seller_info_box dl').children().each(function (i, elem) {
                                                                            switch ($_1(elem).text().trim()) {
                                                                                case '상호':
                                                                                    data_1.name = $_1(elem).next().text().trim();
                                                                                    break;
                                                                                case '대표자':
                                                                                    data_1.ceo = $_1(elem).next().text().trim();
                                                                                    break;
                                                                                case '전화번호':
                                                                                    data_1.tel = $_1(elem).next().text().trim();
                                                                                    break;
                                                                                case '응대시간':
                                                                                    data_1.worktime = $_1(elem).next().text().trim();
                                                                                    break;
                                                                                case '팩스번호':
                                                                                    data_1.fax = $_1(elem).next().text().trim();
                                                                                    break;
                                                                                case '이메일':
                                                                                    data_1.email = $_1(elem).next().text().trim();
                                                                                    break;
                                                                                case '영업소재지':
                                                                                    data_1.addr = $_1(elem).next().text().trim();
                                                                                    break;
                                                                                default:
                                                                                    break;
                                                                            }
                                                                        });
                                                                        return data_1;
                                                                    }
                                                                    else {
                                                                        console.log("this(index: " + i + ") dealer is not power dealer(url: " + _urls[i] + ")... skip");
                                                                        return null;
                                                                    }
                                                                })];
                                                        case 5:
                                                            data = _a.sent();
                                                            if (data === null) {
                                                                return [2 /*return*/, null];
                                                            }
                                                            else {
                                                                return [2 /*return*/, {
                                                                        '순위': _dealer_list_1.length + 1,
                                                                        '상호명': data.name,
                                                                        '온라인매장 주소': url,
                                                                        '대표자명': data.ceo,
                                                                        '전화번호': data.tel,
                                                                        '응대가능시간': data.worktime,
                                                                        '팩스번호': data.fax,
                                                                        '이메일': data.email,
                                                                        '소재지': data.addr,
                                                                        '등록상품수': data.products
                                                                    }];
                                                            }
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                    case 3:
                                        _f.apply(_e, [_g.sent()]);
                                        if (_dealer_list_1[_dealer_list_1.length - 1] === null) {
                                            _dealer_list_1.pop();
                                        }
                                        else if (_dealer_list_1[_dealer_list_1.length - 1]['상호명'] === '') {
                                            _dealer_list_1.pop();
                                        }
                                        else {
                                            for (j = 0; j < _dealer_list_1.length - 1; j++) {
                                                if (_dealer_list_1[j]['상호명'] === _dealer_list_1[_dealer_list_1.length - 1]['상호명']) {
                                                    console.log("this seller is already crawled");
                                                    _dealer_list_1.pop();
                                                    break;
                                                }
                                            }
                                        }
                                        console.log("seller list: " + _dealer_list_1.length);
                                        out_i_2 = i;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_3 = this;
                        i = 0;
                        _a.label = 6;
                    case 6:
                        if (!(_dealer_list_1.length != this.DEALERS)) return [3 /*break*/, 9];
                        return [5 /*yield**/, _loop_3(i)];
                    case 7:
                        _a.sent();
                        i = out_i_2;
                        _a.label = 8;
                    case 8:
                        i++;
                        return [3 /*break*/, 6];
                    case 9:
                        _dealer_list.filter(function (n) { return n; });
                        this.makeFolder(this.OUTDIR);
                        fs.writeFileSync(path.resolve(__dirname, '../' + (this.OUTDIR + "/" + this.FILENAME + this.DESCRIPT.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '') + "_" + this.MODE + (this.MODE === 'default' ? this.DEALERS : '') + "_" + _date + ".json")), JSON.stringify(_dealer_list, null, 4));
                        console.log('complete crawling');
                        return [2 /*return*/];
                }
            });
        });
    };
    return GmarketCrawler;
}());
var crawler = new GmarketCrawler();
crawler.init();
crawler.reqGet().then(function (html) { return __awaiter(void 0, void 0, void 0, function () {
    var urls;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, crawler.getURLs(html)];
            case 1:
                urls = _a.sent();
                console.log('start crawling dealer info!');
                console.log('please waiting for crawling results...');
                return [4 /*yield*/, crawler.start(urls)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
