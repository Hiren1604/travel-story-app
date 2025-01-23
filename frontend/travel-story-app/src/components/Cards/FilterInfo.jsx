import moment from 'moment'
import React from 'react'
import { MdOutlineClose } from 'react-icons/md';

const FilterInfo = ({filterType, onClear, filterDates}) => {

    const DateRangeChip = ({date})=> {
        const startDate = date?.from ? moment(date?.from).format("Do MMM YYYY") : "NA";
        const endDate = date?.to ? moment(date?.to).format("Do MMM YYYY") : "NA";
        return (
            <div className='flex items-center gap-2 bg-slate-100 px-3 py-2 rounded'>
                <p className='text-sm font-medium'>{startDate} - {endDate}</p>
                <button onClick={onClear}><MdOutlineClose/></button>
            </div>
        )
    }
  return (filterType &&
    (<div className='mb-5'>
      {filterType === "search" ? (
        <h3 className='text-lg font-semibold'>Search Results</h3>
      ): (
        <div className='flex items-center gap-3'>
            <h3 className='text-lg font-semibold'>Travel Stories from</h3>
            <DateRangeChip date={filterDates} />
        </div>
      )}
    </div>)
  )
}

export default FilterInfo
