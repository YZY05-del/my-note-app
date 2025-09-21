<template>
  <div class="container mx-auto my-10 px-4">
    <!-- uncomment the following code to use the status object  
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-md font-semibold text-gray-900">
  Status: {{ status.connected ? "Connected" : "Disconnected" }}
      </h1>
      <button
        @click="logout()"
        class="text-red-500 hover:text-red-700 font-semibold"
      >
        Logout
      </button>
    </div>
    -->
    <h1
      class="text-center text-3xl md:text-4xl font-semibold text-gray-900 mb-6"
    >
      To Do List
    </h1>
    <div class="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <form @submit.prevent="addTodo">
        <div class="flex items-center mb-4 space-x-3">
          <input
            v-model="newTodo"
            type="text"
            class="flex-1 px-4 py-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            id="todo-input"
            placeholder="Add new task"
            required
          />
          <button
            type="submit"
            :disabled="newTodo.length === 0"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-blue-300"
          >
            Add
          </button>
        </div>
      </form>
      <ul id="todo-list" class="divide-y divide-gray-200">
        <li
          v-for="(todo, index) in todos"
          :key="index"
          class="py-4 flex justify-between items-center border-b border-gray-200 p-4"
        >
          <div class="flex items-center">
            <input
              type="checkbox"
              class="mr-2 h-4 w-4 text-blue-500 rounded"
              @change="updateTodo(index)"
              :checked="todo.completed === 1"
            />
            <div
              :class="{ 'line-through': todo.completed }"
              class="text-lg text-gray-800"
            >
              {{ todo.description }}
            </div>
          </div>
          <button
            @click.prevent="removeTodo(index)"
            class="text-red-500 hover:text-red-700 font-semibold"
          >
            X
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { supabase } from '../lib/supabase'

// Define a type for the Todo item
interface Todo {
  id: number;
  task: string;
  is_completed: boolean;
}

const newTodo = ref<string>("");
const todos = ref<Todo[]>([]);

const addTodo = async () => {
  if (newTodo.value.trim() !== "") {
    // 尝试向数据库添加数据
    try {
      const { data, error } = await supabase
        .from('todos')  // 告诉数据库：我要往"todos"这个表里加东西
        .insert([
          { 
            task: newTodo.value,  // 任务内容
            is_complete:  false,                // 是否完成（0表示未完成）
            created_at: new Date().toISOString()  // ← 添加这一行
          }
        ])
        .select()  // 让数据库返回刚添加的数据

      if (error) {
        throw error  // 如果有错误就抛出
      }

      // 把新任务添加到页面显示中
      todos.value.push({
        id: data[0].id,          // 使用数据库给的ID
        task: newTodo.value,
        is_complete: false,
      });
      
      newTodo.value = "";  // 清空输入框
      
    } catch (error) {
      // 如果出错了，在控制台显示错误信息
      console.error('添加任务出错:', error)
      alert('添加失败，请查看控制台信息')
    }
  }
};
const updateTodo = async (index: number) => {
  todos.value[index].completed = todos.value[index].completed === 1 ? 0 : 1;
};

const removeTodo = (index: number) => {
  todos.value.splice(index, 1);
};
</script>
