const BUS_COST = 1.8,
    MAX_COST = 3.2,
    COST_ONLY_ZONE_ONE = 2.5,
    COST_ONE_ZONE_NOT_INCLUDING_ZONE_ONE = 2.0,
    COST_TWO_ZONES_INCLUDING_ZONE_ONE = 3.0,
    COST_TWO_ZONES_EXCLUDING_ZONE_ONE = 2.25;

const STATIONS = {
    Holborn: [1],
    EarlsCourt: [1, 2],
    Hammersmith: [2],
    Wimbledon: [3]
};


class OysterCard {

    constructor(credit = 0) {
        this.credit = credit;
        this.fare = 0;
        this.points = [];
    }

    // set credit score
    setCredit(amount) {
        if (typeof (amount) === 'number') {
            this.credit += amount;
        } else {
            return 0;
        }
        return this.credit;
    }


    // get credit value
    getCredit() {
        return this.credit;
    }

    // Debit Credit
    setDebit() {
        (this.credit >= this.fare ? this.credit -= this.fare : console.log('Not enough credit!'));
    }

    /**
     * card is charged the maximum fare
    */
    startStation(station) {
        if (typeof station === `object`) {
            this.points.push(station);
            this.fare = MAX_COST;
            this.setDebit();
        } else {
            console.log('Invalid Station!')
        }
    }

    // the fare is calculated and max fare transaction removed and replace with real transaction
    leaveStation() {
        this.getFinalCost();
        this.setDebit();
    }

    // set new journey
    setJourney(finalStation) {
        this.points.push(finalStation);
    }

    // set new bus journey
    setNewBusJourney() {
        this.fare = BUS_COST;
        this.setDebit();
    }

    // get final cost charge
    getFinalCost() {
        if (this.points.length === 2) {
            this.setCredit(MAX_COST);

            let zonesCrossed = this.getZonesCrossed(this.points[0], this.points[1]);
            let isZoneOneCrossed = this.didCrossedZoneOne(this.points[0], this.points[1]);
            let cost = this.getCostByZone(zonesCrossed, isZoneOneCrossed);
            this.fare = cost;
        } else {
            this.fare = MAX_COST;
        }
    }

    // get cost value by zone
    getCostByZone(crossedZones, ifZoneOneCrossed) {
        if (crossedZones === 1 && ifZoneOneCrossed) { return COST_ONLY_ZONE_ONE; }
        if (crossedZones === 1 && !ifZoneOneCrossed) { return COST_ONE_ZONE_NOT_INCLUDING_ZONE_ONE; }
        if (crossedZones === 2 && ifZoneOneCrossed) { return COST_TWO_ZONES_INCLUDING_ZONE_ONE; }
        if (crossedZones === 2 && !ifZoneOneCrossed) { return COST_TWO_ZONES_EXCLUDING_ZONE_ONE; }
        if (crossedZones === 3) { return MAX_COST; }
        return MAX_COST;
    }

    // get zone crossed
    getZonesCrossed(from, to) {
        let minZonesVisitedZone = 10;
        from.forEach(fromZone => {
            to.forEach(toZone => {
                let zonesVisited = Math.abs(fromZone - toZone) + 1;
                if (zonesVisited < minZonesVisitedZone) {
                    minZonesVisitedZone = zonesVisited;
                }
                if (minZonesVisitedZone === 1) {
                    return;
                }
            });
        });
        return minZonesVisitedZone;
    }

    //check if in Array
    check_if_in_array(needle, haystack) {
        let length = haystack.length;
        for (let i = 0; i < length; i++) {
            if (haystack[i] === needle) return true;
        }
        return false;
    }

    // check if crossed the any zone
    didCrossedZoneOne(from, to) {
        return (from.length === 1 && this.check_if_in_array(1, from)) || (to.length === 1 && this.check_if_in_array(1, to));
    }
}

Object.defineProperty(OysterCard, 'STATIONS', {
    value: STATIONS,
});



let card = new OysterCard();
let balance = 30

card.setCredit(credit);

card.startStation(OysterCard.STATIONS.Hammersmith);
card.setJourney(OysterCard.STATIONS.EarlsCourt);
card.leaveStation();

card.setNewBusJourney();

card.startStation(OysterCard.STATIONS.EarlsCourt);
card.setJourney(OysterCard.STATIONS.Hammersmith);
card.leaveStation();

var credit = card.getCredit();
console.log('Charged Amount: £', (balance - credit).toFixed(2));
console.log('Remaning Credit: £', credit.toFixed(2));