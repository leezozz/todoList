<template>
  <div class="todolist-box">
    <div class="todo-list-top-input-box">
      <el-checkbox
        v-model="checkAll"
        @change="handleCheckAllChange"
      >
        <el-icon><ArrowDownBold /></el-icon>
      </el-checkbox>
      <el-input 
        v-model="inputValue"
        class="todo-list-input"
        @keyup.enter="handleInput(inputValue)"
      />
    </div>
    <!-- todoList列表循环 -->
    <div class="all-todo-list">
      <div 
        class="todo-list-container"
        v-for="(item, index) in filterList"
        :key="item"
        :class="{'edit-todo-box': editingTodo === item}"
      >
      <!-- editingTodo === item.label是不可取的。 item.label是变化的，editingTodo只有触发才会更新-->
        <div 
          class="checked-item-box"
        >
          <div class="checked-left-box" @dblclick.stop="handledb(item)">
            <div 
              class="checked-icon"
              @click="handleCheckItem(item, index)"
            >
              <el-icon 
                :size="14"
                :class="{'is-checked': !item.isChecked}"
              >
                <Check />
              </el-icon>
            </div>
            <span 
              class="doto-text-item"
              :class="{'is-show-delete-line': item.isChecked}"
            >
              {{ item.label }}
            </span>
          </div>
          <el-icon
            class="close-icon"
            @click="handleDelete(item, index)"
          >
            <CloseBold />
          </el-icon>
        </div>
        <!-- 双击显示input编辑框 -->
        <!-- esc退出编辑 -->
        <!-- 回车触发编辑事件（如果编辑后的值为空，则删除该条数据） -->
        <input 
          v-edit-focus="editingTodo === item"
          v-model="item.label"
          class="item-input-value"
          @keyup.enter="handleItemInputValue(index, item.label)"
          @@blur="handleItemInputValue(index, item.label)"
          @keyup.esc="cancelEdit(index, item.label)"
        />
      </div>
    </div>
    <div class="operate-btn">
      <!-- <el-button link @click="handleAll">未选{{ doneCount }}条</el-button>
      <el-button link @click="handleAll">全部</el-button>
      <el-button link @click="handleChecked">选中</el-button>
      <el-button link @click="handleNotChecked">未选中</el-button>
      <el-button link @click="handleClearChecked">清除选中</el-button> -->
      <a href="#/all">未选{{ doneCount }}条</a>
      <a href="#/all">全部</a>
      <a href="#/active">未选中</a>
      <a href="#/completed">选中</a>
      <button type="text" @click="handleClear">清除选中</button>

    </div>
  </div>
</template>

<script lange="js">
// todolist
// 功能：
// 添加待办事项
// 删除待办事项
// 编辑待办事项
// 切换待办事项
// 存储待办事项
import { ArrowDownBold, Check, CloseBold, List } from '@element-plus/icons-vue'
import useLocalStorage from '../utils/useLocalStorage'
import {
  computed,
  onMounted, 
  onUnmounted, 
  ref,
  watch,
  watchEffect
} from 'vue'

