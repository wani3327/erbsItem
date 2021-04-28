import csv
import func

RUN_ENV = 0

# 초성 리스트. 00 ~ 18
CHOSUNG_LIST = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
# 중성 리스트. 00 ~ 20
JUNGSUNG_LIST = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅗㅏ', 'ㅗㅐ', 'ㅗㅣ', 'ㅛ', 'ㅜ', 'ㅜㅓ', 'ㅜㅔ', 'ㅜㅣ', 'ㅠ', 'ㅡ', 'ㅡㅣ', 'ㅣ']
# 종성 리스트. 00 ~ 27 + 1(1개 없음)
JONGSUNG_LIST = ['', 'ㄱ', 'ㄲ', 'ㄱㅅ', 'ㄴ', 'ㄴㅈ', 'ㄴㅎ', 'ㄷ', 'ㄹ', 'ㄹㄱ', 'ㄹㅁ', 'ㄹㅂ', 'ㄹㅅ', 'ㄹㅌ', 'ㄹㅍ', 'ㄹㅎ', 'ㅁ', 'ㅂ', 'ㅂㅅ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

def shatter(korean_word):
    """
    https://frhyme.github.io/python/python_korean_englished/
    변형해서 사용.
    """

    r_lst = []
    for w in list(korean_word.strip()):
        ## 영어인 경우 구분해서 작성함.
        if '가'<=w<='힣':
            ## 588개 마다 초성이 바뀜.
            ch1 = (ord(w) - ord('가'))//588
            ## 중성은 총 28가지 종류
            ch2 = ((ord(w) - ord('가')) - (588*ch1)) // 28
            ch3 = (ord(w) - ord('가')) - (588*ch1) - 28*ch2
            r_lst.extend(CHOSUNG_LIST[ch1] + JUNGSUNG_LIST[ch2] + JONGSUNG_LIST[ch3])
        else:
            r_lst.append(w)

    res = ''
    for w in r_lst:
        res += w

    return res


def main():
    if RUN_ENV == 0:
        data = open('database - API_ADDI.csv', 'r', encoding='utf8')
    elif RUN_ENV == 1:
        data = open('E:/erbsItem/erbsItem/database - KO.csv', 'w', encoding='utf8')

    datac = csv.reader(data)

    moreInfo = {}

    for row in datac:
        name_en, name_kr, alias, stat, _ = row

        query = [name_kr, name_en]
        if alias:
            query += alias.split(',')

        query_s = query

        # Exceptions. Fuck you Nimble Neuron.
        try:
            name_kr = {
                '산타 무에르테': '산타무에르떼',
                '플레셋': '플레솃',
                'STG-44': 'STG44',
                '전술-OPS 헬멧': '전술OPS헬멧',
                '광학미채 슈트': '광학미채수트',
                '배틀 슈트': '배틀수트',
                'EOD 슈트': 'EOD수트',
                '오토-암즈': '오토암즈',
                '레이저 포인터': '레이저포인트',
                '파운드 케이크': '파운드케잌',
                '피쉬 앤 칩스': '피시앤칩스',
                'C-4': 'C4',
                '아이기스의 방패': '아이기스'
            }[name_kr]
        except KeyError:
            pass

        # index 0 is meaningless
        moreInfo[name_kr.replace(' ','')] = [0, stat, query_s]

    return moreInfo

