// Created with Drakon Tech https://drakon.tech/

function common_mod() {

var module = {};

function Dictionary_get(self, key) {
    var map;
    map = self.map
    if (key in map) {
        return map[key]
    } else {
        throw new Error(
            "Dictionary \"" + self.name + "\": key not found: "
            + key
        )
    }
}

function addDaysToDate(date, days) {
    var ms;
    ms = date.getTime()
    ms += 24 * 3600 * 1000 * days
    return new Date(ms)
}

function addMonthToDate(date) {
    var date2, day, daysInMonth, daysInMonth2, month, year;
    day = date.getUTCDate()
    month = date.getUTCMonth()
    year = date.getUTCFullYear()
    daysInMonth = getDaysInMonth(date)
    if (month === 11) {
        year++;
        month = 0
    } else {
        month++
    }
    date2 = stabilizeMonthEnd(
        year,
        month,
        day
    )
    if (daysInMonth === day) {
        daysInMonth2 = getDaysInMonth(date2)
        date2 = stabilizeMonthEnd(
            year,
            month,
            daysInMonth2
        )
    }
    return date2
}

function addTimespanPart(tspan, name, output) {
    var value;
    value = tspan[name]
    if (value) {
        output.push(value + name)
    }
}

function addYearsToDate(date, years) {
    var date2, day, daysInMonth, daysInMonth2, month, year, year2;
    day = date.getUTCDate()
    month = date.getUTCMonth()
    year = date.getUTCFullYear()
    daysInMonth = getDaysInMonth(date)
    year2 = year + years
    date2 = stabilizeMonthEnd(
        year2,
        month,
        day
    )
    if (daysInMonth === day) {
        daysInMonth2 = getDaysInMonth(date2)
        date2 = stabilizeMonthEnd(
            year2,
            month,
            daysInMonth2
        )
    }
    return date2
}

function append(array, element) {
    var arrayCopy;
    array = array || []
    arrayCopy = array.slice()
    arrayCopy.push(element)
    return arrayCopy
}

function arrayToMap(array, keyProp) {
    var _7_col, _7_it, _7_length, item, key, map;
    map = {}
    if (array) {
        _7_it = 0;
        _7_col = array;
        _7_length = _7_col.length;
        while (true) {
            if (_7_it < _7_length) {
                item = _7_col[_7_it];
                key = item[keyProp]
                map[key] = item
                _7_it++;
            } else {
                break;
            }
        }
    }
    return map
}

function breadthFirst(startNodeId, getNode, getChildren, visitor) {
    var _25_col, _25_it, _25_length, childId, children, node, nodeId, stack;
    stack = []
    stack.push(startNodeId)
    while (true) {
        nodeId = stack.shift()
        node = getNode(nodeId)
        visitor(node)
        children = getChildren(node)
        _25_it = 0;
        _25_col = children;
        _25_length = _25_col.length;
        while (true) {
            if (_25_it < _25_length) {
                childId = _25_col[_25_it];
                stack.push(childId)
                _25_it++;
            } else {
                break;
            }
        }
        if (stack.length === 0) {
            break;
        } else {
        }
    }
}

function buildDate(year, month, day) {
    var date2;
    if (((((((!(((isNaN(day)) || (isNaN(month))) || (isNaN(year)))) && (year >= 1900)) && (year <= 2100)) && (month >= 1)) && (month <= 12)) && (day >= 1)) && (day <= 31)) {
        date2 = new Date(
            Date.UTC(
                year,
                month - 1,
                day,
                0,
                0,
                0
            )
        )
        if (date2.getUTCDate() === day) {
            return date2
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}

function cloneArray(src) {
    if (src) {
        return src.slice()
    } else {
        return []
    }
}

function cloneObject(src) {
    var copy;
    copy = {}
    copyProps(src, copy)
    return copy
}

function compareNumbers(leftItem, rightItem, prop) {
    var left, right;
    left = leftItem[prop]
    right = rightItem[prop]
    if (left < right) {
        return -1
    } else {
        if (left > right) {
            return 1
        } else {
            return 0
        }
    }
}

function compareText(leftItem, rightItem, prop) {
    var left, right;
    left = leftItem[prop] || ""
    right = rightItem[prop] || ""
    left = left.toLowerCase()
    right = right.toLowerCase()
    if (left < right) {
        return -1
    } else {
        if (left > right) {
            return 1
        } else {
            return 0
        }
    }
}

function contains(array, element) {
    return array.indexOf(element) !== -1
}

function copyProps(src, target) {
    var _5_col, _5_it, _5_keys, _5_length, key, value;
    if (src) {
        _5_it = 0;
        _5_col = src;
        _5_keys = Object.keys(_5_col);
        _5_length = _5_keys.length;
        while (true) {
            if (_5_it < _5_length) {
                key = _5_keys[_5_it];
                value = _5_col[key];
                if (value === undefined) {
                } else {
                    target[key] = value
                }
                _5_it++;
            } else {
                break;
            }
        }
    }
}

function createDictionary(name) {
    var self;
    self = {name: name, map: {}}
    self.get = function (key) {
        return Dictionary_get(self, key)
    }
    self.set = function (key, item) {
        self.map[key] = item
    }
    self.remove = function (id) {
        delete self.map[id]
    }
    self.clear = function () {
        self.map = {}
    }
    self.contains = function (key) {
        return key in self.map
    }
    return self
}

function deepClone(obj) {
    var visited;
    visited = new Set()
    return deepCloneCore(visited, obj)
}

function deepCloneCore(visited, obj) {
    var _32_col, _32_it, _32_length, _43_col, _43_it, _43_keys, _43_length, _sw_23, array, copy, item, key, value;
    if ((obj === undefined) || (obj === null)) {
        return undefined
    } else {
        _sw_23 =  typeof obj;
        if ((_sw_23 === "number") || (((((_sw_23 === "boolean") || (_sw_23 === "string")) || (_sw_23 === "bigint")) || (_sw_23 === "function")) || (_sw_23 === "symbol"))) {
            return obj
        } else {
            if ((obj instanceof RegExp) || (obj instanceof Date)) {
                return obj
            } else {
                if (visited.has(obj)) {
                    throw new Error(
                        "deepClone: cycle detected"
                    )
                } else {
                    visited.add(obj)
                    if (Array.isArray(obj)) {
                        array = []
                        _32_it = 0;
                        _32_col = obj;
                        _32_length = _32_col.length;
                        while (true) {
                            if (_32_it < _32_length) {
                                item = _32_col[_32_it];
                                array.push(deepCloneCore(visited, item))
                                _32_it++;
                            } else {
                                break;
                            }
                        }
                        return array
                    } else {
                        copy = {}
                        _43_it = 0;
                        _43_col = obj;
                        _43_keys = Object.keys(_43_col);
                        _43_length = _43_keys.length;
                        while (true) {
                            if (_43_it < _43_length) {
                                key = _43_keys[_43_it];
                                value = _43_col[key];
                                copy[key] = deepCloneCore(visited, value)
                                _43_it++;
                            } else {
                                break;
                            }
                        }
                        return copy
                    }
                }
            }
        }
    }
}

function depthFirst(nodeId, getNode, getChildren, visitor) {
    var _25_col, _25_it, _25_length, childId, children, node;
    node = getNode(nodeId)
    visitor(node)
    children = getChildren(node)
    _25_it = 0;
    _25_col = children;
    _25_length = _25_col.length;
    while (true) {
        if (_25_it < _25_length) {
            childId = _25_col[_25_it];
            depthFirst(
                childId,
                getNode,
                getChildren,
                visitor
            )
            _25_it++;
        } else {
            break;
        }
    }
}

function findByProp(array, prop, value) {
    var _7_col, _7_it, _7_length, item;
    if (array) {
        _7_it = 0;
        _7_col = array;
        _7_length = _7_col.length;
        while (true) {
            if (_7_it < _7_length) {
                item = _7_col[_7_it];
                if (item[prop] === value) {
                    return item
                } else {
                    _7_it++;
                }
            } else {
                return undefined
            }
        }
    } else {
        return undefined
    }
}

function findByPropInMap(object, prop, value) {
    var _7_col, _7_it, _7_keys, _7_length, id, item;
    if (object) {
        _7_it = 0;
        _7_col = object;
        _7_keys = Object.keys(_7_col);
        _7_length = _7_keys.length;
        while (true) {
            if (_7_it < _7_length) {
                id = _7_keys[_7_it];
                item = _7_col[id];
                if (item[prop] === value) {
                    return item
                } else {
                    _7_it++;
                }
            } else {
                return undefined
            }
        }
    } else {
        return undefined
    }
}

function forEach(context, list, action) {
    list.forEach(
        function (item) {
            action(context, item)
        }
    )
}

function formatDate(isoDate) {
    var day, month, obj, year;
    if (isoDate) {
        obj = parseIsoDate(isoDate)
        if (obj) {
            day = padWith(
                obj.getUTCDate().toString(),
                2,
                '0'
            )
            month = padWith(
                (obj.getUTCMonth() + 1).toString(),
                2,
                '0'
            )
            year = obj.getUTCFullYear().toString()
            return day + "." + month + "." + year
        } else {
            return ""
        }
    } else {
        return ""
    }
}

function formatTimespan(timespan) {
    var parts;
    if (timespan) {
        parts = []
        addTimespanPart(timespan, "y", parts)
        addTimespanPart(timespan, "m", parts)
        addTimespanPart(timespan, "w", parts)
        addTimespanPart(timespan, "d", parts)
        addTimespanPart(timespan, "h", parts)
        if (parts.length === 0) {
            return "0d"
        } else {
            return parts.join(".")
        }
    } else {
        return ""
    }
}

function getDaysInMonth(date) {
    var date1, date2, day, month, t1, t2, year;
    day = 1
    month = date.getUTCMonth()
    year = date.getUTCFullYear()
    date1 = new Date(
        Date.UTC(year, month, day, 0, 0, 0)
    )
    if (month === 11) {
        year++;
        month = 0
    } else {
        month++
    }
    date2 = new Date(
        Date.UTC(year, month, day, 0, 0, 0)
    )
    t1 = date1.getTime()
    t2 = date2.getTime()
    return Math.round(
        (t2 - t1) / 24 / 3600 / 1000
    )
}

function getLast(array) {
    return array[array.length - 1]
}

function getOrCreate(map, key, defaultValue) {
    var result;
    result = map[key]
    if (result === undefined) {
        map[key] = defaultValue
        result = defaultValue
    }
    return result
}

function getUnixTime() {
    var date;
    date = new Date()
    return date.getTime()
}

function getValues(object) {
    var _8_col, _8_it, _8_keys, _8_length, key, value, values;
    values = []
    if (object) {
        _8_it = 0;
        _8_col = object;
        _8_keys = Object.keys(_8_col);
        _8_length = _8_keys.length;
        while (true) {
            if (_8_it < _8_length) {
                key = _8_keys[_8_it];
                value = _8_col[key];
                values.push(value)
                _8_it++;
            } else {
                break;
            }
        }
    }
    return values
}

function isEmpty(value) {
    if (((value === null) || (value === undefined)) || (value === "")) {
        return true
    } else {
        return false
    }
}

function orderBy(array, prop, type) {
    var _sw_12, sorter;
    _sw_12 = type;
    if (_sw_12 === "number") {
        sorter = function (left, right) {
            return compareNumbers(
                left,
                right,
                prop
            )
        }
    } else {
        sorter = function (left, right) {
            return compareText(left, right, prop)
        }
    }
    array.sort(sorter)
}

function padWith(text, length, ch) {
    var diff, i, result;
    if ((text === undefined) || (text === null)) {
        text = ""
    } else {
        if ( typeof text === "string") {
        } else {
            text = text.toString()
        }
    }
    diff = length - text.length
    result = text
    i = 0;
    while (true) {
        if (i < diff) {
            result = ch + result
            i++;
        } else {
            break;
        }
    }
    return result
}

function parseDate(dateStr) {
    var day, fmtResult, month, parts, year;
    fmtResult = {
        value: "",
        error: "",
        date: undefined
    }
    if (dateStr) {
        dateStr = dateStr.trim()
        parts = split(dateStr, ".")
        if (parts.length === 3) {
            day = parseInt(parts[0])
            month = parseInt(parts[1])
            year = parseInt(parts[2])
            fmtResult.date = buildDate(
                year,
                month,
                day
            )
            if (fmtResult.date) {
                fmtResult.value = year + "-" + padWith(
                    month,
                    2,
                    '0'
                ) + "-" + padWith(day, 2, '0')
            } else {
                fmtResult.error = "Wrong date format. Should be DD.MM.YYYY (for example 31.12.2019)"
            }
        } else {
            fmtResult.error = "Wrong date format. Should be DD.MM.YYYY (for example 31.12.2019)"
        }
    }
    return fmtResult
}

function parseIsoDate(isoDate) {
    var day, month, parts, year;
    if (isoDate) {
        isoDate = isoDate.trim()
        parts = split(isoDate, ".")
        if (parts.length === 3) {
            day = parseInt(parts[2])
            month = parseInt(parts[1])
            year = parseInt(parts[0])
            return buildDate(year, month, day)
        } else {
            parts = split(isoDate, "-")
            if (parts.length === 3) {
                day = parseInt(parts[2])
                month = parseInt(parts[1])
                year = parseInt(parts[0])
                return buildDate(year, month, day)
            } else {
                return undefined
            }
        }
    } else {
        return undefined
    }
}

function parseTimespan(timespanStr) {
    var _7_col, _7_it, _7_length, _sw_25, fmtResult, left, number, parsed, part, partRaw, parts, right;
    fmtResult = {
        value: "",
        error: "",
        parsed: undefined
    }
    if (timespanStr) {
        parts = split(timespanStr, ".")
        parsed = {y: 0, m: 0, w: 0, d: 0, h: 0}
        _7_it = 0;
        _7_col = parts;
        _7_length = _7_col.length;
        while (true) {
            if (_7_it < _7_length) {
                partRaw = _7_col[_7_it];
                part = partRaw.trim()
                left = part.substring(0, part.length - 1)
                right = part.substring(part.length - 1)
                left = left.trim()
                if (left) {
                    number = parseInt(left)
                    if ((!(isNaN(number))) && (number >= 0)) {
                        _sw_25 = right;
                        if (_sw_25 === "y") {
                            parsed.y = number
                        } else {
                            if (_sw_25 === "m") {
                                parsed.m = number
                            } else {
                                if (_sw_25 === "w") {
                                    parsed.w = number
                                } else {
                                    if (_sw_25 === "d") {
                                        parsed.d = number
                                    } else {
                                        if (_sw_25 === "h") {
                                            parsed.h = number
                                        } else {
                                            fmtResult.error = "Wrong date format. Should be "
                                            + "3y or 3y.10m or 10m.2w or 1m.2d or 3d.5h "
                                            + "or 8d"
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        fmtResult.error = "Wrong date format. Should be "
                        + "3y or 3y.10m or 10m.2w or 1m.2d or 3d.5h "
                        + "or 8d"
                    }
                } else {
                    fmtResult.error = "Wrong date format. Should be "
                    + "3y or 3y.10m or 10m.2w or 1m.2d or 3d.5h "
                    + "or 8d"
                }
                _7_it++;
            } else {
                break;
            }
        }
        fmtResult.parsed = parsed
        fmtResult.value = formatTimespan(parsed)
    }
    return fmtResult
}

function remove(array, item) {
    var index;
    index = array.indexOf(item)
    if (index === -1) {
    } else {
        array.splice(index, 1)
    }
}

function removeByProp(array, prop, value) {
    var i, item;
    if (array) {
        i = 0;
        while (true) {
            if (i < array.length) {
                item = array[i]
                if (item[prop] === value) {
                    array.splice(i, 1)
                    break;
                } else {
                    i++;
                }
            } else {
                break;
            }
        }
    }
}

function replaceAll(text, oldText, newText) {
    var parts;
    if (text) {
        parts = text.split(oldText)
        return parts.join(newText)
    } else {
        return ""
    }
}

function selectProp(array, prop) {
    return array.map(
        function (item) {
            return item[prop]
        }
    )
}

function setProp(src, name, target, units) {
    var value;
    if (name in src) {
        value = src[name]
        if (units) {
            value += units
        }
        target[name] = value
    }
}

function sortNumbers(numbers) {
    var comparer;
    comparer = function (a, b) {
        return a - b
    }
    numbers.sort(comparer)
}

function split(text, separator) {
    var notEmpty, parts;
    if (text) {
        notEmpty = function (part) {
            return part.length > 0
        }
        parts = text.split(separator)
        return parts.filter(notEmpty)
    } else {
        return []
    }
}

function stabilizeMonthEnd(year, month, day) {
    var date2, ms;
    ms = Date.UTC(year, month, day, 0, 0, 0)
    while (true) {
        date2 = new Date(ms)
        if (date2.getUTCMonth() === month) {
            break;
        } else {
            ms -= 24 * 3600 * 1000
        }
    }
    return date2
}

function swap(array, i1, i2) {
    var v1, v2;
    v1 = array[i1]
    v2 = array[i2]
    array[i1] = v2
    array[i2] = v1
}

function timespanAdd(ts1, ts2) {
    var pts1, pts2;
    pts1 = parseTimespan(ts1)
    pts2 = parseTimespan(ts2)
    pts1.parsed.y += pts2.parsed.y
    pts1.parsed.m += pts2.parsed.m
    pts1.parsed.w += pts2.parsed.w
    pts1.parsed.d += pts2.parsed.d
    pts1.parsed.h += pts2.parsed.h
    return formatTimespan(pts1.parsed)
}

function timespanToHours(timespanStr, hoursPerDay) {
    var daysPerMonth, daysPerYear, timespan, total;
    timespan = parseTimespan(timespanStr)
    if (timespan.parsed) {
        hoursPerDay = hoursPerDay || 8
        daysPerYear = 365.2425
        daysPerMonth = 30
        total = 0
        if (timespan.parsed.y) {
            total += timespan.parsed.y * daysPerYear * hoursPerDay
        }
        if (timespan.parsed.m) {
            total += timespan.parsed.m * daysPerMonth * hoursPerDay
        }
        if (timespan.parsed.w) {
            total += timespan.parsed.w * 7 * hoursPerDay
        }
        if (timespan.parsed.d) {
            total += timespan.parsed.d * hoursPerDay
        }
        if (timespan.parsed.h) {
            total += timespan.parsed.h
        }
        return Math.round(total)
    } else {
        return undefined
    }
}

function toIso(date) {
    var iso;
    iso = date.toISOString()
    return iso.substring(0, 10)
}

function toIsoDate(dateStr) {
    var date, iso;
    date = parseIsoDate(dateStr)
    if (date) {
        iso = date.toISOString()
        return iso.substring(0, 10)
    } else {
        return undefined
    }
}

function toLower(text) {
    if ((text === undefined) || (text === null)) {
        text = ""
    } else {
        if ( typeof text === "string") {
        } else {
            text = text.toString()
        }
    }
    return text.toLowerCase()
}

function trim(text) {
    text = text || ""
    return text.trim()
}

module.cloneObject = cloneObject;

module.forEach = forEach;

module.split = split;

return module;

}
