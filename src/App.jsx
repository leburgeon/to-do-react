import { useState, useEffect } from "react"
import TasksDisplay from "./components/TasksDisplay"
import tasksService from "./services/tasks"
import TaskField from "./components/TaskField"
import tasks from "./services/tasks"



const App = () => {
  // State for storing the task data
  const [tasksData, setTasksData] = useState([])
  // State for controlling the new task input field
  const [newTaskInput, setNewTaskInput] = useState("")

  // Method for controlling the new task input
  const handleTaskInputChange = (event) => {
    setNewTaskInput(event.target.value)
  }

  // Effect for fetching the tasks data from the json server
  useEffect(() => {
    tasksService.getAll().then(data => setTasksData(data)).catch(err => setTasksData(null))
  }, [])

  // Method for adding a new task to the database
  const addTask = (event) => {
    event.preventDefault()
    const newTaskObj = {
      task: newTaskInput,
      done: false
    }
    tasksService.create(newTaskObj).then(addedTask => {
      setTasksData(tasksData.concat(addedTask))
    })
    setNewTaskInput("")
  }

  // Error alert callback for manipulating non-existant data from database
  const notFoundDataError = (err) => {
    alert("Looks like that task is no longer in the database!")
  }

  // Method for deleting a task from the database
  const deleteTask = (taskId) => {
    tasksService.deleteTask(taskId).catch(notFoundDataError)
    // Filters out the deleted task from the tasks state
    setTasksData(tasksData.filter(task => task.id !== taskId))
  }

  const toggleDone = (taskId) => {
    const taskToUpdate = tasksData.find(task => task.id === taskId)
    const updatedTaskObject = {...taskToUpdate, "done": !taskToUpdate.done}
    tasksService.updateTask(updatedTaskObject).then(updated => {
      setTasksData(tasksData.map(task => task.id !== taskId
        ? task
        : updated
      ))
    })
  }

  return (
    <>
    <h1>TODO:</h1>
      <TasksDisplay tasks={tasksData}
        deleteTask={deleteTask}
        toggleDone={toggleDone}/>
      <TaskField 
        addTask={addTask} 
        newTaskInput={newTaskInput} 
        handleTaskInputChange={handleTaskInputChange}
      />
    </>
      
  )
}

export default App
