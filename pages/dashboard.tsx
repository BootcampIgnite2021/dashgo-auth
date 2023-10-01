import { Can } from "../components/Can";
import { useAuth } from "../hooks/useAuth";
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <h1>Dashboard: {user.email}</h1>
      {
        <Can permissions={["metrics.list"]}>
          <div>Méricas</div>
        </Can>
      }
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/me");

  return {
    props: {},
  };
});
