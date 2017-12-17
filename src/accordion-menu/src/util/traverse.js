/**
 * 遍历树
 * @argument tree 待遍历的树
 * @argument visitor 访问者
 *           visitor.enter 进入节点时回调函数
 *              @argument node 当前节点
 *              @argument stack 压栈后的当前栈，包含当前节点
 *           visitor.exit 退出节点时回调函数
 *              @argument node 当前节点
 *              @argument stack 出栈后的当前栈，不包含当前节点
 */
export default (tree, visitor) => {
    const res = [];
    const treeCopy = JSON.parse(JSON.stringify(tree));
    const enter = typeof visitor === 'function' ? visitor : visitor.enter;
    const exit = visitor.exit;
    const dfs = list => {
        if (list.length === 0) return;
        res.push(list[0]);
        if (typeof enter === 'function') {
            enter(list[0], res);
        }
        if (list[0].children) dfs(list[0].children);
        list.shift();
        const popNode = res.pop();
        if (typeof exit === 'function') {
            exit(popNode, res);
        }
        dfs(list);
    };
    dfs(treeCopy);
};

