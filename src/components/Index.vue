<template>
  <div class="todolist-box">
    <div class="todo-list-top-input-box">
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
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
        v-for="(item, index) in todoList"
        :key="index"
        :class="{'edit-todo-box': editingTodo === item.label}"
      >
        <div 
          class="checked-item-box"
        >
          <div class="checked-left-box">
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
              @dblclick="handledb(item.label)"
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
          v-edit-focus="editingTodo === item.label"
          v-model="itemInputValue"
          class="item-input-value"
          @keyup.enter="handleItemInputValue(index, itemInputValue)"
          @keyup.esc="cancelEdit(index, itemInputValue)"
        />
      </div>
    </div>
    <div class="operate-btn">
      <el-button link @click="handleAll">未选{{ doneCount }}条</el-button>
      <el-button link @click="handleAll">全部</el-button>
      <el-button link @click="handleChecked">选中</el-button>
      <el-button link @click="handleNotChecked">未选中</el-button>
      <el-button link @click="handleClearChecked">清除选中</el-button>
    </div>
  </div>
</template>

<script>
// todolist
import {
 defineComponent, ref, watch
} from 'vue'
import { ArrowDownBold, Check, CloseBold } from '@element-plus/icons-vue'

export default defineComponent({
 name: 'Index',
 directives: {
  editFocus: (el, binding) => {
    binding.value && el.focus()
  }
 }
})
</script>

<script setup>
const inputValue = ref('')
const checkAll = ref(false)
const isIndeterminate = ref(false)
const allList = ref([])
const todoList = ref([
  {
    label: '123',
    isChecked: true
  },
  {
    label: 'todoList',
    isChecked: false
  },
])
todoList.value.reverse()
console.log('todoList.value', todoList.value)

// 把数据存储到localStorage中
window.localStorage.setItem('todoList', JSON.stringify(todoList.value))

allList.value = JSON.parse(window.localStorage.getItem('todoList'))



// 已选中的条数
const doneCount = ref()
const getDoneCount = () => {
  console.log('allList.value.filter((item) => !item.isChecked).length', todoList.value.filter((item) => !item.isChecked).length)
  return todoList.value.filter((item) => !item.isChecked).length
}
doneCount.value = getDoneCount()

watch(
  () => todoList.value,
  () => {
    doneCount.value = getDoneCount()
    console.log('监听事件', todoList.value, doneCount.value)
  },
  {
    deep: true
  }
)



// 编辑输入框的值
const itemInputValue = ref('')

// 全选事件
const handleCheckAllChange = (val) => {
  // isIndeterminate.value = false
  todoList.value.map((item) => {
    item.isChecked = val
  })
}

// 回车事件
const handleInput = (value) => {
  console.log('回车事件', value)
  
  // 注意要去除两端空格
  const inputVal = value && value.trim()
  console.log('---111', inputVal)

  if(!inputVal.length) return
  todoList.value.unshift({
    label: inputValue.value,
    isChecked: false
  })
  window.localStorage.setItem('todoList', JSON.stringify(todoList.value))
  inputValue.value = ''
}



// 手动选中事件
const handleCheckItem = (item, index) => {
  console.log('选中事件', item, index)
  item.isChecked = !item.isChecked
}

// 正在编辑的那条数据
const editingTodo = ref('')

// 列表双击事件
const handledb = (label) => {
  console.log('列表双击事件', label)
  editingTodo.value = label
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
  
  itemInputValue.value = ''
}

// 删除事件
const handleDelete = (item, index) => {
  console.log('删除事件', item, index)
  todoList.value.splice(index, 1)
}

// 全部
const handleAll = () =>  {
  console.log('全部', todoList.value)

  // allList.value = JSON.parse(window.localStorage.getItem('todoList'))
  todoList.value = allList.value
}


// 选中
const handleChecked = () =>  {
  
  todoList.value = allList.value.filter((item) => item.isChecked)
  console.log('选中', todoList.value)

}

// 未选中
const handleNotChecked = () =>  {
  todoList.value = allList.value.filter((item) => !item.isChecked)
  console.log('未选中', todoList.value)

}


// 清除选中
const handleClearChecked = () =>  {
  todoList.value = allList.value.filter((item) => !item.isChecked)
  console.log('清除选中', todoList.value)
}




</script>

<style scoped lang="scss">
.todolist-box {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 350px;
  height: 300px;
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
}
</style>
