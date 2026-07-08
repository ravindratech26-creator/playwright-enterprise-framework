import { MongoClient } from "mongodb";

export class MongoDBClient {

    private client = new MongoClient(process.env.MONGO_URI!);

    async connect() {
        await this.client.connect();
    }

    async getLoginUser(username: string) {

        const db = this.client.db(process.env.MONGO_DATABASE);

        return await db
            .collection(process.env.MONGO_COLLECTION!)
            .findOne({ username });

    }

    async close() {
        await this.client.close();
    }

}