import { useForm } from "react-hook-form";
import { questions } from "./data";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";

function App() {
  const [answers, setAnswers] = useState({});

  const updateAnswer = (answer, questionIndex) => {
    setAnswers((newAnswers) => [{ ...newAnswers, questionIndex: answer }]);
  };

  return (
    <div style={{ margin: 20 }}>
      <h1 style={{ marginBottom: 30 }}>Brag graph generator</h1>
      {questions.map((question, index) => (
        <QnA
          question={question}
          updateAnswer={(answer) => updateAnswer(answer, index)}
        />
      ))}
      <Button variant="contained">Submit</Button>
    </div>
  );
}

const QnA = ({ question, updateAnswer }) => {
  return (
    <div style={{ width: "100%" }}>
      <TextField
        onChange={(event) => updateAnswer(event.target.value)}
        fullWidth
        label={question}
        variant="outlined"
        sx={{ mb: 2 }}
      />
    </div>
  );
};

export default App;
