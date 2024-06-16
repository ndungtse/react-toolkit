import useGet from '@/hooks/useGet';
import { capitalize, getObjValue } from '@/utils/funcs';
import { MantineSize, Select, SelectProps } from '@mantine/core';
import React, { FC, useEffect } from 'react';

interface Props extends SelectProps {}

interface Props {
   label?: string;
   placeholder?: string;
   value?: string;
   datasrc: string;
   accessorKey?: string;
   /** labelKey is the key of the object to be used as the label ex:
    *  {id: 1,
    *  name: 'John', act: {name: 'name'}} => labelKey = 'name' or 'act.name
    *  */
   labelKey?: string;
   onChange?: (e: any) => void;
   disabled?: boolean;
   variant?: 'unstyled' | 'default' | 'filled' | 'outline';
   width?: number | string;
   setActive?: (data: any) => void;
   useAuth?: boolean;
   setData?: (data: any) => void;
   className?: string;
   px?: number;
   size?: MantineSize;
   required?: boolean;
   /** getLabel is a function that takes the data and returns the label to be displayed */
   getLabel?: (data: any) => string;
   description?: string;
   filterData?: (data: any) => any;
}
/**
 * A customized mantine select which fetches data from an api
 * @param props
 * @author Ndungutse Charles
 */

const AsyncSelect: FC<Props> = ({
   label,
   labelKey,
   accessorKey,
   placeholder,
   value,
   datasrc,
   onChange,
   disabled,
   variant,
   width,
   setActive,
   useAuth = true,
   setData,
   className,
   px,
   size,
   required,
   getLabel,
   description,
   filterData,
}) => {
   const [selected, setSelected] = React.useState(value);
   const { data,isLoading: loading } = useGet<any[]>(datasrc, { defaultData: [], useAuth: useAuth });
   const [selectedData, setSelectedData] = React.useState<any[]>([]);

   useEffect(() => {
      console.log('data', data);
      const dataSet = new Set(data?.map((item) => JSON.stringify(item)));
      const newData = [...dataSet].map((item) => JSON.parse(item));
      setData?.(newData);
      const _data = (filterData ? filterData(newData) : newData) as any[];
      const selectData = _data?.map((item) => ({
         value: String(item[accessorKey ?? 'id']),
         label: getLabel ? getLabel(item) : capitalize(getObjValue(labelKey ?? 'name', item) ?? item[labelKey ?? 'name']),
      }));
      setSelectedData(selectData ?? []);
      const selected = _data?.find((item) => item[accessorKey ?? 'id'] === value);
      setActive?.(selected);
      console.log('selected use', selected?.id);
      if (selected) {
         setSelected(selected.id);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [accessorKey, data, labelKey, value]);
   const loadingData = [{ value: 'loading', label: 'Loading...', disabled: true }];
   const noData = [{ value: 'no-data', label: 'No data found', disabled: true }];
   return (
      <Select
         label={label}
         required={required}
         placeholder={placeholder}
         variant={variant ?? 'unstyled'}
         px={px ?? 6}
         disabled={disabled}
         description={description}
         // data={loading ? loadingData : selectedData}
         data={loading ? loadingData : data?.length === 0 ? noData : selectedData}
         value={String(selected)}
         nothingFoundMessage="No data found"
         width={width ?? 300}
         searchable
         size={size ?? 'sm'}
         onChange={(e) => {
            const selected = data?.find((item) => item[accessorKey ?? 'id'] === e);
            setActive?.(selected);
            // console.log('e', e);
            setSelected(e!);
            onChange?.(e);
         }}
         className={className}
      />
   );
};

export default AsyncSelect;