export default {
 name: 'Index',
 components: {
  ArrowDownBold,
  Check,
  CloseBold,
  List
 },
 setup() {
  const storage = useLocalStorage()
  console.log('storage', storage)

  const inputValue = ref('')
  const checkAll = ref(false)

  // 存储事件
  const useStroage = () => {
    const KEY = 'TODOKEYS'
    const todoList = ref(storage.getItem(KEY) || [])
    console.log('todoList111', todoList.value)
    watchEffect(
      () => {
        storage.setItem(KEY, todoList.value)
        console.log('todoList222', todoList.value)
      }
    )

    return todoList
  }

  const todoList = useStroage()

  // const todoList = ref([
  //   {
  //     label: '123',
  //     isChecked: true
  //   },
  //   {
  //     label: 'todoList',
  //     isChecked: false
  //   },
  // ])
  // todoList.value.reverse()
  // console.log('todoList.value', todoList.value)

  // 全选事件
  const handleCheckAllChange = (val) => {
    todoList.value.map((item) => {
      item.isChecked = val
    })
  }

  // 回车事件
  const handleInput = (value) => {
    console.log('回车事件', value)
    
    // 注意要去除两端空格
    const inputVal = value && value.trim()

    if(!inputVal.length) return
    todoList.value.unshift({
      label: inputValue.value,
      isChecked: false
    })
    inputValue.value = ''
  }

  // 手动选中事件
  const handleCheckItem = (item, index) => {
    console.log('选中事件', item, index)
    item.isChecked = !item.isChecked
  }

  // 正在编辑的那条数据
  const editingTodo = ref(null)

  // 列表双击事件
  const handledb = (val) => {
    console.log('列表双击事件', val)
    editingTodo.value = val
  }

  // 取消编辑
  const cancelEdit = (index, value) => {
    console.log('取消编辑', index, value)
    editingTodo.value = ''
  }

  // 每个input回车事件
  const handleItemInputValue = (index, value) => {
    console.log('每个input回车事件', index, value)
    editingTodo.value = ''

    if(!value) {
      todoList.value.splice(index, 1)
      return
    }

    todoList.value.splice(index, 1, {
      label: value.trim(),
      isChecked: false
    })
    console.log('每个input回车事件---', todoList.value)
  }

  // 删除事件
  const handleDelete = (item, index) => {
    console.log('删除事件', item, index)
    todoList.value.splice(index, 1)
  }

  // 切换待办项完成状态
  const useFilter = (todos) => {
    console.log('呀呀呀', todos.value)
    const filter = {
      all: list => list,
      active: list => list.filter((todo) => !todo.isChecked),
      completed: list => list.filter((todo) => todo.isChecked)
    }

    const type = ref('all')
    const hashVal = ref('')


    const filterList = computed(()=> filter[type.value](todos.value))
    console.log('filterList---', filterList.value)

    // if(!todos.length) return 

    // 已选中的条数
    const doneCount = computed(()=> filter.active(todos.value).length)

    const hashChange = () => {
      console.log('hashchange事件', todos.value)
      hashVal.value = window.location.hash.replace('#/', '')
      console.log('hashVal', hashVal.value)

      if(filter[hashVal.value]) {
        type.value = hashVal.value
      } else {
        type.value = 'all'
        window.location.hash = ''
      }
    }

    onMounted(() => {
      window.addEventListener("hashchange", hashChange)
      hashChange()
    }) 

    onUnmounted(() => {
      window.removeEventListener('hashchange', hashChange)
    }) 

    return {
      doneCount,
      filterList
    }
  }

  // 清除选中事件
  const removeEvent = (todos) => {
    
    const handleClear = () => {
      todos.value = todos.value.filter(item => !item.isChecked)
    }

    return {
      handleClear
    }
  }

  const { handleClear } = removeEvent(todoList)


  return {
    inputValue,
    checkAll,
    todoList,
    handleCheckAllChange,
    handleInput,
    handleCheckItem,
    editingTodo,
    handledb,
    cancelEdit,
    handleItemInputValue,
    handleDelete,
    ...useFilter(todoList),
    handleClear,
  }
 },
 // 自定义属性
 directives: {
  editFocus: (el, binding) => {
    binding.value && el.focus()
  }
 },
}
</script>


<style scoped lang="scss">
.todolist-box {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 350px;
  // height: 300px;
  max-height: 300px;
  overflow: hidden;
  .todo-list-top-input-box {
    border-bottom: 1px solid #DEE2EA;
    :deep() {
      .el-checkbox {
        margin-right: 8px;
        .el-checkbox__input {
          display: none;
        }
      }
    }
    .todo-list-input {
      width: 300px;
      :deep() {
        .el-input__wrapper {
          background-color: #f3f4f4;
          box-shadow: none
        }
      }
    }
  }
  .all-todo-list {
    overflow-y: scroll;
    flex: 1;
    overflow: auto;
    .todo-list-container {
      height: 36px;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #DEE2EA;
      cursor: pointer;
      .checked-item-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      .checked-left-box {
        width: 100%;
        display: flex;
        align-items: center;
        .checked-icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 1px solid #000;
          border-radius: 50%;
          margin-right: 8px;
          cursor: pointer;
          .is-checked {
            display: none;
          }
        }
        .doto-text-item {
    
        }
        .is-show-delete-line {
          text-decoration:line-through;
        }
      }
      }
      .close-icon {
        display: none;
      }
      &:hover {
        .close-icon {
          display: inline-block;
        }

      }
      .item-input-value {
        display: none;
      }
    }
    .edit-todo-box {
      .checked-item-box {
        display: none;
      }
      .item-input-value {
        display: inline-block;
        width: calc(100% - 16px);
        height: 24px;
        background-color: #f3f4f4;
        border: none;
        &:focus-visible {
          outline: none;
          border: 1px solid #dee2ea;
        }
      }
    }
  }
  .operate-btn {
    display: flex;
    justify-content: flex-start;
    margin-top: 24px;
    a {
      text-decoration: none!important;;
      color: #000;
      margin-right: 6px;
      &:nth-child(2) {
        margin-left: 36px;
      }
    }
    button {
      margin-left: 40px;
      border: none;
      background-color: transparent;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
</style>
