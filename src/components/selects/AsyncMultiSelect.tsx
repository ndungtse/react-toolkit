import useGet from '@/hooks/useGet';
import { capitalize, getObjValue } from '@/utils/funcs';
import { MultiSelect } from '@mantine/core';
import React, { FC, useEffect } from 'react';

interface Props {
   label?: string;
   placeholder?: string;
   value?: string[];
   datasrc: string;
   accessorKey?: string;
   labelKey?: string;
   onChange?: (e: any) => void;
   disabled?: boolean;
   required?: boolean;
   getLabel?: (data: any) => string;
   px?: number;
   variant?: 'unstyled' | 'default' | 'filled' | 'outline';
   className?: string;
   description?: string;
   size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const AsyncMultiSelect: FC<Props> = ({
   label,
   labelKey,
   accessorKey,
   placeholder,
   value,
   datasrc,
   onChange,
   disabled,
   getLabel,
   required,
   px,
   variant,
   className,
   description,
   size,
}) => {
   const [selected, setSelected] = React.useState<string[]>(value ?? []);
   const { data, isLoading: loading } = useGet<any[]>(datasrc, { defaultData: [] });
   const [selectedData, setSelectedData] = React.useState<any[]>([]);

   useEffect(() => {
      console.log('data', data);
      const dataSet = new Set(data?.map((item) => JSON.stringify(item)));
      const newData = [...dataSet].map((item) => JSON.parse(item));
      const selectData = newData?.map((item) => ({
         value: item[accessorKey ?? 'id']?.toString(),
         label: getLabel ? getLabel(item) : capitalize(getObjValue(labelKey ?? 'name', item) ?? item[labelKey ?? 'name']),
      }));
      setSelectedData(selectData ?? []);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [accessorKey, data, labelKey, value]);
   const loadingData = [{ value: 'loading', label: 'Loading...', disabled: true }];
   return (
      <MultiSelect
         label={label}
         placeholder={placeholder}
         variant={variant ?? 'unstyled'}
         px={px ?? 6}
         searchable
         description={description}
         data={loading ? loadingData : selectedData}
         value={loading ? ['loading...'] : selected}
         nothingFoundMessage="No data found"
         className={className}
         onChange={(e) => {
            // const selected = data?.find((item) => item[accessorKey ?? 'id'] === e);
            console.log('e', e);
            setSelected(e!);
            onChange?.(e);
         }}
         required={required}
         size={size ?? 'sm'}
         disabled={disabled}
      />
   );
};

export default AsyncMultiSelect;