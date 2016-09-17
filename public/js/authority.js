var _OP_ADD_PROCESS = "add_pro"; // level 1 operation 添加PROCESS

var _OP_DEFINE_WORKFLOW = "def_wf"; // level 2 operation 定义WORKFLOW
var _OP_EDIT_MEMBER = "edit_mem"; // level 2 operation 修改MEMBER
var _OP_EDIT_TASK_SETTING = "edit_task_setting"; // level 2 operation 修改TASK属性
var _OP_ANALYSIS = "analysis"; // level 2 operation 分析PEOCESS

var _OP_DRAG_TASK = "drag_task"; // level 3 operation 拖拽TASK
var _OP_ADD_TASK = "add_task"; // level 3 operation 添加TASK
var _OP_EDIT_TASK = "edit_task"; // level 3 operation 编辑TASK
var _OP_DELETE_TASK = "del_task"; // level 3 operation 删除TASK

/**
 * Check if user have authority to execute operation
 * @param ops operation name
 *  {operation : 操作名称,
 *   operation_lv : 操作级别
 *   process_id : 流程ID,
 *   task_id    : 任务ID}
 *  按照操作的级别进行检查
 *  0级：添加Process，任何人都可以执行
 *  1级：process级别操作，有process权限的可以执行
 *  2级：task级别操作，有task权限的可以执行
 * @author leo
 */
function checkAuth(ops) {

	var processes = JSON.parse(window.sessionStorage.getItem("processes"));

//  alert(JSON.stringify(ops));
	var operation_lv = ops.operation_lv;
	var operation = ops.operation; // 如果对每一级的操作各自分配权限的时候再使用
	var process_id = ops.process_id;
	var task_id = ops.task_id; // 现在还没被使用

	switch (operation_lv) {
		case 1:
			return true; // 目前，任何人都可以添加PROCESS
		case 2: // 目前，对TASK的操作权限没有单独设定。可以操作PROCESS的话就可以操作其下所有TASK
		case 3:
			for (var index in processes) {
				// 如果拥有该process的权限，则可以继续判断 
				if (processes[index].process_id == process_id) {
					// 如果对该process的权限不是Viewer则可以继续执行
					if (processes[index].process_authority.toUpperCase() != "VIEWER") {
						return true;
					}
				}
			};
			return false;
		default:
			return false;
	}
}