import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import firebase from '../../firebaseConfig'
import { useHistory } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode'
import { useParams } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';

const schema = yup.object({
    name: yup.string().min(3).required(),
    address: yup.string().min(10).max(1000).required(),
    area: yup.string().matches(/^[a-zA-Z0-9 ._-]+$/,{message:'area cannot contain special characters'}).min(2).max(1000).required(),
    city: yup.string().min(2).max(1000).required(),
    latitude: yup.number().min(-90).max(90).required(),
    longitude: yup.number().min(-180).max(180).required(), 
    razorpayId: yup.string().length(23).required(),
    email:yup.string().email().required(),
    remark:yup.string().max(1000),
    premium:yup.number().min(1).required(),
    businessType:yup.string(),
})
export default function AddRestaurant({editMode}) {
    const history = useHistory()
    const params = useParams()
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [onBoardDate, setOnBoardDate] = useState(new Date())
    const [dueDate, setDueDate] = useState(new Date())
    const { register, setValue , handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
      });

    useEffect(() => {
        if(editMode && params.id){
            firebase.firestore().collection('roles').where('restaurantId','==',params.id).get()
            .then(snap => {
                if(!snap.empty){
                    snap.forEach(doc=>{
                        var data = doc.data()
                        // data.id = doc.id
                        Object.keys(data).forEach(key => {
                            setValue(key,data[key])
                        })
                        var startDate = data.start?data.start.toDate():new Date()
                        setStart(startDate)
                        var endDate = data.end?data.end.toDate():new Date()
                        setEnd(endDate)
                        var board = data.onBoardDate?data.onBoardDate.toDate():new Date()
                        setOnBoardDate(board)
                        var due = data.onBoardDate?data.onBoardDate.toDate():new Date()
                        setDueDate(due)
                    })
                }
            })
        }
    }, []);
    // console.log(errors);
    const onSubmit = async data =>{
        if(start && end){
            try {
                // const snap = await firebase.firestore().collection('roles').where('email','==',data.email).get()
                // if(snap.empty || editMode){
                    // if(editMode){
                    //     for (var doc of snap.docs){
                    //         var d = doc.data()
                    //         if (d.restaurantId !== params.id){
                    //             alert('email already in use')
                    //             return;
                    //         }
                    //     }
                    // }
                    var restaurantId =editMode?params.id : data.name.replace(/ /g,"-")+'-'+data.area.replace(/ /g,"-")+'-'+uuidv4();
                    const qrImage = await QRCode.toDataURL(`https://restaurant.itsonmenu.com/restaurant/${restaurantId}`)
                    var target = {
                        ...data,
                        start,
                        end,
                        onBoardDate,
                        dueDate,
                        restaurantId,
                        registered:false,
                        created:firebase.firestore.FieldValue.serverTimestamp(),
                        role:"admin",
                        qrImage,
                        url:`https://restaurant.itsonmenu.com/restaurant/${restaurantId}`,
                    }
                    var batch = firebase.firestore().batch();
                    var resPartner = firebase.firestore().collection("roles").doc(restaurantId);
                    batch.set(resPartner, target);
                    var restaurant = firebase.firestore().collection("restaurants").doc(restaurantId);
                    batch.set(restaurant, target)
                    batch.commit()
                    .then(() =>{
                        history.push('/')
                    })
                    .catch(err =>{
                        console.log(err);
                    })
                // }
                // else{
                //     alert('email already in use')
                // }
            }
            catch(err){
                console.error(err)
            }
        }
    }     
                       
                   
                    
                    
                      
    return (
        <div
        class="container"
        >
            <p className="mb-4 font-weight-bold" >
                Restaurant Info
            </p>
            <form onSubmit={handleSubmit(onSubmit)} >
                <div
                class="mb-2"
                >
                    <input 
                    type="text" 
                    // className="restaurant" 
                    {...register('name')}
                    placeholder="Restaurant"
                    class="form-control"
                    />
                    <div>
                        {errors.name && 
                        <div className="text-danger text-left" >
                            {errors.name.message}
                        </div>
                        }
                    </div>
                </div>
                {/* <div class="input-group mb-3">
                    <input 
                    type="text" 
                    disabled
                    class="form-control"
                    value={}
                    placeholder="uuid"
                    />
                    <div class="input-group-prepend">
                        <button class="input-group-text" id="basic-addon1"> generate uuid </button>
                    </div>
                </div> */}
                {/* <div
                class="mb-2"
                >
                    
                    <div>
                        {errors.uuid && 
                        <div className="text-danger text-left" >
                            uuid required
                        </div>
                        }
                    </div>
                </div> */}
                <div
                class="mb-2"
                >
                    <input 
                    type="text" 
                    class="form-control"
                    {...register('email')}
                    placeholder="admin email"
                    />
                    <div>
                        {errors.email && 
                        <div className="text-danger text-left" >
                            {errors.email.message}
                        </div>
                        }
                    </div>
                </div>
                <div
                class="mb-2"
                >
                    <textarea  
                    type="text" 
                    class="form-control"
                    {...register('address')}
                    placeholder="Address"
                    />
                    <div>
                        {errors.address && 
                        <div className="text-danger text-left" >
                            {errors.address.message}
                        </div>
                        }
                    </div>
                </div>
                <div
                class="mb-2"
                >
                    <input  
                    type="text" 
                    class="form-control"
                    {...register('area')}
                    placeholder="Area"
                    />
                    <div>
                        {errors.area && 
                        <div className="text-danger text-left" >
                            {errors.area.message}
                        </div>
                        }
                    </div>
                </div>
                <div
                class="mb-2"
                >
                    <input  
                    type="text" 
                    class="form-control"
                    {...register('city')}
                    placeholder="City"
                    />
                    <div>
                        {errors.city && 
                        <div className="text-danger text-left" >
                            {errors.city.message}
                        </div>
                        }
                    </div>
                </div>
                <div>
                    Location
                </div>
                <div
                class="mb-2"
                >
                    <input 
                    type="text" 
                    class="form-control"
                    {...register('latitude')}
                    placeholder="latitude"
                    />
                    <div>
                        {errors.latitude && 
                        <p className="text-danger" >
                            {errors.latitude.message}
                        </p>
                        }
                    </div>
                </div>
                <div
                class="mb-2"
                >
                    <input 
                    type="text" 
                    class="form-control"
                    {...register('longitude')}
                    placeholder="longitude"
                    />
                    <div>
                        {errors.longitude && 
                        <p className="text-danger" >
                            {errors.longitude.message}
                        </p>
                        }
                    </div>
                </div>

                <div>
                    Razorpay payment Key
                </div>

                <div
                class="mb-2"
                >
                    <input 
                    type="text" 
                    class="form-control"
                    {...register('razorpayId')}
                    placeholder="Razorpay API Key"
                    />
                    <div>
                        {errors.razorpayId && 
                        <div className="text-danger" >
                           {errors.razorpayId.message}
                        </div>
                        }
                    </div>
                </div>



                <div>
                    Premium Paid
                </div>

                <div
                class="mb-2"
                >
                    <input 
                    type="text" 
                    class="form-control"
                    {...register('premium')}
                    placeholder="Premium"
                    />
                    <div>
                        {errors.premium && 
                        <div className="text-danger" >
                            Enter valid Premium amount
                        </div>
                        }
                    </div>
                </div>
                <div>
                   Start Date
                </div>

                <div
                class="mb-2"
                >
                   
                    <ReactDatePicker
                    selected={start}
                    onChange={(date) => setStart(date)} 
                    />
                    
                </div>
                <div>
                   End Date
                </div>

                <div
                class="mb-2"
                >
                   
                    <ReactDatePicker
                    selected={end}
                    onChange={(date) => setEnd(date)} 
                    />
                   
                </div>
               
                
                <div
                class="mb-2"
                >
                    <input 
                    type="text" 
                    class="form-control"
                    {...register('remark')}
                    placeholder="Remarks"
                    />
                    <div>
                        {errors.remark && 
                        <div className="text-danger text-left" >
                            {errors.remark.message}
                        </div>
                        }
                    </div>
                </div>
                <div>
                    Premium Paid
                </div>

                <div
                class="mb-2"
                >
                    <input 
                    type="text" 
                    class="form-control"
                    {...register('businessType')}
                    placeholder="Business Type(hotel, restaurant)"
                    />
                    <div>
                        {errors.premium && 
                        <div className="text-danger" >
                            Enter valid Premium amount
                        </div>
                        }
                    </div>
                </div>
                <div>
                   Onboard Date
                </div>

                <div
                class="mb-2"
                >
                   
                    <ReactDatePicker
                    selected={onBoardDate}
                    onChange={(date) => setOnBoardDate(date)} 
                    />
                   
                </div>

                <div>
                   Payment Due Date
                </div>

                <div
                class="mb-2"
                >
                   
                    <ReactDatePicker
                    selected={dueDate}
                    onChange={(date) => setDueDate(date)} 
                    />
                   
                </div>
                
                <br />
                <br />
                <Link to="/">
                <button type="button" class="btn btn-outline-dark" > ← Back </button>
                </Link>
                &ensp;
                &ensp;
                <input
                class="btn btn-dark"
                type='submit'
                />
            </form>
        </div>
    )
}

