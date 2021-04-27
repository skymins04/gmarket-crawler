# gmarket-crawler

G마켓의 베스트 제품별 셀러 정보를 랭킹순으로 크롤링하는 툴입니다.

## 설치법
```
    $ git clone https://github.com/skymins04/gmarket-crawler.git
    $ cd gmarket-crawler
    $ npm install -g typescript
    $ npm install
```

## 사용법
1. 텍스트 편집기를 이용해 preset.json 파일 내의 정보 기입

    + MODE - 크롤링 모드를 설정함 (필수 필드, 타입: string)
        + "default": G마켓 기본 브라우징 제품 내에서 크롤링 
        + ~~"best": G마켓 베스트 제품 내에서 크롤링~~

    + DEALERS - 크롤링하려는 셀러의 수 (필수 필드, 타입: number, ~~MODE-best의 경우 범위: 0~80~~, MODE-default의 경우 범위: 0~무제한)

    + OUTDIR - 크롤링 데이터의 출력 위치 (필수 필드, 타입: string, 디렉토리 형태의 문자열)

    + FILENAME - 출력 데이터의 접두어 (필수 필드, 타입: string)

    + LARGE_CATEGORY_CODE - G마켓 최상위 카테고리의 코드 기입 (필수 필드, 타입: string)

    + MEDIUM_CATEGORY_CODE - G마켓 중간 카테고리의 코드 기입 (타입: string)

    + SMALL_CATEGORY_CODE - G마켓 최하위 카테고리 (타입: string)

    + ONLY_POWERDEALER - G마켓의 파워딜러 등급의 셀러만 크롤링하는 옵션 (기본값: false, 타입: boolean)
```
    (preset.json, mode: default)

    {
        "MODE": "default",
        "LARGE_CATEGORY_CODE": (essential, type: string),
        "DEALERS": (essential, type: number)
        "ONLY_POWERDEALER": (optional, type: boolean),
        "OUTDIR": "data",
        "FILENAME": "crawling_data"
    }

```
```
    (preset.json, mode: best)
    (현재 mode best는 임시적으로 지원하지 않음)

    {
        "MODE": "best",
        "LARGE_CATEGORY_CODE": (essential, type: string),
        "MEDIUM_CATEGORY_CODE" (optional, type: string),
        "SMALL_CATEGORY_CODE": (optional, type: string),
        "DEALERS": (essential, type: number),
        "ONLY_POWERDEALER": (optional, type: boolean),
        "OUTPUTDIR": "data",
        "FILENAME": "crawling_data"
    }

```
2. 명령어 npm start를 입력해 실행
```
    $ npm start
```