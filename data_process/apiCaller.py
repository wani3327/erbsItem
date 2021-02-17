import requests
import json
import func
import ownDB

# TO-DO
#
# 탐색/사냥/채집/보급, 영어이름, alias, 추가스탯(설명)

def callApi(apitype: str):
    headers = {
        'accept': 'application/json',
        'x-api-key': 'GLiLXQdMtN9i657xxYddn8qj9kvkmKt6T7VSK3I9',
    }

    return requests.get('https://open-api.bser.io/v1/' + apitype, headers=headers)


# Initializing
db_js = open('src/database_api.js', 'w', encoding='utf8')
db_py = open('data_process/database_api.py', 'w', encoding='utf8')
item = {}
more = ownDB.main()


weapon = json.loads(callApi('data/ItemWeapon').text)

for w in weapon['data']:
    code     = w['code']
    name_kr  = w['name']
    grade    = func.grade_tr(w['itemGrade'])
    craft    = func.craft_tr(w['makeMaterial1'], w['makeMaterial2'], 1)
    stat     = func.stat_sum(w) + more[name_kr.replace(' ','')][1]
    name     = more[name_kr.replace(' ','')][2]

    item[code] = [name, grade, craft, stat, 0]

print('WEAPON DONE')


armor = json.loads(callApi('data/ItemArmor').text)

for a in armor['data']:
    code     = a['code']
    name_kr  = a['name']
    grade    = func.grade_tr(a['itemGrade'])
    craft    = func.craft_tr(a['makeMaterial1'], a['makeMaterial2'], 1)
    stat     = func.stat_sum(a) + more[name_kr.replace(' ','')][1]
    name     = more[name_kr.replace(' ','')][2]

    item[code] = [name, grade, craft, stat, 0]

print('ARMOR DONE')


consumable = json.loads(callApi('data/ItemConsumable').text)

for c in consumable['data']:
    code     = c['code']
    name_kr  = c['name']
    grade    = func.grade_tr(c['itemGrade'])
    craft    = func.craft_tr(c['makeMaterial1'], c['makeMaterial2'], c['initialCount'])
    stat     = func.heal_tr(c) + more[name_kr.replace(' ','')][1]
    name     = more[name_kr.replace(' ','')][2]

    item[code] = [name, grade, craft, stat, 0]

print('CONSU. DONE')


misc = json.loads(callApi('data/ItemMisc').text)

for m in misc['data']:
    code     = m['code']
    name_kr  = m['name']
    grade    = func.grade_tr(m['itemGrade'])
    craft    = func.craft_tr(m['makeMaterial1'], m['makeMaterial2'], m['initialCount'])
    stat     = more[name_kr.replace(' ','')][1]
    name     = more[name_kr.replace(' ','')][2]

    item[code] = [name, grade, craft, stat, 0]

print('MISC DONE')


special = json.loads(callApi('data/ItemSpecial').text)

for i in special['data']:
    code     = i['code']
    name_kr  = i['name']
    grade    = func.grade_tr(i['itemGrade'])
    craft    = func.craft_tr(i['makeMaterial1'], i['makeMaterial2'], i['initialCount'])
    stat     = more[name_kr.replace(' ','')][1]
    name     = more[name_kr.replace(' ','')][2]

    item[code] = [name, grade, craft, stat, 0]

print('SPECIAL DONE')


spawn = json.loads(callApi('data/ItemSpawn').text)

for i in spawn['data']:
    code   = i['itemCode']
    area   = i['areaCode']
    amount = i['dropCount']

    if item[code][4]:
        item[code][4].append([area, amount])
    else:
        item[code][4] = [[area, amount]]

print('SPAWN DONE')


other_obt = json.loads(callApi('data/HowToFindItem').text)

for i in other_obt['data']:
    code    = i['itemCode']
    # a 7-bit integer stores info about hunt, collect, airsupp
    hunt    = bool(i['huntChicken'])       \
            + bool(i['huntBat']) * 2       \
            + bool(i['huntBoar']) * 4      \
            + bool(i['huntWildDog']) * 8   \
            + bool(i['huntWolf']) * 16     \
            + bool(i['huntBear']) * 32     \
            + bool(i['huntWickline']) * 64
    collect = i["collectibleCode"]
    supply  = i["airSupply"]

    obtInfo = []
    if hunt:
        obtInfo.append([-1, hunt])
    if collect:
        obtInfo.append([-2, collect])
    if supply:
        obtInfo.append([-3, supply])

    if item[code][4]:
        item[code][4].extend(obtInfo)
    else:
        item[code][4] = obtInfo

print('OTHER_OBT DONE')

# Item Type  || Stone:        112101 -> 401198
# Exceptions || Glass Bottle: 112104 -> 401199
#            || Cell Phone:   501401 -> 401399

itemf = str(item).replace(': ', ':').replace(', ', ',') \
                 .replace('112101', '401198')           \
                 .replace('112104', '401199')           \
                 .replace('501401', '401399')

# [name, grade, craft, stat, spawn]
js = 'var t="' + func.now() + '";' + \
     'var item=' + itemf + ';'
db_js.write(js)

py = 'itemdb=' + itemf
db_py.write(py)
