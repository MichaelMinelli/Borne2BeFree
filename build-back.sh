docker buildx build -t borneo-backend:latest -f ./Dockerfile_Backend .
docker service update --force borneo_backend
