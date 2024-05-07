Example of usage

```tsx
import { assignEvaluationState } from '@/atoms';
import { AuthApi } from '@/lib/config/axios.config';
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import CustomInput from '../../inputs/CustomInput';
import MainModal from '../MainModal';
import StyledSelect from '../../selects/StyledSelect';
import VariableInputs from '../../selects/VariableInputs';

interface Props {
   onClose: () => void;
}

type Assignee = {
   role: string;
   evaluator: string;
};

type AssignEvaluationData = {
   us: string;
   them: string;
};

const AssignEvaluation = ({ onClose }: Props) => {
   const [isAssignEvaluation, _] = useRecoilState(assignEvaluationState);
   const [assignedEvaluators, setAssignedEvaluators] = useState<Assignee[]>([]);
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState<AssignEvaluationData[]>([
      {
         us: 'Me',
         them: 'Some',
      },
      {
         us: 'You',
         them: 'Kick',
      },
   ]);

   const assignEvaluation = async () => {
      setLoading(true);
      try {
         const res = await AuthApi.post('/assign-evaluation', assignedEvaluators);
         console.log('---res---', res);
         notifications.show({
            title: 'Success',
            message: 'Evaluation Scheduled Successfully',
            color: 'teal',
         });
      } catch (error) {
         notifications.show({
            title: 'Error',
            message: 'An error occured',
            color: 'red',
         });
      }
   };

   return (
      <MainModal
         open={isAssignEvaluation.state}
         onClose={onClose}
         title="Assign Evaluators"
         size={'xl'}
         closeOnClickOutside={false}
         // description=''
      >
         <div className=" w-full flex flex-col">
            <h1 className=" font-semibold text-lg mt-5">Application</h1>
            <div className=" grid md:grid-cols-2 w-full gap-3 gap-y-8 mt-2">
               <CustomInput disabled placeholder="Place for us" label="Institution Name" value={isAssignEvaluation.data?.name} />
               <CustomInput disabled placeholder="Place for them" label="Trade" value={isAssignEvaluation.data?.trade} />
            </div>
            <h1 className=" font-semibold text-lg mt-5">Evaluators</h1>
            <VariableInputs data={data} className="mt-4">
               <VariableInputs.Input
                  render={({ data, onChange }) => {
                     console.log('---e---', data);
                     return (
                        <StyledSelect
                           value={data.us}
                           onChange={(e) => onChange({ ...data, us: e })}
                           label="Evaluator"
                           data={['Me', 'You']}
                        />
                     );
                  }}
               />
               <VariableInputs.Input
                  render={({ data, onChange }) => (
                     <StyledSelect
                        value={data.them}
                        onChange={(e) => onChange({ ...data, them: e })}
                        label="Evaluator"
                        data={['Some', 'Kick']}
                     />
                  )}
               />
            </VariableInputs>
            <Button onClick={onClose} className="mt-8 w-fit mx-auto" size="sm" radius={'xl'}>
               Schedule
            </Button>
         </div>
      </MainModal>
   );
};

export default AssignEvaluation;
```
