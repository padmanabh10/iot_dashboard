const mqtt = require('mqtt');
const fs = require('fs');

const options = {
    port: 8883,
    protocol: 'mqtts',
    rejectUnauthorized: false,
    connectTimeout: 60 * 1000,
    keepalive: 60
};

const client = mqtt.connect('mqtts://localhost:8883', options);

const users = {
    user1: { deviceCount: 100 },
    user2: { deviceCount: 30 }
};

const deviceTypes = ['temperature', 'humidity', 'vibration']; // Each device sends only one type

function generateSensorData(userId, deviceId) {
    const type = deviceTypes[deviceId % deviceTypes.length]; // Rotate between device types

    const data = {
        userId,
        deviceId: `device_${deviceId}`,
        timestamp: new Date().toISOString(),
        deviceType: type,
        metadata: "x".repeat(1900)
    };

    // Include only relevant sensor data
    if (type === 'temperature') {
        data.temperature = (20 + Math.random() * 15).toFixed(2);
    } else if (type === 'vibration') {
        data.vibration = (0.1 + Math.random() * 2).toFixed(3);
    } else if (type === 'humidity') {
        data.humidity = (30 + Math.random() * 50).toFixed(2);
    }

    return JSON.stringify(data);
}

function publishData() {
    for (const [userId, { deviceCount }] of Object.entries(users)) {
        for (let deviceId = 1; deviceId <= deviceCount; deviceId++) {
            const topic = `users/${userId}/device_${deviceId}`;
            const message = generateSensorData(userId, deviceId);
            client.publish(topic, message, { qos: 0 }, (err) => {
                if (err) {
                    console.error(`Failed to publish for ${userId}/device_${deviceId}`, err);
                }
            });
        }
    }
    console.log('Published data at', new Date().toLocaleTimeString());
}

client.on('connect', () => {
    console.log('Connected to MQTT broker via TLS');
    publishData();
    setInterval(publishData, 60 * 1000);
});

client.on('error', (error) => {
    console.error('MQTT TLS connection error:', error);
    if (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        console.log('Certificate verification failed - consider setting rejectUnauthorized: false for self-signed certificates');
    } else if (error.code === 'ECONNREFUSED') {
        console.log('Connection refused - check if HiveMQ is running on port 8883 with TLS enabled');
    }
});

client.on('close', () => {
    console.log('MQTT connection closed');
});

client.on('reconnect', () => {
    console.log('MQTT reconnecting...');
});

process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    client.end();
    process.exit(0);
});
