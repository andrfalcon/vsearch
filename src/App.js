import './App.css';
import SearchBox from './components/searchBox';
import ApiInput from './components/apiInput';
function App() {
  return (
    <div className="text-center w-[350px] h-[400px] bg-slate-800 flex flex-col items-center justify-center">
      <ApiInput />
      <SearchBox />
    </div>
  );
}

export default App;
