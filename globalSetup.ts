import { MongoClient } from 'mongodb';
import { Logger } from './utils/Logger';

async function globalSetup() {

    Logger.info('========== GLOBAL SETUP: SEEDING MONGODB ==========');

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

        Logger.success(`Seeded user '${process.env.TEST_USER}' into ${process.env.MONGO_DATABASE}.${process.env.MONGO_COLLECTION}`);
    } finally {
        await client.close();
    }

}

export default globalSetup;
