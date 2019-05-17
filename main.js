const originalForm = $('#park-form').clone();
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
const apiKey = "LVhUsRzGAOtjaNdnxB45HihVrJKZiarLYyjeCPzv"

function addPark() {
    $('form').on('click', '.add-state', function(event) {
        console.log("clisk");
        $(this).parent().after(`
        <div class="park-set secondary">
            <input type="text" name="state" pattern="[A-Za-z]{2}" title="2 character state code">
            <button type="button" class="add-state" id="">Add State</button>
            <button type="button" class="delete-state" id="">Delete State</button>
        </div>
        `)
    })
}

function deletePark() {
    $('form').on('click', '.delete-state', function(event) {
        $(this).parent().remove();
    })
}

function clearParks() {
    $('.clear-states').click(event => {
        $('form').replaceWith(originalForm);
    })
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const states = $('input[type=text]').toArray();
        const stateList = states.map(state => $(state).val()).join(",");
    })
}

$(addPark);
$(deletePark);
$(clearParks);
$(watchForm);