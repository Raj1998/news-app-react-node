import React from 'react'
import BounceLoader from 'react-spinners/BounceLoader'

export default function Spinner() {
    return (
        <div style={{ position: "absolute", top:"55%", left:"50%" }} className="mobileSpinner">                   
                <BounceLoader color={"#314ac4"} size={40} style={{margin: "auto" }} />
            <h5 style={{marginLeft: "-15px"}}>Loading</h5>
        </div>
    )
}
