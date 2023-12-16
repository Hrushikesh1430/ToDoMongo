"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Styles from "./page.module.css";

type Todo = {
  _id: string;
  text: string | null;
  completed: boolean;
};

export default function Home() {
  const [userText, setUserText] = useState("");
  const [todo, setToDo] = useState<Todo[]>([]);

  const inputHandler = (text: string) => {
    if (text === "") {
      return;
    }
    setUserText(text);
  };

  const createTodo = async () => {
    if (userText === "") {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/todo", {
        method: "POST",
        body: JSON.stringify({ text: userText }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("data inserted", data);
      setToDo((toDo) => [...toDo, data]);
      setUserText("");
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setToDo(data);
    } catch (error) {
      console.log(error);
    }
  };
  const updateToDo = async (id: string, completed: boolean) => {
    try {
      const response = await fetch("http://localhost:3000/api/todo", {
        method: "PUT",
        body: JSON.stringify({ id, completed }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Todo updated", data);
      setToDo((todos) => todos.map((item) => (item._id === id ? { ...item, completed } : item)));
    } catch (error) {
      console.log("error in updating", error);
    }
  };
  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/todo", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("data deleted", data);
      setToDo((todos) => todos.filter((item) => item._id !== id));
    } catch {}
  };

  useEffect(() => {
    fetchData("http://localhost:3000/api/todo");
  }, []);
  return (
    <>
      <div className={Styles.container}>
        <div className={Styles.childContainer}>
          <Image fill src="/bg-desktop-dark.jpg" alt="me" className={Styles.bgDesktop} />

          <div className={Styles.main}>
            <h2 className={Styles.heading}>TODO</h2>

            <div className={Styles.toDoContainer}>
              <span className={Styles.icon} onClick={() => createTodo()}>
                +
              </span>
              <input
                className={Styles.toDoInput}
                type="text"
                value={userText}
                onChange={(e) => inputHandler(e.target.value)}
                placeholder="Create a new task"
                required
              ></input>
            </div>
            <div className={Styles.toDoList}>
              <ul>
                {todo.map((item) => (
                  <li key={item._id} className={Styles.todoItem}>
                    <div>
                      <input
                        type="checkbox"
                        className={Styles.todoCheck}
                        onChange={(e) => updateToDo(item._id, e.target.checked)}
                        checked={item.completed}
                      />
                      <span className={Styles.todoText}>{item.text}</span>
                    </div>
                    <span
                      className={Styles.cross}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTodo(item._id);
                      }}
                    >
                      X
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
