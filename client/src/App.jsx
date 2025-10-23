import useAuthContext from "./hooks/useAuthContext.jsx";

function App() {
  const { state, dispatch } = useAuthContext();
  return (
    <>
      <h1 className="bg-red-500">Hello World</h1>
    </>
  );
}

export default App;
