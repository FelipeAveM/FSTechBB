# FSTechBB
 

# Docker

1. Descargar imagen de node: 
    docker pull felipeam/node-fstbb

2. Correr imagen node:
    docker run -p 3000:3000 elipeam/node-fstbb


docker network create fst-app

docker pull --platform linux/amd64  -d --network fst-app --network-alias mysql -v fst-mysql-data:/Applications/XAMPP/xamppfiles/var/mysql/ -e MYSQL_ROOT_PASSWORD=1234 mysql

59:19