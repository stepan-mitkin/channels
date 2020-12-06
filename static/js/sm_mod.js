// Created with Drakon Tech https://drakon.tech/

function sm_mod() {

var module = {};



function addChild(parent, child) {
    if (child.parent) {
        throw new Error(
            "Child machine already has parent"
        )
    } else {
        if (parent) {
            parent.kids.push(child)
            child.parent = parent
        }
    }
}

function addMethod(machine, name, method) {
    machine[name] = function (a, b, c) {
        if (machine.state) {
            return method(machine, a, b, c)
        }
    }
}

function createMachine(type, parent) {
    var machine;
    machine = {
        type: type,
        state: "created",
        kids: []
    }
    if (parent) {
        addChild(parent, machine)
    }
    return machine
}

function delayCallback(machine, context, name, msg) {
    var handler;
    if (context.cancelled) {
    } else {
        handler = machine[name]
        if (handler) {
            handler(msg)
        }
    }
}

function handleError(machine, exception) {
    console.log(machine)
    module.handleException(exception)
}

function handleException(exception) {
    console.error(exception)
}

function killMachine(machine) {
    var _6_col, _6_it, _6_length, kid;
    if (machine) {
        machine.state = undefined
        if (machine.kids) {
            _6_it = 0;
            _6_col = machine.kids;
            _6_length = _6_col.length;
            while (true) {
                if (_6_it < _6_length) {
                    kid = _6_col[_6_it];
                    killMachine(kid)
                    _6_it++;
                } else {
                    break;
                }
            }
        }
        if (machine.current) {
            killMachine(machine.current)
        }
    }
}

function remove(array, item) {
    var index;
    index = array.indexOf(item)
    if (index === -1) {
    } else {
        array.splice(index, 1)
    }
}

function removeChild(parent, child) {
    if (child.parent === parent) {
        child.parent = undefined
        remove(parent.kids, child)
        if (parent.current === child) {
            parent.current = undefined
        }
    } else {
        throw new Error(
            "removeChild: removing from wrong parent"
        )
    }
}

function sendMessage(machine, name, msg, timeout) {
    var action, callback, timerId;
    if (machine) {
        action = machine[name]
        if (action) {
            callback = function () {
                try {
                    action(msg)
                } catch (ex) {
                    module.handleException(ex)
                }
            }
            timeout = timeout || 0
            timerId = setTimeout(callback, timeout)
            return timerId
        }
    }
}

module.addChild = addChild;

module.addMethod = addMethod;

module.createMachine = createMachine;

module.handleError = handleError;

module.handleException = handleException;

module.killMachine = killMachine;

module.removeChild = removeChild;

module.sendMessage = sendMessage;

return module;

}
