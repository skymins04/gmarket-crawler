# gmarket-crawler

G마켓의 베스트 제품별 셀러 정보를 랭킹순으로 크롤링하는 툴입니다.

## 설치법
```
    $ git clone https://github.com/skymins04/gmarket-crawler.git
    $ cd gmarket-crawler
    $ npm install
```

## 사용법
1. 텍스트 편집기를 이용해 preset.json 파일 내의 정보 기입
```
    (preset.json)

    {
        URL: (G마켓의 카테고리별 베스트 상품 리스트 페이지의 주소, type: string),
        SELLERS: (크롤링하려는 셀러의 수, type: number)
    }

```
2. 명령어 npm start를 입력해 실행
```
    $ npm start
```