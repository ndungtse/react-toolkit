import React, { useContext } from 'react';
import { VarInputContext, VarInputContextProps } from '.';

export interface VarInpRenderProps<T = any> {
   onChange: (value: T) => void;
   data: T;
}

interface VarInputProps<T> {
   // children?: React.ReactNode;
   // onChange?: (value: any) => void;
   render: (props: VarInpRenderProps<T>) => React.ReactNode;
   /**
    * Add this if you want correct typings
    * @example <VarInput dataType={data[0]} />
    */
   dataType?: T;
}

/**
 * A column input of the VariableInputs passed as its children
 * @example <VariableInputs.Input dataType={data[0]}
 * render={({ data, onChange }) => <input value={data.name} onChange={onChange} />}
 *  />
 */
function VarInput<T = any>(props: VarInputProps<T>) {
   const { render, dataType } = props;
   const dt = dataType as T;
   const { data, onChange } = useContext<VarInputContextProps<typeof dt> | null>(VarInputContext)!;
   return <div className=" w-full">{render({ data, onChange })}</div>;
}

export default VarInput;
