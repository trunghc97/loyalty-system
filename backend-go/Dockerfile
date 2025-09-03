# Build stage
FROM golang:1.21-alpine as build

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main ./cmd/main.go

# Run stage
FROM alpine:latest

WORKDIR /app

# Copy binary
COPY --from=build /app/main .

# Expose port
EXPOSE 8081

# Start the application
CMD ["./main"]