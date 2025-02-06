import './App.css';
import { Button } from './components/ui/button';

export default function App() {
  return (
    <div className="bg-zinc-900 mx">
      <header className="bg-zinc-800 text-white p-4">
        <h1 className="text-2xl">Tailwind CSS with Create React App</h1>
      </header>
      <main className="p-4">
        <p className="text-lg">
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Button variant="destructive">Click me</Button>
      </main>
    </div>
  );
}