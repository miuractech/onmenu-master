import React, { useState } from 'react'
// import { useCollectionData } from 'react-firebase-hooks/firestore';

import { CircularProgress } from '@material-ui/core';
import { Table } from './table';
import { FilterComponent } from './filterComponent';


// const row_size = 20
export default function DataComponent({
    row_size,
    filterConfig,
    defaultQuery,
    columns,
    rowManupulate,
    querySuffix,
    dataGridProp
    }) {
    var targetQuery = querySuffix?defaultQuery.orderBy(querySuffix.name,querySuffix.ascdes): defaultQuery
    const [query, setQuery] = useState(targetQuery)
    const [loading, setLoading] = useState(false)
        
    return (
        <div>
            <br />
            <br />
            <FilterComponent
            {...{
                defaultQuery,
                query,
                setQuery,
                config:filterConfig,
                loading,
                setLoading,
                targetQuery,
                querySuffix
            }}
            />
            {loading ?
            <CircularProgress />
            :<Table 
            query={query}
            row_size={row_size}
            columns={columns}
            rowManupulate={rowManupulate}
            dataGridProp={dataGridProp}
            // timeNow={timeNow}
            />}
        </div>
    )
}