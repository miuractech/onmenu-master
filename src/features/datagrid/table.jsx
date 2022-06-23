import React, { useEffect, useState } from 'react'
// import { useCollectionData } from 'react-firebase-hooks/firestore';
import { DataGrid } from "@mui/x-data-grid";
import usePagination from "firestore-pagination-hook";


export const Table = ({query,row_size,columns,rowManupulate,dataGridProp}) => {
    // console.log('query',query);
    const [page, setPage] = useState(0)
    const [rowSize, setRowSize] = useState(1)
    const {
        loading,
        loadingError:error,
        hasMore,
        items:value,
        loadMore
      } = usePagination(
        query
        ,
        {
          limit: row_size
        }
      );
      
      var rows = value? value.map((val,id)=>{
        var v = {...val.data()}
        console.log(v);
        if(rowManupulate){
            for (var manuplate of rowManupulate){
                v[manuplate['name']] = manuplate['valueGetter'](v[manuplate['name']])
            }
        }
        // var dateString =  v.time.toDate().toLocaleString(undefined,dateOptions)
        // var loyal = (v.loyalty && v.loyalty.programs)?v.loyalty.programs.map(prog=>prog.program).join(","):""
        var new_row = {...v,id:id.toString(),docId:val.id}
        return new_row
    }):[]
    const next = (dir) => {
        setPage(prev=>{
            if(prev<dir && hasMore){
                loadMore()
            }
            return dir
        });
    }
    useEffect(() => {
        if(value){
            setRowSize(r=>{
                if(value.length<r-1){
                    return value.length
                }else{
                    return r+row_size
                }
            })
        }
        // return () => {
        //     setRowSize(row_size+1)
        // }
    }, [value,query])
    // useEffect(() => {
    // //   alert('query changed')
    //   query.get().then(snap=>{
    //     //   console.log(snap.length);
    //   })
    //   return () => {
        
    //   }
    // }, [query])
    
    return (
        <>
            <br />
            <div>
                Hits : {value.length}
            </div>
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <span>Collection: Loading...</span>}
            {value && <DataGrid 
            rows={rows} 
            columns={columns}
            style={{minHeight:500}} 
            rowsPerPageOptions={[row_size]}
            pageSize={row_size}
            pagination
            page={page} 
            onPageChange={next}
            rowCount={rowSize}
            {...dataGridProp}
            // labelDisplayedRows={null}
            />}
        </>
    )
}