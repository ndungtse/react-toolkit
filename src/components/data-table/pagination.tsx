import React, { useEffect } from 'react'
import { IPagination } from './types';
import { Pagination, Select } from '@mantine/core';

interface Props {
  pagination?: IPagination;
  setData: (data: any) => void;
  data: any[];
}

const PaginationComponent = ({ pagination, setData, data }: Props) => {
  const [paginationState, setPagination] = React.useState({
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? 1,
    total: 0
  });
  // const { params, updateParam } = useSearchParams();

  useEffect(() => {
    const total = Math.ceil(data.length / paginationState.limit);
    data.length > 0 && setPagination({ ...paginationState, total });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationState.limit, data]);

  useEffect(() => {
    const _data = data.slice((paginationState.page - 1) * paginationState.limit, paginationState.page * paginationState.limit);
    setData(_data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationState, data]);

  const handlePagination = (page: number) => {
    // updateParam('page', page);
    setPagination({ ...paginationState, page });
  };
  return (
    <div className='flex justify-center gap-x-3'>
      <Pagination total={paginationState.total} value={paginationState.page} onChange={handlePagination} className="" />
      <div className="flex items-center gap-x-2">
        <span className=' text-sm'>Show</span>
        <Select
          size="xs"
          w={100}
          // label="Your favorite library"
          placeholder="Pick Page Size"
          data={[1, 5, 10, 20, 30, 40, 50, 100, 200, 300, 400, 500].map((val) =>
            String(`${val}`),
          )}
          value={String(paginationState.limit)}
          onChange={(value) => {
            // remove 'show' from value and
            const newValue = value?.replace('', '');
            if (!newValue) return;
            setPagination({ ...paginationState, limit: parseInt(newValue), page: 1 });
          }}
        />
      </div>
    </div>
  )
}

export default PaginationComponent