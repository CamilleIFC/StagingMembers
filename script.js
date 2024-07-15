document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '16g9z0yzub3dszefdibss5455tytdhkr';
    const sessionId = 'd2666fb6-c7c9-443a-905a-d0a8876214b3';
    const apiUrl = `https://api.infiniteflight.com/public/v2/sessions/${sessionId}/flights?apikey=${apiKey}`;

    const refreshButton = document.getElementById('refreshButton');
    const userList = document.getElementById('userList');
    const countdownElement = document.getElementById('countdown');
    let countdown = 15;
    let countdownInterval;

    async function fetchUserData() {
        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            const data = await response.json();
            if (data.errorCode === 0) {
                displayUsers(data.result);
            } else {
                console.error('Error fetching data:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function fetchFlightPlan(flightId) {
        const flightPlanApiUrl = `https://api.infiniteflight.com/public/v2/sessions/${sessionId}/flights/${flightId}/flightplan?apikey=${apiKey}`;
        try {
            const response = await fetch(flightPlanApiUrl, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            const data = await response.json();
            if (data.errorCode === 0) {
                return data.result;
            } else {
                console.error('Error fetching flight plan:', data);
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    async function displayUsers(users) {
        userList.innerHTML = '';
        for (const user of users) {
            const flightPlan = await fetchFlightPlan(user.flightId);
            const firstWaypoint = flightPlan && flightPlan.waypoints[0] ? flightPlan.waypoints[0] : 'N/A';
            const lastWaypoint = flightPlan && flightPlan.waypoints[flightPlan.waypoints.length - 1] ? flightPlan.waypoints[flightPlan.waypoints.length - 1] : 'N/A';

            const listItem = document.createElement('li');
            const localImageUrl = `PFP/${user.username}.jpeg`;
            listItem.innerHTML = `
                <img src="${localImageUrl}" alt="${user.username}'s profile picture" class="profile-pic">
                <span class="username">${user.username}</span>
                <span class="callsign">${user.callsign}</span>
                <div class="waypoints">
                    <span class="waypoint">${firstWaypoint}</span>
                    <span class="arrow">➔</span>
                    <span class="waypoint">${lastWaypoint}</span>
                </div>
            `;
            userList.appendChild(listItem);
        }
    }

    function startCountdown() {
        clearInterval(countdownInterval);
        countdown = 15;
        countdownElement.textContent = `Next refresh in: ${countdown} seconds`;
        countdownInterval = setInterval(() => {
            countdown--;
            countdownElement.textContent = `Next refresh in: ${countdown} seconds`;
            if (countdown === 0) {
                fetchUserData();
                startCountdown();
            }
        }, 1000);
    }

    refreshButton.addEventListener('click', () => {
        fetchUserData();
        startCountdown();
    });

    // Fetch user data and start countdown when the page loads
    fetchUserData();
    startCountdown();
});
