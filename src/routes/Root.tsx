import { Header } from "../components/Header";
import { Welcome } from "../components/Welcome";

export default function Root() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="mt-5 flex-grow-1">
        <Welcome />
      </div>
    </div>
  );
}
