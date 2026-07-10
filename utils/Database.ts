import { MongoDBClient } from './MongoDBClient';

export class Database {
    static async getLoginUser(username: string) {
        const mongo = new MongoDBClient();

        try {
            await mongo.connect();

            const user = await mongo.getLoginUser(username);

            if (!user) {
                throw new Error(`User '${username}' not found in MongoDB.`);
            }

            return user;
        } finally {
            await mongo.close();
        }
    }
}
