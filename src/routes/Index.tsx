import { Link } from "react-router-dom";

const Index = () => (
  <div className="index">
    <h1>Litterula</h1>
    <ul>
      <li>
        <Link to="repositories">repositories</Link>
      </li>
    </ul>
  </div>
);

export default Index;
