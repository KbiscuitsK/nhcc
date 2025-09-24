<template>
  <div class="users-page-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h3 class="page-title">用户列表</h3>
      <div class="title-divider"></div>
    </div>

    <!-- 新增/编辑用户弹窗 -->
    <div class="modal-backdrop" v-if="dialogVisible">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ dialogTitle }}</h3>
          <button class="close-btn" @click="handleClose">×</button>
        </div>
        <div class="modal-body">
          <form class="form" @submit.prevent="dialogOk">
            <div class="form-group">
              <label class="form-label">账号:</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="user.account" 
                :disabled="dialogTitle === '编辑用户'"
                required
                minlength="2"
                maxlength="20"
                placeholder="请输入账号（2-20字符）"
              >
            </div>
            <div class="form-group">
              <label class="form-label">密码:</label>
              <input 
                type="password" 
                class="form-control" 
                v-model="user.password" 
                required
                minlength="6"
                maxlength="30"
                placeholder="请输入密码（6-30字符）"
              >
            </div>
            <div class="form-group">
              <label class="form-label">密码:</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="user.name" 
                required
                placeholder="请输入密码"
              >
            </div>
            <div class="form-group">
              <label class="form-label">性别:</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" v-model="user.sex" value="男" required> 男
                </label>
                <label class="radio-item">
                  <input type="radio" v-model="user.sex" value="女" required> 女
                </label>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">生日:</label>
              <input 
                type="date" 
                class="form-control" 
                v-model="user.birthday" 
                required
                :max="new Date().toISOString().split('T')[0]"
              >
            </div>
            <div class="form-group">
              <label class="form-label">工资:</label>
              <input 
                type="number" 
                class="form-control" 
                v-model.number="user.salary" 
                required
                min="0"
                placeholder="请输入工资"
              >
            </div>
            <div class="form-group">
              <label class="form-label">爱好:</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input type="checkbox" v-model="user.hobbies" value="足球"> 足球
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="user.hobbies" value="篮球"> 篮球
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="user.hobbies" value="排球"> 排球
                </label>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">类型:</label>
              <select 
                class="form-control" 
                v-model="user.type" 
                required
              >
                <option value="">请选择账号类型</option>
                <option value="0">管理员</option>
                <option value="1">医生</option>
                <option value="2">体检者</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="dialogVisible = false">取消</button>
          <button class="btn btn-primary" @click="dialogOk">确定</button>
        </div>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-card">
        <form class="search-form" @submit.prevent="handleSearch">
          <!-- 第一行搜索条件 -->
          <div class="search-row">
            <div class="search-item">
              <label class="search-label">账号:</label>
              <input 
                type="text" 
                class="search-input" 
                v-model="searchParams.account" 
                placeholder="请输入账号"
              >
            </div>
            <div class="search-item">
              <label class="search-label">密码:</label>
              <input 
                type="text" 
                class="search-input" 
                v-model="searchParams.name" 
                placeholder="请输入密码"
              >
            </div>
            <div class="search-item">
              <label class="search-label">性别:</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" v-model="searchParams.sex" value="男"> 男
                </label>
                <label class="radio-item">
                  <input type="radio" v-model="searchParams.sex" value="女"> 女
                </label>
                <label class="radio-item">
                  <input type="radio" v-model="searchParams.sex" value="全部" checked> 全部
                </label>
              </div>
            </div>
            <div class="search-item">
              <label class="search-label">爱好:</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input type="checkbox" v-model="searchParams.hobbies" value="足球"> 足球
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="searchParams.hobbies" value="篮球"> 篮球
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="searchParams.hobbies" value="排球"> 排球
                </label>
              </div>
            </div>
          </div>

          <!-- 第二行搜索条件 -->
          <div class="search-row">
            <div class="search-item">
              <label class="search-label">起始生日:</label>
              <input 
                type="date" 
                class="search-input" 
                v-model="searchParams.startBirthday"
              >
            </div>
            <div class="search-item">
              <label class="search-label">截止生日:</label>
              <input 
                type="date" 
                class="search-input" 
                v-model="searchParams.endBirthday"
              >
            </div>
            <div class="search-item">
              <label class="search-label">工资最小:</label>
              <input 
                type="number" 
                class="search-input" 
                v-model="searchParams.minSalary" 
                min="0"
                placeholder="≥ 输入金额"
              >
            </div>
            <div class="search-item">
              <label class="search-label">工资最大:</label>
              <input 
                type="number" 
                class="search-input" 
                v-model="searchParams.maxSalary" 
                min="0"
                placeholder="＜ 输入金额"
              >
            </div>
          </div>

          <!-- 第三行：搜索+重置按钮 -->
          <div class="search-row">
            <div class="search-item">
              <label class="search-label">类型:</label>
              <select class="search-input" v-model="searchParams.type">
                <option value="-1">全部</option>
                <option value="0">管理员</option>
                <option value="1">医生</option>
                <option value="2">体检者</option>
              </select>
            </div>
            <div class="search-actions">
              <button type="submit" class="btn btn-primary">查询</button>
              <button type="button" class="btn btn-default" @click="resetSearch">重置</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <!-- 加载状态 -->
      <div class="loading" v-if="tableLoading">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载用户数据...</div>
      </div>
      
      <!-- 用户表格 -->
      <table class="user-table" v-else>
        <thead>
          <tr>
            <th>账号</th>
            <th>密码</th>
            <th>性别</th>
            <th>生日</th>
            <th>薪资</th>
            <th>爱好</th>
            <th>类型</th>
            <th>
              <button class="btn btn-primary btn-sm" @click="handleAdd">
                + 添加
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index" :class="index % 2 === 0 ? 'even-row' : 'odd-row'">
            <td>{{ user.account }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.sex }}</td>
            <td>{{ user.birthday }}</td>
            <td>{{ formatSalary(user.salary) }}</td>
            <td>{{ user.hobbies?.join('、') || '无' }}</td>
            <td>
              <span class="user-type-tag" :class="'type-' + user.type">
                {{ formatUserType(user.type) }}
              </span>
            </td>
            <td class="action-buttons">
              <button class="btn btn-success btn-sm" @click="handleEdit(index, user)">编辑</button>
              <button class="btn btn-danger btn-sm" @click="handleDelete(index, user)">删除</button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="8" class="no-data">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页区域 -->
    <div class="pagination-container">
      <div class="pagination">
        <button 
          class="btn btn-default btn-sm" 
          @click="previousPage" 
          :disabled="pageNo <= 1"
        >
          上一页
        </button>
        <span class="page-info">
          {{ pageNo }} / {{ totalPages }}
        </span>
        <button 
          class="btn btn-default btn-sm" 
          @click="nextPage" 
          :disabled="pageNo >= totalPages"
        >
          下一页
        </button>
        <div class="page-size-selector">
          每页显示:
          <select v-model="pageSize" @change="handleSizeChange">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div class="total-count">
          共 {{ totalCount }} 条记录
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UsersView',
  mounted() {
    this.handleSearch();
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      users: [],
      user: {
        account: '',
        password: '',
        name: '',
        sex: '男',
        birthday: '',
        salary: 0,
        hobbies: [],
        type: ''
      },
      searchParams: {
        account: '',
        name: '',
        sex: '全部',
        startBirthday: '',
        endBirthday: '',
        minSalary: '',
        maxSalary: '',
        hobbies: [],
        type: '-1'
      },
      correctedSearchParams: {},
      dialogVisible: false,
      dialogTitle: "添加用户",
      tableLoading: false
    };
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
    }
  },
  methods: {
    // 格式化用户类型显示
    formatUserType(type) {
      switch (Number(type)) {
        case 0: return "管理员";
        case 1: return "医生";
        case 2: return "体检者";
        default: return "未知";
      }
    },
    
    // 格式化薪资显示
    formatSalary(salary) {
      return Number(salary).toFixed(2);
    },
    
    // 验证是否可转为数字
    isConvertibleToNumber(str) {
      if (!str) return false;
      const num = Number(str);
      return !isNaN(num) && str.trim() !== '';
    },
    
    // 搜索用户
    handleSearch() {
      this.tableLoading = true;
      const params = { ...this.searchParams };
      
      // 参数处理
      if (params.account?.trim() === "") params.account = null;
      if (params.name?.trim() === "") params.name = null;
      if (params.sex === "全部") params.sex = null;
      if (params.hobbies?.length === 0) params.hobbies = null;
      if (!this.isConvertibleToNumber(params.minSalary)) params.minSalary = null;
      if (!this.isConvertibleToNumber(params.maxSalary)) params.maxSalary = null;
      if (params.type === "-1") params.type = null;
      
      this.correctedSearchParams = {
        ...params,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      
      this.getUsers();
    },
    
    // 获取用户列表
    getUsers() {
      axios.get('/user/findusers', {
        params: this.correctedSearchParams
      }).then((response) => {
        if (response.status === 200 && response.data.code === 0) {
          this.users = response.data.data.users || [];
          this.totalCount = response.data.data.count || 0;
          
          // 处理页码边界
          if (this.pageNo > this.totalPages) {
            this.pageNo = this.totalPages;
            this.handleSearch();
          }
        }
      }).catch((error) => {
        console.error('获取用户列表失败:', error);
        alert('获取数据失败，请稍后重试');
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    
    // 重置搜索条件
    resetSearch() {
      this.searchParams = {
        account: '',
        name: '',
        sex: '全部',
        startBirthday: '',
        endBirthday: '',
        minSalary: '',
        maxSalary: '',
        hobbies: [],
        type: '-1'
      };
      this.pageNo = 1;
    },
    
    // 添加用户
    handleAdd() {
      this.user = {
        account: "",
        password: "",
        name: "",
        sex: '男',
        birthday: new Date().toISOString().split('T')[0],
        salary: 0,
        hobbies: [],
        type: "2"
      };
      this.dialogTitle = "添加用户";
      this.dialogVisible = true;
    },
    
    // 编辑用户
    handleEdit(index, user) {
      this.user = { ...user };
      this.dialogTitle = "编辑用户";
      this.dialogVisible = true;
    },
    
    // 确认弹窗操作
    dialogOk() {
      if (this.dialogTitle === "添加用户") {
        this.addUser();
      } else {
        this.updateUser();
      }
    },
    
    // 添加用户请求
    addUser() {
      this.tableLoading = true;
      axios.get('/user/adduser', {
        params: this.user
      }).then((response) => {
        if (response.status === 200) {
          if (response.data.code === 0) {
            alert(`成功添加用户 ${this.user.account}!`);
            this.dialogVisible = false;
            this.handleSearch();
          } else {
            alert(`添加用户 ${this.user.account} 失败: ${response.data.description || '未知错误'}`);
          }
        }
      }).catch((error) => {
        console.error('添加用户失败:', error);
        alert('添加用户失败，请稍后重试');
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    
    // 更新用户请求
    updateUser() {
      this.tableLoading = true;
      axios.get('/user/chguser', {
        params: this.user
      }).then((response) => {
        if (response.status === 200) {
          if (response.data.code === 0) {
            alert(`成功修改用户 ${this.user.account}!`);
            this.dialogVisible = false;
            this.handleSearch();
          } else {
            alert(`修改用户 ${this.user.account} 失败: ${response.data.description || '未知错误'}`);
          }
        }
      }).catch((error) => {
        console.error('修改用户失败:', error);
        alert('修改用户失败，请稍后重试');
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    
    // 关闭弹窗
    handleClose() {
      if (confirm('确认关闭？')) {
        this.dialogVisible = false;
      }
    },
    
    // 删除用户
    handleDelete(index, user) {
      if (confirm(`此操作将永久删除用户${user.account}, 是否继续?`)) {
        this.tableLoading = true;
        axios.get('/user/deluserbyid', {
          params: { id: user.id }
        }).then((response) => {
          if (response.status === 200 && response.data.code === 0) {
            alert(`成功删除${user.account}!`);
            this.handleSearch();
          } else {
            alert(`删除失败: ${response.data.description || '未知错误'}`);
          }
        }).catch((error) => {
          console.error('删除用户失败:', error);
          alert('删除用户失败，请稍后重试');
        }).finally(() => {
          this.tableLoading = false;
        });
      }
    },
    
    // 上一页
    previousPage() {
      if (this.pageNo > 1) {
        this.pageNo--;
        this.handleSearch();
      }
    },
    
    // 下一页
    nextPage() {
      if (this.pageNo < this.totalPages) {
        this.pageNo++;
        this.handleSearch();
      }
    },
    
    // 改变每页条数
    handleSizeChange() {
      this.pageNo = 1; // 重置到第一页
      this.handleSearch();
    }
  }
};
</script>

<style scoped>
/* 基础样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.users-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* 标题样式 */
.page-header {
  margin-bottom: 20px;
}

.page-title {
  color: #333;
  font-size: 20px;
  margin-bottom: 10px;
}

.title-divider {
  height: 2px;
  background-color: #e5e7eb;
}

/* 按钮样式 */
.btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
}

.btn-default {
  background-color: #fff;
  color: #333;
  border-color: #ddd;
}

.btn-default:hover {
  background-color: #e9ecef;
}

.btn-success {
  background-color: #28a745;
  color: white;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #bb2d3b;
}

.btn-sm {
  padding: 3px 6px;
  font-size: 12px;
}

/* 表单样式 */
.form {
  width: 100%;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.form-label {
  width: 100px;
  text-align: right;
  margin-right: 10px;
  font-weight: bold;
  font-size: 14px;
}

.form-control {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

/* 单选框和复选框样式 */
.radio-group, .checkbox-group {
  display: flex;
  gap: 15px;
  flex: 1;
}

.radio-item, .checkbox-item {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

/* 弹窗样式 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  width: 500px;
  border-radius: 6px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 15px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 15px;
}

.modal-footer {
  padding: 10px 15px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 搜索区域样式 */
.search-container {
  margin-bottom: 20px;
}

.search-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-form {
  width: 100%;
}

.search-row {
  display: flex;
  margin-bottom: 15px;
  gap: 15px;
  align-items: center;
}

.search-item {
  display: flex;
  align-items: center;
  flex: 1;
}

.search-label {
  width: 80px;
  text-align: right;
  margin-right: 10px;
  font-size: 14px;
}

.search-input {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-actions {
  display: flex;
  gap: 10px;
  margin-left: 90px;
}

/* 表格样式 */
.table-container {
  margin-bottom: 20px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e5e7eb;
}

.user-table th, .user-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
}

.user-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.user-table th:last-child, .user-table td:last-child {
  border-right: none;
}

.even-row {
  background-color: #f8f9fa;
}

.odd-row {
  background-color: white;
}

.user-type-tag {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.type-0 {
  background-color: #0d6efd;
}

.type-1 {
  background-color: #28a745;
}

.type-2 {
  background-color: #ffc107;
}

.action-buttons {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.no-data {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

/* 分页样式 */
.pagination-container {
  margin-top: 10px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}

.page-info {
  font-size: 14px;
}

.page-size-selector {
  font-size: 14px;
}

.page-size-selector select {
  margin-left: 5px;
  padding: 2px 5px;
}

.total-count {
  color: #666;
  font-size: 14px;
}

/* 加载状态样式 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0d6efd;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.loading-text {
  color: #666;
  font-size: 14px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
