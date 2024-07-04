Para rodar no docker é preciso fazer as alterações 
1. Alterar arquivo server.ts
	Comentar as linhas com dados fixos e tirar o comentário das linhas que pega dados do script Python
	
	const dataFile = "./test/16522.json";
	const credentialFile = "./test/16522_cred.json"
	
	// Receive file from Python script
	// const dataFile = process.argv[2];
	// const credentialFile = process.argv[3];

2. Alterar RML_FILE no Config.ts
	Comentar linha com caminho relativo local e tirar o comentário da linha do docker.

    export const RML_FILE = './src/rml/rml_lite.ttl';

    // Docker path
    // export const RML_FILE = '../solid-server/FotSolid/Sensor2Gateway/src/rml/rml_lite.ttl'; 