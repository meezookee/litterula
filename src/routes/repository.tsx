import { strict as assert } from "assert";
import { Outlet, useParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import Explorer from "../components/Explorer";

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
