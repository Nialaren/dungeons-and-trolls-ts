rm -rf dungeons_and_trolls_ts

export VERSION=$(curl -s https://converter.swagger.io/api/convert?url=https://raw.githubusercontent.com/gdg-garage/dungeons-and-trolls/master/api/dungeonsandtrolls.swagger.json | jq ".info.version")

docker compose run client-gen

chmod -R a+rw dungeons_and_trolls_ts