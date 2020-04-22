const Trip = require('./Trip')

class TripController {

    getTrips(req, res) {
        let tripList = Trip.getAll();
        console.log(tripList);
        res.send(tripList);
    }

    addTrip(req, res) {
        let newTrip = Trip.addTrip(req.body.info);
        console.log(newTrip);
        res.send(newTrip);
    }

    updateTrip(req, res) {
        let updatedTrip = req.body;
        let tripID = updatedTrip.id;
        Trip.updateTrip(updatedTrip, tripID);
    }

    deleteTrip(req, res) {
        let tripID = req.body.id;
        Trip.deleteTrip(tripID);
    }

    updateDistance(req, res) {
        let tripID = req.body.info.id;
        let distance = req.body.info.distance;
        Trip.updateDistance(tripID, distance);
    }

    setTrips(req, res) {
        console.log("in set trips")
        Trip.setTrips(req.body);
    }

}

module.exports = TripController;