"use strict";
const originalForm = `<form id="park-form" autocomplete="off">
                        <label for="park-number">How Many Parks Are You Looking For?</label>
                        <input type="number" min="0" value="10" id="park-number" required>
                        <label>Where Are Your Parks Located?
                            <div class="park-set">
                                <input type="text" name="state" pattern="[A-Za-z]{2}" title="2 character state code" id="state" required>
                                <button type="button" class="add-state">Add State</button>
                            </div>
                        </label>
                        <div class="end-form">
                            <input type="submit" value="Let's go">
                            <button type="button" class="clear-states">Clear States</button>
                        </div>
                    </form>`;
const statesObject = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}
const myKey = "LVhUsRzGAOtjaNdnxB45HihVrJKZiarLYyjeCPzv";
const searchURL = "https://developer.nps.gov/api/v1/parks?";
const geoKey = "9975432294b04ba49f9f001f06eaf22d";
const geoURL = "https://api.opencagedata.com/geocode/v1/json?";

function addParkInput() {
    $('main').on('click', '.add-state', function(event) {
        $(this).parent().after(`
        <div class="park-set secondary">
            <input type="text" name="state" pattern="[A-Za-z]{2}" title="2 character state code">
            <button type="button" class="add-state" id="">Add State</button>
            <button type="button" class="delete-state" id="">Delete State</button>
        </div>
        `)
    })
}

function deleteParkInput() {
    $('main').on('click', '.delete-state', function(event) {
        $(this).parent().remove();
    })
}

function clearParkInputs() {
    $('main').on('click', '.clear-states', event => {
        $('form').replaceWith(originalForm);
    })
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
    return queryItems;
}

function getCoords(coords) {
    let lat, long;
    const coordList = coords.split(", ");
    if (coordList.length < 2) {
        lat = "none";
        long = "none";
    } else {
        lat = coordList[0].substring(4, );
        long = coordList[1].substring(5, );
    }
    return [lat, long];
}

function getAddress(lat, long) {
    console.log("latitude is " + lat + "long is " + long)
    if (lat === "none" || long === "none") {
        console.log('we have no coords; if condition reached')
        let promise = new Promise(function(resolve, reject) {
            resolve("This park is too big for one address. Sorry bud");
        });
        return promise;
    } else {
        const params = {
            q: `${lat}%2C${long}`,
            key: geoKey,
            pretty: 1
        }
        const locationQuery = formatQueryParams(params);
        const locationUrl = geoURL + locationQuery;
        return fetch(locationUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText)
            })
            .then(responseJson => {
                console.log("address is: " + responseJson.results[0].formatted)
                return responseJson.results[0].formatted
            })
            .catch(error => alert(error));
    }
}

function displayResults(responseJson) {
    $('section.error').empty();
    $('.results h2').empty();
    $('.results-list').empty();
    if (responseJson.total === "0") {
        $('section.error').text("no parks found");
    } else {
        const stateNames = $('input[type=text]').toArray().map(code => statesObject[$(code).val().toUpperCase()]).filter(ele => ele).join(", ");
        const parks = responseJson.data;
        $('.results h2').text(`Your parks located in: ${stateNames}`);
        parks.forEach(park => {
            console.log("park data is:");
            console.log(park)
            const coords = getCoords(park.latLong)
            console.log(coords);
            const lat = coords[0];
            const long = coords[1];
            getAddress(lat, long).then(address => {
                console.log("address received " + address);
                $('.results-list').append(`
                <li>
                    <h3>${park.fullName}</h3>
                    <p>${park.description}</p>
                    <p>address: <a href="https://maps.google.com/?ll=${lat},${long}" target="_blank">${address}</a></p>
                    <a href="${park.url}" target="_blank">Link</a>
                </li>
                `)
            });
        })
    }
}

function callAPI(stateList, maxResults=10) {
    const params = {
        stateCode: stateList,
        api_key: myKey,
        limit: maxResults
    }
    const urlQuery = formatQueryParams(params)
    const url = searchURL + urlQuery;
    console.log("url is " + url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(error => $("section.error").text(`Oopsies, try again something done went wrong: ${error.message}`))
}

function watchForm() {
    $('main').on('submit', 'form', event => {
        event.preventDefault();
        const states = $('input[type=text]').toArray();
        const stateList = states.map(state => $(state).val()).join(",");
        const numOfResults = $('#park-number').val() - 1;
        callAPI(stateList, numOfResults);
    })
}

$(addParkInput);
$(deleteParkInput);
$(clearParkInputs);
$(watchForm);