# attack是面板攻击，critical是会心率，attack_power是强度，master是专精，hit_rate是专注率
def compare_attribute(attack, critical, attack_power, master, hit_rate, compare_dict):
    convertion_rate_attack = 2400
    convertion_rate_critical = 2880
    convertion_rate_master = 2400
    convertion_rate_hit = 3000
    base_hit_rate = 0.7288 # 对应合道3，合道1为0.8
    master_effect = 0.938 #   master_effect = skill_rate_1*proportion_1 + skill_rate_2*proportion_2 + ..., 对飞星寒宵来说，目前寒宵加星如雨约84%，证道加霜天约7%，前者专精加成率为1，后者为1.4，总和即0.84*1+0.07*1.4=0.938
    critical_effect = 0.6
    base_attack = attack / (1 + attack_power/convertion_rate_attack)
    dps_base = base_attack*(1 + attack_power/convertion_rate_attack)*(1 + critical_effect*critical/100)*(1 + master_effect*master/convertion_rate_master)*(1 - 0.7*max(0, 1 - base_hit_rate - hit_rate/100 + 0.8))
    print('基础伤害: ', dps_base)
    dps_best = ['基础', dps_base]
    
    if '主属性' in compare_dict:
        agility_value = compare_dict['主属性']
        dps_agility = (base_attack + 0.5*agility_value)*(1 + (attack_power + 0.33*agility_value)/convertion_rate_attack)*(1 + critical_effect*(critical/100 + 0.33*agility_value/convertion_rate_critical))*(1 + master_effect*master/convertion_rate_master)*(1 - 0.7*max(0, 1 - base_hit_rate - hit_rate/100 + 0.8))
        improve = (dps_agility - dps_base)/dps_base*100
        if dps_agility > dps_best[1]:
            dps_best = ['主属性', dps_agility]
        print('\r\n主属性伤害: ', dps_agility,'提升百分比: ', improve)
    if '攻击' in compare_dict:
        attack_value = compare_dict['攻击']
        dps_attack = (base_attack + attack_value)*(1 + attack_power/convertion_rate_attack)*(1 + critical_effect*critical/100)*(1 + master_effect*master/convertion_rate_master)*(1 - 0.7*max(0, 1 - base_hit_rate - hit_rate/100 + 0.8))
        improve = (dps_attack - dps_base)/dps_base*100
        if dps_attack > dps_best[1]:
            dps_best = ['攻击', dps_attack]
        print('\r\n攻击伤害: ', dps_attack,'提升百分比: ', improve)
    if '强度' in compare_dict:
        attack_power_value = compare_dict['强度']
        dps_attack_power = base_attack*(1 + (attack_power + attack_power_value)/convertion_rate_attack)*(1 + critical_effect*critical/100)*(1 + master_effect*master/convertion_rate_master)*(1 - 0.7*max(0, 1 - base_hit_rate - hit_rate/100 + 0.8))
        improve = (dps_attack_power - dps_base)/dps_base*100
        if dps_attack_power > dps_best[1]:
            dps_best = ['攻击', dps_attack_power]
        print('\r\n强度伤害: ', dps_attack_power,'提升百分比: ', improve)
    if '专精' in compare_dict:
        master_value = compare_dict['专精']
        dps_master = base_attack*(1 + attack_power/convertion_rate_attack)*(1 + critical_effect*critical/100)*(1 + master_effect*(master + master_value)/convertion_rate_master)*(1 - 0.7*max(0, 1 - base_hit_rate - hit_rate/100 + 0.8))
        improve = (dps_master - dps_base)/dps_base*100
        if dps_master > dps_best[1]:
            dps_best = ['专精', dps_master]
        print('\r\n专精伤害: ', dps_master,'提升百分比: ', improve)
    if '会心' in compare_dict:
        critical_value = compare_dict['会心']
        dps_critical = base_attack*(1 + attack_power/convertion_rate_attack)*(1 + critical_effect*(critical/100 + critical_value/convertion_rate_critical))*(1 + master_effect*master/convertion_rate_master)*(1 - 0.7*max(0, 1 - base_hit_rate - hit_rate/100 + 0.8))
        improve = (dps_critical - dps_base)/dps_base*100
        if dps_critical > dps_best[1]:
            dps_best = ['会心', dps_critical]
        print('\r\n会心伤害: ', dps_critical,'提升百分比: ', improve)
    if '专注' in compare_dict:
        hit_rate_value = compare_dict['专注']
        dps_hit_rate = base_attack*(1 + attack_power/convertion_rate_attack)*(1 + critical_effect*critical/100)*(1 + master_effect*master/convertion_rate_master)*(1 - 0.7*max(0, 1 - base_hit_rate - hit_rate/100 - hit_rate_value/convertion_rate_hit + 0.8))
        improve = (dps_hit_rate - dps_base)/dps_base*100
        if dps_hit_rate > dps_best[1]:
            dps_best = ['专精', dps_hit_rate]
        print('\r\n专注伤害: ', dps_hit_rate,'提升百分比: ', improve)
    improve = (dps_best[1] - dps_base)/dps_base*100
    print('\r\n提升最大的属性为：', dps_best[0], '，提升百分比：', improve)
    print('请注意，这里未考虑会心的额外收益（比如触发效果）以及技能特效被识破带来的影响，如果本职业受影响较多，会心及专注收益需适当上调')

if __name__ == '__main__':    
    attack = float(input('请输入当前面板攻击'))
    attack_power = float(input('请输入当前强度'))
    master = float(input('请输入当前专精值'))
    critical = float(input('请输入当前会心率'))
    hit_rate = float(input('请输入当前专注率'))
    flag = True
    compare_dict = {}
    attribute_dict = {1:'主属性',2:'攻击',3:'强度',4:'专精', 5:'会心', 6:'专注'}
    stone_dict = {1:[6,4,15], 2:[7,5,18], 3:[6,9,21]}
    while flag:
        attribute_code = int(input('请输入要比较的属性代号，1代表主属性，2代表基础攻击，3代表强度，4代表专精，5代表会心，6代表专注，7代按灵石等级统一设置属性，输入0开始比较\r\n'))
        if attribute_code in attribute_dict.keys():
            print('已添加待比较属性：', attribute_dict[attribute_code])
            attribute_value = float(input('请输入该属性的值：'))
            compare_dict[attribute_dict[attribute_code]] = attribute_value
        elif attribute_code == 7:            
            attribute_value = int(input('將按灵石设置属性，请输入灵石等级：'))
            compare_dict['主属性'] = stone_dict[attribute_value][0]
            compare_dict['攻击'] = stone_dict[attribute_value][1]
            compare_dict['强度'] = stone_dict[attribute_value][2]
            compare_dict['专精'] = stone_dict[attribute_value][2]
            compare_dict['会心'] = stone_dict[attribute_value][2]
        elif attribute_code != 0:
            print('请输入正确的属性代号')
        else:
            flag = False
    print('---------------------------------------------------')
    compare_attribute(attack, critical, attack_power, master, hit_rate, compare_dict)