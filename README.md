# WebSocket Java Spring Example

A simple Spring Boot application demonstrating WebSocket communication using the STOMP protocol. This example showcases how to set up a WebSocket server and client, enabling real-time, bidirectional communication between a client and a server.

## Features

* **WebSocket Server**: Configured with Spring Boot to handle WebSocket connections.
* **STOMP Protocol**: Utilizes the STOMP protocol over WebSocket for messaging.
* **SockJS Fallback**: Provides SockJS fallback options for browsers that don't support WebSocket.
* **Real-Time Communication**: Enables real-time messaging between client and server.

## Technologies Used

* **Spring Boot**: Framework for building the application.
* **WebSocket**: Protocol for full-duplex communication channels.
* **STOMP**: Simple Text Oriented Messaging Protocol for messaging over WebSocket.
* **SockJS**: JavaScript library that provides WebSocket-like object in browsers that don't support WebSocket.

## Prerequisites

* Java 8 or higher
* Maven 3.5+
* A modern web browser (Chrome, Firefox, etc.)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/AlexNicolasCode/websocket-java-spring-example.git
cd websocket-java-spring-example
```

### Build and Run the Application

```bash
./mvnw spring-boot:run
```

The application will start on [http://localhost:8080](http://localhost:8080).

### Accessing the Client

Open `src/main/resources/static/index.html` in your browser to interact with the WebSocket client.

## WebSocket Configuration

The WebSocket configuration is set up in the `WebSocketConfig` class. It registers the `/ws` endpoint and enables SockJS fallback options.

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic");
    }
}
```

## Usage

1. Start the Spring Boot application.
2. Open `src/main/resources/static/index.html` in multiple browser tabs.
3. Enter a username and start sending messages.
4. Messages will be broadcasted to all connected clients in real-time.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes using **Conventional Commits**:

   * **feat:** for new features
   * **fix:** for bug fixes
   * **docs:** for documentation changes
   * **style:** for code formatting or style changes
   * **refactor:** for code refactoring
   * **test:** for adding or updating tests
   * **chore:** for maintenance tasks
     Example: `git commit -m "feat: add real-time notification feature"`
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.
