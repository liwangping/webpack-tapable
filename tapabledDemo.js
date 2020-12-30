/**
 *  tapabledDemo的演示
 */

const { SyncHook, AsyncParallelHook } = require('tapable');

/**
 * 所有钩子的构造器都会接受一个参数名数组
 * 下面相当于创建了一个同步钩子，它的构造器参数名分别为"arg1", "arg2", "arg3"。
 */
const hook = new SyncHook(["arg1", "arg2", "arg3"]);

/**
 * 我们创建一个汽车
 */
class Car {
    constructor() {
        this.hooks = {
            accelerate: new SyncHook(['newSpeed']),
            break: new SyncHook(),
            calculateRoutes: new AsyncParallelHook(["source", "target", "routeList"])
        }
    }
}

/**
 * 接下来我们创建一个插件来调用这些hooks
 */
const myCar= new Car();

/**
 * 实例化Car类后的myCar对象，监听myCar上的break钩子，在它触发的时候给它绑定一个
 * 名为WarningLamPlugin的事件。起名是必需的，可以用来辨别这个插件
 * 事件的执行代码是() => console.log('my car is break')
 * break这个hook并不用传参，定义时并没有定义。break: new SyncHook(),
 */
myCar.hooks.break.tap("WarningLamPlugin", () => console.log('my car is break'));

/**
 * 与上面不同的地方是传的参有一个 newSpeed,与hook中定义的一致
 * new SyncHook(['newSpeed'])
 */
myCar.hooks.accelerate.tap("LoggerPlugin", newSpeed => console.log(`Accelerating to ${newSpeed}`))

/**
 * 异步钩子，跟同步钩子不同，它们返回一个promise
 */
myCar.hooks.calculateRoutes.tapPromise('calcTotal', (source, target, routeList) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`tapPromise to ${source} ${target} ${routeList}`)
            resolve();
        }, 1000)
    })
})


/**
 * 调用myCar对象上的break钩子时，注册在这个钩子上的"WarningLamPlugin"事件会被触发。
 * 执行输出my car is break
 */
myCar.hooks.break.call();
/**
 * 与上同理
 */
myCar.hooks.accelerate.call(1000)
/**
 * 异步hook
 */
myCar.hooks.calculateRoutes.promise(1000, 30, "到了");
