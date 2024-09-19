import { useUserStore } from "../stores/user";

import { Main } from "../components/Main";
import { Welcome } from "../components/Welcome";

export default function Index() {
  const { user } = useUserStore();

  return user ? <Main /> : <Welcome />;
}
