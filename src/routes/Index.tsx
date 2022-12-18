import { Options } from "@isomorphic-git/lightning-fs";
import { Link } from "react-router-dom";
import { pfs } from "../fs";

const Index = () => (
  <div>
    <h1>Litterula</h1>
    <ul>
      <li>
        <Link to="repositories">repositories</Link>
      </li>
    </ul>
    <div>
      <button
        onClick={() => {
          pfs.init("litterula", { wipe: true } as Options);
        }}
      >
        Wipe file system
      </button>
    </div>
  </div>
);

export default Index;
