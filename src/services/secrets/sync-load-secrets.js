import { v1 } from "@google-cloud/secret-manager";

const projectId = process.env.GCP_PROJECT_ID;
const filename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const secretName = process.env.SECRET_NAME;

const client = new v1.SecretManagerServiceClient({
    projectId,
    keyFilename: filename
});

client.accessSecretVersion({
    name: secretName
})
    .then(([response]) => {
        console.log(response.payload.data.toString());
    })
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
