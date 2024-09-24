# Introduction to WIMP E2E

**WIMP** stands for **Where Is My Professor**. It is an IoT-based system designed to allow students to track the real-time availability of their professors using data collected from various IoT devices. This system leverages sensors, cameras, buddy robots, and smartwatches to ascertain the professors' locations within university buildings and provide relevant information. By analyzing the collected data, WIMP can automatically inform students about their professors' availability.

The WIMP project originated in various branches, each dedicated to specific components and functionalities. This modular approach enhances development efficiency and collaboration.

## Devices (WIMP-Devices)

WIMP interacts with two primary devices:

### Buddy the Robot

Buddy the robot collects and relays information to the WIMP system.

### Fitbit Watch

Fitbit devices gather health data, such as heart rate and step count, which is transmitted to the Fitbit app on users' phones via Bluetooth. In our setup, we utilize a companion app that works alongside the Fitbit app. This companion app collects data from Fitbit and forwards it to the WIMP system.

To ensure secure data transmission, we use HTTPS. Additionally, we employ a local server on the Android device using NanoHTTPD, as Fitbit devices do not directly communicate with Android apps. NanoHTTPD facilitates secure and efficient communication between the companion app and other Android applications.

## Application Layer (WIMP-App)

The WIMP app integrates various technologies, including Node.js for server-side logic, MariaDB for database management, and WebSocket for real-time communication. The app's primary function is to receive data from various IoT devices, including sensors and smart devices. This data may encompass temperature readings, motion detection, or location tracking. 

The WIMP app processes this data to trigger specific actions in connected devices. In educational settings, it informs students about their professors' availability based on geolocation data received from Fitbit watches worn by the professors. By integrating with scheduling systems or location-based devices, the app can notify students when professors are in their offices or available for meetings. This combination of IoT data processing and real-time communication makes the WIMP app a valuable tool in both smart environments and educational contexts.

## Testing Tool (TestRunner)

The TestRunner component prepares payloads, validates them, sends them to the System Under Test (SUT) for execution, and retrieves responses from the execution. 

## Contribution

Contributions to the WIMP project are welcome! If you would like to contribute, please follow these steps:

1. **Fork the repository**: Create your own copy of the project.
2. **Create a new branch**: Use a descriptive name for your branch that reflects the feature or bug fix you are working on (e.g., `feature/new-feature` or `bugfix/fix-issue`).
3. **Make your changes**: Implement your feature or bug fix.
4. **Commit your changes**: Write clear and concise commit messages that explain your changes.
5. **Push your changes**: Push your branch to your forked repository.
6. **Submit a pull request**: Open a pull request to the main repository, describing your changes and why they should be merged.

By contributing to this project, you help enhance its capabilities and support its development. Thank you for your interest!

