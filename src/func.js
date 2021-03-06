function init()
{
    $('#time').html(t);
    loadItemList();
    $('#map-content').css('display', 'none');
    $('#craft-content').css('display', 'none');
    $('#hunt-content').css('display', 'none');
    search();

    let regex = new RegExp('[?&]item(=([^&#]*)|&|#|$)');
    let results = regex.exec(window.location.href);
    if (!results || !results[2]) showItem(101101, 0);
    else showItem(Number(results[2]), 0);
}

function loadItemList()
{
    let ht = ''

    Object.keys(item).forEach(function(code) {
        i = item[code]

        ht +=
        `<div id='${code}' title='${i[0][0]}' class='${rarityClass(code)}' onclick='showItem(${code})'>
            <img src='image/item/${code}.webp'/>
            <span>${i[0][0]}</span>
        </div>`;
    });

    ht += '<div id="dummy1" class="dummy"></div><div id="dummy2" class="dummy"></div><div id="dummy3" class="dummy"></div>'
    ht += '<div id="found-nothing" style="display:none;">검색 결과가 없습니다. 필터를 다시 한 번 확인해 주십시오.</div>';

    $('#item-list').html(ht);
}

function showFilter(by)
{
    $('.filter-tab').each(function (_) {
        $(this).removeClass('filter-tab-on');
    });
    $('.selectible-filter').each(function (_) {
        $(this).removeClass('selectible-filter-on');
    });

    $('#by-' + by).addClass('filter-tab-on');
    $('#' + by + '-filter').addClass('selectible-filter-on');

    refreshList();
}

