import './App.css';
import Home from './Home';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <header className='App-header'>
                <Routes>
                    <Route
                        index
                        element={<Home />}
                    />
                </Routes>
            </header>
        </BrowserRouter>
    );
}

export default App;
