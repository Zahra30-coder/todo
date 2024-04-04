import React, { useEffect, useState } from 'react';
import './App.css';
// import { todos } from './tasks/tasks';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { globalUrl } from './environment/environment.js';
import axios from 'axios';

export default function App() {
  let [mytasks, setTasks] = useState([]);
  let [userInput, setUserInput] = useState('');
  let [activeid, setActiveid] = useState('');
  let [mode, setMode] = useState('insert');

  // handle taskchange
  const handleChange = async (event) => {
    setUserInput(event.target.value);
  }
  // handle add task
  const handleAddTask = async () => {
    // setTasks([...mytasks, { id: mytasks.length + 1, task: userInput, completed: false }]);
    // setUserInput('');
    // setTodo([...todo, { id: todo.length + 1, task: userInput, completed: false }]);
    // setUserInput('');
    try {
      let response = await axios.post(globalUrl.todoUrl, {
        task: userInput,
        completed: false
      })
      setTasks([...mytasks, response.data])
      setUserInput('')
    } catch (error) {
      console.log(error)
    }

  }



  // handling the activeid
  const handleActive = (id) => {
    setActiveid(id);
  }
  // handle toggler
  const handleToggle = async (id) => {
    // let updatedTask = mytasks.map((elem) => {
    //   if (elem.id == id) {
    //     return { ...elem, completed: !elem.completed }
    //   }
    //   return elem
    // })
    // setTasks([...updatedTask])
    try {
      let url = `${globalUrl.todoUrl}/${id}`;
      let taskToAdd = mytasks.find((elem)=>elem.id == id);
      if(!taskToAdd){
        return;
      }
      console.log(taskToAdd)
      let updatedTasks = {...taskToAdd, completed:!taskToAdd.completed}
      await axios.patch(url, updatedTasks);
      setTasks((prevTasks)=>
      prevTasks.map((elem)=>elem.id==id? updatedTasks : elem)
      )
    } catch (error) {
      console.log(error)
    }
  }

  // // handle Delete

  const handleDelete = async (id) => {
    // let removedTask = mytasks.filter((elem) => elem.id != id);
    // setTasks([...removedTask]);
    try {
      let url = `${globalUrl.todoUrl}/${id}`;
      await axios.delete(url);
      let remainingTasks = mytasks.filter((elem) => elem.id != id);
      setTasks([...remainingTasks])
    } catch (error) {
      console.log(error)
    }
  }


  // handle Edit
  const handleEdit = async () => {
    // let updatedTask = mytasks.map((elem) => {
    //   if (elem.id == activeid) {
    //     return { ...elem, task: userInput }
    //   }
    //   return elem
    // })
    // setTasks([...updatedTask]);
    // setMode('insert');
    try {
      let url = `${globalUrl.todoUrl}/${activeid}`;
      await axios.patch(url, {
        task:userInput,
        completed:false
      })
      setTasks((prevTasks)=>
      prevTasks.map((elem)=>elem.id == activeid ? {...elem, task: userInput, completed:false} : elem)
      )
    } catch (error) {
      console.log(error)
    }

  }

  // handle edit todo
  const handleEditTodo = (id) => {
    let tasksTodo = mytasks.find((elem) => elem.id == id);
    setUserInput(tasksTodo.task);
    setMode('edit');
  }

  // fetchtodo 

  async function fetchtodo() {
    try {
      const successResponse = await axios.get(globalUrl.todoUrl);
      setTasks(successResponse.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  useEffect(() => {
    fetchtodo()
  }, []);

  return (
    <div>
      <div className="container my-3 d-flex align-items-center flex-column bg-light app-height primary-box-shadow rounded-1 p-4">
        <h1 className='text-danger font-serif'>Todo List App</h1>
        <div className='d-flex flex-column w-50'>

          <h3 >Daily Tasks...</h3>

          <div className="inputTasks p-3 d-flex flex-column justify-content-center">
            <input type="text" className="form-control mb-3" value={userInput} onChange={handleChange} />

            <button className="btn btn-primary" onClick={mode == 'insert' ? handleAddTask : () => handleEdit()}
            >{mode == 'insert' ? "Add Todo" : "Update Todo"}</button>
          </div>
          {
            (mytasks && mytasks.length == 0) ?
              <div className="text-secondary text-center">
                <p>List is Empty</p>
              </div> :
              <ul className='list-group'>
                {
                  mytasks.map((elem, idx) => (
                    <li key={idx}
                      onClick={() => handleActive(elem.id)}
                      className={`list-group-item d-flex align-items-center justify-content-around ${elem.id == activeid ? "active" : ""}
                      `}
                      style={{ textDecoration: elem.completed ? 'line-through' : '' }}
                    >
                      <input type="checkbox" onChange={() => handleToggle(elem.id)} />
                       
                      Task: {elem.task}
                      <input className="btn btn-success" type='button' onClick={() => handleEditTodo(elem.id)} value='Edit Task' />

                      <input className="btn btn-danger" type='button' onClick={() => handleDelete(elem.id)} value='Delete Task' />
                    </li>
                  ))}

              </ul>
          }
        </div>
      </div>
    </div>
  )
}