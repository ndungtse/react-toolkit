import React, { Children } from "react";
import VarInput from "./VarInput";
import { cn } from "@/utils/cn";

interface Props<T> {
  children: React.ReactNode;
  className?: string;
  rightSection?: React.ReactNode;
  leftSection?: React.ReactNode;
  addSection?: React.ReactNode;
  data: T[];
  onChange?: (value: T[]) => void;
}

export interface VarInputContextProps<T = any> {
  data: T;
  onChange: (value: T) => void;
}

export const VarInputContext = React.createContext<VarInputContextProps | null>(
  null
);

/**
 * A variable input container which allows to add more inputs as you want effortlessly
 * @param props props of the component
 * @author Ndungutse Charles
 */
function VariableInputs<T = any>(props: Props<T>) {
  const {
    children,
    className,
    rightSection,
    leftSection,
    addSection,
    data,
    onChange,
  } = props;
  const convertedChildren = Children.toArray(children) as React.ReactElement[];
  const varInputs = convertedChildren.filter(
    (child) => child.type === VarInput
  );
  const [inputRows, setInputsRows] = React.useState(data);

  const addInput = () => {
    setInputsRows((prev) => [...prev, {} as any]);
  };

  const removeInput = (index: number) => {
    setInputsRows((prev) => prev.filter((_, i) => i !== index));
  };

  React.useEffect(() => {
    onChange?.(inputRows);
  }, [inputRows]);

  return (
    <div className={cn(className, "flex w-full gap-2 flex-col")}>
      {inputRows.map((r, i) => (
        <div key={i} className={cn("flex w-full gap-2")}>
          {leftSection}
          <div className="flex w-full gap-2">
            {varInputs.map((input, index) => {
              const inputData = r;
              const onChange = (value: any) => {
                console.log("value", value);
                console.log("index", index);
                const newData = JSON.parse(
                  JSON.stringify(inputRows)
                ) as typeof inputRows;
                newData[i] = value;
                console.log("newData", newData);
                console.log("oldData", inputRows);
                setInputsRows(newData);
              };
              return (
                <VarInputContext.Provider value={{ data: inputData, onChange }}>
                  <div key={index} className="flex gap-2 w-full">
                    {input}
                  </div>
                </VarInputContext.Provider>
              );
            })}
          </div>
          <button onClick={() => removeInput(i)} className="p-0 flex items-end">
            {rightSection ?? (
              <span className="flex flex-col mt-auto items-center justify-center w-11 border text-2xl p-2">
                -
              </span>
            )}
          </button>
        </div>
      ))}
      {addSection ?? (
        <button
          onClick={addInput}
          className="flex border-2 px-5 w-fit mx-auto flex-col text-2xl p-1.5"
        >
          +
        </button>
      )}
    </div>
  );
}

VariableInputs.Input = VarInput;

export default VariableInputs;
