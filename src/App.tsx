import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { Viewer } from './components/layout/Viewer'

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-800 overflow-hidden font-sans">
      <Header />
      <div className="flex-1 flex relative overflow-hidden">
        <Sidebar />
        <Viewer />
      </div>
    </div>
  )
}