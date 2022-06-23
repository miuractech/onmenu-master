import React, { useState } from 'react'
import firebase from "firebase/app";
import "firebase/firestore";
import { Button } from '@material-ui/core';
import { Link } from "react-router-dom"

export const filterBoxStyles = {
    width:150,
    outline:0,
    border: '1px solid #e4e4e4',
    backgroundColor:"#f6f7fa",
    padding:'0.5rem',
    resize:'none',
    borderRadius:5
}

export const FilterComponent = ({defaultQuery,setQuery,query,config,setLoading,targetQuery,querySuffix}) => {
    const [currentFilter, setCurrentFilter] = useState(config[0])
    const [value, setValue] = useState(null)
    var timeNow = new Date(firebase.firestore.Timestamp.now().toDate())
    timeNow.setHours(timeNow.getHours() - 4);
    return(
        <div
            style={{display: 'flex',margin:"8px auto",alignItems:'center'}}
            >
                <div
                style={{fontSize:16}}
                >
                    Filter &ensp;
                </div>
                <div
                >
                    <select 
                    style={{...filterBoxStyles}}
                    name="filter" 
                    id="current-filtyer"
                    onChange={e=>{
                        const target = config.filter(c=>c.name===e.target.value)[0]
                        setCurrentFilter(target)
                    }}
                    >
                        {config.map(({name,field,type})=>(
                        <option value={name}>{name}</option>
                        ))}
                    </select>
                    &ensp;
                </div>
                <div
                >
                   <FilterInput 
                   currentFilter={currentFilter} 
                   value={value}
                   setValue={setValue}
                   />
                   &ensp;
                </div>
                <Button
                    height={30}
                    width={50} 
                    variant={'outlined'} 
                    color='primary'
                    onClick={()=>{
                        if(value){
                            setLoading(true)
                            var targetText = currentFilter.valueGetter?currentFilter.valueGetter(value):value
                            var target = querySuffix?defaultQuery.where(currentFilter.field,'==',targetText).orderBy(querySuffix.name,querySuffix.ascdes):defaultQuery.where(currentFilter.field,'==',targetText).orderBy('time','desc')
                            setQuery(target)
                            setTimeout(() => {
                                setLoading(false)
                            }, 100);
                        }
                    }}
                >
                    Filter
                </Button>
                &ensp;
                <Button
                    height={30}
                    width={50} 
                    variant={'outlined'} 
                    onClick={()=>{
                        setLoading(true)
                        setQuery(targetQuery)
                        setTimeout(() => {
                            setLoading(false)
                        }, 100);
                    }}
                >
                    Reset
                </Button>

                <div style={{ display: "flex", justifyContent: "flex-end",flexGrow:1,marginRight:32 }}>
                    <Link to="/add">
                        <Button variant='contained' color='primary' >Add New Restaurant</Button>
                    </Link>
                </div>
            </div>
    )
}




const FilterInput = ({currentFilter,setValue,value})=>{
    // console.log('type',currentFilter.type);
    switch (currentFilter.type) {
        case 'text':
            return<input
            value={value}
            onChange={e=>setValue(e.target.value)}
            style={{...filterBoxStyles}}
            type="text" 
            />
         case 'option':
             return <select
             value={value}
             onChange={e=>setValue(e.target.value)}
             name={currentFilter.name}
             style={{...filterBoxStyles}}
             >
                 {currentFilter.options.map(name=>(
                     <option key={name} value={name}>{name}</option>
                 ))}
             </select>
    
        default:
            return <input
            style={{...filterBoxStyles}}
            type="text" 
            />
     }
    }
