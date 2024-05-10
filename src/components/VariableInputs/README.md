Example of usage

```tsx
interface Props {
  onClose: () => void;
}

type AssignEvaluationData = {
  role: string | null;
  evaluator: string | null;
};

const AssignEvaluation = ({ onClose }: Props) => {
  const [assignedEvaluators, setAssignedEvaluators] = useState<
    AssignEvaluationData[]
  >([
    {
      role: "Main Evaluator",
      evaluator: "Some",
    },
    {
      role: "Secondary Evaluator",
      evaluator: "Kick",
    },
  ]);
  const [loading, setLoading] = useState(false);

  // ... other logics

  return (
    <VariableInputs
      data={assignedEvaluators}
      onChange={(data) => {
        window.log("---data---", data);
        setAssignedEvaluators(data);
      }}
      className="mt-4"
    >
      <VariableInputs.Input
        dataType={assignedEvaluators[0]} // if you want auto typing from your data
        render={({ data, onChange }) => {
          window.log("---e---", data);
          return (
            <StyledSelect
              value={data.role}
              onChange={(e) => onChange({ ...data, role: e })}
              label="Role"
              data={["Main Evaluator", "Secondary Evaluator", "Others"]}
              placeholder="Select Role"
            />
          );
        }}
      />
      <VariableInputs.Input
        // manually typed types
        render={({
          data,
          onChange,
        }: VarInpRenderProps<AssignEvaluationData>) => (
          <StyledSelect
            value={data.evaluator}
            onChange={(e) => onChange({ ...data, evaluator: e })}
            label="Evaluator"
            data={["Some", "Kick"]}
            placeholder="Select Evaluator"
          />
        )}
      />
    </VariableInputs>
  );
};

export default AssignEvaluation;
```
