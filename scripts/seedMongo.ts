import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config({ path: process.env.ENV_FILE || '.env.docker' });

const requiredEnvVars = ['MONGO_URI', 'MONGO_DATABASE', 'MONGO_COLLECTION', 'TEST_USER', 'TEST_PASSWORD'];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`${envVar} is not configured.`);
    }
}

async function seed() {
    const client = new MongoClient(process.env.MONGO_URI!);

    try {
        await client.connect();

        const db = client.db(process.env.MONGO_DATABASE!);
        const collection = db.collection(process.env.MONGO_COLLECTION!);

        await collection.updateOne(
            { username: process.env.TEST_USER! },
            { $set: { username: process.env.TEST_USER!, password: process.env.TEST_PASSWORD! } },
            { upsert: true }
        );

        console.log(`Seeded user '${process.env.TEST_USER}' into ${process.env.MONGO_DATABASE}.${process.env.MONGO_COLLECTION}`);
    } finally {
        await client.close();
    }
}

seed();