function search() {
    function shatter_hangul(hangul) {
        let CHOSUNG_LIST = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
        let JUNGSUNG_LIST = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅗㅏ', 'ㅗㅐ', 'ㅗㅣ', 'ㅛ', 'ㅜ', 'ㅜㅓ', 'ㅜㅔ', 'ㅜㅣ', 'ㅠ', 'ㅡ', 'ㅡㅣ', 'ㅣ']
        let JONGSUNG_LIST = ['', 'ㄱ', 'ㄲ', 'ㄱㅅ', 'ㄴ', 'ㄴㅈ', 'ㄴㅎ', 'ㄷ', 'ㄹ', 'ㄹㄱ', 'ㄹㅁ', 'ㄹㅂ', 'ㄹㅅ', 'ㄹㅌ', 'ㄹㅍ', 'ㄹㅎ', 'ㅁ', 'ㅂ', 'ㅂㅅ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

        let r_lst = []

        for (let w of hangul)
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

        let shattered = '';

        for (let a of r_lst)
            shattered += a;

        return shattered;
    }

    function findValidItem() {
        let search_q = $("#search input").val()
                                         .replace(' ', '')
                                         .replace('-', '')
                                         .toLocaleUpperCase();

        let showing = []

        Object.keys(item).forEach(function(code) {
            for (let name of item[code][0])
            {
                name = name.replace(' ','').replace('-', '').toLocaleUpperCase()

                if (shatter_hangul(name).includes(shatter_hangul(search_q)))
                {
                    showing.push(code)
                    break;
                }
            }
        });

        showList(showing);
    }

    $("#search input").on('keyup', findValidItem);
    findValidItem();
}

function statFilter()
{
    let showing = []
    let filters = []

    Object.keys(item).forEach(function (code) {
        showing.push(code);
    });

    // Filtering by stats
    $('#stat-filter input').each(function(_) {
        if ($(this).prop('checked'))
            filters.push(this.id.replace('s', ''));
    });

    for (let i = 0; i < showing.length; i++)
    {
        let code = showing[i]

        for (let checkedStat of filters)
        {
            stat = item[code][3]

            if (!stat)
            {
                showing.splice(i--, 1);
                break;
            }

            let isValid;

            switch (checkedStat)
            {
            case 'SP':
                isValid = stat.includes('SP') || stat.includes('SO');
                break;

            case 'HNS':
                isValid = stat.includes('HN') || stat.includes('HS');
                break;

            default:
                isValid = stat.includes(checkedStat)
                break;
            }

            if (!isValid)
            {
                showing.splice(i--, 1);
                break;
            }
        }
    }

    showList(showing);
}

function areaSelect(id)
{
    id = '#area-' + id;

    $('.area').removeClass('area-on');
    $(id).addClass('area-on');

    areaFilter();
}

function areaFilter()
{
    let showing = [];
    let area = $('.area-on').attr('id')

    if (area == undefined)
        showing = [];
    else
    {
        area = area.replace('area-', '');

        Object.keys(item).forEach(function (code) {
            for (let s of item[code][4])
            {
                if (s[0] == area)
                {
                    showing.push(code);
                    break;
                }
            }
        });
    }

    showList(showing);
}

function typeToggle(id)
{
    function isOn(id)
    {
        return $(id).attr('class').includes('on');
    }

    id = '#type-' + id;

    if (id == '#type-all')
    {
        if (isOn(id))
            $(id).removeClass('item-type-on');
        else
        {
            $('.item-type').removeClass('item-type-on');
            $(id).addClass('item-type-on');
        }
    }
    else
    {
        if (isOn(id))
            $(id).removeClass('item-type-on');
        else
        {
            $(id).addClass('item-type-on');
            $('#type-all').removeClass('item-type-on');
        }
    }

    refreshList();
}

function refreshList()
{
    function isOn(id)
    {
        return $(id).attr('class').includes('on');
    }

    if (isOn('#by-name')) search();
    else if (isOn('#by-stat')) statFilter();
    else areaFilter();
}

function showList(showing)
{
    // Hiding all items; initialization
    $('#item-list div').each(function(_) {
        $(this).css('display', 'none');
    });

    // Find activated types
    activatedType = []

    $('.item-type-on').each(function (i) {
        if (this.id == 'type-all')
        {
            activatedType = [-1];
            return;
        }

        activatedType.push(Number(this.id.replace('type-', '')));
    });

    if (activatedType.length == 0)
    {
        typeToggle('all');
        return;
    }

    // Displaying all activated item
    let show = 0;

    for (let code of showing)
        if ( activatedType[0]  == -1 ||
             activatedType.includes( Math.floor(code / 1000) ))
        {
            $('#' + code).css('display', '');
            show += 1;
        }

    // If there's no item
    if (!show)
    {
        $('#found-nothing').css('display', '');
    }

    // Displaying dummies; for layout
    else
    {
        let dummy = 4 - show % 4;

        if (dummy != 4)
        for (let i = 1; i < dummy + 1; i++) {
            $('#dummy' + i).css('display', '');
        }
    }
}

var itemStack = []
var old;
var now;

function showItem(code, p)
{
    if (p == undefined)
    {
        itemStack.push(old);
        if (itemStack.length > 100)
        {
            itemStack = itemStack.slice(1)
        }
    }
    old = code;

    showItemInfo(code);
    showSuper(code);

    fold('map', showMap(code));
    fold('craft', showRecipe(code));
    fold('hunt', showHunt(code));
}

function goBack()
{
    old = itemStack.pop()
    if (old == undefined) return;

    showItem(old, false);
}

function showItemInfo(code)
{
    let i = item[code]

    // Image, Name, Type
    $('#item-image img').attr('src', imagePath(code));
    $('#item-name').html(i[0][0]);
    $('#type-info').html(typeDecode(code));

    // Color
    $('#basic-info').removeClass('commonItem');
    $('#basic-info').removeClass('uncommonItem');
    $('#basic-info').removeClass('rareItem');
    $('#basic-info').removeClass('epicItem');
    $('#basic-info').removeClass('legendaryItem');
    $('#basic-info').addClass(rarityClass(code));

    // Stat
    stat_raw = i[3].split(',');
    stat = ''

    for (let s in stat_raw)
    {
        if (!stat_raw[s]) continue;
        ss = stat_raw[s].slice(0, 2);

        stat += {
            'AP': '공격력',
            'EN': '기본 공격 추가 피해',
            'AS': '공격 속도',
            'AR': '기본 공격 사거리',
            'LS': '생명력 흡수',
            'CC': '치명타 확률',
            'CD': '치명타 피해량',
            'SA': '스킬 증폭',
            'CR': '쿨타임 감소',
            'MS': '최대 스태미너',
            'SR': '스태미너 재생',
            'DF': '방어력',
            'MH': '최대 체력',
            'HR': '체력 재생',
            'ND': '기본 공격 피해량 감소',
            'SD': '스킬 피해량 감소',
            'SP': '이동 속도',
            'SO': '비전투시 이동 속도',
            'VR': '시야',
            'HN': '기본 공격 적중 시 치유 감소',
            'HS': '스킬 적중 시 치유 감소',
            'MA': '장탄수',
            'SI': '상위 아이템에',
            '00': '',
            'AL': '치명타 피해량 감소'
        }[ss] + stat_raw[s].slice(2) + '<br>'
    }

    $('#stat-info').html(stat);
}

function imagePath(code)
{
    return 'image/item/' + code + '.webp';
}

function typeDecode(code)
{
    return {
        101: '단검', 102: '양손검', 103: '쌍검', 104: '망치', 105: '도끼',
        107: '창', 108: '방망이', 109: '채찍', 110: '글러브', 111: '톤파',
        112: '투척', 113: '암기', 114: '활', 115: '석궁', 116: '권총',
        117: '돌격소총', 118: '저격총', 119: '쌍절곤', 120: '레이피어', 121: '기타',
        201: '머리', 202: '옷', 203: '팔', 204: '다리', 205: '장식',
        301: '음료', 302: '음식', 401: '재료', 502: '설치',
    }[Math.floor(code / 1000)]
}

function rarityClass(code)
{
    return [
        'commonItem', 'uncommonItem', 'rareItem', 'epicItem', 'legendaryItem'
    ][item[code][1]];
}

function showSuper(code)
{
    let ht = ''

    Object.keys(item).forEach(function(sup) {
        // for every item that might be superior item
        let cr = item[sup][2] // recipe of superior item

        if (code == cr[0])
        {
            ht +=
            `<div><span>+</span>
                <div onclick=showItem(${cr[1]})>
                    <img src="${imagePath(cr[1])}"/>
                    <span>${item[cr[1]][0][0]}</span>
                </div><span>=</span>
                <div onclick=showItem(${sup})>
                    <img src="${imagePath(sup)}"/>
                    <span>${item[sup][0][0]}</span>
            </div></div>`;
        }
        else if (code == cr[1])
        {
            ht += `<div><span>+</span>
            <div onclick=showItem(${cr[0]})>
                <img src="${imagePath(cr[0])}"/>
                <span>${item[cr[0]][0][0]}</span>
            </div><span>=</span>
            <div onclick=showItem(${sup})>
                <img src="${imagePath(sup)}"/>
                <span>${item[sup][0][0]}</span>
            </div></div>`;
        }
    });

    if (!ht)
        ht = '<div>상위 아이템이 없습니다.</div>'

    $('#super-list').html(ht);
}

function fold(obj, set) {
    let title = $('#' + obj + '-fold');
    let content = $('#' + obj + '-content');

    // set = undefined would satisfy both statement
    if (content.css('display') == 'none' && set != false)
    {
        title.css('transform', 'rotate(90deg)');
        content.css('display', '');
    }
    else if(set != true)
    {
        title.css('transform', 'rotate(0deg)');
        content.css('display', 'none');
    }
}

function showMap(code)
{
    $('#map-content div').each(function(_) {
        $(this).css('display', 'none')
    })

    let show = false

    for (let spawn of item[code][4])
    {
        if (spawn[0] > 0)
        {
            $('#map-' + spawn[0]).css('display', '')
            $('#map-' + spawn[0] + ' img').attr('src', imagePath(code));
            $('#map-' + spawn[0] + ' span').html(spawn[1]);

            show = true
        }
    }

    return show;
}

function showRecipe(code)
{
    function createRecipeHtml(code)
    {
        let ht = `
        <div class='craft-result'>
            <div class="craft-item" onclick="showItem(${code})">
                <img src='image/item/${code}.webp'/>
                <span>${item[code][0][0]}</span>
            </div>`

        if (item[code][2])
        {
            ht += `
            <div class='craft-ingre'>
                ${createRecipeHtml(item[code][2][0])}
                <br><hr>
                ${createRecipeHtml(item[code][2][1])}
            </div>`;
        }

        return ht + '</div>';
    }

    if (item[code][2])
    {
        $('#craft-content').html(createRecipeHtml(code));
        return true;
    }
    else
    {
        $('#craft-content').html('<div id="no-recipe">조합식이 존재하지 않습니다.</div>');
        return false;
    }
}

function showHunt(code)
{
    let show = false;

    for (let spawn of item[code][4])
    {
        if (spawn[0] == -1)
        {
            v = spawn[1];
            show = true;

            for (let i = 6; i > -1; i--)
            {
                if (v / 2 ** i >= 1)
                {
                    $('#is-dropped-' + Math.floor(i / 4)
                    + ' td:nth-child(' + (i % 4 + 1) + ')'
                    ).css('background-color', 'forestgreen');

                    v -= 2 ** i;
                }
                else
                    $('#is-dropped-' + Math.floor(i / 4)
                    + ' td:nth-child(' + (i % 4 + 1) + ')'
                    ).css('background-color', 'firebrick');
            }
        }
    }

    switch (code) {
        case 302111:
            $('#is-dropped-0 td:nth-child(1)').css('background-color', 'steelblue');
            $('#is-dropped-0 td:nth-child(3)').css('background-color', 'steelblue');
            $('#is-dropped-1 td:nth-child(1)').css('background-color', 'steelblue');
            $('#is-dropped-1 td:nth-child(2)').css('background-color', 'steelblue');
            break;

        case 401103:
            $('#is-dropped-0 td:nth-child(1)').css('background-color', 'steelblue');
            $('#is-dropped-0 td:nth-child(4)').css('background-color', 'steelblue');
            $('#is-dropped-1 td:nth-child(1)').css('background-color', 'steelblue');
            $('#is-dropped-1 td:nth-child(2)').css('background-color', 'steelblue');
            break;

        case 401403:
        case 401401:
        case 302324:
            $('#is-dropped-1 td:nth-child(3)').css('background-color', 'steelblue');

        default:
            break;
    }

    if (!show)
    {
        $('.is-dropped td').css('background-color', 'firebrick');
    }

    return show;
}
