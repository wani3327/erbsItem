function toggle(type)
{
    button = $('#' + type);

    if (button.css('border-style') != 'inset')
        button.css('border-style', 'inset');
    else
        button.css('border-style', 'none');

    $('#all').css('border-style', 'none');

    typeFilter();
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

    typeFilter();
}

function typeFilter()
{
    var filters = []
    $('#itemList div img').each(function(_) {
        $(this).css('display', 'none');
    });

    $('#itemType img').each(function(i) {

        if (i != 0)
            if ($(this).css('border-style') == 'inset')
            {
                for (let item of type[this.id])
                {
                    $('#' + item).css('display', '');
                }
            }
    });


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
    if (code in stat)
        $('#stat').html(stat[code]);
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
            $('#' + place[0]).css('display', '')
            $('#' + place[0] + ' img').attr('src', img[code]);
            $('#' + place[0] + ' span').html(place[1]);
        }
    }
}


/*
var image = document.createElement("img");
image.src = 'image/Acupuncture.png'

window.addEventListener("load", function()
{
    var canvas = document.createElement("canvas");
    document.getElementById("mapColumn").appendChild(canvas);

    canvas.id = 'mapCanvas';
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext("2d");

    context.fillStyle = "#BBBBBB";
    context.fillRect(0, 0, 256, 142);

    context.drawImage(image, 0, 0);
}); */
