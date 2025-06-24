docker buildx build -t borneo-backend:latest -f ./Dockerfile_Backend .
docker buildx build -t borneo-frontend:latest -f ./Dockerfile_Frontend .
docker service update --force borneo_borneo-frontend
docker service update --force borneo_borneo-backend
