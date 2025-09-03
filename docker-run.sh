#!/bin/bash

# DevSecOps Agent Docker Run Script
# This script runs the DevSecOps Agent container with proper configuration

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="devsecops-agent"
CONTAINER_NAME="devsecops-agent-container"
PORT="3001"
NODE_ENV="development"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if image exists, build if not
check_and_build_image() {
    if [[ "$(docker images -q $IMAGE_NAME 2> /dev/null)" == "" ]]; then
        print_warning "Image $IMAGE_NAME not found. Building..."
        docker build -t $IMAGE_NAME .
        print_success "Image built successfully"
    else
        print_success "Image $IMAGE_NAME found"
    fi
}

# Function to stop and remove existing container
cleanup_existing_container() {
    if docker ps -a --format "table {{.Names}}" | grep -q "^$CONTAINER_NAME$"; then
        print_warning "Container $CONTAINER_NAME already exists. Stopping and removing..."
        docker stop $CONTAINER_NAME > /dev/null 2>&1 || true
        docker rm $CONTAINER_NAME > /dev/null 2>&1 || true
        print_success "Existing container cleaned up"
    fi
}

# Function to create logs directory
create_logs_directory() {
    if [ ! -d "./logs" ]; then
        print_status "Creating logs directory..."
        mkdir -p ./logs
        print_success "Logs directory created"
    fi
}

# Function to run the container
run_container() {
    print_status "Starting DevSecOps Agent container..."
    
    docker run -d \
        --name $CONTAINER_NAME \
        -p $PORT:$PORT \
        -e NODE_ENV=$NODE_ENV \
        -e PORT=$PORT \
        -e API_KEY=dev-api-key-12345 \
        -e CORS_ORIGIN=http://localhost:3000 \
        -e LOG_LEVEL=debug \
        -e MOMO_API_KEY=dev-momo-api-key \
        -e MOMO_API_URL=http://localhost:8080/api \
        -e MOMO_MERCHANT_ID=dev-merchant-123 \
        -v "$(pwd)/logs:/usr/src/app/logs" \
        --restart unless-stopped \
        --health-cmd="curl -f http://localhost:$PORT/health || exit 1" \
        --health-interval=30s \
        --health-timeout=10s \
        --health-retries=3 \
        --health-start-period=40s \
        $IMAGE_NAME
    
    print_success "Container started successfully"
}

# Function to wait for container to be ready
wait_for_container() {
    print_status "Waiting for container to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker exec $CONTAINER_NAME curl -f http://localhost:$PORT/health > /dev/null 2>&1; then
            print_success "Container is ready and responding to health checks"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts: Container not ready yet, waiting 2 seconds..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "Container failed to become ready after $max_attempts attempts"
    return 1
}

# Function to show container status
show_status() {
    print_status "Container status:"
    docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo
    print_status "Container logs (last 10 lines):"
    docker logs --tail 10 $CONTAINER_NAME
    
    echo
    print_status "Health check:"
    if curl -f http://localhost:$PORT/health > /dev/null 2>&1; then
        print_success "Application is responding at http://localhost:$PORT"
    else
        print_warning "Application is not responding yet"
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -f, --force    Force rebuild image and recreate container"
    echo "  -l, --logs     Show container logs after starting"
    echo "  -s, --status   Show container status after starting"
    echo "  -p, --port     Specify port (default: 3001)"
    echo
    echo "Examples:"
    echo "  $0                    # Run with default settings"
    echo "  $0 -f                 # Force rebuild and recreate"
    echo "  $0 -p 3002           # Run on port 3002"
    echo "  $0 -l -s             # Show logs and status"
}

# Main execution
main() {
    local force_rebuild=false
    local show_logs=false
    local show_status_flag=false
    local custom_port=""
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -f|--force)
                force_rebuild=true
                shift
                ;;
            -l|--logs)
                show_logs=true
                shift
                ;;
            -s|--status)
                show_status_flag=true
                shift
                ;;
            -p|--port)
                custom_port="$2"
                shift 2
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Set custom port if specified
    if [ ! -z "$custom_port" ]; then
        PORT="$custom_port"
        print_status "Using custom port: $PORT"
    fi
    
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  DevSecOps Agent Docker Run${NC}"
    echo -e "${BLUE}================================${NC}"
    echo
    
    # Check prerequisites
    check_docker
    
    # Create logs directory
    create_logs_directory
    
    # Force rebuild if requested
    if [ "$force_rebuild" = true ]; then
        print_status "Force rebuild requested. Building new image..."
        docker build -t $IMAGE_NAME .
        print_success "Image rebuilt successfully"
    else
        check_and_build_image
    fi
    
    # Cleanup existing container
    cleanup_existing_container
    
    # Run container
    run_container
    
    # Wait for container to be ready
    if wait_for_container; then
        print_success "DevSecOps Agent is running successfully!"
        echo
        print_status "Access your application at: http://localhost:$PORT"
        print_status "Health endpoint: http://localhost:$PORT/health"
        print_status "Container name: $CONTAINER_NAME"
        echo
        
        # Show logs if requested
        if [ "$show_logs" = true ]; then
            print_status "Container logs:"
            docker logs $CONTAINER_NAME
            echo
        fi
        
        # Show status if requested
        if [ "$show_status_flag" = true ]; then
            show_status
        fi
        
        echo
        print_status "Useful commands:"
        echo "  View logs: docker logs -f $CONTAINER_NAME"
        echo "  Stop container: docker stop $CONTAINER_NAME"
        echo "  Remove container: docker rm $CONTAINER_NAME"
        echo "  Shell access: docker exec -it $CONTAINER_NAME /bin/bash"
        echo "  Health check: curl http://localhost:$PORT/health"
        
    else
        print_error "Failed to start container properly"
        print_status "Container logs:"
        docker logs $CONTAINER_NAME
        exit 1
    fi
}

# Run main function with all arguments
main "$@" 