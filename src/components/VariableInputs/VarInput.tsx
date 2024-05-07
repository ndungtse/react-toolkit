import React, { useContext } from 'react';
import { VarInputContext } from '.';

interface RenderProps {
   onChange: (value: any) => void;
   data: any;
}

interface VarInputProps {
   // children?: React.ReactNode;
   // onChange?: (value: any) => void;
   render: (props: RenderProps) => React.ReactNode;
}

const VarInput = (props: VarInputProps) => {
   const { data, onChange } = useContext(VarInputContext)!;
   const { render } = props;
   return <div className=" w-full">{render({ data, onChange })}</div>;
};

export default VarInput;
