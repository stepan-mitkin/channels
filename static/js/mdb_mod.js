// Created with Drakon Tech https://drakon.tech/

function mdb_mod() {

var module = {};

function add(mdb, id, name, value, before) {
    var array, fieldInfo, index, key, manyRow, map, row, tableInfo, type;
    function branch1() {
        if (value) {
            row = getRow(mdb, id)
            type = row._type
            tableInfo = mdb.schema[type]
            fieldInfo = getFieldInfo(tableInfo, name)
            if (fieldInfo.type === "array") {
                manyRow = checkManySide(
                    mdb,
                    fieldInfo,
                    value
                )
                return branch2();
            } else {
                if (fieldInfo.type === "map") {
                    manyRow = checkManySide(
                        mdb,
                        fieldInfo,
                        value
                    )
                    return branch3();
                } else {
                    throw new Error(
                        "Field \"" + name + "\" of type \"" +
                        type + "\" is not a collection"
                    )
                }
            }
        } else {
            throw new Error("value is empty")
        }
    }

    function branch2() {
        array = row[name]
        if (array) {
        } else {
            array = []
            row[name] = array
        }
        if (before) {
            index = array.indexOf(before)
            if (index === -1) {
                throw new Error(
                    "Wrong before: " + before
                )
            } else {
                array.splice(index, 0, value)
                return branch4();
            }
        } else {
            array.push(value)
            return branch4();
        }
    }

    function branch3() {
        key = manyRow[fieldInfo.key]
        if (isEmpty(key)) {
            throw new Error("Key cannot be empty")
        } else {
            map = row[name]
            if (map) {
            } else {
                map = {}
                row[name] = map
            }
            key = key.toString()
            if (key in map) {
                throw new Error(
                    "Key is not unique: " + key
                )
            } else {
                map[key] = value
                return branch4();
            }
        }
    }

    function branch4() {
        manyRow[fieldInfo.manyField] = id
        return branch5();
    }

    function branch5() {
    }

    return branch1();
}

function checkCollectionField(schema, fieldInfo) {
    var many, manyField;
    checkFieldIsPresent(
        fieldInfo,
        "field " + fieldInfo.name,
        "manyField"
    )
    many = schema[fieldInfo.many]
    if (many) {
        manyField = many.fields[
            fieldInfo.manyField
        ]
        if (manyField) {
            throw new Error(
                "Wrong 'manyField' in collection " +
                fieldInfo.name
            )
        } else {
            many.fields[fieldInfo.manyField] = {
                name: fieldInfo.manyField,
                type: "backlink"
            }
        }
    } else {
        throw new Error(
            "Wrong 'many' in collection " + fieldInfo
            .name
        )
    }
}

function checkFieldIsPresent(obj, objName, name) {
    if (name in obj) {
    } else {
        throw new Error(
            "Property \"" + name + "\" is missing in "
            + objName
        )
    }
}

function checkFields(schema, tableInfo) {
    var _5_col, _5_it, _5_keys, _5_length, _sw_11, fieldInfo, key, many, name;
    _5_it = 0;
    _5_col = tableInfo.fields;
    _5_keys = Object.keys(_5_col);
    _5_length = _5_keys.length;
    while (true) {
        if (_5_it < _5_length) {
            name = _5_keys[_5_it];
            fieldInfo = _5_col[name];
            if (fieldInfo.type) {
            } else {
                fieldInfo.type = "any"
            }
            _sw_11 = fieldInfo.type;
            if (_sw_11 === "map") {
                checkCollectionField(schema, fieldInfo)
                checkFieldIsPresent(
                    fieldInfo,
                    "field " + fieldInfo.name,
                    "key"
                )
                many = schema[fieldInfo.many]
                if (fieldInfo.key === "_id") {
                } else {
                    key = many.fields[fieldInfo.key]
                    if (key) {
                        if ((key.type === "map") || (key.type === "array")) {
                            throw new Error(
                                "A collection field is chosen as key in "
                                + fieldInfo.name
                            )
                        } else {
                            key.isKey = true
                        }
                    } else {
                        throw new Error(
                            "A key field not found for  " + fieldInfo
                            .name
                        )
                    }
                }
            } else {
                if (_sw_11 === "array") {
                    checkCollectionField(schema, fieldInfo)
                } else {
                    if (_sw_11 === "link") {
                        checkFieldIsPresent(
                            fieldInfo,
                            "field " + fieldInfo.name,
                            "target"
                        )
                        if (fieldInfo.target in schema) {
                        } else {
                            throw new Error(
                                "Wrong 'target' in " + fieldInfo.name
                            )
                        }
                    } else {
                    }
                }
            }
            _5_it++;
        } else {
            break;
        }
    }
}

function checkManySide(mdb, fieldInfo, id) {
    var existing, row, type;
    row = getRow(mdb, id)
    type = row._type
    if (type === fieldInfo.many) {
        existing = row[fieldInfo.manyField]
        if (existing) {
            throw new Error(
                "Object \"" + id + "\" on many-side of relation "
                + "has a link in field \"" + fieldInfo
                .many + "\""
            )
        } else {
            return row
        }
    } else {
        throw new Error(
            "Object \"" + id + "\" on many-side of relation "
            + "has a wrong type"
        )
    }
}

function clear(mdb, id, name) {
    var context, fieldInfo, row, tableInfo, type;
    row = getRow(mdb, id)
    type = row._type
    tableInfo = mdb.schema[type]
    fieldInfo = getFieldInfo(tableInfo, name)
    context = {
        mdb: mdb,
        manyField: fieldInfo.manyField
    }
    forEach(
        mdb,
        id,
        name,
        context,
        unlinkMany
    )
    row[name] = undefined
}

function convertTableInfo(tableInfo) {
    checkFieldIsPresent(
        tableInfo,
        "tableInfo",
        "name"
    )
    checkFieldIsPresent(
        tableInfo,
        "tableInfo " + tableInfo.name,
        "fields"
    )
    return {
        name: tableInfo.name,
        fields: toNameMap(
            tableInfo.fields,
            "field"
        )
    }
}

function copyField(tableInfo, row, name, value) {
    var fieldInfo;
    fieldInfo = getFieldInfo(tableInfo, name)
    if ((((fieldInfo.type === "array") || (fieldInfo.type === "link")) || (fieldInfo.type === "backlink")) || (fieldInfo.type === "map")) {
        throw new Error(
            "Field \"" + name + "\" cannot be directly assigned in type \""
            + tableInfo.name + "\""
        )
    } else {
        row[name] = value
    }
}

function count(mdb, id, name) {
    var collection, fieldInfo, row, tableInfo, type;
    row = getRow(mdb, id)
    type = row._type
    tableInfo = mdb.schema[type]
    fieldInfo = getFieldInfo(tableInfo, name)
    collection = row[name]
    if (fieldInfo.type === "array") {
        if (collection) {
            return collection.length
        } else {
            return 0
        }
    } else {
        if (fieldInfo.type === "map") {
            if (collection) {
                return Object.keys(collection).length
            } else {
                return 0
            }
        } else {
            throw new Error(
                "Field \"" + name + "\" of type \"" +
                type + "\" is not a collection"
            )
        }
    }
}

function create(schema) {
    var mdb;
    mdb = {
        type: "mdb",
        state: "ok",
        schema: {},
        nextId: 1,
        rows: {},
        tables: {}
    }
    setMdbSchema(mdb, schema)
    return mdb
}

function decrementCounter(mdb, id) {
    var row;
    row = mdb.rows[id]
    row._counter--
}

function del(mdb, id) {
    var _12_col, _12_it, _12_keys, _12_length, _sw_38, fieldInfo, name, row, tableInfo, type, value;
    function branch1() {
        row = mdb.rows[id]
        if (row) {
            type = row._type
            return branch2();
        } else {
            return branch5();
        }
    }

    function branch2() {
        if (row._counter) {
            throw new Error(
                "Cannot delete object \"" + id + "\" because "
                + " it is referenced by other objects"
            )
        } else {
            return branch3();
        }
    }

    function branch3() {
        tableInfo = mdb.schema[type]
        _12_it = 0;
        _12_col = tableInfo.fields;
        _12_keys = Object.keys(_12_col);
        _12_length = _12_keys.length;
        while (true) {
            if (_12_it < _12_length) {
                name = _12_keys[_12_it];
                fieldInfo = _12_col[name];
                value = row[name]
                if (value) {
                    _sw_38 = fieldInfo.type;
                    if (_sw_38 === "link") {
                        throw new Error(
                            "Cannot delete object \"" + id + "\" because it has "
                            + "a link to another object"
                        )
                    } else {
                        if (_sw_38 === "array") {
                            if (value.length === 0) {
                            } else {
                                throw new Error(
                                    "Cannot delete object \"" + id + "\" because it has "
                                    + "a non-empty collection"
                                )
                            }
                        } else {
                            if (_sw_38 === "map") {
                                if (Object.keys(value).length === 0) {
                                } else {
                                    throw new Error(
                                        "Cannot delete object \"" + id + "\" because it has "
                                        + "a non-empty collection"
                                    )
                                }
                            } else {
                            }
                        }
                    }
                }
                _12_it++;
            } else {
                break;
            }
        }
        return branch4();
    }

    function branch4() {
        deleteRow(mdb, type, id)
        return branch5();
    }

    function branch5() {
    }

    return branch1();
}

function deleteRow(mdb, type, id) {
    var table;
    delete mdb.rows[id]
    table = mdb.tables[type]
    delete table[id]
}

function deleteSubgraph(mdb, start) {
    var _16_col, _16_it, _16_length, _21_col, _21_it, _21_length, id, ids, refs, row, type;
    function branch1() {
        refs = {}
        traverseSubgraph(mdb, start, refs)
        ids = Object.keys(refs)
        return branch2();
    }

    function branch2() {
        _16_it = 0;
        _16_col = ids;
        _16_length = _16_col.length;
        while (true) {
            if (_16_it < _16_length) {
                id = _16_col[_16_it];
                if (refs[id] > 0) {
                    throw new Error(
                        "Cannot delete: " + "object " + id +
                        " is still referenced"
                    )
                } else {
                    _16_it++;
                }
            } else {
                return branch3();
            }
        }
    }

    function branch3() {
        _21_it = 0;
        _21_col = ids;
        _21_length = _21_col.length;
        while (true) {
            if (_21_it < _21_length) {
                id = _21_col[_21_it];
                row = mdb.rows[id]
                type = row._type
                deleteRow(mdb, type, id)
                _21_it++;
            } else {
                break;
            }
        }
        return branch4();
    }

    function branch4() {
    }

    return branch1();
}

function exists(mdb, id) {
    return id in mdb.rows
}

function forEach(mdb, id, name, context, action) {
    var _44_col, _44_it, _44_keys, _44_length, collection, exit, fieldInfo, i, item, key, length, other, row, tableInfo, type;
    function branch1() {
        row = getRow(mdb, id)
        type = row._type
        tableInfo = mdb.schema[type]
        fieldInfo = getFieldInfo(tableInfo, name)
        collection = row[name]
        if (collection) {
            if (fieldInfo.type === "array") {
                return branch2();
            } else {
                if (fieldInfo.type === "map") {
                    return branch3();
                } else {
                    throw new Error(
                        "Field \"" + name + "\" of type \"" +
                        type + "\" is not a collection"
                    )
                }
            }
        } else {
            return branch4();
        }
    }

    function branch2() {
        length = collection.length
        i = 0;
        while (true) {
            if (i < length) {
                item = collection[i]
                exit = action(context, item, i)
                if (exit) {
                    return branch4();
                } else {
                    i++;
                }
            } else {
                return branch4();
            }
        }
    }

    function branch3() {
        _44_it = 0;
        _44_col = collection;
        _44_keys = Object.keys(_44_col);
        _44_length = _44_keys.length;
        while (true) {
            if (_44_it < _44_length) {
                key = _44_keys[_44_it];
                other = _44_col[key];
                exit = action(context, other, key)
                if (exit) {
                    return branch4();
                } else {
                    _44_it++;
                }
            } else {
                return branch4();
            }
        }
    }

    function branch4() {
    }

    return branch1();
}

function forEachRev(mdb, id, name, context, action) {
    var collection, exit, fieldInfo, i, item, length, row, tableInfo, type;
    function branch1() {
        row = getRow(mdb, id)
        type = row._type
        tableInfo = mdb.schema[type]
        fieldInfo = getFieldInfo(tableInfo, name)
        collection = row[name]
        if (collection) {
            if (fieldInfo.type === "array") {
                return branch2();
            } else {
                throw new Error(
                    "Field \"" + name + "\" of type \"" +
                    type + "\" is not an array"
                )
            }
        } else {
            return branch3();
        }
    }

    function branch2() {
        length = collection.length
        i = length - 1;
        while (true) {
            if (i >= 0) {
                item = collection[i]
                exit = action(context, item, i)
                if (exit) {
                    return branch3();
                } else {
                    i--;
                }
            } else {
                return branch3();
            }
        }
    }

    function branch3() {
    }

    return branch1();
}

function generateId(mdb, type) {
    var counter, id;
    while (true) {
        counter = mdb.nextId++
        id = type + "-" + counter
        if (id in mdb.rows) {
        } else {
            break;
        }
    }
    return id
}

function get(mdb, id, name) {
    var _sw_30, fieldInfo, row, tableInfo, type;
    row = getRow(mdb, id)
    type = row._type
    tableInfo = mdb.schema[type]
    fieldInfo = getFieldInfo(tableInfo, name)
    _sw_30 = fieldInfo.type;
    if ((_sw_30 === "array") || (_sw_30 === "map")) {
        throw new Error(
            "Cannot get field \"" + name + "\" of type \""
            + type + "\" because it is a collection"
        )
    } else {
        return row[name]
    }
}

function getCounter(mdb, id) {
    var row;
    row = getRow(mdb, id)
    return row._counter || 0
}

function getFieldInfo(tableInfo, name) {
    var fieldInfo;
    fieldInfo = tableInfo.fields[name]
    if (fieldInfo) {
        return fieldInfo
    } else {
        throw new Error(
            "Field \"" + name + "\" not found in type \""
            + tableInfo.name + "\""
        )
    }
}

function getRow(mdb, id) {
    var row;
    row = mdb.rows[id]
    if (row) {
        return row
    } else {
        throw new Error(
            "Row with id \"" + id + "\" is not found"
        )
    }
}

function getTableInfo(mdb, type) {
    var tableInfo;
    tableInfo = mdb.schema[type]
    if (tableInfo) {
        return tableInfo
    } else {
        throw new Error(
            "Type \"" + type + "\" not found"
        )
    }
}

function getType(mdb, id) {
    var row;
    row = getRow(mdb, id)
    return row._type
}

function incrementCounter(mdb, id) {
    var counter, row;
    row = mdb.rows[id]
    counter = row._counter || 0
    row._counter = counter + 1
}

function insert(mdb, type, id, fields) {
    var _37_col, _37_it, _37_keys, _37_length, name, row, table, tableInfo, value;
    function branch1() {
        tableInfo = getTableInfo(mdb, type)
        return branch2();
    }

    function branch2() {
        if (id) {
        } else {
            id = generateId(mdb, type)
        }
        if (id in mdb.rows) {
            throw new Error(
                "Row of type \"" + type + "\" with id \""
                + id + "\" already exists"
            )
        } else {
            return branch3();
        }
    }

    function branch3() {
        row = {_id: id, _type: type}
        mdb.rows[id] = row
        table = mdb.tables[type]
        table[id] = true
        return branch4();
    }

    function branch4() {
        if (fields) {
            _37_it = 0;
            _37_col = fields;
            _37_keys = Object.keys(_37_col);
            _37_length = _37_keys.length;
            while (true) {
                if (_37_it < _37_length) {
                    name = _37_keys[_37_it];
                    value = _37_col[name];
                    copyField(tableInfo, row, name, value)
                    _37_it++;
                } else {
                    break;
                }
            }
        }
        return id
    }

    function branch5() {
    }

    return branch1();
}

function isEmpty(value) {
    if (((value === null) || (value === undefined)) || (value === "")) {
        return true
    } else {
        return false
    }
}

function lookup(mdb, id, name, key) {
    var _sw_16, collection, fieldInfo, row, tableInfo, type;
    row = getRow(mdb, id)
    type = row._type
    tableInfo = mdb.schema[type]
    fieldInfo = getFieldInfo(tableInfo, name)
    collection = row[name]
    _sw_16 = fieldInfo.type;
    if ((_sw_16 === "array") || (_sw_16 === "map")) {
        if (collection) {
            return collection[key]
        } else {
            return undefined
        }
    } else {
        throw new Error(
            "Cannot lookup field \"" + name + "\" of type \""
            + type + "\" because it is not a collection"
        )
    }
}

function remove(mdb, id, name, value) {
    var before, collection, fieldInfo, index, key, manyRow, row, tableInfo, type;
    function branch1() {
        before = undefined
        if (value) {
            manyRow = getRow(mdb, value)
            row = getRow(mdb, id)
            type = row._type
            tableInfo = mdb.schema[type]
            fieldInfo = getFieldInfo(tableInfo, name)
            collection = row[name]
            if (collection) {
                if (fieldInfo.type === "array") {
                    return branch2();
                } else {
                    if (fieldInfo.type === "map") {
                        return branch3();
                    } else {
                        throw new Error(
                            "Field \"" + name + "\" of type \"" +
                            type + "\" is not a collection"
                        )
                    }
                }
            } else {
                throw new Error(
                    "value is not in collection"
                )
            }
        } else {
            throw new Error("value is empty")
        }
    }

    function branch2() {
        index = collection.indexOf(value)
        if (index === -1) {
            throw new Error(
                "value is not in collection"
            )
        } else {
            if (index + 1 < collection.length) {
                before = collection[index + 1]
            }
            collection.splice(index, 1)
            return branch4();
        }
    }

    function branch3() {
        if (manyRow._type === fieldInfo.many) {
            key = manyRow[fieldInfo.key]
            if (key in collection) {
                delete collection[key]
                return branch4();
            } else {
                throw new Error(
                    "value is not in collection"
                )
            }
        } else {
            throw new Error(
                "Wrong type of deleted element"
            )
        }
    }

    function branch4() {
        manyRow[fieldInfo.manyField] = undefined
        return branch5();
    }

    function branch5() {
        return before
    }

    return branch1();
}

function reportFields(tableInfo, columns) {
    var _, _5_col, _5_it, _5_keys, _5_length, name;
    _5_it = 0;
    _5_col = tableInfo.fields;
    _5_keys = Object.keys(_5_col);
    _5_length = _5_keys.length;
    while (true) {
        if (_5_it < _5_length) {
            name = _5_keys[_5_it];
            _ = _5_col[name];
            columns[name] = {}
            _5_it++;
        } else {
            break;
        }
    }
}

function set(mdb, id, name, value) {
    var fieldInfo, row, tableInfo, type;
    row = getRow(mdb, id)
    type = row._type
    tableInfo = mdb.schema[type]
    fieldInfo = getFieldInfo(tableInfo, name)
    if (((fieldInfo.type === "array") || (fieldInfo.type === "backlink")) || (fieldInfo.type === "map")) {
        throw new Error(
            "Field \"" + name + "\" cannot be directly assigned in type \""
            + tableInfo.name + "\""
        )
    } else {
        if (fieldInfo.isKey) {
            throw new Error(
                "Field \"" + name + "\" cannot be assigned in type \""
                + tableInfo.name + "\" because it is a key in a collection"
            )
        } else {
            if (fieldInfo.type === "link") {
                updateRefCounter(
                    mdb,
                    row,
                    fieldInfo,
                    value
                )
            }
            row[name] = value
        }
    }
}

function setMdbSchema(mdb, schemaRaw) {
    var _18_col, _18_it, _18_keys, _18_length, _29_col, _29_it, _29_keys, _29_length, name, schema, schemaInt, tableInfo;
    function branch1() {
        schemaInt = schemaRaw.map(
            convertTableInfo
        )
        schema = toNameMap(schemaInt, "table")
        return branch2();
    }

    function branch2() {
        _18_it = 0;
        _18_col = schema;
        _18_keys = Object.keys(_18_col);
        _18_length = _18_keys.length;
        while (true) {
            if (_18_it < _18_length) {
                name = _18_keys[_18_it];
                tableInfo = _18_col[name];
                checkFields(schema, tableInfo)
                _18_it++;
            } else {
                break;
            }
        }
        return branch3();
    }

    function branch3() {
        _29_it = 0;
        _29_col = schema;
        _29_keys = Object.keys(_29_col);
        _29_length = _29_keys.length;
        while (true) {
            if (_29_it < _29_length) {
                name = _29_keys[_29_it];
                tableInfo = _29_col[name];
                mdb.tables[name] = {}
                _29_it++;
            } else {
                break;
            }
        }
        return branch4();
    }

    function branch4() {
        mdb.schema = schema
    }

    return branch1();
}

function toNameMap(array, type) {
    var map;
    map = {}
    array.forEach(
        function (item) {
            checkFieldIsPresent(
                item,
                type,
                "name"
            )
            map[item.name] = item
        }
    )
    return map
}

function traverseSubgraph(mdb, id, refs) {
    var _11_col, _11_it, _11_keys, _11_length, _27_col, _27_it, _27_length, _30_col, _30_it, _30_keys, _30_length, _sw_17, child, fieldInfo, key, name, row, tableInfo, value;
    function branch1() {
        if (id in refs) {
            return branch3();
        } else {
            row = mdb.rows[id]
            refs[id] = row._counter || 0
            return branch2();
        }
    }

    function branch2() {
        tableInfo = mdb.schema[row._type]
        _11_it = 0;
        _11_col = tableInfo.fields;
        _11_keys = Object.keys(_11_col);
        _11_length = _11_keys.length;
        while (true) {
            if (_11_it < _11_length) {
                name = _11_keys[_11_it];
                fieldInfo = _11_col[name];
                value = row[name]
                if (value) {
                    _sw_17 = fieldInfo.type;
                    if (_sw_17 === "link") {
                        traverseSubgraph(mdb, value, refs)
                        refs[value]--
                    } else {
                        if (_sw_17 === "backlink") {
                            traverseSubgraph(mdb, value, refs)
                        } else {
                            if (_sw_17 === "array") {
                                _27_it = 0;
                                _27_col = value;
                                _27_length = _27_col.length;
                                while (true) {
                                    if (_27_it < _27_length) {
                                        child = _27_col[_27_it];
                                        traverseSubgraph(mdb, child, refs)
                                        _27_it++;
                                    } else {
                                        break;
                                    }
                                }
                            } else {
                                if (_sw_17 === "map") {
                                    _30_it = 0;
                                    _30_col = value;
                                    _30_keys = Object.keys(_30_col);
                                    _30_length = _30_keys.length;
                                    while (true) {
                                        if (_30_it < _30_length) {
                                            key = _30_keys[_30_it];
                                            child = _30_col[key];
                                            traverseSubgraph(mdb, child, refs)
                                            _30_it++;
                                        } else {
                                            break;
                                        }
                                    }
                                } else {
                                }
                            }
                        }
                    }
                }
                _11_it++;
            } else {
                break;
            }
        }
        return branch3();
    }

    function branch3() {
    }

    return branch1();
}

function tryUnlink(mdb, id, refs) {
}

function unlinkMany(context, id) {
    var row;
    row = context.mdb.rows[id]
    row[context.manyField] = undefined
}

function updateRefCounter(mdb, row, fieldInfo, value) {
    var old, target;
    function branch1() {
        old = row[fieldInfo.name]
        if (old) {
            decrementCounter(mdb, old)
        }
        return branch2();
    }

    function branch2() {
        if (value) {
            target = getRow(mdb, value)
            if (target._type === fieldInfo.target) {
                incrementCounter(mdb, value)
                return branch3();
            } else {
                throw new Error(
                    "Wrong type for target object \"" + value
                    + "\""
                )
            }
        } else {
            return branch3();
        }
    }

    function branch3() {
    }

    return branch1();
}

module.add = add;

module.clear = clear;

module.count = count;

module.create = create;

module.del = del;

module.deleteSubgraph = deleteSubgraph;

module.exists = exists;

module.forEach = forEach;

module.forEachRev = forEachRev;

module.get = get;

module.getCounter = getCounter;

module.getType = getType;

module.insert = insert;

module.lookup = lookup;

module.remove = remove;

module.set = set;

return module;

}
