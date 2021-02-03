import math
import time

def type_tr(t):
    return {
        'OneHandSword': 15, 'TwoHandSword': 16, 'DualSword': 18, 'Hammer': 13,
        'Axe': 14, 'Spear': 19, 'Bat': 3, 'Whip': 4,
        'Glove': 1, 'Tonfa': 2, 'HighAngleFire': 5, 'DirectFire': 6,
        'Bow': 7, 'CrossBow': 8, 'Pistol': 9, 'AssaultRifle': 10,
        'SniperRifle': 11, 'Nunchaku': 20, 'Rapier': 21, 'Guitar': 22
    }[t]

def grade_tr(g):
    return {'Common': 0, 'Uncommon': 1, 'Rare': 2, 'Epic': 3, 'Legend': 4}[g]

def craft_tr(c1, c2, a):
    return 0 if c1 == 0 else [c1, c2] if a == 1 else [c1, c2, a]

def stat_sum(i):
    statType = [
        ['attackPower', 'AP ', ','],

        ['increaseBasicAttackDamage', 'EN ', ','],
        ['attackSpeedRatio', 'AS ', '%,'],
        ['criticalStrikeChance', 'CC ', '%,'],
        ['criticalStrikeDamage', 'CD ', '%,'],
        ['attackRange', 'AR ', ','],

        ['increaseSkillDamage', 'SA ', ','],
        ['increaseSkillDamageRatio', 'SA ', '%,'],
        ['cooldownReduction', 'CR ', '%,'],
        ["maxSp", 'MS ', ','],
        ['spRegenRatio', 'SR ', '%,'],
        ['spRegen', 'SR ', ','],

        ['defense', 'DF ', ','],
        ['maxHp', 'MH ', ','],
        ['hpRegenRatio', 'HR ', '%,'],
        ['hpRegen', 'HR ', ','],
        ["preventBasicAttackDamaged", 'ND ', ','],
        ["preventSkillDamagedRatio", 'SD ', '%,'],

        ['moveSpeed', 'SP ', ','],
        ["outOfCombatMoveSpeed", 'SO ', ','],
        ['sightRange', 'VR ', ','],
        ['lifeSteal', 'LS ', '%,'],
        ['decreaseRecoveryToBasicAttack', 'HN ', '%,'],
        ['decreaseRecoveryToSkill', 'HS ', '%,']
    ]

    def itoa_w_plus(n):
        return ('+' if n > 0 else '') + str(n)

    stat = ''

    for key, code, comma in statType:
        try:
            if i[key]:
                if comma[0] == '%':
                    stat += code + itoa_w_plus(math.floor(i[key] * 100)) + comma
                else:
                    stat += code + itoa_w_plus(i[key]) + comma
        except KeyError:
            pass

    return stat

def heal_tr(i):
    if i["consumableType"] == "Beverage":
        return 'SR +' + str(i['spRecover'])
    else:
        return 'HR +' + str(i['hpRecover'])

def now():
    return time.strftime('%Y-%m-%d %I:%M:%S %p', time.localtime(time.time()))