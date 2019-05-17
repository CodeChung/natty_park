"use strict";
const originalForm = $('form').clone();
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

function displayResults(responseJson) {
    $('section.error').empty();
    $('.results-list').empty();
    if (responseJson.total === "0") {
        $('section.error').text("no parks found");
    } else {
        const stateNames = $('input[type=text]').toArray().map(code => statesObject[$(code).val().toUpperCase()]).filter(ele => ele).join(", ");
        const parks = responseJson.data;
        $('.results h2').text(`Your parks located in: ${stateNames}`);
        parks.forEach(park => {
            $('.results-list').append(`
            <li>
                <h3>${park.fullName}</h3>
                <p>${park.description}</p>
                <a href="${park.url}" target="_blank">Link</a>
            </li>
            `)
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