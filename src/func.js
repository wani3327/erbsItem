function changeLayout(sizeCode)
{
    switch (sizeCode)
    {
    case 0: // 1536*864
        $('#content').css('height', '520px');
        $('.column').css('width', '495px');
        $('#itemList').css('height', '100%');
        $('#stat').css('height', '37.8%');
        $('#recipe').css('height', '45%');
        break;

    case 1: // mobile
        $('#content').css('height', 'auto');
        $('.column').css('width', '100%');
        $('#itemList').css('height', '320px');
        $('#stat').css('height', 'auto');
        $('#recipe').css('height', '480px');
        break;
    }
}

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
    if (button.css('border-style') != 'inset')
    {
        button.css('border-style', 'inset');
        $('#itemType img').css('border-style', 'inset');
    }
    else
    {
        button.css('border-style', 'none');
        $('#itemType img').css('border-style', 'none')
    }

    filter();
}

function filter()
{
    $('#itemList div img').each(function(_) {
        $(this).css('display', 'none');
    });

    let showing = []
    let filters = []

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

    $('#statFilter table tr td input').each(function(_) {
        if ($(this).prop('checked'))
            filters.push(this.id.replace('s', ''));
    });

    for (let i = 0; i < showing.length; i++)
    {
        let item = showing[i]

        for (let ab of filters)
            if (!stat[item] || !stat[item].includes(ab))
            {
                showing.splice(i--, 1);
                break;
            }
    }

    for (let item of showing)
    {
        $('#' + item).css('display', '');
    }
}

function showItem(code)
{
    showSuper(code);
    showRecipe(code);
    showStat(code);
    showMap(code);
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
    var ht = '';

    if (code in sup)
    {
        for (let c of sup[code])
            ht += '<img src="' + img[c]
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

    $('#final img').attr('src', img[code]);
    $('#final span').html(itemName[code]);
    $('#final img').css('background-color', bgColor(code));

    if (code in recipe)
    {
        function setAttr(divId, code)
        {
            var imgTag = $('#' + divId + ' img');
            imgTag.attr('src', img[code]);
            imgTag.attr('onclick', 'showItem("' + code + '")');
            imgTag.css('background-color', bgColor(code));
            $('#' + divId + ' span').html(itemName[code]);
            $('#' + divId).css('display', '');
        }

        function setAmount(divId, code)
        {
            var amount = recipe[code][2] == undefined ? '1' : recipe[code][2]

            $('#' + divId).html(amount + '개');
            $('#' + divId).css('display', '');
        }

        var left = recipe[code][0]
        var right = recipe[code][1]

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
                .replace('SR', '스태미너 재생')
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
            $('#m' + place[0] + ' img').attr('src', img[code]);
            $('#m' + place[0] + ' span').html(place[1]);
        }
    }
}



