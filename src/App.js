import React from 'react'
import './App.css';
import MapContainer from './components/MapContainer';

function Entry({ edit, submitCallback, submitTripChanged, submitTripDelete, tripList }) {

  let [ removedText, setRemovedText ] = React.useState();
  let [ trips, setTrips ] = React.useState([{id: 5, name: "Southwest", stops: ["MyHouse", "YourHouse", "MySchool"], distance: 0},]);
  let [ trip, setTrip ] = React.useState({id: 5, name: "Southwest", stops: ["MyHouse", "YourHouse", "MySchool"], distance: 0});

  React.useEffect(() => {
    setTrips(tripList);
    setTrip(tripList["0"]);
  }, [tripList]);

  let setEdit = (curTrip) => {
    console.log(curTrip);
    setTrip(curTrip);
    submitCallback();
  }

  if (edit) {
    return (
      <div>
      <MapContainer trip={trip}/>
        <div className="done_block">
          <button className="submit" onClick={event => submitCallback()}>Done</button>
        </div>
      </div>
    )
  }

  if (edit && !edit) {
    return (
      <div>
          {removedText}
      </div>
    )
  }

  let addTrip = () => {
    let newID = 0;
    trips.forEach((item) => {
      if (item.id > newID) {
        newID = item.id;
      }
    })
    newID += 1;
    let newTrip = {id: newID, name: "My new trip", stops: [], distance: 0};
    let newTrips = trips;
    newTrips.push(newTrip);
    setTrips(newTrips);
    setRemovedText("added trip " + newTrip.id);
    submitTripChanged(newTrip);
  }

  let removeTrip = (index) => {
    if (trips.length > 1){
      let updatedList = trips;
      let removedTrip = updatedList.splice(index, 1);
      console.log(removedTrip);
      setTrips(updatedList);
      submitTripDelete(updatedList);
      setRemovedText ("removed " + removeTrip.id + updatedList.length);
    }
  }

  let editStops = (curTrip) => {
    if (curTrip && curTrip.stops) {
      let result = curTrip.stops.map((stop, index) => {
        console.log(stop);
        return (
          <tr key={index} className="stop_row">
            <td>{stop}</td>
            <td></td>
          </tr>
        )
      })

      return (result);
    }

    return (<tr></tr>);
  };

  let showTrips = () => {
    let result = trips.map((curTrip, index) => {
       return (
         <div>
        <table key={index}>
        <thead>
            <span className="table_header">Name: {curTrip.name}</span>
          <tr>
            <th id="name_tag">Addresses</th>
            <th><button type="submit" onClick={event => setEdit(curTrip)}>Edit</button></th>
          </tr>
        </thead>
        <tbody>
          {editStops(curTrip)}
          <tr>
            <td><strong>Distance:</strong></td>
            <td>{curTrip.distance} mi</td>
          </tr>
        </tbody>
        </table>
        <button className="tripBtns" onClick={event => removeTrip(index)}>Delete trip</button>
        </div>
      )
    })

    return result;
  }
  
  return (
    <div className="trip-list">
      {showTrips()}
      <button className="tripBtns" onClick={event => addTrip()}>New trip</button>
    </div>
  );
}

function App() {
  const apiURL = 'http://localhost:3001'
  const [tripList, setTripList] = React.useState([]);
  const [edit, setEdit] = React.useState(false);

  let switchEdit = () => {
    if (edit === true) {
      setEdit(false);
    }
    else {
      setEdit(true);
    }
  };

  let getTrips = () => {
    fetch((`${apiURL}/trips`)).then((response) => {
      console.log(response);
      return (response.json());
    }).then((data) => {
      setTripList(data);
    })
  }

  let updateTrip = (curTrip) => {
    let trip = curTrip;
    const options = {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(trip)
    };
    console.log("Attempting to post trip");
    console.log(trip);
    console.log(options.body);
    return fetch(`${apiURL}/trip`, options).then(response => {
        getTrips();
        return response.json();
    })
  }

  let setTrips = (newList) => {
    const options = {
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(newList)
    };
    console.log("Attempting to delete trip");
    console.log(newList);
    console.log(options.body);
    return fetch(`${apiURL}/setTrips`, options).then(response => {
        getTrips();
        return response.json();
    })
  }

  React.useEffect(() => {
    getTrips();
  }, [])

  return (
    <div className="App">
        <span id="app_title">Roadtrip-Planner</span>
        <Entry edit={edit} submitCallback={switchEdit} submitTripChanged={updateTrip} submitTripDelete={setTrips} tripList={tripList}/>
    </div>
  );
}

export default App;
