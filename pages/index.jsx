import { ToDoApp } from "@/components/todo";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>ToDo List</title>
      </Head>
        <h1>ToDo List</h1>
        <ToDoApp />
        
      
    </>
  );
}
