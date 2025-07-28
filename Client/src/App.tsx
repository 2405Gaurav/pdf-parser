import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Upload from './components/Upload';
import Chat from './components/Chat';

const App = () => {
  return (
  <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/upload" element={<Upload/>} />
          <Route path="/chat" element={<Chat/>} />
          <Route path="/" element={<Upload/>} />
          
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
