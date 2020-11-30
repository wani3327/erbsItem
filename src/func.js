function toggle(type)
{
    button = $('#' + type);

    if (button.css('border-style') != 'inset')
        button.css('border-style', 'inset');
    else
        button.css('border-style', 'none');

    $('#all').css('border-style', 'none');

    filter();
}

function toggleAll()
{
    button = $('#all');
    let isOff = button.css('border-style') != 'inset'

    $('#itemType img').css('border-style', 'none')

    if (isOff)
        button.css('border-style', 'inset');

    filter();
}

function filter()
{
    let showing = []
    let filters = []

    // Filtering by types
    let isAll = false
    $('#itemType img').each(function(i) {
        if (i != 0)
        {
            if (isAll || $(this).css('border-style') == 'inset')
                showing = showing.concat(type[this.id]);
        }
        else if ($(this).css('border-style') == 'inset')
            isAll = true;
    });

    // Filtering by stats
    $('#statFilter input').each(function(_) {
        if ($(this).prop('checked'))
            filters.push(this.id.replace('s', ''));
    });

    for (let i = 0; i < showing.length; i++)
    {
        let item = showing[i]

        for (let ab of filters)
        {
            if (!stat[item])
            {
                showing.splice(i--, 1);
                break;
            }

            let isValid;

            switch (ab)
            {
            case 'SP':
                isValid
                = stat[item].includes('SP') || stat[item].includes('SO');
                break;

            case 'HNS':
                isValid
                = stat[item].includes('HN') || stat[item].includes('HS');
                break;

            default:
                isValid = stat[item].includes(ab)
                break;
            }

            if (!isValid)
            {
                showing.splice(i--, 1);
                break;
            }
        }
    }

    $('#itemList div img').each(function(_) {
        $(this).css('display', 'none');
    });

    for (let item of showing)
        $('#' + item).css('display', '');
}

