import TypstEditor from "./editor/CodeEditor";
import { MouseEventHandler, useRef, useState } from "react";
import Compile from "./compile_renderer/ArtifactProcessing";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import 'bootstrap/dist/css/bootstrap.css';
import Button from "react-bootstrap/esm/Button";


const App = () => {
  // const childRef = useRef<{ exportPDF: () => void; } | undefined>(undefined);
  const [isListVisible, setListVisible] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [buttonClicked, setButtonClicked] = useState(0);

  const handleCodeChange = (newValue: string) => {
    setCodeValue(newValue);
  };

  const toggleList = () => {
    setListVisible(!isListVisible);
  };

  return (
    <>
      <Container fluid="md">
        <Row style={{color: 'white', margin: '10px 0'}}>
          <Button style={{width: '200px'}} onClick={() => {
            console.log('export PDF');
            setButtonClicked(buttonClicked + 1);
          } }>
            export PDF
          </Button>
        </Row>
        <Row>
          <Col>
            <TypstEditor onCodeChange={handleCodeChange} />
          </Col>
          <Col>
            <Compile codeAsString={codeValue} onPdfExport={buttonClicked} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
