import { MongoClient, Db } from 'mongodb';

export class MongoDBClient {
    private client: MongoClient;
    private database: Db | null = null;

    constructor() {
        this.client = new MongoClient(process.env.MONGO_URI!);
    }

    async connect() {
        await this.client.connect();

        this.database = this.client.db(process.env.MONGO_DATABASE!);

        console.log('✅ Connected to MongoDB');
    }

    getCollection() {
        if (!this.database) {
            throw new Error('Database connection not established.');
        }

        return this.database.collection(process.env.MONGO_COLLECTION!);
    }

    async getLoginUser(username: string) {
        const collection = this.getCollection();

        const user = await collection.findOne({ username });

        return user;
    }

    async close() {
        await this.client.close();
    }
}
