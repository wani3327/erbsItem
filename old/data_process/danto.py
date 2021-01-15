import csv
import func

# data = open('database - KO.csv', 'r', encoding='utf8')
data = open('E:/erbsItem/erbsItem/database - KO.csv', 'r', encoding='utf8')
datac = csv.reader(data)

# resD = open('src/database.js', 'w', encoding='utf8')
resD = open('E:/erbsItem/erbsItem/src/database.js', 'w', encoding='utf8')
resT = None

shouldWeMakeImageTags = True

if shouldWeMakeImageTags:
    # resT = open('data_process/imgtags.txt', 'w')
    resT = open('E:/erbsItem/erbsItem/data_process/imgtags.txt', 'w')

dname = {}
drarity = {}
drecipe = {}
dstat = {}
dimg = {}
ddrop = {}
dclass = {}
dsuper = {}
dquery = {}

html = ''

for n, row in enumerate(datac):
    if n == 0:
        continue

    try:
        _, name, code, ty, rarity, recipe, drop, stat, img, alias, _ = row

        if ty == 'Deleted':
            continue


        dname[code] = name


        drarity[code] = rarity[0] # Common -> C


        if recipe:
            sub = recipe.split('+')
            drecipe[code] = sub

            if sub[0] not in dsuper:
                dsuper[sub[0]] = [code]
            else:
                dsuper[sub[0]].append(code)

            if sub[1] not in dsuper:
                dsuper[sub[1]] = [code]
            else:
                dsuper[sub[1]].append(code)


        if stat:
            dstat[code] = stat.replace(',', '<br>')


        dimg[code] = img


        if drop:
            ddrop[code] = []
            single = drop.split(',')
            for s in single:
                ddrop[code].append(s.split())


        ty = ty.replace(' ', '_')
        if ty not in dclass:
            dclass[ty] = [code]
        else:
            dclass[ty].append(code)


        names = [name]
        if alias:
            names += alias.split(',')
        dquery[code] = []

        for n in names:
            n = n.replace(' ', '')
            dquery[code].append(func.shatter(n))


        if shouldWeMakeImageTags:
            html += f"\t\t\t\t\t<img id='{code}' class='listItemIcon' title='{name}' src='image/item/{img}.webp' onclick='showItem(\"{code}\")'/>\n"



    except IndexError: # no rarity
        print('ierr' + str(n))
    except ValueError: # no image path and more
        print('verr' + str(n))

resD.write(f'''
var itemName={str(dname).replace(', ',',').replace(': ',':')};
var recipe={str(drecipe).replace(', ',',').replace(': ',':')};
var img={str(dimg).replace(', ',',').replace(': ',':')};
var rarity={str(drarity).replace(', ',',').replace(': ',':')};
var drop={str(ddrop).replace(', ',',').replace(': ',':')};
var type={str(dclass).replace(', ',',').replace(': ',':')};
var stat={str(dstat).replace(', ',',').replace(': ',':')};
var sup={str(dsuper).replace(', ',',').replace(': ',':')};
var query={str(dquery).replace(', ',',').replace(': ',':')};
''')
resD.close()

if shouldWeMakeImageTags:
    resT.write(html)
    resT.close()

# var itemName = {'TE1': 'test1', 'TE2': 'test2', 'TE3': 'test3', 'TE4': 'test4', 'TE5': 'test5'}
# var recipe = {'TE1': ['TE2', 'TE3', '2'], 'TE3': ['TE4', 'TE5']};
# var img = {'TE1': 'image/Acupuncture.png', 'TE2': 'image/AK-12.png', 'TE3': 'image/AK-47.png', 'TE4': 'image/Alcohol.png', 'TE5': 'image/Amazoness Armor.png'};
# var rarity = {'TE1': 'C', 'TE2': 'R', 'TE3': 'L', 'TE4': 'U', 'TE5': 'E'};
# var drop = {'TE1': [['forest', 1], ['dock', 2]], 'TE2': [['chapel', 3]]};
# var type = {}
