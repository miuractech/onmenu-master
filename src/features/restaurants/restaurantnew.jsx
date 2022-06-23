import React from 'react'
import DataComponent from '../../features/datagrid/DataGrid';
import firebase from "firebase/app";
import "firebase/firestore";
import { useSelector } from 'react-redux';
import { Container, Rating } from '@mui/material';
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

const filterConfig = [
    { 
        name:'Name',
        field:'name',
        type:'text',
        // options:[
        //     1,2,3,4,5
        // ],
        // valueGetter:(text)=>parseInt(text),

    },
    { 
        name:'Admin Email',
        field:'email',
        type:'text',

    },
    { 
        name:'Phone',
        field:'mobile',
        type:'text',
    

    },
    { 
        name:'Locality',
        field:'area',
        type:'text',

    },
    { 
        name:'Active',
        field:'published',
        type:'option',
        options:[
            'active',
            'inactive'
        ],
        valueGetter:(text)=>text==='active',

    },
]


const postRowStyle = (v, index) => ({
    backgroundColor:parseInt(v['feedback'])<3 ? '#efe' : 'white',
});
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
  
//   const filterColumn = [
//     ...base,
//     { 
//       field: 'start',
//       headerName: 'Start Date',
//       sortable: false,
//       width:150,
//       renderCell: (params) => (
//           <span>
//           {params.row.start?params.row.start.toDate().toLocaleDateString():''}
//           </span>
//       )
//     },
//     { 
//       field: 'end',
//       headerName: 'End Date',
//       sortable: false,
//       width:150,
//       renderCell: (params) => (
//           <span>
//           {params.row.end?params.row.start.toDate().toLocaleDateString():''}
//           </span>
//       )
//     },
//   ]
  
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


const rowManupulate = [
    // {
    //     name:'time',
    //     valueGetter:cell=>cell.toDate().toLocaleString(undefined,dateOptions)
    // },
    {
        name:'start',
        valueGetter:cell=>cell?cell.toDate().toLocaleString(undefined,dateOptions):''
    },
    {
        name:'end',
        valueGetter:cell=>cell?cell.toDate().toLocaleString(undefined,dateOptions):''
    },
]

// var dishFeedbackDishes = v['dishFeedback']? Object.keys(v['dishFeedback']):[]
//             var dishFeedback = dishFeedbackDishes.length>0? dishFeedbackDishes.map(dish=>(`${dish} : ${v['dishFeedback'][dish]}`)):''
//             console.log(v['feedback']);
//             var new_row = {...v,id,dishFeedback} 

export default function Index() {

   
    var timeNow = new Date(firebase.firestore.Timestamp.now().toDate())
    timeNow.setHours(timeNow.getHours() - 4);
    const defaultQuery = firebase
    .firestore()
    .collection('restaurants')
    return (
      <Container>
        
          <DataComponent
          columns={columns}
          defaultQuery={defaultQuery}
          row_size={20}
          filterConfig={filterConfig}
          rowManupulate={rowManupulate}
          querySuffix={{
              name:'created',
              ascdes:'desc'
          }}
          dataGridProp={{postRowStyle}}
          />
      </Container>

    )
}

export const dateOptions =  { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric"} 
