import { strict as assert } from "assert";
import { Outlet, useParams } from "react-router-dom";
import { PageLayout } from "@primer/react";
import Explorer from "../components/Explorer";

const Repository = () => {
  const { repositoryName } = useParams();
  assert(repositoryName != null);

  return (
    <PageLayout>
      <PageLayout.Pane position="start">
        <Explorer path={repositoryName} />
      </PageLayout.Pane>
      <PageLayout.Content>
        <Outlet />
      </PageLayout.Content>
    </PageLayout>
  );
};

export default Repository;
