import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LinkList from "./components/LinkList";
import LinkDetail from "./components/LinkDetail";
import CreateLink from "./components/CreateLink";
import EditLink from "./components/EditLink";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<LinkList />} />
          <Route path="/link/:id" element={<LinkDetail />} />
          <Route path="/create" element={<CreateLink />} />
          <Route path="/edit/:id" element={<EditLink />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