function search() {
    $("#search input").on('keyup', function () {
        let CHOSUNG_LIST = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
        let JUNGSUNG_LIST = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅗㅏ', 'ㅗㅐ', 'ㅗㅣ', 'ㅛ', 'ㅜ', 'ㅜㅓ', 'ㅜㅔ', 'ㅜㅣ', 'ㅠ', 'ㅡ', 'ㅡㅣ', 'ㅣ']
        let JONGSUNG_LIST = ['', 'ㄱ', 'ㄲ', 'ㄱㅅ', 'ㄴ', 'ㄴㅈ', 'ㄴㅎ', 'ㄷ', 'ㄹ', 'ㄹㄱ', 'ㄹㅁ', 'ㄹㅂ', 'ㄹㅅ', 'ㄹㅌ', 'ㄹㅍ', 'ㄹㅎ', 'ㅁ', 'ㅂ', 'ㅂㅅ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

        let r_lst = []
        for (let w of $("#search input").val()
                                       .replace(' ', '')
                                       .toLocaleUpperCase())
        {
            if ('가' <= w && w <='힣')
            {
                // 588개 마다 초성이 바뀜.
                ch1 = Math.floor((w.charCodeAt() - 44032) / 588)
                // 중성은 총 28가지 종류
                ch2 = Math.floor(((w.charCodeAt() - 44032) - (588 * ch1)) / 28)
                ch3 = Math.floor((w.charCodeAt() - 44032) - (588 * ch1) - 28 * ch2)
                r_lst = r_lst.concat(CHOSUNG_LIST[ch1] + JUNGSUNG_LIST[ch2] + JONGSUNG_LIST[ch3])
            }
            else
                r_lst.push(w)
        }

        res = '';
        for (let a of r_lst)
        {
            res += a;
        }

        let showing = []

        Object.keys(query).forEach(function(item) {
            for (let q of query[item])
                if (q.includes(res))
                {
                    showing.push(item);
                    break;
                }
        });

        $('#itemList div img').each(function(_) {
            $(this).css('display', 'none');
        });

        for (let item of showing)
            $('#' + item).css('display', '');
    });
}

function showItem(code)
{
    showSuper(code);
    showRecipe(code);
    showStat(code);
    showMap(code);
    clicky.log('/erbsItem/', code);
}

function imagePath(code)
{
    return 'image/item/' + img[code] + '.webp';
}

function bgColor(code)
{
    switch (rarity[code])
    {
    case 'C':
        return 'grey';
    case 'U':
        return 'lawngreen';
    case 'R':
        return 'deepskyblue';
    case 'E':
        return 'purple';
    case 'L':
        return 'yellow';
    }
}

function showSuper(code)
{
    let ht = '<p>상위 아이템</p>';

    if (code in sup)
    {
        for (let c of sup[code])
            ht += '<img src="' + imagePath(c)
                  + '" onclick="showItem(\'' + c
                  + '\')" style="background-color:' + bgColor(c) + '"/>';

        $('#super').html(ht);
    }
    else $('#super').html('');
}

function showRecipe(code)
{
    $('#recipe div').each(function(i) {
        if (i != 0) // not final
            $(this).css('display', 'none');
    });

    if (code == 0) return;

    $('#final img').attr('src', imagePath(code));
    $('#final span').html(itemName[code]);
    $('#final img').css('background-color', bgColor(code));

    if (code in recipe)
    {
        function setAttr(divId, code)
        {
            let imgTag = $('#' + divId + ' img');
            imgTag.attr('src', imagePath(code));
            imgTag.attr('onclick', 'showItem("' + code + '")');
            imgTag.css('background-color', bgColor(code));
            $('#' + divId + ' span').html(itemName[code]);
            $('#' + divId).css('display', '');
        }

        function setAmount(divId, code)
        {
            let amount = recipe[code][2] == undefined ? '1' : recipe[code][2]

            $('#' + divId).html(amount + '개');
            $('#' + divId).css('display', '');
        }

        let left = recipe[code][0]
        let right = recipe[code][1]

        setAttr('ingre11', left)
        setAttr('ingre12', right)
        setAmount('amount1', code);

        if (left in recipe)
        {
            setAttr('ingre21', recipe[left][0])
            setAttr('ingre22', recipe[left][1])
            setAmount('amount2', left);
        }

        if (right in recipe)
        {
            setAttr('ingre23', recipe[right][0])
            setAttr('ingre24', recipe[right][1])
            setAmount('amount3', right);
        }
        //TODO '#more'
    }
}

function showStat(code)
{
    function translate(s)
    {
        return s.replace('AP', '공격력')
                .replace('EN', '기본 공격 추가 피해')
                .replace('AS', '공격 속도')
                .replace('AR', '기본 공격 사거리')
                .replace('LS', '생명력 흡수')
                .replace('CC', '치명타 확률')
                .replace('CD', '치명타 피해량')
                .replace('SA', '스킬 증폭')
                .replace('CR', '쿨타임 감소')
                .replace('MS', '최대 스태미너')
                .replace('SR', '스태미너 재생').replace('SR', '스태미너 재생')
                .replace('DF', '방어력')
                .replace('MH', '최대 체력')
                .replace('HR', '체력 재생')
                .replace('ND', '기본 공격 피해량 감소')
                .replace('SD', '스킬 피해량 감소')
                .replace('SP', '이동 속도')
                .replace('SO', '비전투시 이동 속도')
                .replace('VR', '시야')
                .replace('HN', '기본 공격 적중 시 치유 감소')
                .replace('HS', '스킬 적중 시 치유 감소')
                .replace('MA', '장탄수');
    }

    if (code in stat)
        $('#stat').html(translate(stat[code]));
    else
        $('#stat').html('');
}

function showMap(code)
{
    $('#map div').each(function(_) {
        $(this).css('display', 'none')
    })

    if (code in drop)
    {
        singleDrop = drop[code]
        for (let place of singleDrop)
        {
            $('#m' + place[0]).css('display', '')
            $('#m' + place[0] + ' img').attr('src', imagePath(code));
            $('#m' + place[0] + ' span').html(place[1]);
        }
    }
}
