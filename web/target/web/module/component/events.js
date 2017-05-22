define(function() {

    // Events
    // -----------------
    // Thanks to:
    //  - https://github.com/documentcloud/backbone/blob/master/backbone.js
    //  - https://github.com/joyent/node/blob/master/lib/events.js


    // Regular expression used to split event strings
    var eventSplitter = /\s+/;


    // A module that can be mixed in to *any object* in order to provide it
    // with custom events. You may bind with `on` or remove with `off` callback
    // functions to an event; `trigger`-ing an event fires all callbacks in
    // succession.
    //
    //     var object = new Events();
    //     object.on('expand', function(){ alert('expanded'); });
    //     object.trigger('expand');
    //
    // ����ʹ�÷��������ģ����Ի����κζ���֮�У�ʵ�ֶ��Զ����¼����ʴ�~
    function Events() {
    }


    // Bind one or more space separated events, `events`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    // ���ո�ָ���¼��󶨸������¼���Ϊall�Ļ����¼��ص��������κ��¼�������ʱ������á�
    Events.prototype.on = function(events, callback, context) {
        var cache, event, list;
        // �ص����������ڣ�ֱ�ӷ���
        if (!callback) return this;

        // �������`__events`���Ի��棬`__events`���Բ��������ʼ��Ϊ�ն���
        cache = this.__events || (this.__events = {});
        // �������е��¼��ַ������зָ�õ��¼�������
        events = events.split(eventSplitter);

        // ѭ������`events`�е��¼�
        while (event = events.shift()) {
            // ��ѯcache���Ƿ񻺴����¼�������У�ȡ������¼��Ļص��������е����ã����û�У���ʼ��Ϊ������
            list = cache[event] || (cache[event] = []);
            // ���ص��������Ĵ���ص���������
            list.push(callback, context)
        }

        return this
    };

    // ��ִֻ��һ�ξ����ٵ��¼��ص�
    Events.prototype.once = function(events, callback, context) {
        var that = this;
        // �Դ����`callback`����һ�η�װ��`cb`�ڵ���`off`����������һ�ξͽ��
        var cb = function() {
            that.off(events, cb);
            callback.apply(context || that, arguments)
        };
        // ����װ���`cb`���а�
        return this.on(events, cb, context)
    };

    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    // �Ƴ�һ�������ص������`context`Ϊ�գ��Ƴ�����ͬ���Ļص���
    //���`callback`Ϊ�գ��Ƴ����¼������лص���
    //���`events`Ϊ�գ��Ƴ�����ʱ���ϰ󶨵����лص�������
    Events.prototype.off = function(events, callback, context){
        var cache, event, list, i;

        // No events, or removing *all* events.
        // ���û���κ��Ѱ��¼���ֱ�ӷ���
        if (!(cache = this.__events)) return this;
        // �������������û������ɾ�������ϵ�`__events`���ԣ������ض���
        if (!(events || callback || context)) {
            delete this.__events;
            return this
        }

        // �Դ����`events`���зָ�����û�д���`events`��ȡ�û����е������¼�
        events = events ? events.split(eventSplitter) : keys(cache);

        // Loop through the callback list, splicing where appropriate.
        // ѭ������events
        while (event = events.shift()) {
            // �����¼��ص�����
            list = cache[event];
            // �����Ϊ�գ�����
            if (!list) continue;

            // ���`callback`��`context`��û������ɾ�����¼�����
            if (!(callback || context)) {
                delete cache[event];
                continue
            }

            // �����ص����У�ע��ÿ���ص���������������Ǽ�����еģ�����Ϊ2
            // �ʹ����`callback`�Լ�`context`�Ƚϣ������ϵ��򽫻ص��͵��������Ĵ��������Ƴ�

            for (i = list.length - 2; i >= 0; i -= 2) {
                if (!(callback && list[i] !== callback ||

                    context && list[i + 1] !== context)) {
                    list.splice(i, 2)
                }
            }
        }

        return this
    };


    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    Events.prototype.trigger = function(events) {
        var cache, event, all, list, i, len, rest = [], args, returned = true;
        // ���û�а󶨹��κ��¼���ֱ�ӷ���
        if (!(cache = this.__events)) return this;

        // �ָ�
        events = events.split(eventSplitter);

        // Fill up `rest` with the callback arguments.  Since we're only copying
        // the tail of `arguments`, a loop is much faster than Array#slice.
        // ������һ������`events`������в������汣��Ϊ�������`rest`
        for (i = 1, len = arguments.length; i < len; i++) {
            rest[i - 1] = arguments[i]
        }

        // For each event, walk through the list of callbacks twice, first to
        // trigger the event, then to trigger any `"all"` callbacks.
        // ����ÿ���¼����������λص����У���һ���Ǵ����Ǹ��¼����ڶ����Ǵ����κ�`all`�¼��Ļص�
        while (event = events.shift()) {
            // Copy callback lists to prevent modification.
            // ��������д���all�¼�������ص����зָ����all
            if(cache.all) {
                if (all = cache.all) all = all.slice()
            }
            // ����������е�ǰ���������¼�������ص����зָ����list
            if (list = cache[event]) list = list.slice();

            // Execute event callbacks except one named "all"
            // �����������¼�������allʱ�������¼������лص�����this��Ϊ����������
            if (event !== 'all') {
                returned = triggerEvents(list, rest, this) && returned
            }

            // Execute "all" callbacks.
            // ������Ӧall�¼������лص�
            returned = triggerEvents(all, [event].concat(rest), this) && returned
        }

        // ����ֵ
        return returned
    };

    // trigger == emit
    Events.prototype.emit = Events.prototype.trigger;

    // Mix `Events` to object instance or Class function.
    Events.mixTo = function(receiver) {
        receiver = isFunction(receiver) ? receiver.prototype : receiver;
        var proto = Events.prototype;

        for (var p in proto) {
            if (proto.hasOwnProperty(p)) {
                receiver[p] = proto[p]
            }
        }
    };


    // Helpers
    // -------
    // �����`Object.keys`����������

    var keys = Object.keys;




    if (!keys) {
        // ����һ�����󣬷��ظö���������������
        keys = function(o) {
            var result = [];

            for (var name in o) {
                if (o.hasOwnProperty(name)) {
                    result.push(name)
                }
            }
            return result
        }
    }

    // Execute callbacks
    /**
     * ִ�лص��ķ���
     * @param {Array} list �ص���������
     * @param {Array} args ��������
     * @param {Object} context ����������
     * @return {Boolean} pass
     */
    function triggerEvents(list, args, context) {
        var pass = true;

        if (list) {
            var i = 0, l = list.length, a1 = args[0], a2 = args[1], a3 = args[2];
            // call is faster than apply, optimize less than 3 argu
            // http://blog.csdn.net/zhengyinhui100/article/details/7837127
            // ����`call`����Ҫ��`apply`�죬�����Բ����������ڵ���3������������Ż�������`call`��������������3��ʱ����`apply`
            switch (args.length) {
                case 0: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context) !== false && pass} break;
                case 1: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context, a1) !== false && pass} break;
                case 2: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context, a1, a2) !== false && pass} break;
                case 3: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context, a1, a2, a3) !== false && pass} break;
                default: for (; i < l; i += 2) {pass = list[i].apply(list[i + 1] || context, args) !== false && pass} break;
            }
        }
        // trigger will return false if one of the callbacks return false
        // ��һ���ص������ķ���ֵΪfalse��passֵΪfalse
        return pass;
    }

    // �ж��Ƿ�ΪFunction���͵Ĺ��ߺ���
    function isFunction(func) {
        return Object.prototype.toString.call(func) === '[object Function]'
    }

    return Events
});