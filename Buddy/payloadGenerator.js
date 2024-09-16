const phrases = [
    'Hello', 'Go', 'I am waiting', 'It is not normal', 'You can do it', 'Come here',
    'Good job', 'Try again', 'Almost there', 'Watch out', 'Yes', 'No', 'Please',
    'Thank you', 'Welcome', 'See you', 'Goodbye', 'Not now', 'Later', 'Wait',
    'relax it is normal', 'Can we get a doctor?'
];
function getRandomDateTimeToday() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const randomTime = new Date(startOfDay.getTime() + Math.random() * (endOfDay.getTime() - startOfDay.getTime()));

    // Format to MariaDB/SQL datetime format
    const formattedDateTime = `${randomTime.getFullYear()}-${(randomTime.getMonth()+1).toString().padStart(2, '0')}-${randomTime.getDate().toString().padStart(2, '0')} ${randomTime.getHours().toString().padStart(2, '0')}:${randomTime.getMinutes().toString().padStart(2, '0')}:${randomTime.getSeconds().toString().padStart(2, '0')}`;
    return formattedDateTime;
}
function getRandomFloat(min, max) {
    return (Math.random() * (max - min) + min).toFixed(1);
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function simulateHeartRate() {
    // Simulate heart rate between a plausible human range of 40 and 160
    return getRandomInt(40, 160);
}

function generatePayload(heartRate=simulateHeartRate()) {
    let buddyPayload = '';
    if (heartRate < 60) { // Bradycardia
        buddyPayload = `rotate/${getRandomFloat(-100, 100)}f/${getRandomFloat(-360, 360)}f AND move/${getRandomFloat(0.05, 0.7)}f/${getRandomFloat(0, 100)}f AND speak/'Can we get a doctor?'`;
    } else if (heartRate >= 60 && heartRate <= 100) { // Normal
        buddyPayload = `speak/'relax it is normal' AND blink/${Math.floor(Math.random() * 3)}/${['red', 'green', 'blue'][Math.floor(Math.random() * 3)]}`;
    } else if (heartRate > 100) { // Tachycardia
        buddyPayload = `rotate/${getRandomFloat(-100, 100)}f/${getRandomFloat(-360, 360)}f AND move/${getRandomFloat(0.05, 0.7)}f/${getRandomFloat(0, 100)}f AND speak/'Can we get a doctor?'`;
    }

    const payload = {
        receivedOn: getRandomDateTimeToday(),
        heartRate: heartRate, // Include heart rate in payload for reference
        buddyPayload: buddyPayload,
        buddyPayloadExecutionStatus: 'NOT STARTED',
        buddyPayloadExecutionOutcome: '',
        buddyExpectedOutcome: 'SUCCESS',
        triggeringEvent: 'hr'
    };
   
    return payload;

}

module.exports = generatePayload;