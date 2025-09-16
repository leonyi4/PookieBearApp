import React from 'react'
import { Link } from 'react-router-dom';


const DisasterCard = (props) => {
    // console.log(props.data)

    const progress = props.data.raised / props.data.goal * 100;
    
    
  return (
    <Link to={`/donations/${props.data.id}`} className='min-w-[200px] max-w-[200px] min-h-[250px] max-h-[250px] bg-secondary shadow-md'>
        <img className="w-full h-40 rounded-md " src={props.data.image} alt={props.data.name} />
        <h3 className='text-sm uppercase font-semibold text-gray-800 h-10 '>{props.data.name}</h3>
        <div className="h-4 my-2 bg-secondary rounded-full">
          <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }}></div>
          <div className="text-xs text-gray-800 mt-1">
            ${props.data.raised?.toLocaleString() || 0} raised of ${props.data.goal?.toLocaleString() || 0}
          </div>
        </div>
    </Link>
  )
}

export default DisasterCard