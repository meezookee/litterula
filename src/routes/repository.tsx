import { Outlet, useParams } from "react-router-dom";
import { strict as assert } from "assert";
import Explorer from "../components/Explorer";
import { Col, Container, Row } from "react-bootstrap";

const Repository = () => {
  const { repositoryName } = useParams();
  assert(repositoryName != null);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Explorer path={repositoryName} />
        </Col>
        <Col>
          <Outlet />
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default Repository;
