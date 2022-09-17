function emptyAction() {
    //警告:提示当前使用的是空Action
    console.warn('未注入Actions实例!')
}
class Actions {
    //默认值为空Action
    actions = {
        onGlobalStateChange: emptyAction,
        setGlobalState: emptyAction,
        getGlobalState: emptyAction,
    };
    /**本 章
    往入Actions实例
    */
    setActions(actions) {
        this.actions = actions
    };
    /*
    映射观察者函数
    */
    onGlobalStateChange(...args) {
        return this.actions.onGlobalStateChange(...args)
    };
    /*家
    映射修改实例
    */
    setGlobalState(...args) {
        return this.actions.setGlobalState(...args)
    };
    /**
    映射获取实例*/
    getGlobalState(...args) {
        return this.actions.getGlobalState(...args)
    };
}
const actions = new Actions()
export default actions