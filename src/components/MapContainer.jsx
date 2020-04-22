// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line
import { GoogleMap, LoadScript, Marker, DistanceMatrixService } from '@react-google-maps/api';
import Geocode from "react-geocode";

const MapContainer = (trip) => {
    const apiURL = 'http://localhost:3001'

    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
    Geocode.setApiKey("AIzaSyAdLjk0WV1zMaBtd5TBw1g3pfpcaP_V_Ic");

    // set response language. Defaults to english.
    Geocode.setLanguage("en");

    // Enable or disable logs. Its optional.
    Geocode.enableDebug();

    const [ currentPosition, setCurrentPosition ] = useState({});
    const [ currentAddress, setCurrentAddress ] = useState("");
    const [ stops, setStops ] = useState([]);
    let [ distance, setDistance ] = useState(0);
    let [errorText, setErrorText] = useState("");
    let [ tripName, setTripName ] = useState("Your trip name");

    useEffect(() => {
        setTripName(trip.trip.name);
    }, [trip])

    useEffect(() => {
        setCurrentAddress(getCurrentAddress);
    }, // eslint-disable-next-line
    [currentPosition])

    useEffect(() => {
        setStops(trip.trip.stops);
    }, [trip.trip.stops])

    let updateTrip = () => {
        let tripUpdate = trip.trip;
        tripUpdate.stops = stops;
        tripUpdate.distance = distance;
        tripUpdate.name = tripName;
        const options = {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(tripUpdate)
        };
        console.log("Attempting to post trip");
        console.log(tripUpdate);
        console.log(options.body);
        return fetch(`${apiURL}/trip`, options).then(response => {
            return response.json();
        });
    }

    const success = position => {
        const currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
        }
        setCurrentPosition(currentPosition);
        console.log("current position set");
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(success);
    }, [])

    // Get address from latidude & longitude.
    let getAddress = (lat, lng) => {
        if (lat !== undefined && lng !== undefined){
            Geocode.fromLatLng(lat, lng).then(
                response => {
                    const address = response.results[0].formatted_address;
                    console.log(address);
                    setCurrentAddress(address);
                    setErrorText(currentAddress);
                },
                error => {
                    console.error(error);
                }
            );
        }
    };

    let getCurrentAddress = () => {
        getAddress(currentPosition.lat, currentPosition.lng);
    };

    const onClick = (...args) => {
        console.log(
            'onClick args: ',
            args[0].latLng.lat(),
            ' : ',
            args[0].latLng.lng()
            )
        let lat = args[0].latLng.lat();
        let lng = args[0].latLng.lng();
        setCurrentPosition({lat, lng})
        getAddress(lat, lng);
    }

    let addStop = () => {
        let newStops = stops;
        newStops.push(currentAddress);
        setStops(newStops);
        setErrorText(stops.length);
    }

    let mapStyles = () => {
        return ({
            height: "75vh",
            width: "50%",
            left: "25%"
        })
    }

    if (!apiURL) {
        return (
        <div>
            {errorText}
        </div>
        )
    }

    let removeStop = (index) => {
        let newStops = stops;
        newStops.splice(index, 1);
        setStops(newStops);
        setErrorText(stops.length);
    };

    let showStops = () => {
        let result = stops.map((stop, index) => {
            return (
                <tr key={index} className="stop_row">
                    <td>{stop}</td> <button onClick={event => removeStop(index)} >X</button> 
                </tr>
            )
        })
        return (result);
    };

    let onLoad = () => {
        if (currentAddress === "" || currentAddress === undefined) {
            getCurrentAddress();
        }
    }

    let showCurrentAddress = () => {
        if (currentAddress === "" || currentAddress === undefined) {
            return ("Loading address...");
        }
        return currentAddress;
    }

    let getDistance = (response) => {
        console.log(response);
            if (response) {
            let result = 0;
            if (response) {
            if (response.rows){
            response.rows.forEach((row, index) => {
                let curDist = row.elements[index].distance;
                if (curDist) {
                    result += Math.round(curDist["value"]/1609);
                }
            })}}
            setDistance(result);
        }
    }

    return (
        <div>
            <div className="map_holder">
                <LoadScript
                id="script-loader"
                googleMapsApiKey="AIzaSyAdLjk0WV1zMaBtd5TBw1g3pfpcaP_V_Ic"
                >
                <GoogleMap
                    id="map-example"
                    mapContainerStyle={mapStyles()}
                    zoom={7}
                    center={currentPosition}
                    onClick={onClick}
                    onLoad={onLoad}
                >
                    <Marker 
                        key={0} 
                        position={currentPosition}
                        draggable={true}
                        onDragEnd={onClick}
                    />
                    <DistanceMatrixService
                        options={{
                            origins: stops.slice(0, -1),
                            destinations: stops.slice(1),
                            travelMode: 'DRIVING',
                        }}
                        callback={getDistance}
                    />
                </GoogleMap>
                </LoadScript>
            </div>
            <div className="map_controls">
                <div>
                    <span id="address">{showCurrentAddress()}</span>
                </div>
                <br></br>
                <div>
                    <button className="submit" onClick={addStop}>Add</button>
                </div>
                <div>
                    <table>
                        <thead>
                        <span>Trip name: </span>
                        </thead>
                    <tbody>
                    <tr>
                        
                        <td><label>
                            <input type="text" className="input" value={tripName} onChange={event => setTripName(event.target.value)}></input>
                        </label></td>
                    </tr>
                    </tbody>
                    </table>
                </div>
                <div>
                    <table>
                        <tbody>
                            {showStops()}
                        </tbody>
                    </table>
                </div>
                <br></br>
                <div>
                    <button className="submit" id="submit-changes" onClick={updateTrip}>Submit & Calculate</button>
                </div>
            </div>
        </div>
    )
}


export default MapContainer; 