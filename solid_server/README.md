# Solid Server

Our server is based on Community Solid Server V7.0.5. We use the Dockerfile from the V7.0.5 project folder to generate our server image. We need to update the Node image from Build and Runtime stages. We use this [Dockerfile](Dockerfile) to create our Solid Image (georgepacheco/solid-server:7.1.1)

The Dash Image (georgepacheco/dash-solid:1.2.3) was created based on our Solid Image using this [Dockerfile](FotSolid/Dockerfile). 