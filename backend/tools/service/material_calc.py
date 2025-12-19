def calc_material(current, target, table):
    result = {}
    for lvl in range(current + 1, target + 1):
        for k, v in table[lvl].items():
            result[k] = result.get(k, 0) + v
    return result
