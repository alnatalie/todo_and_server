import { MouseEventHandler, useState } from "react";
import useSWR from "swr";
import { ErrorInfo } from "../Error";
import {ToDo} from '@prisma/client'

const fetcher = async (url: string | URL): Promise <ToDo[]> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("fetch" + response.status);
  const data = await response.json();
  return data;
};
const 
  // URL = "http://localhost:3333/todo",
  URL = '/api/todoPrism',
  ADD_TODO = "add-todo",
  DELETE_ACTION = "delete",
  CHECKBOX_TOGGLE = "toggle-checkbox";

export function ToDoApp() {
  const [text, setText] = useState("");
  const { data, error, mutate } = useSWR(URL, fetcher);
  const onClick:MouseEventHandler = async event => {
    const target = event.target as HTMLElement;
    const action = (target.closest('[data-action]')as HTMLElement)?.dataset?.action;
    const id = (target.closest('[data-id]')as HTMLElement)?.dataset?.id;
    console.log('onClick', {action, id});
    switch(action){
      case DELETE_ACTION:
        await fetch(URL + '/' + id, {method: 'DELETE'});
        mutate();
        return;
      case ADD_TODO:
        await fetch(URL, {
          method: 'POST',
          headers:{
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify({text, checked:false})
        });
        mutate();
        return;
        case CHECKBOX_TOGGLE:
          const current:ToDo | undefined = data?.find(el => String(id) === String(el.id));
          const checked = !current?.checked 
          await fetch(URL+'/'+id,{
            method:'PATCH',
            headers:{'Content-type' : 'application/json'},
            body: JSON.stringify({ checked })

          });
          mutate();
        }

    };
  
  return (
    <>
    <fieldset onClick={onClick}> 
        {error && `💀 ${error.toString()}`}

        <input
          value={text}
          onInput={(event) => setText(event.currentTarget.value)}
        />
        <button data-action={ADD_TODO}>Add➕</button>
        <ol>
          {data?.map((item) => (
            <Item
              key={item.id}
              item={item}
            />
          ))}
        </ol>
    </fieldset>
    </>
  );
}

function Item({ item } : {item : ToDo}) {
  const { id, checked, text } = item;
  return (
    <li data-id={id}>
      <input
        type="checkbox"
        checked={checked}
        data-action={CHECKBOX_TOGGLE}
      />
      <span>{text}</span>
      <button data-action={DELETE_ACTION}>❌️</button>
      {!!checked && '✅'}
    </li>
  );
}
