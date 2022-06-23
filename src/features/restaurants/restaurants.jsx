import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import firebase from "../../firebaseConfig";
import { Link } from "react-router-dom";
import usePagination from "firestore-pagination-hook";

const base = [
  { field: "id", hide: true },
  { field: "name", headerName: "Restaurant", flex: 1 },
  { field: "email", headerName: "Email", flex: 1},
  { 
    field: 'url',
    headerName: 'Url',
    sortable: false,
    flex: 1,
    renderCell: (params) => (
      <a href={params.row.url}>
        <span>
        {params.row.url}
        </span>
      </a>
    )
  },
  { field: "remark", headerName: "Remarks", flex: 1},
  { 
    field: 'action',
    headerName: 'Action',
    sortable: false,
    width: 150, 
    renderCell: (params) => {
      // console.log(params);

      
      return (
        <>
        <Link to={`/edit/${params.row.restaurantId}`}>
          <Button variant='outlined' color='primary' size='small'>Edit</Button>
        </Link>
        &ensp;
        <Button variant='outlined' color='secondary' size='small' >Disable</Button>
        </>
      );
    },
  },
];

const filterColumn = [
  ...base,
  { 
    field: 'start',
    headerName: 'Start Date',
    sortable: false,
    width:150,
    renderCell: (params) => (
        <span>
        {params.row.start?params.row.start.toDate().toLocaleDateString():''}
        </span>
    )
  },
  { 
    field: 'end',
    headerName: 'End Date',
    sortable: false,
    width:150,
    renderCell: (params) => (
        <span>
        {params.row.end?params.row.start.toDate().toLocaleDateString():''}
        </span>
    )
  },
]

const columns = [
  ...base,
  { 
    field: 'start',
    headerName: 'Start Date',
    sortable: false,
    width:150,
    // renderCell: (params) => (
    //     <span>
    //     {params.row.start?params.row.start.toDate().toLocaleDateString():''}
    //     </span>
    // )
  },
  { 
    field: 'end',
    headerName: 'End Date',
    sortable: false,
    width:150,
    // renderCell: (params) => (
    //     <span>
    //     {params.row.end?params.row.start.toDate().toLocaleDateString():''}
    //     </span>
    // )
  },
]


const row_size = 10

export default function Restaurant() {
  const [restaurants, setRestaurants] = useState(null);
  const [page, setPage] = useState(0)
  const [rowSize, setRowSize] = useState(1)
  const [query, setQuery] = useState(firebase
    .firestore()
    .collection('restaurants')
    .orderBy('created','desc'));
    
    const [email, setEmail] = useState(null);
    
    useEffect(() => {
      if(email){
        query 
        .limit(10)
        .get()
        .then(snap=>{
            if(!snap.empty){
                var data = []
                snap.forEach((doc)=>{
                    data.push({...doc.data(),id:doc.id})
                })
                setRestaurants(data)
            }
        })
      }
      else{
        setRestaurants(null)
      }
    }, [query])

  return (
    <div style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "flex-end",flexGrow:1,margin:16,marginRight:32 }}>
            <Link to="/add">
                <Button variant='contained' color='primary' >Add New Restaurant</Button>
            </Link>
        </div>
      <input 
      type="email" 
      value={email?email:''}
      onChange ={ e =>{
        e.preventDefault()
        if(e.target.value){
          setEmail(e.target.value)
        }else{
          setEmail(null)
        }
      }}
      />
      <button
      onClick ={ ()=>{
        if(email){
          setQuery(()=>firebase
          .firestore()
          .collection('restaurants')
          .orderBy('created','desc')
          // .where('email','==',email)
          .where('email','==',email) 
          )
        }
      }}
      >filter</button>
      <button
      onClick ={ ()=>{
        setEmail(null)
        setQuery(firebase
        .firestore()
        .collection('restaurants')
        .orderBy('created','desc'))
      }}
      >clear</button>
      {restaurants?
      <DataGrid
      rows={restaurants}
      columns={filterColumn} 
      autoHeight={true}
      // style={{minHeight:500}} 
      rowsPerPageOptions={[row_size]}
      pageSize={row_size}
      pagination
      page={page} 
      // onPageChange={next}
      rowCount={rowSize}
      labelDisplayedRows={null}
      />
      :
      <Table query={query} 
      page={page} 
      rowCount={rowSize}
      rowSize={rowSize} 
      setRowSize={setRowSize}
      setPage={setPage}
      />}
    </div>
  );
}


export const dateOptions =  { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric"} 


const Table = ({query,setRowSize,rowSize,page,setPage}) => {
  const {
    loading,
    loadingError:error,
    // loadingMore,
    // loadingMoreError,
    hasMore,
    items:value,
    loadMore
  } = usePagination(
    query,
    {
      limit: row_size
    }
  );
  var rows =value? value.map((val,id)=>{
    var v = val.data()
    var start =  v.start?v.start.toDate().toLocaleString(undefined,dateOptions):''
    var end =  v.end?v.end.toDate().toLocaleString(undefined,dateOptions):''
    var new_row = {...v,
      start,
      end,
      id:id.toString()}
    return new_row
  }):[]
  
  const next = dir => {
    setPage(prev=>{
        if(prev<dir && hasMore){
            loadMore()
        }
        return dir
    })
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
}, [value])
  return (
    <div>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading ? <span>Loading...</span>
      : 
      <DataGrid
      rows={rows}
      columns={columns} 
      autoHeight={true}
      // style={{minHeight:500}} 
      rowsPerPageOptions={[row_size]}
      pageSize={row_size}
      pagination
      page={page} 
      onPageChange={next}
      rowCount={rowSize}
      labelDisplayedRows={null}
      />}
    </div>
  )
}