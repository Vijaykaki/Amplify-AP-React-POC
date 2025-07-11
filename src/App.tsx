import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

function App() {
  const {user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [userOptions] = useState<Array<Schema["UserOptions"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }
  
  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li onClick={() => deleteTodo(todo.id)} key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <br />
      <h2>User Options</h2>
      <button onClick={() => client.models.UserOptions.create({ DisplayFirstNameOnly: true, DisplayLastNameOnly: false })}>
        Set User Options
      </button>
      <ul>
        {userOptions.map((option) => (
          <li key={option.id}>
            DisplayFirstNameOnly: {option.DisplayFirstNameOnly ? "Yes" : "No"}, 
            DisplayLastNameOnly: {option.DisplayLastNameOnly ? "Yes" : "No"}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
       <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
