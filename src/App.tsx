import TypstEditor from "./editor/CodeEditor";
import { useState } from "react";
import Compile from "./compile_renderer/ArtifactProcessing";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import 'bootstrap/dist/css/bootstrap.css';


const App = () => {
  const [isListVisible, setListVisible] = useState(false);
  const [codeValue, setCodeValue] = useState("");

  const handleCodeChange = (newValue: string) => {
    setCodeValue(newValue);
  };

  const toggleList = () => {
    setListVisible(!isListVisible);
  };

  return (
    <>
      <Container fluid="md">
        <Row>
          <Col>
            <TypstEditor onCodeChange={handleCodeChange} />
          </Col>
          <Col>
            <Compile codeAsString={codeValue} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
