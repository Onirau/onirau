import lemonLogo from "./assets/lemon.svg"
import './App.css'
import { LiquidCanvas } from "./Liquid/Liquid"

function App() {
  return (
    <>
      <div>
        <a href="https://onirau.github.io/">
          <img src={lemonLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Lumino</h1>
      <LiquidCanvas />
    </>
  )
}

export default App
