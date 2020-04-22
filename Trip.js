class Trip {

    constructor (info) {
        if (info) {
            this.id = info.id;
            this.name = info.name;
            this.stops = info.stops;
            this.distance = info.distance;
        }
    }

    static getAll() {
        return this.tripList;
    }

    static setTrips(newList) {
        this.tripList = newList;
    }

    static getTrip(tripID) {
        return this.tripList.find((item) => item.id === tripID);
    }

    static addTrip(info) {
        let newTrip = new Trip(info);
        this.tripList.push(newTrip);
        return newTrip;
    }

    static addStop(info, tripID) {
        let newStop = info;
        let trip = getTrip(tripID);
        trip.stops.push(newStop);
    }

    static updateTrip(info, tripID) {
        let updatedTrip = info;
        let index = this.tripList.findIndex((item) => item.id === tripID);
        if (index === undefined || index < 0) {
            this.tripList.push(updatedTrip);
        }
        else {
            this.tripList[index] = updatedTrip;
        }
    }

    static deleteTrip(tripID) {
        let index = this.tripList.findIndex((item) => item.id === tripID);
        this.tripList.splice(index, 1);
    }

    static updateDistance(tripID, newDistance) { 
        let index = this.tripList.findIndex((item) => item.id === tripID);
        this.tripList[index].distance = newDistance;
    }

}

Trip.tripList = [{id: 5, name: "Southwest", stops: ["MyHouse", "YourHouse", "MySchool"], distance: 0},
                {id: 0, name: "Southeast", stops: ["A place", "A different place", "Some cool city!"], distance: 0}];

module.exports = Trip;